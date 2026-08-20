# Nara TV Frontend - Backend Integration Guide

## 1. Watch Page & Video Player
### Expected Endpoints
- **GET** `/api/v1/watch/{slug}`
  Fetches the watch page metadata and handles access rights.
  *Response shape:*
  ```json
  {
    "id": "event-123",
    "title": "Main Event: Boxer A vs Boxer B",
    "description": "...",
    "is_live": true,
    "status": "live", // "scheduled" | "starting_soon" | "live" | "ended" | "replay_available"
    "source": {
      "type": "hls", // "mp4" | "hls" | "youtube"
      "url": "https://stream.mux.com/xxxxx.m3u8",
      "poster": "https://picsum.photos/seed/poster/1920/1080"
    },
    "access": {
      "has_access": true,
      "requires_target": "subscription", // "free" | "ticket" | "subscription" | "ppv",
      "payment_options": []
    }
  }
  ```

## 2. Live Chat Integration
- **GET** `/api/v1/live-events/{eventId}/chat/messages` -> Loads initial messages.
- **POST** `/api/v1/live-events/{eventId}/chat/messages` -> Send a chat message.
- **WebSockets / Laravel Echo:** 
  You should connect Laravel Reverb or Pusher via Echo inside `components/watch/ChatTab.tsx`.
  Listen to channel `live-event.{eventId}` and event `ChatMessageSent`.

## 3. Comments (For VODs/Replays)
- **GET** `/api/v1/videos/{videoId}/comments` -> Load paginated comments.
- **POST** `/api/v1/videos/{videoId}/comments` -> Post new comment.

## 4. Content Rails
- **GET** `/api/v1/content/home-rails` -> Feed for the bottom of the dashboard.
- Connect this endpoint in `services/home.ts`.
