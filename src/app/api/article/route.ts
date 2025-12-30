import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ message: "userId is required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const articles = await prisma.article.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ articles });
}
