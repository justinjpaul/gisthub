import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./components/pages/home/Home";
import Group from "./components/pages/groups/Group";
import Event from "./components/pages/events/Event";
import NotFound from "./components/pages/notfound/NotFound";

function App() {
  return (
    <div id="main-container">
      <Router>
        <Routes>
          {/* <Route path="/login" element={<login />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="event/:name" element={<Group />} />
          <Route path="event/:name" element={<Event />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
