import logo from "./logo.svg";
import ChatBox from "./ChatBox"; // Import the ChatBox component
import CreateUser from "./CreateUser";
import "./App.css";

function App() {
  return (
    <div className="App">
      <CreateUser />
      <ChatBox />
    </div>
  );
}

export default App;
