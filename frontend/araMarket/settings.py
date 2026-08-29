from pathlib import Path
from decouple import config # type: ignore
from datetime import timedelta
import sys
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(os.path.join(BASE_DIR, 'apps'))

SECRET_KEY = config('SECRET_KEY', default='votre-secret-key-de-développement')
DEBUG = config('DEBUG', default=True, cast=bool)

render_hostname = config('RENDER_EXTERNAL_HOSTNAME', default='')
allowed_hosts = config('ALLOWED_HOSTS', default='localhost,127.0.0.1,testserver').split(',')
if render_hostname:
    allowed_hosts.append(render_hostname)
    allowed_hosts.append(f"{render_hostname}.onrender.com")
if DEBUG and 'testserver' not in allowed_hosts:
    allowed_hosts.append('testserver')
ALLOWED_HOSTS = [host.strip() for host in allowed_hosts if host.strip()]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'apps.users',
    'apps.products', 
    'apps.orders',
    'apps.cart',
    'apps.reviews',
    'apps.commissions',
    'apps.admin_api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'araMarket.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'araMarket.wsgi.application'

DB_ENGINE = config('DB_ENGINE', default='django.db.backends.sqlite3')
DATABASE_URL = config('DATABASE_URL', default='')

if DATABASE_URL:
    DATABASES = {'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=600, ssl_require=not DEBUG)}
else:
    DATABASES = {'default': {'ENGINE': DB_ENGINE}}
    if DB_ENGINE.endswith('sqlite3'):
        DATABASES['default']['NAME'] = str(BASE_DIR / 'db.sqlite3')
    else:
        DATABASES['default'].update({
            'NAME': config('DB_NAME', default='aramarket'),
            'USER': config('DB_USER', default='aramarket'),
            'PASSWORD': config('DB_PASSWORD', default='password'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='5432'),
        })

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('apps.users.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'COERCE_DECIMAL_TO_STRING': False,
}

FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:4173')
render_frontend = config('RENDER_EXTERNAL_HOSTNAME', default='')
render_frontend_origin = f"https://{render_frontend}" if render_frontend else None

CORS_ALLOWED_ORIGINS = list(dict.fromkeys([
    FRONTEND_URL,
    render_frontend_origin,
    "http://localhost:3000", "http://127.0.0.1:3000",
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:4173", "http://127.0.0.1:4173",
]))
CORS_ALLOWED_ORIGINS = [origin for origin in CORS_ALLOWED_ORIGINS if origin]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.onrender\.com$",
    r"^http://localhost:\d+$",
    r"^https://localhost:\d+$",
]

CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS', default=','.join(CORS_ALLOWED_ORIGINS)
).split(',')
if render_frontend:
    CSRF_TRUSTED_ORIGINS.append(f"https://{render_frontend}")
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in CSRF_TRUSTED_ORIGINS if origin.strip()]
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
JWT_ACCESS_MINUTES = config('JWT_ACCESS_MINUTES', default=15, cast=int)
JWT_REFRESH_DAYS = config('JWT_REFRESH_DAYS', default=30, cast=int)
JWT_REFRESH_COOKIE = 'aramarket_refresh'

SUPABASE_URL = config('SUPABASE_URL', default='https://drqzggozpiuzwxiouphh.supabase.co')
SUPABASE_PUBLISHABLE_KEY = config('SUPABASE_PUBLISHABLE_KEY', default='')
SUPABASE_SECRET_KEY = config('SUPABASE_SECRET_KEY', default='')
SUPABASE_JWKS_URL = config('SUPABASE_JWKS_URL', default=f'{SUPABASE_URL}/auth/v1/.well-known/jwks.json')

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
