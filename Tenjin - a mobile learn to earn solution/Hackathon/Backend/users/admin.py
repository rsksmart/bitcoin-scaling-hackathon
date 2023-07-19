from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from category.admin import academy_site

User = get_user_model()

@admin.register(User)
class UserAdmin(UserAdmin):
    readonly_fields = ('date_joined',)
    # fields shown when creating a new instance
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2')}
         ),
    )
    # fields when reading / updating an instance
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email','phone', 'wallet_address', 'notification_token', 'personal_referral_code', 'given_referral_code', 'is_subscribed', 'is_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        #('Groups', {'fields': ('groups',)}),
        ('Social',{'fields':('avatar', 'followees', 'about_me')}),

    )
    # fields which are shown when looking at a list of instances
    list_display = ('id','email','username','first_name', 'last_name', 'is_staff')
    ordering = ('id',)


class UserAdminCustom(admin.ModelAdmin):

    list_display = ('id', 'username')
    search_fields = ('username',)
    ordering = ('id',)


academy_site.register(User, UserAdminCustom)

