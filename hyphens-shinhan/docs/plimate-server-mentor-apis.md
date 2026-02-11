# plimate-server APIs and mentor view

Backend base: `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://hypen.supervive.bio/api/v1`).  
All plimate-server routes are under `/api/v1`.

## Already connected for mentor view

| API | Purpose |
|-----|--------|
| `GET /users/me` | Display name (e.g. "한동훈님") via `useMe` / `useUserStore` |
| `GET /mentoring/requests/received?status=PENDING` | Mentor home: pending requests list, 수락/거절 |
| `POST /mentoring/requests/{id}/accept` | Accept request → redirect to calendar |
| `POST /mentoring/requests/{id}/reject` | Reject request |
| `GET /mentoring/requests/received?status=ACCEPTED` | Mentees list + mentor home "활성 멘티" count |
| `GET /mentoring/profile/me` | Mentor profile page (view) |
| `PATCH /mentoring/profile` | Mentor profile edit (introduction, affiliation) |

## Optional: connect next

| API | Purpose |
|-----|--------|
| **`GET /chats`** | Mentor "메시지" tab: list chat rooms. plimate-server has `GET /chats` (room list), `GET /chats/{room_id}/messages`, `POST` to send. Currently `src/services/chat.ts` uses mocks; wiring to these would show real conversations for mentors. |
| **Stats** | "다가오는 미팅", "총 멘토링 시간", "응답률" are still mock — plimate-server has no dedicated stats endpoint. Could add a small `/mentoring/stats` (or derive from other tables) later. |
| **일정 (Calendar)** | No mentoring calendar/schedule endpoint in plimate-server; calendar tab stays placeholder unless backend adds one. |

## Adding data so the mentor view is not empty

The mentor UI reads from the **same Supabase project** as plimate-server. If there are no mentoring requests or chat rooms for the logged-in mentor, the mentor view will be empty.

- **Option 1 (recommended):** Run the seed SQL in that Supabase project. See **plimate-server** docs: [SEED_MENTOR_DATA.md](../../../plimate-server/docs/SEED_MENTOR_DATA.md). The script uses existing users (one MENTOR, two YB/OB), inserts `mentoring_requests` (PENDING + ACCEPTED), mutual `follows`, and one DM room with messages.
- **Option 2:** Add rows manually in Supabase (e.g. `mentoring_requests`, `follows`, `chat_rooms`, `chat_room_members`, `chat_messages`) as described in that doc.

Existing YB/OB student data in the same DB is reused as mentees; no need to duplicate user data.

## Other plimate-server routes (not mentor-specific)

- **YB / 공통**: `GET /mentoring/mentors`, `GET /mentoring/mentors/{id}`, `GET /mentoring/recommendations`, `POST /mentoring/requests`, `GET /mentoring/requests/sent`, `GET|POST|PUT /mentoring/survey/me` — used by YB flow (mentor list, apply, questionnaire).
- **Notifications**: `GET /notifications`, push subscribe — used app-wide if header uses them.
- **Chats**: `GET /chats`, `GET /chats/{room_id}/messages`, `POST` create/send — can be used by mentor messages tab as above.
