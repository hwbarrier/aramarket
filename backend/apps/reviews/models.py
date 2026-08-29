from django.conf import settings
from django.db import models

class Review(models.Model):
    target_type = models.CharField(max_length=20)
    target_id = models.PositiveBigIntegerField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    author_name = models.CharField(max_length=200)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ('-created_at',)
        constraints = [models.CheckConstraint(check=models.Q(rating__gte=1, rating__lte=5),
                                               name='review_rating_1_5')]
