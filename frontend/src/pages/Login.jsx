import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate(); // Use navigate for redirection

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch(
          "https://binge-karo-5.onrender.com/login",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response not ok");
        }

        const json = await response.json();
        document.title = json.title;
      } catch (e) {
        console.error("Fetch title error:", e);
      }
    };

    fetchTitle();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://binge-karo-5.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      console.log(json);

      if (json.success) {
        alert(json.message);
        localStorage.setItem("SID", json.sessionId); // Save session ID to local storage
        localStorage.setItem("NAME", json.name);
        localStorage.setItem("userId", json.userId);
        navigate("/"); // Redirect to home page or another page
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 row">
          <label htmlFor="username" className="col-sm-2 col-form-label">
            Username
          </label>
          <div className="col-sm-10">
            <input
              id="username"
              className="col-sm-2 col-form-label"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="password" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              id="password"
              className="col-sm-2 col-form-label"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <Link to="/register">Do you wanna register?</Link>
    </div>
  );
};

export default Login;
