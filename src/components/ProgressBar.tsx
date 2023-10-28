import { ProgressTrackerCallback } from "datasources/base";
import { useEffect, useState } from "react";
import { formatDurationFromMilliseconds } from "utils/date";

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
  const [current_progress, set_current_progress] = useState<number | null>(
    null
  );
  const [error_message, set_error_message] = useState("");
  const [duration_ms, set_duration_ms] = useState(0);

  // initial timer is just to wait for `progress_tracker_callback` to return non-null
  useEffect(() => {
    const interval_id = setInterval(() => {
      const updated_progress = progress_tracker_callback();
      if (updated_progress !== null) {
        clearInterval(interval_id);
        if (typeof updated_progress === "string") {
          set_error_message(updated_progress);
        } else {
          set_current_progress(updated_progress);
        }
      }
    }, interval);
  }, []);

  // this timer only starts when `progress_tracker_callback` returns non-null
  useEffect(() => {
    const updated_progress = progress_tracker_callback();
    if (updated_progress === null) return;

    const interval_id = setInterval(() => {
      set_duration_ms((prev) => prev + interval);
      const updated_progress = progress_tracker_callback();

      if (typeof updated_progress === "string") {
        set_error_message(updated_progress);

        // we stop the timer if there is an error
        clearInterval(interval_id);
      } else if (typeof updated_progress === "number") {
        set_current_progress(updated_progress);

        // we stop the timer if progress is reached
        if (updated_progress >= total_progress) {
          clearInterval(interval_id);
        }
      }
    }, interval);
  }, [progress_tracker_callback]);

  return (
    <>
      <p>
        {error_message && (
          <span className="alert alert-error line-clamp-3">
            {error_message}
          </span>
        )}
        {text_template
          .replace("{current}", (current_progress || 0).toLocaleString())
          .replace("{total}", total_progress.toLocaleString())}
      </p>
      <progress value={current_progress || 0} max={total_progress}></progress>
      <span className="label">
        Time elapsed {formatDurationFromMilliseconds(duration_ms)}
      </span>
    </>
  );
};
