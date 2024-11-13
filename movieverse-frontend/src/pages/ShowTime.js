import React, { useEffect, useState } from "react";

function ShowTime() {
  const [theatreID, setTheatreID] = useState("");
  const [date, setDate] = useState("");
  const [theatres, setTheatres] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await fetch(
          "https://www.finnkino.fi/xml/TheatreAreas/"
        );
        const data = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        const theatreElements = xml.getElementsByTagName("TheatreArea");
        const theatreList = Array.from(theatreElements).map((theatre) => ({
          id: theatre.getElementsByTagName("ID")[0].textContent,
          name: theatre.getElementsByTagName("Name")[0].textContent,
        }));
        setTheatres(theatreList);
      } catch (err) {
        setError("Error fetching theatre data");
        console.error("Error fetching theatre data:", err);
      }
    };
    fetchTheatres();
  }, []);

  useEffect(() => {
    if (!theatreID || !date) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.finnkino.fi/xml/Schedule/?area=${theatreID}&dt=${date}`
        );
        const data = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        const showElements = xml.getElementsByTagName("Show");

        // Group schedules by movie title
        const scheduleList = Array.from(showElements).reduce((acc, show) => {
          const title = show.getElementsByTagName("Title")[0].textContent;
          const startTime =
            show.getElementsByTagName("dttmShowStart")[0].textContent;

          if (!acc[title]) {
            acc[title] = [];
          }
          acc[title].push(new Date(startTime).toLocaleString());

          return acc;
        }, {});

        setSchedules(scheduleList);
      } catch (err) {
        setError("Error fetching schedule data");
        console.error("Error fetching schedule data:", err);
      }
    };

    fetchData();
  }, [theatreID, date]);

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const formattedDate = selectedDate.toLocaleDateString("fi-FI");
    setDate(formattedDate);
  };

  return (
    <div className="container">
      <h2>Select Theatre and Date</h2>

      {/* Choose theatre */}
      <select onChange={(e) => setTheatreID(e.target.value)} value={theatreID}>
        <option value="">Select Theatre</option>
        {theatres.map((theatre) => (
          <option key={theatre.id} value={theatre.id}>
            {theatre.name}
          </option>
        ))}
      </select>

      {/* Choose date */}
      <input type="date" onChange={handleDateChange} />

      <h2>Schedule</h2>
      {error && <p>{error}</p>}
      {Object.keys(schedules).length > 0 ? (
        <ul>
          {Object.entries(schedules).map(([title, times], index) => (
            <li key={index}>
              <p>
                <strong>Movie:</strong> {title}
              </p>
              <ul>
                {times.map((time, idx) => (
                  <li key={idx}>
                    <strong>Start Time:</strong> {time}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No schedules available for the selected theatre and date.</p>
      )}
    </div>
  );
}

export default ShowTime;
