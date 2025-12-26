"use client";
import { useEffect, useState } from "react";
import { GeneratorIcon } from "../_downIcon/GeneratorIcon";
import { TitleIcon } from "../_downIcon/TitleIcon";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@clerk/nextjs";
import { ReturnInf } from "./ReturnInf";
import { ChevronLeft } from "lucide-react";

export const Container = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();
  const [activeButton, setActiveButton] = useState(false);
  const handleActiveButton = () => {
    setActiveButton(!activeButton);
  };
  const handleAgainButton = () => {
    setContent("");
    setTitle("");
  };
  const handleBackActive = () => {
    setActiveButton(false);
    setContent("");
    setTitle("");
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [generateResult, setGenerateResult] = useState("");
  const [error, setError] = useState("");
  const [articleId, setArticleId] = useState<number | null>(null);
  const generate = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title болон Content хоёуланг нь бөглөнө үү");
      return;
    }

    setError("");
    setIsGenerating(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          content: content,
          userId: user?.id,
        }),
      });
      const data = await res.json();
      setIsGenerating(false);
      handleActiveButton();
      setGenerateResult(data.summary);
      setArticleId(data.id);
    } catch (err) {
      setError("Алдаа гарлаа. Дахин оролдоно уу");
    } finally {
      setIsGenerating(false);
    }
  };
  const createUser = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          name: user?.firstName,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    createUser();
  }, [user]);
  return (
    <div className="flex flex-col justify-center">
      {(title.trim().length > 0 || content.trim().length > 0) && (
        <button
          className={`${
            activeButton
              ? "hidden"
              : "w-[47px] h-10 border rounded-md flex justify-center items-center bg-white mt-32 mb-5"
          }`}
          onClick={handleAgainButton}
        >
          <ChevronLeft className="w-4 h-5 " />
        </button>
      )}

      <div
        className={`${
          activeButton
            ? "bg-[#f8f8f8] flex justify-center items-center"
            : "w-[856px] h-[442px] rounded-md border flex justify-center items-center bg-white"
        }`}
      >
        <div
          className={`${
            activeButton ? "hidden" : "w-200 h-[404px] flex flex-col gap-5"
          }`}
        >
          <div className="w-200 h-[78px] flex flex-col">
            <div className="w-200 h-8 flex gap-2">
              <GeneratorIcon />
              <p className="text-black font-bold text-2xl">
                Article Quiz Generator
              </p>
            </div>
            <p className="text-4 text-[#71717A]">
              Paste your article below to generate a summarize and quiz
              question. Your articles will saved in the sidebar for future
              reference
            </p>
          </div>

          <div className="w-200 min-h-16 flex flex-col">
            <div className="h-7 flex gap-2 items-center">
              <TitleIcon />
              <p className="text-[#71717A] text-[14px]">Article Title</p>
            </div>
            <Textarea
              placeholder="Enter a title for your article..."
              className={`${
                error
                  ? "border-red-600 w-200 min-h-10 rounded-md"
                  : "w-200 min-h-10 border rounded-md flex items-center text-black border-gray-200"
              }`}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <div className="w-200 min-h-[145px] flex flex-col">
            <div className="h-7 flex gap-2 items-center">
              <TitleIcon />
              <p className="text-[#71717A] text-[14px]">Article Content</p>
            </div>
            <Textarea
              placeholder="Enter a title for your article..."
              className={`${
                error
                  ? "border-red-600 w-200 min-h-30 rounded-md"
                  : "w-200 min-h-30 border rounded-md flex items-center text-black border-gray-200"
              }`}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <div className=" flex justify-end w-200 ">
            <button
              className="cursor-pointer w-40 h-10 flex justify-center items-center bg-[#71717A] rounded-md"
              onClick={generate}
            >
              {isGenerating ? (
                <Spinner className="w-4 h-4 text-white" />
              ) : (
                <p className="  text-white text-[14px]">Generate summary</p>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeButton && (
        <ReturnInf
          generateResult={generateResult}
          title={title}
          content={content}
          handleBackActive={handleBackActive}
          articleId={articleId}
        />
      )}
    </div>
  );
};
