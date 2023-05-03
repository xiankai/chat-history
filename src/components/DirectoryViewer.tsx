import { SupportedFormatter } from "formatter/base";
import { useEffect, useState } from "react";
import {
  asciiTreeToHtml,
  generateAsciiTree,
  getDirectoryTree,
} from "utils/filetree";

type File = [string, FileSystemDirectoryHandle | FileSystemFileHandle];

export const DirectoryViewer = ({
  filesystem,
  directoryHandle,
}: {
  filesystem: SupportedFormatter;
  directoryHandle: FileSystemDirectoryHandle;
}) => {
  const [ascii_tree, set_ascii_tree] = useState("");

  useEffect(() => {
    getDirectoryTree(directoryHandle).then((directoryTree) => {
      const asciiTree = generateAsciiTree(directoryTree);
      const html = asciiTreeToHtml(asciiTree);
      set_ascii_tree(html);
    });
  }, [directoryHandle]);

  return <div dangerouslySetInnerHTML={{ __html: ascii_tree }} />;

  // const [files, set_files] = useState<File[]>([]);
  // useEffect(() => {
  //   (async () => {
  //     const files = [];
  //     for await (const item of directoryHandle.entries()) {
  //       files.push(item);
  //     }
  //     set_files(files);
  //   })();
  // }, [directoryHandle]);

  // return (
  //   <div>
  //     {filesystem} data stored at {directoryHandle.name}
  //     {files.map(([filename, file_handle]) => {
  //       return <div key={filename}>{filename}</div>;
  //     })}
  //   </div>
  // );
};
