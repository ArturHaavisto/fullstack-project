import "./styles/App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import MainPage from "./pages/main";
import StudyPage from "./pages/study";
import EditPage from "./pages/edit";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navClass">
          <ul>
            <li className="nav-item">
              <Link to="/">Main Page</Link>
            </li>
            <li className="nav-item">
              <Link to="/study">Study</Link>
            </li>
            <li className="last-nav-item">
              <Link to="/edit">Edit</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/study/*" element={<StudyPage />} />
          <Route path="/edit/*" element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
