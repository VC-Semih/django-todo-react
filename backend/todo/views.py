from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer
from .models import Todo


# Create your views here. A view in django is a controller and not a template !!!

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()  # Gets all Todo_objects, this is the query field.
