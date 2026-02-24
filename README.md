# Node.js Express Backend TypeScript Project

## WorkStack-server

This repo contains **Backend** of the Project: WorkStack: A Project Management Tool
The **Frontend** part of this is in Repo: [WrokStack-client](https://github.com/ashishkr45/WorkStack-client.git)

## Project Highlight

1. Node.js
2. Express.js
3. Typescript
4. Mongoose
5. Mongodb
6. JWT

## About this Project

A modern full-stack project management application built using the MERN stack.  
It allows teams to create projects, assign tasks, manage workflows, and track progress efficiently.

## Project Structure

```text
src/
 ├─ models/
 │  ├── User.ts
 │  ├── Project.ts
 │  ├── ProjectMember.ts
 │  └── Task.ts
 │
 ├─ controllers/
 │  ├── auth.controller.ts
 │  ├── project.controller.ts
 │  └── task.controller.ts
 │
 ├─ routes/
 │  ├── auth.routes.ts
 │  ├── project.routes.ts
 │  └── task.routes.ts
 │
 ├─ middleware/
 │  ├── auth.middleware.ts
 │  └── role.middleware.ts
 │
 ├─ app.ts
 ├─ config.ts
 └─ server.ts
```

## Installation & Setup

1. Clone the repo

   ```bash
      git clone https://github.com/ashishkr45/WorkStack-server.git
      cd WorkStack-server
   ```

2. Install Dependencies

   ```bash
      npm install
   ```

3. Configure Environment Variables

   Create a `.env` file in the root directory and add the following:

   ```env
      PORT=8000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
   ```

4. Run the Development Server

   ```bash
      npm run dev
   ```

5. Build for Production

   ```bash
      npm run build
      npm start
   ```

---

The server should now be running at:

```web
http://localhost:8000
```
