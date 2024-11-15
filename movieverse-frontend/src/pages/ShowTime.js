import React, { useCallback, useEffect, useState } from "react";

export default function ShowTime1() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to convert XML nodes to JSON format
  const xmlToJson = useCallback((node) => {
    const json = {};

    // Handle text nodes
    if (node.nodeType === 3) {
      return node.nodeValue.trim();
    }

    let children = [...node.children];

    if (!children.length) {
      return node.innerHTML;
    }

    // process child nodes
    for (let child of children) {
      const hasSiblings =
        children.filter((each) => each.nodeName === child.nodeName).length > 1;

      // Handle array-like elements
      if (hasSiblings) {
        if (json[child.nodeName] === undefined) {
          json[child.nodeName] = [xmlToJson(child)];
        } else {
          json[child.nodeName].push(xmlToJson(child));
        }
      } else {
        json[child.nodeName] = xmlToJson(child); //return the value of the child
      }
    }
    return json;
  }, []);

  // Function to parse XML string into JSON
  const parseXML = useCallback(
    (xml) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");
      return xmlToJson(xmlDoc);
    },
    [xmlToJson]
  );

  // Fetch theater areas on component mount
  useEffect(() => {
    fetch("https://www.finnkino.fi/xml/TheatreAreas/")
      .then((response) => response.text())
      .then((xml) => {
        const json = parseXML(xml);
        //.log("json", json.Schedule.Shows.Show);
        // to make sure we have an array of theatre areas
        const theatreAreas = json.TheatreAreas.TheatreArea;
        setAreas(Array.isArray(theatreAreas) ? theatreAreas : [theatreAreas]);
      })
      .catch((err) => {
        console.error("Error fetching theatre areas:", err);
      });
  }, [parseXML]);

  const fetchSchedule = useCallback(async () => {
    //If no theater/date is selected, exit the function
    if (!selectedArea || !selectedDate) return;

    setLoading(true); //to show loading spinner

    try {
      const response = await fetch(
        // api call to fetch schedule data
        `https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&dt=${selectedDate}`
      );
      const xml = await response.text();
      const json = parseXML(xml);
      const showData = json.Schedule.Shows.Show;
      console.log("showData", showData);
      setMovies(Array.isArray(showData) ? showData : [showData]);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedArea, selectedDate, parseXML]);
  // Function recreates when dependencies change

  useEffect(() => {
    fetchSchedule();
  }, [selectedArea, selectedDate, fetchSchedule]);

  // Convert minutes to hours and minutes format
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div>
      <h2>Select Theatre and Date</h2>

      {/* Theater Selection Dropdown */}
      <div>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">Select Theatre</option>
          {areas.map((area) => (
            <option key={area.ID} value={area.ID}>
              {area.Name}
            </option>
          ))}
        </select>

        {/* Date Selection */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Loading Indicator */}
      {loading && <div>Loading...</div>}

      <h2>Schedule</h2>
      {selectedArea && selectedDate && (
        <div>
          {/* Movie shows list */}
          {movies.map((movie, index) => (
            <div key={index}>
              {/* Movie information card */}
              <div>
                <h3>{movie.Title}</h3>
                <div>
                  <img
                    src={movie.Images.EventSmallImagePortrait}
                    alt="Movie poster"
                  />
                  <p>Duration: {formatDuration(movie.LengthInMinutes)}</p>
                  <p>Language: {movie.SpokenLanguage?.Name || "N/A"}</p>
                  <p>
                    Subtitles:
                    {movie.SubtitleLanguage1?.Name || "N/A"}
                  </p>
                  <p>Theatre: {movie.Theatre}</p>
                  <p>Auditorium: {movie.TheatreAuditorium}</p>
                </div>
              </div>
              <div>
                <p>
                  Starts: {new Date(movie.dttmShowStart).toLocaleTimeString()}
                </p>
                <p>Ends: {new Date(movie.dttmShowEnd).toLocaleTimeString()}</p>
                {movie.PresentationMethod && (
                  <span>{movie.PresentationMethod}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && movies.length === 0 && selectedArea && selectedDate && (
        <div>No showings found for selected date and theatre</div>
      )}
    </div>
  );
}
