import { MessengerMetadata } from "formatter/messenger";

export const PhotoMessage = ({
  photos,
  assetPrefixUrl,
  isRecipient,
}: {
  photos: MessengerMetadata["photos"];
  assetPrefixUrl: string;
  isRecipient: boolean;
}) => {
  if (photos?.length === 1) {
    return (
      <div>
        <a
          href={assetPrefixUrl + photos[0].uri}
          className={isRecipient ? "" : "rtl:"}
        >
          <img
            src={assetPrefixUrl + photos[0].uri}
            className={`
                max-h-48
                rounded
                m-1
              `}
          />
        </a>
      </div>
    );
  }

  return (
    <div>
      {photos?.map((photo, i) => (
        <span key={i}>
          <a href={assetPrefixUrl + photo.uri}>
            <img
              src={assetPrefixUrl + photo.uri}
              className={`
                w-32
                h-32
                rounded
                m-1
                object-cover
              `}
            />
          </a>
        </span>
      ))}
    </div>
  );
};
