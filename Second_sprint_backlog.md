Second sprint backlog
1. Sprint Goal
Enhance user interaction and implement real-time communication features within ThemeChat, allowing users to send and receive messages instantly, join or leave chat rooms dynamically, and manage basic social connections through a friend system.

2. Functionalities to Complete

Real-Time Messaging
- Integrate WebSocket (Django Channels) to support live message sending and receiving within chat rooms.
- Display new messages instantly on the frontend without page refresh.
- Implement auto-scroll and message timestamp display.
- Handle message delivery acknowledgment and read status updates.

Group Interaction
- Enable users to join or leave groups directly from the Explore or Group pages.
- Update joined groups dynamically in the user’s “My Groups” list.
- Add backend logic to manage membership and store join/leave events.

Message Notifications
- Implement unread message counts on the navigation bar and message list.
- Show notification badges for new messages in each group.
- Allow users to mark messages as read upon viewing.

UI & UX Enhancement
- Add message input box with send button and keyboard shortcuts.
- Improve chat interface with alternating message bubble colors for sender and receiver.
- Include loading indicators and status messages for better user feedback.

3. Team Allocation
The second sprint is led by **Fanyun Xu**.
- **Fenghua Tong:** Develop real-time backend with Django Channels, manage WebSocket routing, and ensure secure message handling.
- **Fanyun Xu:** Implement the dynamic frontend chat interface, including message rendering and live updates.
- **Linyang Liu:** Add group join/leave functionality and unread message notifications.
- **Shuangxueer Zhang:** Design and implement the friend management module within the Contacts page.

4. Expected Deliverable:
By the end of the sprint, the ThemeChat system will support:
- Real-time messaging within joined groups.
- Dynamic group membership updates.
- Basic friend management and message notification features.
- A polished, interactive chat interface that enables live communication among users.
