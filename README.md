<b>STICKY BOARD</b>

<b> Description </b>

<i>A visual, drag-and-drop task management tool that combines the familiarity of colorful sticky notes with the structure of a Kanban board and calendar.

You'll see a playful gradient app with a mini calendar on the left, colorful post-it note task cards with drag-and-drop between columns, priority badges, due dates, a board selector dropdown, and full create/edit/delete for both tasks and boards.</i>

<b>Intent & Goal</b>

<i>A fun, playful Kanban-style task management web app where users can organize tasks as colorful post-it note cards across customizable boards. The app aims to make task management visually engaging and intuitive — combining a drag-and-drop Kanban board, a mini calendar sidebar for date-based task placement, and multiple saved boards per user.</i>

<b>Audience & Roles</b>

<i>Multiple users with separate accounts. Each user authenticates independently and has their own private set of Kanban boards, tasks, and calendar view. No shared boards between users. Role: authenticated user (full CRUD on their own data only).</i>

<b>Core Flows</b>

<i>These flows must work end-to-end:

- User signs up / logs in → lands on their main board view

- User creates a new Kanban board → board is saved and appears in a dropdown on the right sidebar → user can switch between boards

- User adds a task card to a column (e.g. To Do, In Progress, Done) → task appears as a post-it note with chosen color (yellow, pink, blue, green, purple)

- User edits a task → can update title, description/notes, due date, priority level (low/medium/high), and color

- User drags and drops a task card between columns on the Kanban board

- User views the mini calendar on the left sidebar → tasks with due dates appear on the calendar → user can drag a task from the board and drop it onto a calendar date to set/change its due date

- User deletes a task or an entire board

- User switches between their saved boards using the dropdown on the right side of the screen</i>

<b>Technical Requirements</b>

<i>React + Tailwind CSS. Drag and drop via @hello-pangea/dnd (already installed). Auth via Base44 AuthProvider (already configured). Data stored in Base44 backend entities: Board (title, owner), Task (title, description, due_date, priority, color, column, board_id, position). Mini calendar using react-day-picker (already installed). Multi-board support via dropdown switcher.</i>

<b>Design</b>

<i>Bright and playful aesthetic. Light gradient background (soft white-to-lavender or white-to-sky-blue). Task cards styled as post-it notes with slight drop shadows and a subtle paper texture feel. Color options per card: yellow, pink, blue, green, purple. Bold readable sans-serif typography. Priority badge indicators (low = green, medium = amber, high = red). Mini calendar on left sidebar. Board selector dropdown on right sidebar. Overall feel: cheerful, energetic, organized.</i>

