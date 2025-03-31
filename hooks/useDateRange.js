import { useState, useEffect } from "react";
import { compareAsc } from "date-fns";

export const useDateRange = (defaultDate = true) => {
  const now = new Date();
  const [startDate, setStartDate] = useState(defaultDate ? now : null);
  const [endDate, setEndDate] = useState(defaultDate ? now : null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    if (compareAsc(startDate, endDate) === 1) {
      setEndDate(startDate);
    }
  }, [startDate]);
  useEffect(() => {
    if (!startDate || !endDate) return;

    if (compareAsc(endDate, startDate) === -1) {
      setStartDate(endDate);
    }
  }, [endDate]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    now,
  };
};
