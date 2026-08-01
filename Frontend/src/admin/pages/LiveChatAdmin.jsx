import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import { socket } from "../../socket/socket";

const formatMessageTime = (date) => {
  const time = new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return time.replace(":", ".").replace(" AM", "am").replace(" PM", "pm");
};

export default function LiveChatAdmin() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesRef = useRef(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedId),
    [conversations, selectedId]
  );

  useEffect(() => {
    socket.emit("joinAdmin");

    axios.get("/api/chat/admin/conversations").then((res) => {
      const list = res.data.conversations || [];
      setConversations(list);
      setSelectedId((current) => current || list[0]?._id || "");
    });

    const handleUpdate = (updatedConversation) => {
      setConversations((current) => {
        const exists = current.some((conversation) => conversation._id === updatedConversation._id);
        const next = exists
          ? current.map((conversation) => conversation._id === updatedConversation._id ? updatedConversation : conversation)
          : [updatedConversation, ...current];

        return next.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    };

    socket.on("chatConversationUpdated", handleUpdate);
    return () => socket.off("chatConversationUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    if (selectedId) {
      socket.emit("joinChat", selectedId);
      axios.put(`/api/chat/admin/${selectedId}/read`).catch(() => {});
    }
  }, [selectedId]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [selectedConversation?.messages?.length, selectedId]);

  const sendReply = async (event) => {
    event.preventDefault();
    if (!reply.trim() || !selectedId || sending) return;

    setSending(true);
    try {
      const res = await axios.post(`/api/chat/admin/${selectedId}/message`, {
        text: reply.trim(),
      });
      setConversations((current) =>
        current.map((conversation) =>
          conversation._id === selectedId ? res.data.conversation : conversation
        )
      );
      setReply("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-150px)]">
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-emerald-100">
        <div className="p-4 border-b bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/95 grid place-items-center shadow-inner">
              <img
                src="/images/logo.png"
                alt="SwatiGemz"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">SwatiGemz Live Chat</h2>
              <p className="text-sm text-green-50">Each customer has a separate chat.</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-73px)]">
          {conversations.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No customer messages yet.</p>
          )}
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages.at(-1);

            return (
              <button
                key={conversation._id}
                onClick={() => setSelectedId(conversation._id)}
                className={`w-full text-left p-4 border-b hover:bg-emerald-50 transition ${
                  selectedId === conversation._id ? "bg-emerald-50" : "bg-white"
                }`}
              >
                <div className="flex justify-between gap-3">
                  <p className="font-semibold text-gray-900">{conversation.customerName || "Customer"}</p>
                  {conversation.unreadAdminCount > 0 && (
                    <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unreadAdminCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{conversation.customerId}</p>
                <p className="text-sm text-gray-600 truncate mt-1">{lastMessage?.text || "No messages"}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden border border-emerald-100 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 text-white">
              <h3 className="font-semibold">{selectedConversation.customerName}</h3>
              <p className="text-xs text-green-50">{selectedConversation.customerId}</p>
            </div>

            <div ref={messagesRef} className="flex-1 overflow-y-auto bg-gradient-to-b from-[#f7f2ea] to-[#eee7dc] p-4 space-y-2">
              {selectedConversation.messages.map((message) => (
                <div key={message._id} className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${message.sender === "admin" ? "bg-emerald-600 text-white rounded-br-md" : "bg-white text-gray-900 rounded-bl-md border border-gray-100"}`}>
                    <p className="leading-relaxed">{message.text}</p>
                    <p className={`text-[10px] mt-1.5 text-right whitespace-nowrap ${message.sender === "admin" ? "text-emerald-50" : "text-gray-500"}`}>
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendReply} className="flex items-center gap-2 p-4 bg-white border-t border-gray-100">
              <div className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                <input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Reply to customer"
                  className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                aria-label="Send reply"
                title="Send reply"
                className="h-12 shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center gap-2 px-4 font-semibold shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaPaperPlane className="text-lg translate-x-[1px]" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 grid place-items-center text-gray-500">Select a customer chat.</div>
        )}
      </div>
    </div>
  );
}
