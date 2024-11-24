import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles/ShowTime.module.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ShowTime() {
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

  // Group movies by title
  const groupedMovies = movies.reduce((acc, movie) => {
    const title = movie.Title;
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(movie);
    return acc;
  }, {});

  // Function to handle language conversion
  const getFormattedLanguage = (language) => {
    switch (language) {
      case "dubattu suomeksi":
        return "Dubbed in Finnish";
      case "suomi":
        return "Finnish";
      case "ruotsi":
        return "Swedish";
      case "englanti":
        return "English";
      case "suomi/englanti":
        return "Finnish/English";
      default:
        return language || "N/A";
    }
  };

  // Function to capitalize subtitle language
  const capitalizeSubtitle = (subtitle) => {
    switch (subtitle) {
      case "suomi":
        return "Finnish";
      case "Kuvaileva suomenkiel. tekstitys kuulovammaisille":
        return "Descriptive Finnish";
      case "":
      case null:
      case undefined:
        return "No Subtitles";
      default:
        return (
          subtitle.charAt(0).toUpperCase() + subtitle.slice(1).toLowerCase()
        );
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.showtimePage}>
        <h2 className={styles.heading}>Movies on Show</h2>
        <div className={styles.selectionContainer}>
          {/* Theater Selection Dropdown */}
          <div className={styles.selectRow}>
            <label>Theatre</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              aria-label="Select theatre"
            >
              <option value="">Select Theatre</option>
              {areas.map((area) => (
                <option key={area.ID} value={area.ID}>
                  {area.Name}
                </option>
              ))}
            </select>
            <div className={styles["selection-underline"]}></div>
          </div>

          {/* Date Selection */}
          <div className={styles.selectRow}>
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select date"
            />
            <div className={styles["selection-underline"]}></div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && <div className={styles.loading}>Loading...</div>}

        <h2 className={styles.heading}>
          {selectedArea && selectedDate
            ? "Schedule"
            : "Welcome! Please select theatre and date."}
        </h2>
        {selectedArea &&
          selectedDate &&
          Object.entries(groupedMovies).map(([title, shows]) => (
            <div className={styles.movieCard} key={title}>
              {/* Movie information card */}
              <div className={styles.movieDetails}>
                <div className={styles.posterContainer}>
                  <img
                    className={styles.moviePoster}
                    src={shows[0].Images.EventSmallImagePortrait}
                    alt="Movie poster"
                  />
                </div>
                <div className={styles.movieInfo}>
                  <div className={styles.movieTitle}>{title}</div>
                  <div className={styles.detailsColumn}>
                    <div className={styles.movieLanguage}>
                      <p>
                        Language:{" "}
                        {getFormattedLanguage(shows[0].SpokenLanguage?.Name)} |{" "}
                        Subtitles:{" "}
                        {capitalizeSubtitle(shows[0].SubtitleLanguage1?.Name)}
                      </p>
                    </div>
                    <div className={styles.durationMethod}>
                      <p>
                        <span>{formatDuration(shows[0].LengthInMinutes)}</span>

                        <span className={styles.movieMethod}>
                          {shows[0].PresentationMethod}
                        </span>
                      </p>
                    </div>

                    <div className={styles.showTimings}>
                      {shows.map((show, index) => (
                        <p key={index}>
                          {new Date(show.dttmShowStart).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          -
                          {new Date(show.dttmShowEnd).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" | "} {show.Theatre}, {show.TheatreAuditorium}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {!loading && movies.length === 0 && selectedArea && selectedDate && (
          <div className={styles.noShowings}>
            No showings found for selected date and theatre.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
