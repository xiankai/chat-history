import { MessengerMetadata } from "formatter/messenger";

export const PhotoMessage = ({
  photos,
  assetPrefixUrl,
}: {
  photos: MessengerMetadata["photos"];
  assetPrefixUrl: string;
}) => {
  if (photos?.length === 1) {
    return (
      <div>
        <a href={assetPrefixUrl + photos[0].uri}>
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
    )
  }

  return (
    <div>
      {photos?.map((photo) => (
        <span>
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
