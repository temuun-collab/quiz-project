// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // const users = await prisma.user.findMany();
  try {
    const body = await req.json();
    const { clerkId, email, name } = body;
    if (!email) {
      return NextResponse.json({ error: "unauthor" }, { status: 200 });
    }
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });
    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 });
    }

    const users = await prisma.user.create({
      data: { clerkId, name, email },
    });
    console.log(users, "userid");

    return NextResponse.json(users, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async () => {};
