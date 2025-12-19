import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
  });

  return Response.json(article);
}
