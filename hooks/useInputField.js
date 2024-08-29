import { useState, useRef } from "react";

export const useInputField = (initialValue) => {
  const [value, setValue] = useState(initialValue || "");
  const [error, setError] = useState("");
  const ref = useRef(null);

  return { value, setValue, error, setError, ref };
};
