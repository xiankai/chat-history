import { MessengerMetadata } from "formatter/messenger";

export const VideoMessage = ({
  videos,
  assetPrefixUrl,
  isRecipient,
}: {
  videos: MessengerMetadata["videos"];
  assetPrefixUrl: string;
  isRecipient: boolean;
}) => {
  return (
    <>
      {videos?.map((video) => (
        <div
          className={`
            min-w-[48]
            h-48
            ${isRecipient ? "" : "rtl"}
          `}
        >
          <video src={assetPrefixUrl + video.uri} />
        </div>
      ))}
    </>
  );
};
