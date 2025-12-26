// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const users = await prisma.user.findMany();
  try {
    const body = await req.json();
    const { clerkId, email, name } = body;

    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 });
    }

    const user = await prisma.user.create({
      data: { clerkId, name, email },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async () => {};
