import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Keyboard from "./pages/Keyboard";
import Lessons from "./pages/Lessons";
import Practice from "./pages/Practice";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/keyboard" element={<Keyboard />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/practice" element={<Practice />} />
    </Routes>
  );
}

export default App;