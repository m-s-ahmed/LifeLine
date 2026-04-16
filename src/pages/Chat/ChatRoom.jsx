import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosSecure } from "../../api/axiosSecure";
import { AuthContext } from "../../providers/AuthProvider";

export default function ChatRoom() {
  const { conversationId } = useParams();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const chatBoxRef = useRef(null);

  const loadMessages = async () => {
    if (!conversationId) return;

    try {
      const res = await axiosSecure.get(`/api/chat/messages/${conversationId}`);
      setMessages(res.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !conversationId || sending) return;

    try {
      setSending(true);

      await axiosSecure.post(`/api/chat/messages/${conversationId}`, {
        text: text.trim(),
      });

      setText("");
      await loadMessages();
    } catch (e) {
      console.log(e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-base-200/40 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-base-100 border border-base-200 shadow-xl p-5">
          <h1 className="text-2xl font-extrabold mb-4">Conversation</h1>

          <div
            ref={chatBoxRef}
            className="h-[420px] overflow-y-auto rounded-2xl border border-base-200 p-4 space-y-3 bg-base-200/20"
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-base-content/50 text-sm">
                No messages yet. Start the conversation.
              </div>
            ) : (
              messages.map((m) => {
                const mine = user?.uid === m.fromUid;

                return (
                  <div
                    key={m._id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        mine
                          ? "bg-primary text-primary-content"
                          : "bg-base-100 border border-base-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {m.text}
                      </p>
                      <p
                        className={`text-[11px] mt-1 ${
                          mine
                            ? "text-primary-content/70"
                            : "text-base-content/50"
                        }`}
                      >
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <textarea
              className="textarea textarea-bordered w-full min-h-[52px] max-h-32"
              placeholder="Write a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={sending || !text.trim()}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
