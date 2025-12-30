import express from "express";
import prisma from "./prismaClient.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", async (_, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
