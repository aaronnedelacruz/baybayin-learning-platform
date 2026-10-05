import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Keyboard from "./pages/Keyboard";
import Lessons from "./pages/Lessons";
import Lesson1 from "./pages/Lesson1";
import Lesson2 from "./pages/Lesson2";
import Lesson3 from "./pages/Lesson3";
import Lesson4 from "./pages/Lesson4";
import Lesson5 from "./pages/Lesson5";
import Lesson6 from "./pages/Lesson6";
import Practice from "./pages/Practice";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keyboard" element={<Keyboard />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/lessons/1" element={<Lesson1 />} />
      <Route path="/lessons/2" element={<Lesson2 />} />
      <Route path="/lessons/3" element={<Lesson3 />} />
      <Route path="/lessons/4" element={<Lesson4 />} />
      <Route path="/lessons/5" element={<Lesson5 />} />
      <Route path="/lessons/6" element={<Lesson6 />} />
      <Route path="/practice" element={<Practice />} />
    </Routes>
  );
}

export default App;
