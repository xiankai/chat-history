import { entries, get, set, update, createStore, getMany } from "idb-keyval";
import { DirectoryViewer } from "components/DirectoryViewer";
import { SupportedFormatter, supported_formatters } from "formatter/base";
import { Fragment, useEffect, useState } from "react";
import { getDirectoryFilesRecursively } from "utils/filetree";
import { formatDurationFromSeconds } from "utils/string";
import config_store from "stores/config_store";
import { ProgressBar, ProgressBarProps } from "components/ProgressBar";
import Cookies from "js-cookie";

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

    // collect all the params first (promises)
    const params_array = filesystems.map(async ([, directoryHandle]) => {
      const fileHandles = await getDirectoryFilesRecursively(
        directoryHandle.name,
        directoryHandle,
        formatter_instance.isValidFileFormat
      );

      return await Promise.all(
        fileHandles.map(async ({ directoryName, fileHandle }) => {
          const file = await fileHandle.getFile();
          const contents = await file.text();

          const { metadata, messages } = formatter_instance.formatChatLog(
            contents.trim()
          );

          return {
            index: `${directoryName}/${file.name}`,
            recipient: formatter_instance.getRecipient(metadata),
            formatter,
            messages,
          };
        })
      );
    });

    // await the promises to get the actual params, then flatten
    const flat_params_array = (await Promise.all(params_array.flat())).flat();

    // initial progress bar setup
    set_progress_bars(
      flat_params_array.map((params) => ({
        index: params.index,
        text_template: `Processed {current} out of {total} records for ${params.index}`,
        progress_tracker_callback: () => null,
        total_progress: params.messages.length,
      }))
    );

    // sequential execution
    flat_params_array.reduce((prev, curr, index) => {
      return prev.then(() => {
        // in case of auth failure, early return
        if (!Cookies.get("firebase_token")) {
          return;
        }

        // call the api
        const { progress_tracker_callback, promise } =
          config_store.datasource_instance.bulkAddToStorage(
            curr.recipient,
            curr.formatter,
            curr.messages
          );

        // update progress bar callback
        set_progress_bars((progress_bars) => [
          ...progress_bars.slice(0, index),
          {
            ...progress_bars[index],
            progress_tracker_callback,
          },
          ...progress_bars.slice(index + 1),
        ]);

        // return promise to be thenned/chained
        return promise;
      });
    }, Promise.resolve());
  };

  const handle_start = () => {
    set_progress_bars([]);
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

      {progress_bars.map((progress_bar) => (
        <ProgressBar key={progress_bar.index} {...progress_bar} />
      ))}
    </>
  );
};
