import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const People = () => {
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(
          "https://binge-karo-5.onrender.com/people",
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
        setPeople(json.data);
      } catch (e) {
        console.error("Fetch people error:", e);
      }
    };

    if (!localStorage.getItem("SID")) {
      alert("Login First.");
      alert("You are being redirected");
      navigate("/login");
    }

    fetchPeople();
  }, [navigate]);

  return (
    <div>
      <h1>People</h1>
      <ul>
        {people.map((person) =>
          localStorage.getItem("userId") !== person._id ? (
            <li key={person._id}>
              <Link to={`/chat/${person._id}`}>{person.name}</Link>
            </li>
          ) : (
            ""
          )
        )}
      </ul>
    </div>
  );
};

export default People;
