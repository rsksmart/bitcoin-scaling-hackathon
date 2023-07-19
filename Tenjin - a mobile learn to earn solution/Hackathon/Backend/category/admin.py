from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from category.models import Category


admin.site.unregister(Group)

User = get_user_model()



admin.site.site_header = 'Tenjin Admin Panel'



class CategoryAdmin(admin.ModelAdmin):


    # fields which are shown when looking at a list of instances
    list_display = ('category_name', 'sequence', 'activated', 'id')
    list_filter = ('created_at',)
    search_fields = ()
    ordering = ('sequence', 'activated',)



class AdminAcademy(admin.AdminSite):


    admin.site.site_header = 'Tenjin Admin Panel'


academy_site = AdminAcademy(name='AcademyAdmin')


admin.site.register(Category, CategoryAdmin)

academy_site.register(Category, CategoryAdmin)





