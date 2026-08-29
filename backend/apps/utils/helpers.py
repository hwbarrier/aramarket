import random
import string
from datetime import datetime

def generate_order_number():
    """Generate a unique order number"""
    date_str = datetime.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{date_str}-{random_str}"

def calculate_cart_total(cart):
    """Calculate total price of cart items"""
    total = 0
    for item in cart.items.all():
        total += item.product.price * item.quantity
    return total

def validate_image_extension(value):
    """Validate that uploaded file is an image"""
    import os
    from django.core.exceptions import ValidationError # type: ignore
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension. Please upload an image file.')