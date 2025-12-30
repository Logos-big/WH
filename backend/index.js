import express from "express";
import prisma from "./prismaClient.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ROOT (обязательно для Railway)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "WH backend",
  });
});

// health-check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// USERS API

// создать пользователя
app.post("/users", async (req, res) => {
  try {
    const { nickname, email } = req.body;

    if (!nickname || !email) {
      return res.status(400).json({ error: "nickname and email are required" });
    }

    const user = await prisma.user.create({
      data: { nickname, email },
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "email already exists" });
    }
    res.status(500).json({ error: "internal error" });
  }
});

// список пользователей
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

// пользователь по id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  res.json(user);
});

// ОБЯЗАТЕЛЬНО
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
