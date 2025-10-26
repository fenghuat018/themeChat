from django.urls import path

from .views import ExploreRoomsView, JoinRoomView, JoinedRoomsView, UnreadMessagesView

urlpatterns = [
    path("rooms/explore/", ExploreRoomsView.as_view(), name="api-rooms-explore"),
    path("rooms/joined/", JoinedRoomsView.as_view(), name="api-rooms-joined"),
    path("rooms/<int:room_id>/join/", JoinRoomView.as_view(), name="api-rooms-join"),
    path("messages/unread/", UnreadMessagesView.as_view(), name="api-messages-unread"),
]
