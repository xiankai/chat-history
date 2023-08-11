import { ProgressTrackerCallback } from "datasources/base";
import { useEffect, useState } from "react";
import { formatDurationFromMilliseconds } from "utils/string";

export type ProgressBarProps = {
  index: string; // Unique identifier to ensure we only render this progress bar once. eg. file name.
  progress_tracker_callback: ProgressTrackerCallback;
  text_template: string;
  total_progress: number;
  interval?: number;
};

export const ProgressBar = ({
  progress_tracker_callback,
  total_progress,
  text_template,
  interval = 1000,
}: ProgressBarProps) => {
  const [current_progress, set_current_progress] = useState(0);
  const [error_message, set_error_message] = useState("");
  const [duration_ms, set_duration_ms] = useState(0);

  useEffect(() => {
    const interval_id = setInterval(() => {
      const current_progress = progress_tracker_callback();
      if (typeof current_progress === "string") {
        set_error_message(current_progress);
        clearInterval(interval_id);
      } else {
        set_current_progress(current_progress);
        if (current_progress >= total_progress) {
          clearInterval(interval_id);
        }
      }
      set_duration_ms((duration_ms) => {
        return duration_ms + interval;
      });
    }, interval);
    console.log(interval_id);
  }, []);

  return (
    <>
      <span className="label">
        {error_message ||
          text_template
            .replace("{current}", current_progress.toLocaleString())
            .replace("{total}", total_progress.toLocaleString())}
      </span>
      <progress value={current_progress} max={total_progress}></progress>
      <span className="label">
        Time elapsed {formatDurationFromMilliseconds(duration_ms)}
      </span>
    </>
  );
};
