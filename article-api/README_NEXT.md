# A simple Todo ReST API with Supabase Auth and persistance

This is a demo application with user authentication using Supabase, JWT token handling for session management, and protected CRUD operations for todos.

This demo uses Node.js and Express for the server setup, TypeScript for strong typing, and Supabase for authentication and database operations.

# Step 1: Initialize Your Project

First, ensure Node.js is installed on your system. Create a new project directory, initialize a Node.js project, and install necessary dependencies.

```bash

mkdir supabase-todos
cd supabase-todos
npm init -y
npm install express @supabase/supabase-js dotenv jsonwebtoken node-fetch typescript @types/node @types/express @types/jsonwebtoken @types/node-fetch --save-dev

```

Set up TypeScript in your project:

```bash

npx tsc --init
```

Modify tsconfig.json to suit your project, for example:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

## Step 2: Configure Supabase

Sign up or log in to Supabase and create a new project. Note down your project's URL and anon key from the project's API settings.

Create a .env file in your project root:

```env

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

## Step 3: Set Up Express Server and Supabase Client

Create a src folder and inside it, an index.ts file. Initialize your Express server and Supabase client:

```typescript
// src/index.ts
import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

app.use(express.json());

app.listen(3000, () => console.log("Server running on port 3000"));
```

## Step 4: Implement Authentication Routes

Add routes for user registration and login, which interact with Supabase's authentication API:

```typescript
// User registration
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: "User registered successfully", user });
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { user, session, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Login successful", session });
});
```

## Step 5: Implement JWT Middleware for Route Protection

Create a middleware to verify JWT tokens from Supabase:

```typescript
// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const jwksUrl = `${process.env.SUPABASE_URL}/auth/v1/jwks`;
    const jwksResponse = await fetch(jwksUrl);
    const jwks = await jwksResponse.json();
    const getKey = (header, callback) => {
      const signingKey = jwks.keys.find((key) => key.kid === header.kid);
      callback(
        null,
        signingKey
          ? `-----BEGIN PUBLIC KEY-----\n${signingKey.x5c[0]}\n-----END PUBLIC KEY-----`
          : null,
      );
    };

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = { id: decoded?.sub }; // Use the user ID from the token
      next();
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};
```

## Step 6: Define CRUD Operations for Todos

Implement CRUD operations for todos, ensuring they're protected with the authenticate middleware. Here's an example of creating a todo:

```typescript
// Create a todo
app.post("/todos", authenticate, async (req: AuthRequest, res) => {
  const { title, description } = req.body;
  const { user } = req;

  const { data, error } = await supabase
    .from("todos")
    .insert([{ title, description, user_id: user!.id }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});
```

Repeat similar patterns for reading, updating, and deleting todos, using the authenticated user's ID to ensure they can only access their own data.

## Step 7: Running Your Application

Compile TypeScript to JavaScript:

```bash

npx tsc
```

Run your compiled server:

```bash

node dist/index.js
```
