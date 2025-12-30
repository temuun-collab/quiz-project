"use client";

import { HistoryHeader } from "@/app/_component/HistoryHeader";
import { useRouter } from "next/navigation";
import { Bookmark, CheckCircle, X, XCircle } from "lucide-react";
import { BookOpen, FileText } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { GeneratorIcon } from "@/app/_downIcon/GeneratorIcon";
export default function ArticleClick() {
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id;
  const [summary, setSummary] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/article?userId=${userId}`);
        // if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        console.log(data, "dataaaa");

        setSummary(data.articles[0].summary);
        setTitle(data.articles[0].title);
        setContent(data.articles[0].content);
        console.log(summary, "summmaryy");
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };
    fetchHistory();
  }, [userId]);
  const [seeContent, setSeeContent] = useState(false);
  const handleSeeContent = () => {
    setSeeContent(!seeContent);
  };
  const handleBackActive = () => {
    setTimeout(() => {
      router.push("/.");
    }, 3000);
  };
  return (
    <div className="flex w-[1440px]">
      <HistoryHeader />
      <div className="w-[1368px] h-[1080px] flex flex-col items-center justify-center bg-[#f8f8f8] border">
        <div className="w-[858px] h-[450px]">
          <button
            className="w-[47px] h-10 border rounded-md flex justify-center items-center ml-5 bg-white"
            onClick={handleBackActive}
          >
            <ChevronLeft className="w-4 h-5 " />
          </button>
          <div
            className={`w-[858px] h-[400px] bg-white border border-gray-100 rounded-md flex justify-center items-center m-5
        `}
          >
            <div className={`w-[800px] h-auto flex flex-col gap-5`}>
              <div className="w-200 h-8 flex gap-2">
                <GeneratorIcon />
                <p className="text-black font-bold h-8 text-6">
                  Article Quiz Generator
                </p>
              </div>
              <div className="w-[800px] h-auto flex flex-col">
                <div className="flex w-[800px] h-5 gap-2">
                  <BookOpen className="w-4 h-4 mt-1" />
                  <p className="text-[14px] text-[#737373]">
                    Summarized content
                  </p>
                </div>
                <p className="text-[25px] font-bold text-black">{title}</p>
              </div>
              <div className="w-[800px] h-auto flex flex-col">
                <p className="text-[14px] text-black">{summary}</p>
              </div>
              <div className="w-[800px] flex justify-between">
                <button
                  className="w-[113px] h-10 flex justify-center items-center text-black border rounded-md"
                  onClick={handleSeeContent}
                >
                  See content
                </button>
                {/* <button
                  className="w-[113px] h-10 flex justify-center items-center text-white bg-black rounded-md text-[14px]"
                    onClick={generate}
                >
                  Back
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {seeContent && (
        <div className="fixed  z-50 top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(0,_0,_0,_0.5)]">
          <div className="w-[628px] h-auto rounded-md border bg-white flex flex-col justify-center items-center">
            <div className="w-[572px] h-auto mt-5 mb-5">
              <div className="flex justify-between w-[572px]">
                <p className="text-[25px] font-bold text-black">{title}</p>
                <button
                  className="w-10 h-10 flex justify-center items-center border rounded-md "
                  onClick={() => {
                    setSeeContent(false);
                  }}
                >
                  <X />
                </button>
              </div>
              <p className="text-[14px] text-black">{content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
