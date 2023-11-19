import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./components/pages/home/Home";
import Group from "./components/pages/groups/Group";
import Event from "./components/pages/events/Event";
import NotFound from "./components/pages/notfound/NotFound";
import Landing from "./components/pages/landing/Landing";

function App() {
  return (
    <div id="main-container">
      <Router>
        <Routes>
          <Route path="/login" element={<Landing />} />
          <Route path="/" element={<Home />} />
          <Route path="group/:id" element={<Group />} />
          <Route path="event/:id" element={<Event />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
