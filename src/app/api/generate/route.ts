import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Models } from "@google/genai";
const genimApi = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_MY_GEMINI_TOKEN,
});
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const text = body.text;
  const generate = prisma.quiz.create({
    data: text,
  });
  if (!text) {
    return NextResponse.json({ error: "no text" }, { status: 400 });
  }
  const res = await genimApi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate me quiz from this article: ${body}`,
  });
  const prompt = {
    quizzes: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
      },
    ],
  };
  const result = await Models.generateContent(prompt);
  return NextResponse.json({ question: quizzes });
  console.log(res);
  return new NextResponse(JSON.stringify({ generate }), { status: 201 });
};
