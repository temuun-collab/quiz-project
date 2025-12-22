import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Models } from "@google/genai";
const genimApi = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_MY_GEMINI_TOKEN,
});
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const content = body.content;

  if (!content) {
    return NextResponse.json({ error: "no text" }, { status: 400 });
  }
  const res = await genimApi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate me quiz from this article: ${content}. output format should be quizzes: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
      },
    ],`,
  });
  const { candidates } = res as any;
  const text = candidates[0].content.parts[0].text;
  console.log("--------", text);
  const quiz = JSON.parse(text.replace("```json", "").replace("```", ""));
  console.log(quiz, "quiz");
  const generate = prisma.quiz.create({
    data: {
      question: text.question,
      answer: text.answer,
      options: [text.options],
    },
  });
  return new NextResponse(JSON.stringify({ generate }), { status: 201 });
};
