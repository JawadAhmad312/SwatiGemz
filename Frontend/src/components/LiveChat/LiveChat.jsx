import React, { useContext, useEffect, useRef, useState } from "react";
import { FaComments, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket";
import { AuthContext } from "../../context/AuthContext";
import api from "../../lib/api";

const formatMessageTime = (date) => {
  const time = new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return time.replace(":", ".").replace(" AM", "am").replace(" PM", "pm");
};

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const customerId = user?.id || user?._id;
  const messages = conversation?.messages || [];

  useEffect(() => {
    if (!customerId) {
      setConversation(null);
      return;
    }

    api
      .get("/api/chat/customer", {
        params: { customerId },
      })
      .then((res) => {
        if (res.data.conversation) {
          setConversation(res.data.conversation);
          socket.emit("joinChat", res.data.conversation._id);
        }
      })
      .catch(() => {});
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;

    const handleUpdate = (updatedConversation) => {
      if (updatedConversation.customerId === customerId) {
        setConversation(updatedConversation);
        socket.emit("joinChat", updatedConversation._id);
      }
    };

    socket.on("chatConversationUpdated", handleUpdate);
    return () => socket.off("chatConversationUpdated", handleUpdate);
  }, [customerId]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, open]);

  const handleOpenChat = () => {
    if (!customerId) {
      navigate("/login");
      return;
    }

    setOpen(true);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!text.trim() || sending || !customerId) return;

    setSending(true);
    setError("");
    try {
      const res = await api.post("/api/chat/customer/message", {
        customerId,
        customerName: user?.username || "Website Customer",
        text: text.trim(),
      });
      setConversation(res.data.conversation);
      socket.emit("joinChat", res.data.conversation._id);
      setText("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Message not sent. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) return null;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-2xl border border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-500 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/95 grid place-items-center shadow-inner">
                <img
                  src="/images/logo.png"
                  alt="SwatiGemz"
                  className="h-9 w-9 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">SwatiGemz Live Chat</h3>
                <p className="text-xs text-green-50">Private support with our admin team</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition"
              aria-label="Close live chat"
            >
              <FaTimes />
            </button>
          </div>

          <div ref={messagesRef} className="h-80 overflow-y-auto bg-gradient-to-b from-[#f7f2ea] to-[#eee7dc] p-4 space-y-3">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}
            {messages.length === 0 && (
              <div className="bg-white rounded-2xl p-4 text-sm text-gray-600 shadow-sm border border-gray-100">
                <p className="font-semibold text-gray-900">Hi! Welcome to SwatiGemz</p>
                <p className="mt-1">Send your message and admin will reply here.</p>
              </div>
            )}
            {messages.map((message) => (
              <div key={message._id} className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${message.sender === "customer" ? "bg-emerald-600 text-white rounded-br-md" : "bg-white text-gray-900 rounded-bl-md border border-gray-100"}`}>
                  <p className="leading-relaxed">{message.text}</p>
                  <p className={`text-[10px] mt-1.5 text-right whitespace-nowrap ${message.sender === "customer" ? "text-emerald-50" : "text-gray-500"}`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 bg-white border-t border-gray-100">
            <div className="min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Type a message"
                className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              aria-label="Send message"
              title="Send message"
              className="h-12 min-w-[104px] shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center gap-2 px-4 font-semibold shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaPaperPlane className="text-lg translate-x-[1px]" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
      {!open && (
        <button
          className="fixed bottom-36 right-4 sm:bottom-36 sm:right-6 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-xl hover:bg-blue-700 transition z-50 text-xl sm:text-2xl"
          onClick={handleOpenChat}
          aria-label="Open live chat"
        >
          <FaComments />
        </button>
      )}
    </>
  );
}

