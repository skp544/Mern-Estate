import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { createMessage, getChat, readChat } from "../../api/chat";
import toast from "react-hot-toast";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);

  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, reciever) => {
    setLoading(true);
    const res = await getChat(id);

    setLoading(false);

    if (res.chat.seenBy.includes(currentUser.id)) {
      decrease();
    }

    if (!res.success) {
      return toast.error(res.message);
    }

    setChat({ ...res.chat, reciever });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    const res = await createMessage(chat.id, text);

    setChat((prev) => ({ ...prev, messages: [...prev.messages, res.message] }));
    e.target.reset();
    socket.emit("sendMessage", {
      recieverId: chat.reciever.id,
      data: res.data,
    });
  };

  useEffect(() => {
    const read = async () => {
      const res = await readChat(chat.id);

      if (!res.success) {
        return toast.error(res.message);
      }
    };

    if (socket && chat) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }

    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>

        {chats.map((c) => (
          <div
            key={c.id}
            className="message"
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.reciever.id)}
          >
            <img src={c.reciever.avatar || "/noavatar.jpg"} alt="user" />
            <span>{c.reciever.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.reciever.avatar || "/noavatar.jpg"} alt="user" />
              {chat.reciever.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage own"
                key={message.id}
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
