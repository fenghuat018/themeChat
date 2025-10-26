from django.contrib.auth.models import User
from rest_framework import serializers

from accounts.serializers import UserPublicSerializer
from .models import Message, Room, RoomMembership


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("id", "name", "theme", "is_public", "created_at")


class RoomMembershipSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)

    class Meta:
        model = RoomMembership
        fields = ("id", "room", "joined_at")


class MessageSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    sender = UserPublicSerializer(read_only=True)
    snippet = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = (
            "id",
            "room",
            "sender",
            "snippet",
            "is_read",
            "created_at",
        )

    def get_snippet(self, obj: Message) -> str:
        return (obj.content or "").strip()[:140]
