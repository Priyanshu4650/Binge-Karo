import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

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
        const response = await fetch("http://localhost:5000/register", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
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

      if (json.success) {
        alert(json.message);
        alert("Account Created! Go and login.");
        navigate("/login"); // Redirect to login page
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 row">
          <label htmlFor="name" className="col-sm-2 col-form-label">
            Name
          </label>
          <div className="col-sm-10">
            <input
              id="name"
              className="col-sm-2 col-form-label"
              type="text"
              value={credentials.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>
        </div>
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

export default Register;
