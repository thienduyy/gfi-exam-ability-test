import './App.scss';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}>
            {/* <Header /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
