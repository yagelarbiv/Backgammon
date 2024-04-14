// DataDisplay.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function DataDisplay() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/data")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Add an empty dependency array to run effect only once

  return (
    <>
      <div>
        {(typeof data.message === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          <p>{data.message}</p>
        )}
      </div>
    </>
  );
}

export default DataDisplay;