"use client";
import { BookOpen, FileText } from "lucide-react";
import { GeneratorIcon } from "../_downIcon/GeneratorIcon";
import { Bookmark, CheckCircle, X, XCircle } from "lucide-react";
import { useState } from "react";
import { ReloadIcon } from "../_downIcon/RestartIcon";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
type Result = {
  title: string;
  generateResult: string;
  handleBackActive: () => void;
  content: string;
  articleId: number | null;
};
type Quiz = {
  question: string;
  options: string[];
  answer: string;
};
type UserAnswer = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};
export const ReturnInf = (props: Result) => {
  const { title, generateResult, content, handleBackActive, articleId } = props;
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const handlequizActive = () => {
    setQuizActive(true);
    setNextClickCompleted(false);
  };
  const [nextClickCompleted, setNextClickCompleted] = useState(false);
  const handleClickCompleted = () => {
    setNextClickCompleted(true);
  };
  const [backHomePage, setBackHomePage] = useState(false);
  const handleBackHomePage = () => {
    setQuizActive(false);
    setNextClickCompleted(false);
  };
  const [seeContent, setSeeContent] = useState(false);
  const handleSeeContent = () => {
    setSeeContent(!seeContent);
  };
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const currentQuiz = quizzes[currentIndex];
  const handleAnswer = (option: string) => {
    const current = quizzes[currentIndex];
    const isCorrect = option === current.answer;

    setSelected(option);
    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected: option,
        correct: current.answer,
        isCorrect: isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < quizzes.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        setNextClickCompleted(true);
      }
    }, 500);
  };

  const generate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          articleId: articleId,
        }),
      });
      setIsGenerating(false);
      const data = await res.json();
      setQuizzes(data.quizzes);
      handlequizActive();
      setCurrentIndex(0);
      setQuizActive(true);
    } catch (err) {
      setError("Алдаа гарлаа. Дахин оролдоно уу");
    }
  };
  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswers([]);
    setNextClickCompleted(false);
    setQuizActive(true);
  };
  return (
    <div className="bg-[#f8f8f8]">
      {!quizActive && !nextClickCompleted && (
        <div className="gap-5">
          <button
            className="w-[47px] h-10 border rounded-md flex justify-center items-center ml-5 bg-white"
            onClick={handleBackActive}
          >
            <ChevronLeft className="w-4 h-5 " />
          </button>
          <div
            className={`w-[858px] h-[400px] bg-white border border-gray-100 rounded-md flex justify-center gap-5 items-center m-5
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
                <p className="text-[14px] text-black">{generateResult}</p>
              </div>
              <div className="w-[800px] flex justify-between">
                <button
                  className="w-[113px] h-10 flex justify-center items-center text-black border rounded-md"
                  onClick={handleSeeContent}
                >
                  See content
                </button>
                <button
                  className="w-[113px] h-10 flex justify-center items-center text-white bg-black rounded-md"
                  onClick={generate}
                >
                  {isGenerating ? (
                    <Spinner className="w-4 h-4 text-white" />
                  ) : (
                    <p className="  text-white text-[14px]">Take a quiz</p>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {quizActive && !nextClickCompleted && (
        <div className={`w-[558px] h-auto m-3 flex flex-col gap-6`}>
          <div className="flex w-[558px] h-16">
            <div className="w-[446px] h-8 flex flex-col">
              <div className=" flex gap-2">
                <GeneratorIcon />
                <p className="text-black font-bold h-8 text-6">Quick test</p>
              </div>
              <p className="text-4 text-[#71717A]">
                Take a quick test about your knowledge from your content
              </p>
            </div>
            <div className="w-28 h-16 flex justify-end">
              <button
                className="w-12 h-10 flex justify-center items-center text-[#71717A] rounded-md border border-gray-100"
                onClick={handleBackHomePage}
              >
                <X />
              </button>
            </div>
          </div>
          <div className="w-[558px] h-auto bg-white rounded-md flex justify-center items-center">
            <div className="w-[502px] h-auto gap-5 flex-col flex m-5">
              <div className="flex justify-between w-[502px] h-auto">
                <p className="text-black text-xl w-auto">
                  {" "}
                  {currentQuiz?.question}
                </p>
                <div className="w-[35px] h-7 flex">
                  <p className="text-base text-black">{currentIndex + 1}</p>
                  <p className="text-base text-[#71717A]">/{quizzes.length}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-[502px] h-auto">
                {currentQuiz?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    className="cursor-pointer w-[243px] h-auto border rounded-md"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {nextClickCompleted && (
        <div className="w-[428px] h-[630px] flex flex-col gap-6">
          <div className="w-[223px] h-16 flex flex-col">
            <div className="flex gap-2">
              <GeneratorIcon />
              <p className="text-black font-bold h-8 text-6">Quiz completed</p>
            </div>
            <p className="text-4 text-[#71717A]">Let’s see what you did</p>
          </div>

          <div className="w-[428px] h-[528px] bg-white flex justify-center items-center border border-gray-100 rounded-md">
            <div className="w-[372px] h-[475px] flex flex-col gap-7">
              <div className="flex gap-1">
                <p className="text-black font-bold text-2xl">
                  Your score: {score}
                </p>
                <p className="text-base text-[#71717A] mt-1">
                  / {quizzes.length}
                </p>
              </div>
              <div className="w-[372px] flex flex-col gap-5 overflow-y-auto">
                {userAnswers.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div>
                      {item.isCorrect ? (
                        <CheckCircle className="text-[#22C55E]" />
                      ) : (
                        <XCircle className="text-red-600" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <p className="text-black text-xs">
                        Your answer: {item.selected}
                      </p>

                      {!item.isCorrect && (
                        <p className="text-[#22C55E] text-xs">
                          Correct: {item.correct}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-[372px] h-10 flex justify-between">
                <button
                  className="w-[175px] h-10 flex justify-center items-center text-black gap-2 border border-gray-100 rounded-md text-[14px]"
                  onClick={restartQuiz}
                >
                  <ReloadIcon />
                  Restart quiz
                </button>

                <button className="w-[175px] h-10 flex justify-center items-center text-white gap-2 bg-black rounded-md text-[14px]">
                  <Bookmark />
                  Save and leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {backHomePage && (
        <div className="fixed  z-50 top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(0,_0,_0,_0.5)]">
          <div
            className={`w-[450px] h-[170px] flex flex-col bg-white border rounded-md items-center justify-center gap-4`}
          >
            <div className="flex flex-col h-[58px] w-[402px]">
              <p className="text-2xl font-bold text-black">Are you sure?</p>
              <p className="text-[#B91C1C] text-sm">
                If you press 'Cancel', this quiz will restart from the
                beginning.
              </p>
            </div>

            <div className="w-[402px] h-10 flex justify-between">
              <button
                className="w-[179px] h-10 flex justify-center items-center text-black gap-2 border border-gray-100 rounded-md text-[14px] cursor-pointer"
                onClick={() => {
                  setQuizActive(false);
                }}
              >
                Go back
              </button>
              <button
                className="w-[179px] h-10 flex justify-center items-center text-white gap-2 bg-black rounded-md text-[14px] cursor-pointer"
                onClick={() => {
                  setBackHomePage(false);
                }}
              >
                Cancel quiz
              </button>
            </div>
          </div>
        </div>
      )}
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
};
