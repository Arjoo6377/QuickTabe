import React from "react";
import Home from "./components/Home";

import { Route, Routes } from "react-router-dom";
import Congrats from "./components/Congrats";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Home />}></Route>
        <Route path="/Congratulations" element={<Congrats />}></Route>
      </Routes>
      <Home />
    </div>
  );
}

export default App;
