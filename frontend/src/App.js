import './App.css';
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <h1>Buy stuff from The Witcher</h1>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Items</Link>
              </li>
              <li>
                <Link to="/signup">Sign up</Link>
              </li>
              <li>
                <Link to="/signin">Sign in</Link>
              </li>
            </ul>
          </nav>

          {/* Routes look through its children <Route>s and renders the one that matches */}
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Items />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/items/')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.type} - {item.rarity}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Signup() {
  return <h2>Sign up</h2>;
}

function Signin() {
  return <h2>Sign in</h2>;
}

export default App;
