from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.CharField(max_length=20, unique=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('processing', 'Processing'), ('shipped', 'Shipped'), ('out_for_delivery', 'Out for delivery'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled'), ('refunded', 'Refunded'), ('returned', 'Returned')], default='pending', max_length=20)),
                ('payment_status', models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded')], default='pending', max_length=20)),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tax', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('shipping_cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('discount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('currency', models.CharField(default='USD', max_length=8)),
                ('payment_method', models.CharField(default='cash_on_delivery', max_length=30)),
                ('shipping_address', models.JSONField()),
                ('billing_address', models.JSONField(blank=True, null=True)),
                ('note', models.TextField(blank=True, null=True)),
                ('carrier', models.CharField(blank=True, max_length=100)),
                ('tracking_number', models.CharField(blank=True, max_length=150)),
                ('shipped_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('estimated_delivery_date', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('method', models.CharField(choices=[('credit_card', 'Credit Card'), ('paypal', 'PayPal'), ('bank_transfer', 'Bank Transfer'), ('cash_on_delivery', 'Cash on Delivery')], max_length=20)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transaction_id', models.CharField(blank=True, max_length=100, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='payment', to='orders.order')),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='orders.order')),
            ],
        ),
    ]
