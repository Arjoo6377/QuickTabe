import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

function Home() {
  const [boxColor, setBoxColor] = useState(
    new Array(30).fill("bg-gradient-to-b from-green-400 to-blue-500")
  );

  const [buttonColor, setButtonColor] = useState("bg-blue-600");
  const [timerActive, setTimerActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [clickedBoxes, setClickedBoxes] = useState(new Array(30).fill(false));
  const [clickCount, setClickCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [userName, setUserName] = useState("");
  const [maxScoreAchieved, setMaxScoreAchieved] = useState(false);

  const MAX_SCORE = 20; // Maximum score you can achieve

  const navigate = useNavigate(); // Use the useNavigate hook

  // Fetch leaderboard data from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/score")
      .then((response) => {
        setLeaderboard(response.data.data || []); // Ensure it defaults to an empty array if data is undefined
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error.message);
      });
  }, []);

  // Function to handle button click
  const clickHandler = () => {
    if (!userName.trim()) {
      alert("Please enter your name before starting the game.");
      return;
    }

    // Reset box colors and other states
    setBoxColor(
      new Array(30).fill("bg-gradient-to-b from-green-400 to-blue-500")
    );

    const numBlackBoxes = 20;
    const randomIndexes = new Set();
    while (randomIndexes.size < numBlackBoxes) {
      randomIndexes.add(Math.floor(Math.random() * 30));
    }
    const newBoxColors = [...boxColor];
    randomIndexes.forEach((index) => {
      newBoxColors[index] = "bg-black";
    });
    setBoxColor(newBoxColors);

    setButtonColor("bg-black");
    setTimerActive(true);
    setRemainingTime(5);
    setStartButtonDisabled(true);
  };

  // Use useEffect to handle the timer and remaining time
  useEffect(() => {
    if (timerActive) {
      const timer = setTimeout(() => {
        // Timer action after 5 seconds
        setBoxColor(
          new Array(30).fill("bg-gradient-to-b from-green-400 to-blue-500")
        );
        setButtonColor("bg-blue-600");
        setClickedBoxes(new Array(30).fill(false));

        // Send clickCount and userName to the backend
        axios
          .post("http://localhost:3000/score", {
            name: userName,
            score: clickCount,
          })
          .then((response) => {
            console.log(response.data.message);
            setLeaderboard((prev) => [
              ...prev,
              { name: userName, score: clickCount },
            ]);

            // Fetch all scores again to check for maximum
            axios
              .get("http://localhost:3000/score")
              .then((response) => {
                const scores = response.data.data || [];
                const maxScore = Math.max(
                  ...scores.map((entry) => entry.score)
                );

                // Check if current score is the maximum
                if (clickCount >= maxScore) {
                  setMaxScoreAchieved(true);

                  // Navigate to the Congratulations page
                  navigate("/Congratulations");
                } else {
                  setMaxScoreAchieved(false);
                }
              })
              .catch((error) => {
                console.error("Error fetching updated scores:", error.message);
              });
          })
          .catch((error) => {
            console.error("Error saving score:", error.message);
          });

        setClickCount(0);
        setTimerActive(false);
        setStartButtonDisabled(false);
      }, 5000);

      const countdown = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdown);
      };
    }
  }, [timerActive, clickCount, userName, navigate]);

  // Function to handle box click
  const handleBoxClick = (index) => {
    if (timerActive && boxColor[index] === "bg-black" && !clickedBoxes[index]) {
      const newClickedBoxes = [...clickedBoxes];
      newClickedBoxes[index] = true;
      setClickedBoxes(newClickedBoxes);

      setClickCount((prevCount) => prevCount + 1);
    }
  };

  // Function to generate boxes
  const generateBoxes = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className={`w-16 h-16 flex items-center justify-center transition-transform transform hover:scale-105 ${
          clickedBoxes[index] ? "bg-gray-500" : boxColor[index]
        } text-white font-bold border border-gray-300 rounded-lg shadow-lg`}
        onClick={() => handleBoxClick(index)}
      ></div>
    ));
  };

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 h-full flex flex-col p-4">
        <div className="text-white font-bold mb-4">Leaderboard</div>
        <table className="w-full text-white">
          <thead>
            <tr>
              <th className="border-b border-gray-700 py-2">Name</th>
              <th className="border-b border-gray-700 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td className="py-2 border-b border-gray-700">{entry.name}</td>
                <td className="py-2 border-b border-gray-700">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Content Area */}
      <div className="bg-gradient-to-r from-indigo-400 to-purple-500 w-4/5 h-full flex justify-center items-center">
        <div className="bg-white border border-gray-300 rounded-lg shadow-2xl w-[70%] h-[95%] p-8 flex flex-col items-center justify-center overflow-auto space-y-8">
          {/* Box Container */}
          <div className="grid grid-cols-5 gap-6 mb-6">{generateBoxes(30)}</div>

          {/* Click Count Display */}
          <div className="text-lg font-bold mb-4">
            Boxes Clicked: {clickCount}
          </div>

          {/* Timer Display */}
          {timerActive && (
            <div className="text-lg font-bold mb-4">
              Time Remaining: {remainingTime} seconds
            </div>
          )}

          {/* Display Maximum Score Message */}
          {maxScoreAchieved ? (
            <div className="text-lg font-bold mb-4 text-green-600">
              Congratulations! You've achieved the maximum score!
            </div>
          ) : (
            <div className="text-lg font-bold mb-4 text-red-600">
              Keep trying to achieve the maximum score!
            </div>
          )}

          {/* Small Button */}
          <button
            className={`w-12 h-12 ${buttonColor} text-white font-semibold rounded-lg shadow-lg hover:opacity-80 transition-all duration-300`}
          ></button>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />

          {/* Start Button */}
          <button
            className={`w-full max-w-sm px-4 py-3 ${
              startButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold rounded-lg shadow-lg transition-all duration-300`}
            onClick={clickHandler}
            disabled={startButtonDisabled}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
