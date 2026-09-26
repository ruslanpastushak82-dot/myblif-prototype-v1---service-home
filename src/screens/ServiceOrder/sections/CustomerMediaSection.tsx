import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Toggle } from "../../../components/ui/toggle";

const photoItems = ["photo-1", "photo-2"];
const videoItems = ["video-1"];

const mediaTileClassName =
  "h-[70px] w-[70px] rounded-[9px] border-2 border-solid border-[#012878] bg-[#e7f1fe] p-0 text-2xl font-medium text-[#308cf9] hover:bg-[#e7f1fe] data-[state=on]:bg-[#d9eaff]";

export const CustomerMediaSection = (): JSX.Element => {
  const [_selectedMedia, setSelectedMedia] = useState<string[]>([]);

  const toggleMedia = (mediaId: string) => {
    setSelectedMedia((current) =>
      current.includes(mediaId)
        ? current.filter((id) => id !== mediaId)
        : [...current, mediaId],
    );
  };

  return (
    <Card className="w-full max-w-[181px] min-h-[438px] rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
      <CardContent className="flex min-h-[434px] flex-col p-0 [font-family:'Inter',Helvetica] text-[#012878]">
        <h2 className="ml-2 mt-3.5 flex h-7 items-center text-xl font-normal tracking-[0] leading-[normal]">
          Customer Media
        </h2>
        <h3 className="ml-5 mt-1.5 flex h-5 items-center text-[13px] font-medium tracking-[0] leading-[normal]">
          Photos
        </h3>
        <section
          aria-label="Photos"
          className="ml-2.5 mt-1.5 flex h-40 w-40 flex-col rounded-xl border-2 border-solid border-[#012878] bg-[#f6faff] p-[7px]"
        >
          <div className="grid grid-cols-2 gap-[6px]">
            {photoItems.map((photoId) => (
              <Toggle
                key={photoId}
                aria-label={`Select ${photoId}`}
                onPressedChange={() => toggleMedia(photoId)}
                className={mediaTileClassName}
              >
                ▧
              </Toggle>
            ))}
          </div>
          <button
            type="button"
            aria-label="Show more photos"
            className="mt-auto self-end pr-0.5 text-sm font-normal leading-none text-[#012878]"
          >
            ⌄
          </button>
        </section>
        <h3 className="ml-5 mt-[5px] flex h-5 items-center text-[13px] font-medium tracking-[0] leading-[normal]">
          Video
        </h3>
        <section
          aria-label="Video"
          className="ml-2.5 mt-2 flex h-40 w-40 flex-col rounded-xl border-2 border-solid border-[#012878] bg-[#f6faff] p-[7px]"
        >
          <div>
            {videoItems.map((videoId) => (
              <Toggle
                key={videoId}
                aria-label={`Select ${videoId}`}
                onPressedChange={() => toggleMedia(videoId)}
                className={mediaTileClassName}
              >
                ▧
              </Toggle>
            ))}
          </div>
          <button
            type="button"
            aria-label="Show more videos"
            className="mt-auto self-end text-sm font-normal leading-none text-[#012878]"
          >
            ⌄
          </button>
        </section>
      </CardContent>
    </Card>
  );
};
