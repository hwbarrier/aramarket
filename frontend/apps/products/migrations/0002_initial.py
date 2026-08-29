from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0001_initial'),
        ('users', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='vendor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='users.vendorprofile'),
        ),
        migrations.AddField(
            model_name='customcategoryrequest',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='category_requests', to='products.product'),
        ),
        migrations.AddField(
            model_name='customcategoryrequest',
            name='reviewed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='customcategoryrequest',
            name='vendor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='category_requests', to='users.vendorprofile'),
        ),
    ]
