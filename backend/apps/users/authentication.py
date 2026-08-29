"""Dependency-free HS256 JWT access tokens, Supabase JWT validation, and refresh sessions."""
import base64
import functools
import hashlib
import hmac
import json
import time
import uuid
from datetime import timedelta

import jwt
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import authentication, exceptions

from .models import RefreshSession

def _b64(value):
    return base64.urlsafe_b64encode(value).rstrip(b'=').decode()

def _unb64(value):
    return base64.urlsafe_b64decode(value + '=' * (-len(value) % 4))

def _encode(payload):
    header = _b64(b'{"alg":"HS256","typ":"JWT"}')
    body = _b64(json.dumps(payload, separators=(',', ':')).encode())
    signature = hmac.new(settings.SECRET_KEY.encode(), f'{header}.{body}'.encode(), hashlib.sha256).digest()
    return f'{header}.{body}.{_b64(signature)}'

def _decode(token):
    header, body, signature = token.split('.')
    expected = hmac.new(settings.SECRET_KEY.encode(), f'{header}.{body}'.encode(), hashlib.sha256).digest()
    if not hmac.compare_digest(_unb64(signature), expected):
        raise ValueError('Invalid signature')
    payload = json.loads(_unb64(body))
    if payload.get('exp', 0) < time.time():
        raise ValueError('Expired token')
    return payload

def issue_access(user):
    now = int(time.time())
    return _encode({'sub': str(user.pk), 'type': 'access', 'iat': now,
                    'exp': now + settings.JWT_ACCESS_MINUTES * 60})

def issue_refresh(user):
    now = timezone.now()
    jti = uuid.uuid4().hex
    expiry = now + timedelta(days=settings.JWT_REFRESH_DAYS)
    payload = {'sub': str(user.pk), 'type': 'refresh', 'jti': jti, 'iat': int(now.timestamp()),
               'exp': int(expiry.timestamp())}
    RefreshSession.objects.create(user=user, jti=jti, expires_at=expiry)
    return _encode(payload)

def revoke_refresh(token):
    try:
        payload = _decode(token)
    except (TypeError, ValueError, KeyError, IndexError):
        return
    RefreshSession.objects.filter(jti=payload.get('jti')).delete()

def rotate_refresh(token):
    payload = _decode(token)
    if payload.get('type') != 'refresh':
        raise exceptions.AuthenticationFailed('Invalid refresh token.')
    try:
        session = RefreshSession.objects.select_related('user').get(jti=payload['jti'])
    except RefreshSession.DoesNotExist:
        raise exceptions.AuthenticationFailed('Invalid refresh token.')
    if session.expires_at <= timezone.now():
        session.delete()
        raise exceptions.AuthenticationFailed('Refresh token expired.')
    user = session.user
    if not user.is_active:
        session.delete()
        raise exceptions.AuthenticationFailed('Invalid refresh token.')
    session.delete()
    return user, issue_refresh(user)


@functools.lru_cache(maxsize=1)
def _get_supabase_jwks():
    jwks_url = getattr(settings, 'SUPABASE_JWKS_URL', None)
    if not jwks_url:
        return {}
    try:
        response = requests.get(jwks_url, timeout=10)
        response.raise_for_status()
        data = response.json()
        return {key.get('kid'): key for key in data.get('keys', []) if key.get('kid')}
    except Exception:
        return {}


def _supabase_issuer():
    supabase_url = getattr(settings, 'SUPABASE_URL', '').rstrip('/')
    return f'{supabase_url}/auth/v1' if supabase_url else None


def authenticate_supabase_user(token):
    if not token:
        raise exceptions.AuthenticationFailed('Missing Supabase token.')

    jwks = _get_supabase_jwks()
    if not jwks:
        raise exceptions.AuthenticationFailed('Supabase JWKS is unavailable.')

    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get('kid')
        key_data = jwks.get(kid)
        if not key_data:
            raise ValueError('Unknown Supabase signing key.')

        signing_key = jwt.PyJWK.from_dict(key_data).key
        issuer = _supabase_issuer()
        claims = jwt.decode(
            token,
            signing_key,
            algorithms=[unverified_header.get('alg', 'ES256')],
            options={'verify_aud': False},
            issuer=issuer,
        )
    except Exception:
        raise exceptions.AuthenticationFailed('Invalid or expired Supabase access token.')

    email = claims.get('email') or claims.get('user_email')
    if not email:
        raise exceptions.AuthenticationFailed('Supabase token missing user email.')

    from .models import User

    user = User.objects.filter(email__iexact=email).first()
    if user is None:
        full_name = claims.get('user_metadata', {}).get('full_name') or claims.get('user_metadata', {}).get('name') or email.split('@', 1)[0]
        first_name, _, last_name = full_name.partition(' ')
        user = User.objects.create_user(
            email=email,
            password=User.objects.make_random_password(),
            first_name=first_name,
            last_name=last_name,
            user_type='customer',
            is_email_verified=bool(claims.get('email_verified')),
        )
    else:
        user.is_email_verified = user.is_email_verified or bool(claims.get('email_verified'))
        user.save(update_fields=['is_email_verified'])

    if not user.is_active:
        raise exceptions.AuthenticationFailed('Inactive Supabase user.')

    return user, claims


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate_header(self, request):
        return 'Bearer'

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).split()
        if not header:
            return None
        if header[0].lower() != b'bearer' or len(header) != 2:
            raise exceptions.AuthenticationFailed('Invalid Authorization header.')

        token = header[1].decode()
        try:
            payload = _decode(token)
            if payload.get('type') != 'access':
                raise ValueError()
            from .models import User
            user = User.objects.get(pk=payload['sub'], is_active=True)
            return user, payload
        except Exception:
            try:
                return authenticate_supabase_user(token)
            except exceptions.AuthenticationFailed:
                raise exceptions.AuthenticationFailed('Invalid or expired access token.')
