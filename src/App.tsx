import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const CHAT_SERVER_URL = "http://127.0.0.1:3000";
const socket = io(CHAT_SERVER_URL);

interface MessageType {
  type: string;
  message: string;
  user: { username: string; color: string };
}

function App() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const handleMessage = (type: string, message: string, user: { username: string; color: string }) => {
      setMessages((prevMessages) => [...prevMessages, { type, message, user }]);
    };

    const handleUserJoined = (_: any, user: { username: string; color: string }) => {
      console.log("User joined:", user);
    };

    const handleUserLeft = (_: any, user: { username: string; color: string }) => {
      console.log("User left:", user);
    };

    socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    socket.on("USER_MESSAGE", handleMessage);
    socket.on("USER_JOINED", handleUserJoined);
    socket.on("USER_LEFT", handleUserLeft);

    return () => {
      socket.off("USER_MESSAGE", handleMessage);
      socket.off("USER_JOINED", handleUserJoined);
      socket.off("USER_LEFT", handleUserLeft);
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("USER_MESSAGE", newMessage);
      setNewMessage(""); // Clear the input after sending the message
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-800">
      <h1 className="text-white text-2xl">Chat Bot😀</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p style={{ color: msg.user?.color }}>
              <span>{msg.user?.username}:</span>
              <span>{msg.message}</span>
            </p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
}

export default App;
