import { useEffect, useState } from "react";
import { formatDate } from "utils/date";

export const DatePicker = ({
  date,
  select_date,
}: {
  date?: Date;
  select_date: (date: Date) => void;
}) => {
  // Workaround for allowing "Invalid Date", just not displaying it.
  const [value, setValue] = useState("");
  useEffect(() => {
    const validDate = formatDate(date);
    if (validDate) setValue(validDate);
  }, [value, date]);

  return (
    <input
      type="date"
      value={value}
      onChange={(e) => select_date(new Date(e.target.value))}
      placeholder="Select a date"
    />
  );
};
