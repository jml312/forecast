import { useState, useEffect } from "react";
import { compareAsc } from "date-fns";

export const useDateRange = () => {
  const now = new Date();
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(now);

  useEffect(() => {
    if (compareAsc(startDate, endDate) === 1) {
      setEndDate(startDate);
    }
  }, [startDate]);
  useEffect(() => {
    if (compareAsc(endDate, startDate) === -1) {
      setStartDate(endDate);
    }
  }, [endDate]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};
