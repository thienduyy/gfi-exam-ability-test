import './App.scss';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage';
import AppComponent from './components/App';
import Profile from './components/Profile';
import Matched from './components/Matched';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? (children) : <Navigate to="/" />
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<RequireAuth><AppComponent /></RequireAuth>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matched" element={<Matched />} />
          {/* <Header /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
