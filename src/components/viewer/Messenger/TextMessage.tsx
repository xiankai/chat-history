import { fixMessengerExport } from "utils/string";

export const TextMessage = ({
  isRecipient,
  message,
}: {
  isRecipient: boolean;
  message: string;
}) => {
  return (
    <div
      className={`
    ${
      isRecipient
        ? "bg-gray-300 text-black text-left"
        : "bg-blue-500 text-white text-right"
    }
    rounded-3xl pt-2 pb-2 pl-3 pr-3
  `}
    >
      {fixMessengerExport(message)}
    </div>
  );
};
