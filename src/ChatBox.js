import React, { useState, useEffect } from "react";

// Replace with the actual URL of your deployed backend
const backendUrl = "https://chat-app-deploy-production.up.railway.app";
const socketUrl = "wss://chat-app-deploy-production.up.railway.app:8080"; // WebSocket URL

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("JohnDoe"); // Example, should be dynamically set
  const [currentUserId, setCurrentUserId] = useState(1); // Example user_id, set it to the correct ID of the logged-in user

  // WebSocket setup
  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    // Listen for incoming WebSocket messages
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.onopen = () => {
      console.log("WebSocket connected!");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  // Fetch existing messages from the Flask API when the component mounts
  useEffect(() => {
    fetch(`${backendUrl}/api/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  // Handle the form submit event to send a new message
  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = { text: newMessage, user_id: currentUserId };

    // Send the message to the Flask backend
    fetch(`${backendUrl}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Optionally, send the message via WebSocket immediately after posting
        const socket = new WebSocket(socketUrl);
        socket.onopen = () => {
          socket.send(JSON.stringify(data)); // Send the new message to the WebSocket server
        };
        setNewMessage(""); // Clear the input field after sending
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="chat-container">
      <h1>Real Time Chat</h1>
      <div className="chat-box">
        {/* Display messages with username */}
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.username}:</strong> <p>{message.content}</p>
          </div>
        ))}
      </div>

      {/* Form to send a new message */}
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
