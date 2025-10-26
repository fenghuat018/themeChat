from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from chat.models import Message, Room, RoomMembership


class Command(BaseCommand):
    help = "Seed sample rooms and demo messages for development"

    def handle(self, *args, **options):
        rooms = [
            ("Retro Gaming Lounge", "Gaming"),
            ("Mindful Mornings", "Wellness"),
            ("Art & Illustration", "Creative"),
            ("AI Builders", "Technology"),
        ]

        created_count = 0
        for name, theme in rooms:
            _, created = Room.objects.get_or_create(
                name=name,
                defaults={"theme": theme, "is_public": True},
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Ensured {len(rooms)} rooms ({created_count} added)."))

        system_user, _ = User.objects.get_or_create(
            username="system-bot",
            defaults={"email": "system@example.com"},
        )

        demo_user, _ = User.objects.get_or_create(
            username="demo-user",
            defaults={"email": "demo@example.com"},
        )

        for room in Room.objects.all()[:2]:
            RoomMembership.objects.get_or_create(user=demo_user, room=room)
            Message.objects.get_or_create(
                room=room,
                sender=system_user,
                recipient=demo_user,
                content=f"Welcome to {room.name}!",
            )

        self.stdout.write(self.style.SUCCESS("Seed data ready."))
        self.stdout.write(self.style.WARNING("Note: Seed command intended for local development only."))
