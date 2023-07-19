from rest_framework import serializers
from customer_support.models import CustomerSupport


class CreateCustomerSupportSerializer(serializers.ModelSerializer):


    class Meta:
        model = CustomerSupport
        fields = '__all__'


class RetrieveUpdateDestroyCustomerSupportSerializer(serializers.ModelSerializer):


    class Meta:
        model = CustomerSupport
        fields = '__all__'


class ListCustomerSupportSerializer(serializers.ModelSerializer):


    class Meta:
        model = CustomerSupport
        fields = '__all__'