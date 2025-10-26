from django.contrib import admin

from .models import Message, Room, RoomMembership


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("name", "theme", "is_public", "created_at")
    list_filter = ("is_public", "theme")
    search_fields = ("name", "theme")


@admin.register(RoomMembership)
class RoomMembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "room", "joined_at")
    search_fields = ("user__username", "room__name")
    list_select_related = ("user", "room")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "room", "sender", "recipient", "is_read", "created_at")
    list_filter = ("is_read", "room")
    search_fields = ("sender__username", "room__name", "content")
    list_select_related = ("room", "sender", "recipient")
