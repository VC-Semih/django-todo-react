from rest_framework import serializers
from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    # Classe Meta interne des modèles dans django.
    # https://docs.djangoproject.com/fr/4.1/ref/models/options/
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')
