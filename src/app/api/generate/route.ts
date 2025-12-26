// import prisma from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenAI, Models } from "@google/genai";
// const genimApi = new GoogleGenAI({
//   apiKey: process.env.NEXT_PUBLIC_MY_GEMINI_TOKEN,
// });
// export const POST = async (req: NextRequest) => {
//   const body = await req.json();
//   const { content, articleId } = body;
//   if (!content) {
//     return NextResponse.json({ error: "no text" }, { status: 400 });
//   }
//   const res = await genimApi.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: `Generate exactly 5 quiz questions from this article: ${content}. output format should be quizzes: [
//       {
//         question: "",
//         options: ["", "", "", ""],
//         answer: "",
//       },
//     ],`,
//   });
//   const { candidates } = res as any;
//   const text = candidates[0].content.parts[0].text;
//   console.log("--------", text);
//   const quiz = JSON.parse(text.replace("```json", "").replace("```", ""));
//   const firstQuiz = quiz[0];

//   const question = firstQuiz.question;
//   const answer = firstQuiz.answer;
//   const options = firstQuiz.options;
//   const generate = await prisma.quiz.create({
//     data: {
//       question: question,
//       answer: answer,
//       options: options,
//       articleId: articleId,
//     },
//   });
//   return new NextResponse(JSON.stringify({ generate }), { status: 201 });
// };

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genimApi = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_MY_GEMINI_TOKEN!,
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { content, articleId } = body;

    if (!content) {
      return NextResponse.json({ error: "no text" }, { status: 400 });
    }

    const res = await genimApi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Generate exactly 5 quiz questions from this article.

Return ONLY valid JSON array.
Format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }
]

Article:
${content}
      `,
    });

    const candidates = (res as any).candidates;
    const text = candidates[0].content.parts[0].text;
    const quizzes = JSON.parse(text.replace(/```json|```/g, "").trim());
    const savedQuizzes = [];

    for (const q of quizzes) {
      const saved = await prisma.quiz.create({
        data: {
          question: q.question,
          answer: q.answer,
          options: q.options,
          articleId: articleId,
        },
      });

      savedQuizzes.push(saved);
    }
    console.log(savedQuizzes, "saaaa");
    return NextResponse.json({ quizzes: savedQuizzes }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
