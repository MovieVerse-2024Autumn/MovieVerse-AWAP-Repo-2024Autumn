import { useState, useEffect } from "react";

export function useFetchData(url, initialData = []) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((err) => setError(err));
  }, [url]);

  return { data, error };
}
