from .base import *
from decouple import config

ALLOWED_HOSTS = ['deployed-capital.com', 'www.deployed-capital.com', '172.31.87.170']

CORS_ORIGIN_WHITELIST = [
    'https://deployed-capital.com', 
    'https://www.deployed-capital.com'   
]

CSRF_COOKIE_SECURE = True

SESSION_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = True

SECURE_SSL_HOST = config('SECURE_SSL_HOST')

SECURE_HSTS_SECONDS = 31536000

STATIC_URL = '/home/ubuntu/'

try:
    from .local import *
except:
    pass
