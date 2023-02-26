import { MessengerMetadata } from "formatter/messenger"

export const VideoMessage = ({
  videos,
  assetPrefixUrl
}: {
  videos: MessengerMetadata['videos'],
  assetPrefixUrl: string
}) => {
  return <>
    {videos?.map(video => (
      <div className={`
        w-48
        h-48
      `}>
        <video src={assetPrefixUrl + video.uri} />
      </div>
    ))}
  </>
}