"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
export const CreateUser = () => {
  const { user } = useUser();
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
  return <></>;
};
