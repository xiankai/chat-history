import { entries, get, set, update, createStore, getMany } from "idb-keyval";
import { DirectoryViewer } from "components/DirectoryViewer";
import { SupportedFormatter, supported_formatters } from "formatter/base";
import { Fragment, useEffect, useState } from "react";
import { getDirectoryFilesRecursively } from "utils/filetree";
import { formatDurationFromSeconds } from "utils/string";
import config_store from "stores/config_store";
import { ProgressBar, ProgressBarProps } from "components/ProgressBar";

type Data = [SupportedFormatter, FileSystemDirectoryHandle];

const filesystemStore = createStore("filesystems", "keyval");

export const Filesystem = () => {
  const [filesystems, set_filesystems] = useState<Data[]>([]);
  const [formatter, set_formatter] = useState<SupportedFormatter>();

  // useEffect(() => {
  //   const getFilesystems = async () => {
  //     return await entries<SupportedFormatter, FileSystemDirectoryHandle>(
  //       filesystemStore
  //     );
  //   };

  //   getFilesystems().then((val) => set_filesystems(val));
  // }, []);

  const handleSelectFolder = (formatter: SupportedFormatter) => () => {
    set_formatter(formatter);
    const getDirectory = async () => {
      return await window.showDirectoryPicker({ id: formatter });
    };

    getDirectory().then((directoryFileHandle) => {
      set_filesystems([...filesystems, [formatter, directoryFileHandle]]);

      // seems like file handles are not preserved when serialized in store, so no point for now
      // set(formatter, directoryFileHandle, filesystemStore);
    });
  };

  const [duration_tracker, set_duration_tracker] = useState<number>();

  const [progress_bars, set_progress_bars] = useState<ProgressBarProps[]>([]);

  const handleStartEmbedding = async () => {
    if (!formatter) {
      alert("Formatter not selected");
      return;
    }
    const formatter_instance = config_store.get_formatter_instance(formatter);
    handle_start();
    Promise.all(
      filesystems.map(async ([, directoryHandle]) => {
        const fileHandles = await getDirectoryFilesRecursively(
          directoryHandle,
          formatter_instance.isValidFileFormat
        );

        return Promise.all(
          fileHandles.map(async (fileHandle) => {
            const file = await fileHandle.getFile();
            const contents = await file.text();

            const { metadata, messages } = formatter_instance.formatChatLog(
              contents.trim()
            );

            const progress_tracker_callback =
              config_store.datasource_instance.bulkAddToStorage(
                formatter_instance.getRecipient(metadata),
                formatter,
                messages
              );

            return {
              index: file.name,
              text_template: `Processed {current} out of {total} records for ${file.name}`,
              progress_tracker_callback,
              total_progress: messages.length,
            };
          })
        ).then((progress_bars) => {
          set_progress_bars(progress_bars);
        });
      })
    ).finally(handle_end);
  };

  const handle_start = () => {
    set_progress_bars([]);
  };

  const handle_end = () => {};

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

      {progress_bars.map((progress_bar) => (
        <ProgressBar key={progress_bar.index} {...progress_bar} />
      ))}
    </>
  );
};
