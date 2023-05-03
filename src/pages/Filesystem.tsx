import { entries, get, set, update, createStore, getMany } from "idb-keyval";
import { DirectoryViewer } from "components/DirectoryViewer";
import { SupportedFormatter, supported_formatters } from "formatter/base";
import { useEffect, useState } from "react";

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

  return (
    <>
      <label className="label">
        Select the root folder containing your export
      </label>
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
          <>
            <button
              key={supported_formatter}
              onClick={handleSelectFolder(supported_formatter)}
              className="btn btn-primary"
            >
              {supported_formatter}
            </button>
          </>
        );
      })}
    </>
  );
};
