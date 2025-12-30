"use client";

import { useUser } from "@clerk/nextjs";
import { HistoryHideIcon } from "../_downIcon/HistoryHideIcon";
import { useEffect, useState } from "react";
import Link from "next/link";
type Article = {
  id: number;
  title: string;
  content: string;
};
export const HistoryHeader = () => {
  const [activeHistory, setActiveHistory] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const handleHistory = () => {
    setActiveHistory(!activeHistory);
  };
  const { user } = useUser();
  const users = user?.id;
  const getData = async () => {
    const data = await fetch(`/api/articles?userId=${users}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const jsonData = await data.json();
    setArticles(jsonData.articles);
  };
  useEffect(() => {
    if (user) getData();
  }, [user]);
  return (
    <div>
      <div
        className={`${
          activeHistory
            ? "hidden"
            : "w-[72px] h-screen flex justify-center items-start mt-5"
        }`}
      >
        <button
          className={`${
            activeHistory
              ? "hidden"
              : "w-10 h-10 flex justify-center items-center cursor-pointer"
          }`}
          onClick={handleHistory}
        >
          <HistoryHideIcon />
        </button>
      </div>
      {activeHistory && (
        <div className="w-[300px] h-screen flex flex-col items-center">
          <div className="w-[268px] h-10 flex justify-between mt-5">
            <p className="text-[21px] text-black font-bold w-[68px] h-[21px]">
              History
            </p>
            <button
              className="w-10 h-10 flex justify-center items-center cursor-pointer"
              onClick={() => {
                setActiveHistory(false);
              }}
            >
              <HistoryHideIcon />
            </button>
          </div>
          <div className="w-[268px] h-screen overflow-y-scroll flex flex-col gap-2">
            {articles.map((article) => (
              <Link key={users} href={`/article/${users}`}>
                <p className="text-black text-6">{article.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
