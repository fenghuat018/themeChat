from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from .models import Message, Room, RoomMembership
from .serializers import MessageSerializer, RoomSerializer


class ExploreRoomsView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RoomSerializer

    def get_queryset(self):
        joined_ids = RoomMembership.objects.filter(user=self.request.user).values_list(
            "room_id", flat=True
        )
        return Room.objects.filter(is_public=True).exclude(id__in=joined_ids).order_by("name")


class JoinedRoomsView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RoomSerializer

    def get_queryset(self):
        return (
            Room.objects.filter(memberships__user=self.request.user)
            .distinct()
            .order_by("name")
        )


class JoinRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, room_id: int):
        room = get_object_or_404(Room, pk=room_id)
        membership, created = RoomMembership.objects.get_or_create(
            user=request.user, room=room
        )
        serializer = RoomSerializer(room)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)


class UnreadMessagesView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        return (
            Message.objects.filter(recipient=self.request.user, is_read=False)
            .select_related("room", "sender", "recipient")
            .order_by("-created_at")
        )
