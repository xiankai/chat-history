import { entries, get, set, update, createStore, getMany } from "idb-keyval";
import { DirectoryViewer } from "components/DirectoryViewer";
import { SupportedFormatter, supported_formatters } from "formatter/base";
import { Fragment, useEffect, useState } from "react";
import { getDirectoryFilesRecursively } from "utils/filetree";
import { MessengerFormatter, txtai_datasource } from "config";
import { formatDurationFromSeconds } from "utils/string";

type Data = [SupportedFormatter, FileSystemDirectoryHandle];

const filesystemStore = createStore("filesystems", "keyval");

export const Filesystem = () => {
  const [filesystems, set_filesystems] = useState<Data[]>([]);

  // useEffect(() => {
  //   const getFilesystems = async () => {
  //     return await entries<SupportedFormatter, FileSystemDirectoryHandle>(
  //       filesystemStore
  //     );
  //   };

  //   getFilesystems().then((val) => set_filesystems(val));
  // }, []);

  const handleSelectFolder = (formatter: SupportedFormatter) => () => {
    const getDirectory = async () => {
      return await window.showDirectoryPicker({ id: formatter });
    };

    getDirectory().then((directoryFileHandle) => {
      set_filesystems([...filesystems, [formatter, directoryFileHandle]]);

      // seems like file handles are not preserved when serialized in store, so no point for now
      // set(formatter, directoryFileHandle, filesystemStore);
    });
  };

  const [loading, set_loading] = useState(false);
  const [duration, set_duration] = useState(0);
  const [duration_tracker, set_duration_tracker] = useState<number>();

  type ProgressBar = {
    file_name: string;
    progress: number;
    progress_goal: number;
  };
  const [progress_bars, set_progress_bars] = useState<ProgressBar[]>([]);

  const handleStartEmbedding = async () => {
    handle_start();
    await Promise.all(
      filesystems.map(async ([, directoryHandle]) => {
        const fileHandles = await getDirectoryFilesRecursively(directoryHandle);

        fileHandles.forEach(async (fileHandle, file_index) => {
          const file = await fileHandle.getFile();
          const contents = await file.text();

          const { metadata, messages } = MessengerFormatter.formatChatLog(
            contents.trim()
          );

          set_progress_bars((progress_bars) => [
            ...progress_bars,
            {
              file_index,
              file_name: file.name,
              progress: 0,
              progress_goal: messages.length,
            },
          ]);

          await txtai_datasource.bulkAddToStorage(
            metadata.participants[0].identifier,
            messages
          );

          handle_end();
        });

        return Promise.resolve();
      })
    );
  };

  const handle_start = () => {
    set_progress_bars([]);
    set_duration(0);
    set_loading(true);
    set_duration_tracker(
      window.setInterval(() => set_duration((duration) => duration + 1), 1000)
    );
  };

  const handle_end = () => {
    set_loading(false);
    clearInterval(duration_tracker);
  };

  return (
    <>
      <label className="label">
        Select the root folder containing your export
      </label>
      <div>
        {supported_formatters.map((supported_formatter) => {
          const supported_filesystem = filesystems.find(
            (filesystem) => filesystem[0] === supported_formatter
          );

          return supported_filesystem ? (
            <DirectoryViewer
              key={supported_formatter}
              filesystem={supported_formatter}
              directoryHandle={supported_filesystem[1]}
            />
          ) : (
            <button
              key={supported_formatter}
              onClick={handleSelectFolder(supported_formatter)}
              className="btn btn-primary"
            >
              {supported_formatter}
            </button>
          );
        })}
      </div>
      <div>
        <button className="btn btn-secondary" onClick={handleStartEmbedding}>
          Start embedding the folder
        </button>
      </div>
      <span className="label">
        Time elapsed {formatDurationFromSeconds(duration)}
      </span>
      {progress_bars.map((progress_bar, index) => (
        <Fragment key={index}>
          <span className="label">
            Processed {progress_bar.progress.toLocaleString()} out of{" "}
            {progress_bar.progress_goal.toLocaleString()} records for{" "}
            {progress_bar.file_name}
          </span>
          <progress
            value={progress_bar.progress}
            max={progress_bar.progress_goal}
          ></progress>
        </Fragment>
      ))}
    </>
  );
};
