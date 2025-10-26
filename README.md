# Theme Chat Milestone
A minimal, testable milestone for a theme-based chat platform. The backend is built with Django REST Framework, OAuth-only authentication, and JWT issuance. The frontend is a Vite + React + TypeScript application styled with Tailwind CSS.

## Project Layout
- `server/` – Django REST API (OAuth-only auth, rooms/messages endpoints, seed command)
- `web/` – Vite + React single-page app (routing, auth handling, placeholder chat UIs)

## Backend Quick Start
- cd server
- python3 -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt  # mysqlclient needs libmysqlclient headers installed
- python manage.py migrate (如果变更表结构)
- python manage.py seed_demo 生成演示房间与消息
- python manage.py runserver，API 将跑在 http://127.0.0.1:8000/


## Frontend Quick Start
- 新开终端：cd web
- npm run dev
- 浏览器访问 http://127.0.0.1:5173 即可看到 Explore/Groups/Messages + OAuth 登录的界面

## OAuth Configuration Notes
github Oauth:
Client ID: Ov23li9GtbLOLaest3IY
secret key: 1f87028551a7e141acb483d4a773284ac6c918fe

## MySQL guidance
- 确认 MySQL 已启动, brew services start mysql (Mac)
- 以 root（或具备创建权限的账号）登录：mysql -u root -p
