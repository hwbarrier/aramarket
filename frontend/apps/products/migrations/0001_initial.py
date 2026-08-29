from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='categories/')),
                ('is_active', models.BooleanField(default=True)),
                ('name_key', models.CharField(blank=True, max_length=150)),
                ('icon', models.CharField(blank=True, max_length=80)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='CustomCategoryRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('requested_category', models.CharField(max_length=150)),
                ('requested_sub_category', models.CharField(blank=True, max_length=150)),
                ('description', models.TextField(blank=True)),
                ('status', models.CharField(default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('reviewed_at', models.DateTimeField(blank=True, null=True)),
                ('admin_notes', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('compare_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('cost_per_item', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('sku', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('barcode', models.CharField(blank=True, max_length=100, null=True)),
                ('quantity', models.IntegerField(default=0)),
                ('is_published', models.BooleanField(default=False)),
                ('is_featured', models.BooleanField(default=False)),
                ('can_backorder', models.BooleanField(default=False)),
                ('requires_shipping', models.BooleanField(default=True)),
                ('weight', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('review_count', models.IntegerField(default=0)),
                ('brand', models.CharField(blank=True, max_length=100)),
                ('sub_category', models.CharField(blank=True, max_length=100)),
                ('features', models.JSONField(blank=True, default=list)),
                ('specifications', models.JSONField(blank=True, default=dict)),
                ('tags', models.JSONField(blank=True, default=list)),
                ('shipping_info', models.JSONField(blank=True, default=dict)),
                ('status', models.CharField(default='published', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='products.category')),
            ],
        ),
        migrations.CreateModel(
            name='ProductOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='options', to='products.product')),
            ],
        ),
        migrations.CreateModel(
            name='ProductOptionValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=100)),
                ('price_modifier', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('quantity', models.IntegerField(default=0)),
                ('option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='values', to='products.productoption')),
            ],
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='products/')),
                ('alt_text', models.CharField(blank=True, max_length=200, null=True)),
                ('is_default', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='products.product')),
            ],
        ),
    ]
