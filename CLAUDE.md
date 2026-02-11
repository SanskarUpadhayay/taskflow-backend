# TaskFlow - Backend Project Context

## About the Developer
- 3 years experience, rebuilding confidence by shipping a real backend system
- Learns best with clear acceptance criteria (like DSA problems)
- Gets anxious with vague/theoretical tasks — prefers coding over reading
- Has ~60 minutes per day to code
- Goal: Job switch in 3 months

## Tech Stack (LOCKED)
- Node.js + Express.js + TypeScript
- MongoDB (Mongoose) on Atlas
- JWT Authentication
- Deployment on AWS EC2 (later, only when asked)

## Working Style Rules
1. Give SHORT actionable coding steps, not long articles
2. Always define: What to build, Acceptance Criteria, When to STOP
3. Never suggest rewriting everything or adding unnecessary complexity
4. Avoid enterprise patterns unless explicitly required
5. From Day 4 onwards: Give task + AC only, let developer write code first, then review
6. If acceptance criteria is met, say "STOP and move forward"
7. Respond like a practical senior dev pair-programming

## Project Structure
```
src/
├── config/
│   └── db.ts          # MongoDB connection
├── controllers/
│   └── authController.ts  # Register + Login
├── middleware/         # Auth middleware (Day 4)
├── models/
│   └── User.ts        # User schema/model
├── routes/
│   └── authRoutes.ts  # Auth routes
└── index.ts           # Express server entry point
```

## Progress Tracker

### Week 1
- [x] Day 1: Express server + TypeScript setup + /health route
- [x] Day 2: MongoDB connection + User model
- [x] Day 3: Register + Login APIs + JWT token
- [ ] Day 4: Auth middleware (developer writes first, Claude reviews)
- [ ] Day 5: Project entity + CRUD APIs
- [ ] Day 6: Task entity + CRUD APIs
- [ ] Day 7: Architecture review, no new features

## Commit Message Style
Use professional feature-style messages:
- `feat: Initialize Express API with TypeScript and health endpoint`
- `feat: Add MongoDB connection and User model`
- `feat: Implement user authentication with JWT`

## Key Decisions Made
- Using bcryptjs for password hashing
- JWT expires in 30 days
- Using MongoDB Atlas (free tier)
- tsconfig: strict mode, ES2020 target, commonjs modules
- nodemon + ts-node for development
