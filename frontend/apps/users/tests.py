from rest_framework.test import APITestCase
from apps.users.models import User

class AuthContractTests(APITestCase):
    def test_register_login_me_refresh_logout(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'contract@example.com', 'password': 'secret123',
            'name': 'Contract User', 'role': 'client', 'permissions': ['buy_products'],
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['data']['role'], 'client')
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 200)
        self.assertEqual(self.client.post('/api/auth/refresh/').status_code, 200)
        self.assertEqual(self.client.post('/api/auth/logout/').status_code, 204)

    def test_duplicate_email_is_validation_error(self):
        User.objects.create_user('duplicate@example.com', 'secret123')
        response = self.client.post('/api/auth/register/', {
            'email': 'duplicate@example.com', 'password': 'secret123',
        }, format='json')
        self.assertEqual(response.status_code, 400)
