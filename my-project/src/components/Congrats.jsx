import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

function Congrats() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window dimensions when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-bl from-yellow-300 via-red-400 to-purple-600 relative overflow-hidden">
      {/* Confetti Animation */}
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        numberOfPieces={800}
        gravity={0.3}
        recycle={false}
      />

      <div className="text-center p-10 bg-white rounded-lg shadow-xl border-t-8 border-pink-500 max-w-lg w-full mx-4">
        {/* Congratulations Message */}
        <h1 className="text-7xl font-extrabold text-pink-600 mb-4 animate-pulse">
          🎉 Congratulations! 🎉
        </h1>
        <p className="text-2xl font-medium mb-8 text-gray-800">
          You achieved the maximum score!
        </p>

        {/* Start Again Button */}
        <Link to="/">
          <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-transform duration-300 transform hover:scale-110">
            Start Game Again
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Congrats;
