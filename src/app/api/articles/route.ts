import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { title } from "process";
const genimApi = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_MY_GEMINI_TOKEN,
});
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { title, content, userId } = body;

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!title || !content || !userId) {
      console.log("❌ Missing fields");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const res = await genimApi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `this article is article please summarize to me this: ${body.content}`,
    });
    const { candidates } = res as any;
    const summary = candidates[0].content.parts[0].text;
    console.log(summary, "summ");

    const article = await prisma.article.create({
      data: {
        title: title,
        content: content,
        userId: user?.id || 0,
        summary: summary,
      },
    });
    console.log(res);
    console.log(article, "body");
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error(" SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId") as string;

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    const articles = await prisma.article.findMany({
      where: { userId: user?.id },
    });

    return NextResponse.json({ articles }, { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Failed to fetch all articles", { status: 500 });
  }
};
