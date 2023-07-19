from django.contrib import admin

from category.admin import academy_site
from class_app.models import Class, AffiliateLink


class ClassAdmin(admin.ModelAdmin):

    def chapter(self, obj):
        return obj.lesson.chapter

    # fields which are shown when looking at a list of instances
    list_display = ('id', 'title', 'lesson', 'sequence', 'chapter')
    raw_id_fields = ('lesson',)
    list_filter = ('created_at', 'lesson',)
    search_fields = ('title', 'id',)
    ordering = ('id',)



class Affiliate_Link_Admin(admin.ModelAdmin):


    # fields which are shown when looking at a list of instances
    list_display = ('id', 'service_name')
    filter_horizontal = ('related_class',)
    list_filter = ('created_at',)
    search_fields = ('service_name',)
    ordering = ('id',)



admin.site.register(AffiliateLink, Affiliate_Link_Admin)

academy_site.register(AffiliateLink, Affiliate_Link_Admin)


admin.site.register(Class, ClassAdmin)

academy_site.register(Class, ClassAdmin)


