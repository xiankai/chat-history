import {
  // RangeDatePicker,
  SingleDatePicker,
} from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";

export const DatePicker = ({
  date,
  select_date,
}: {
  date: Date;
  select_date: (date: Date) => void;
}) => <SingleDatePicker startDate={date} onChange={select_date} />;
