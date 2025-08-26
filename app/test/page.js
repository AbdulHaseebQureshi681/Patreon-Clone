
"use client";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function ChatPage() {
  const { data: session } = useSession();
  const sendMessage = useMutation(api.messages.send);
  const messages = useQuery(api.messages.list); // You need to implement 'list' in convex/messages.js
  const [text, setText] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!session || !text.trim()) return;
    await sendMessage({
      text,
      user: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    });
    setText("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-md">
        <form onSubmit={handleSend} className="flex gap-2 mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
            Send
          </button>
        </form>
        <div className="space-y-2">
          {messages?.map((msg) => (
            <div key={msg._id} className="p-2 border rounded">
              <div className="font-bold">{msg.userName}</div>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}