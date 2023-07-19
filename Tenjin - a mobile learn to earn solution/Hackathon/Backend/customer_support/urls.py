from django.urls import path

from customer_support.views import CreateCustomerSupportMassage, ListCustomerSupportMassage, RetrieveUpdateDestroyCustomerSupportMassage


urlpatterns = [
    # backend/api/contact_support/
    path('', ListCustomerSupportMassage.as_view()),
    path('new/', CreateCustomerSupportMassage.as_view()),
    path('<int:id>/', RetrieveUpdateDestroyCustomerSupportMassage.as_view()),

]
