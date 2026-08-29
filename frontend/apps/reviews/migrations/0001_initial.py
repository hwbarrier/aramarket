from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target_type', models.CharField(max_length=20)),
                ('target_id', models.PositiveBigIntegerField()),
                ('author_name', models.CharField(max_length=200)),
                ('rating', models.PositiveSmallIntegerField()),
                ('comment', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ('-created_at',),
            },
        ),
    ]
