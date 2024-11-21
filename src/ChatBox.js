import React, { useState, useEffect } from "react";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("JohnDoe"); // This should be dynamically set
  const [currentUserId, setCurrentUserId] = useState(4); // Example user_id, set it to the correct ID of the logged-in user

  // Fetch existing messages from the Flask API when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/messages")
      .then((response) => response.json())
      .then((data) => setMessages(data));
  }, []);

  // Handle the form submit event to send a new message
  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = { text: newMessage, user_id: currentUserId }; // Send user_id along with the message

    // Send the message to the Flask backend
    fetch("http://127.0.0.1:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the message list with the new message
        setMessages([...messages, data]);
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
