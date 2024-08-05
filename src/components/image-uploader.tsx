import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

const ImageUploader = ({
  imgUrl,
  setImgUrl,
}: {
  imgUrl: string;
  setImgUrl: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2">
      <Button
        asChild
        className="w-[300px] h-[300px] flex items-center justify-center"
        variant="secondary"
      >
        <UploadDropzone
          appearance={{
            button({ uploadProgress }) {
              return {
                padding: ".2rem",
                width: "100%",
                background: "black",
                ...(uploadProgress && { background: "green" }),
              };
            },
          }}
          endpoint="imageUploader"
          config={{ mode: "auto" }}
          onClientUploadComplete={(res) => {
            setImgUrl(res[0].url);
            toast.success("Image upload Successful");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      </Button>
    </div>
  );
};

export default ImageUploader;
