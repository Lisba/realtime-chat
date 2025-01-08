import { useEffect, useState, FC } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import type {Message} from "../../types/globalTypes";
import {Socket} from "socket.io-client";

type ChatProps = {
  socket: Socket,
  username: string,
  room: string
}

const Chat: FC<ChatProps> = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);

  const sendMessage = () => {
    if (currentMessage) {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`
      };
      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data: Message) => {
      setMessageList((list) => [...list, data]);
    };
    
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyUp={(event) => {
            if(event.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;