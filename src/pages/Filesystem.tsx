import { entries, get, set, update, createStore, getMany } from "idb-keyval";
import { DirectoryViewer } from "components/DirectoryViewer";
import { SupportedFormatter, supported_formatters } from "formatter/base";
import { useEffect, useState } from "react";
import { getDirectoryFilesRecursively } from "utils/filetree";
import { MessengerFormatter, vector_datasource } from "config";

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

          await vector_datasource.bulkAddToStorage(
            metadata.participants[0].identifier,
            messages,
            () => Promise.resolve([""]),
            (callback) => {
              let progress_interval_id = setInterval(() => {
                let progress = callback();
                set_progress_bars((progress_bars) => {
                  const new_progress_bars = progress_bars.slice();
                  new_progress_bars[file_index].progress = progress;
                  return new_progress_bars;
                });
                if (progress >= messages.length) {
                  clearInterval(progress_interval_id);
                }
              }, 1000);
            }
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
          Start embeding the folder
        </button>
      </div>
    </>
  );
};
