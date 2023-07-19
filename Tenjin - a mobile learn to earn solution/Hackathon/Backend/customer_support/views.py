from django.core.mail import send_mail
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from customer_support.models import CustomerSupport
from customer_support.serializers import CreateCustomerSupportSerializer, \
    RetrieveUpdateDestroyCustomerSupportSerializer, ListCustomerSupportSerializer
from django.contrib.auth import get_user_model
from allauth.account.adapter import get_adapter

User = get_user_model()


class CreateCustomerSupportMassage(CreateAPIView):
    """
    Create a Customer Support instance to be sent as an email to Wizzer Support
    """
    queryset = CustomerSupport.objects.all()
    serializer_class = CreateCustomerSupportSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Customer_support'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):

        instance = serializer.save()

        user_lastname = instance.user.last_name
        user_name = instance.user.first_name
        msg = instance.message
        user_email = instance.user.email
        email = get_adapter().clean_email('hello@wizzer.io')

        context = {
            'user_email': user_email,
            'msg': msg,
            'user_name': user_name,
            'user_lastname': user_lastname
        }

        get_adapter().send_mail(
            'account/email/customer_support_key', email, context
        )
        return instance


class RetrieveUpdateDestroyCustomerSupportMassage(RetrieveUpdateAPIView):
    """
    Update/Retrieve a Customer Support instance by passing a Customer Support ID
    """

    queryset = CustomerSupport.objects.all().order_by('pk')
    serializer_class = RetrieveUpdateDestroyCustomerSupportSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @swagger_auto_schema(tags=['Customer_support'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Customer_support'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Customer_support'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class ListCustomerSupportMassage(ListAPIView):
    """
    Get all a Customer Support instances
    """
    queryset = CustomerSupport.objects.all()
    serializer_class = ListCustomerSupportSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['Customer_support'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)