import React, { useState } from "react";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  // Handle input change
  const handleUsernameChange = (e) => setUsername(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the user data to send
    const userData = { username };

    try {
      // Make a POST request to the Flask backend to create the user
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`User created! ID: ${data.id}, Username: ${data.username}`);
      } else {
        setMessage("Error creating user");
      }
    } catch (error) {
      setMessage("Error: " + "Username already exists");
    }
  };

  return (
    <div>
      <h2>Enter Username</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateUser;
