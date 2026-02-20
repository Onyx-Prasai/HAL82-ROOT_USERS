import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message, Notification

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        self.receiver_id = self.scope["url_route"]["kwargs"]["receiver_id"]
        self.room_name = f"chat_{min(self.user.id, self.receiver_id)}_{max(self.user.id, self.receiver_id)}"
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        sender_id = self.user.id
        receiver_id = int(self.receiver_id)
        timestamp = await self.save_message(sender_id, receiver_id, message)
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "timestamp": timestamp,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        msg = Message.objects.create(sender_id=sender_id, receiver_id=receiver_id, content=message)
        Notification.objects.create(
            user_id=receiver_id,
            notification_type='MESSAGE',
            title='New Message',
            message=f"You received a message (see chat).",
            payload={'sender_id': sender_id},
        )
        return msg.timestamp.isoformat()
