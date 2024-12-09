import { useState, useEffect } from "react";

export function useFetchData(urlf, initialData = []) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(urlf)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((err) => setError(err));
  }, [urlf]);

  return { data, error };
}
