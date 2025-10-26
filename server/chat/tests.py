from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Message, Room, RoomMembership


class RoomAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="roomie", email="roomie@example.com")
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        self.room_public = Room.objects.create(name="Public Room", theme="General", is_public=True)
        self.room_private = Room.objects.create(name="Private Room", theme="Secret", is_public=False)

    def test_explore_lists_unjoined_public_rooms(self):
        response = self.client.get(reverse("api-rooms-explore"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        room_ids = [item["id"] for item in response.json()["results"]]
        self.assertIn(self.room_public.id, room_ids)
        self.assertNotIn(self.room_private.id, room_ids)

    def test_join_room_creates_membership(self):
        url = reverse("api-rooms-join", args=[self.room_public.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(RoomMembership.objects.filter(user=self.user, room=self.room_public).exists())

    def test_joined_rooms_lists_memberships(self):
        RoomMembership.objects.create(user=self.user, room=self.room_public)
        response = self.client.get(reverse("api-rooms-joined"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.json()["results"]), 1)

    def test_unread_messages_endpoint(self):
        RoomMembership.objects.create(user=self.user, room=self.room_public)
        Message.objects.create(
            room=self.room_public,
            sender=self.user,
            recipient=self.user,
            content="Test message",
        )
        response = self.client.get(reverse("api-messages-unread"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["results"]), 1)
