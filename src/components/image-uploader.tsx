import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

const ImageUploader = ({
  imgUrl,
  setImgUrl,
  type,
}: {
  imgUrl: string | string[];
  setImgUrl: Dispatch<SetStateAction<string[]>>;
  type: "user" | "product";
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dashed rounded-lg">
      <Button
        asChild
        variant="secondary"
        className="h-[80%] aspect-square flex items-center justify-center"
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
            if (type === "user") {
              setImgUrl([res[0].url]);
              toast.success("Image upload Successful");
            } else {
              setImgUrl((prevUrl) => [...prevUrl, res[0].url]);
              toast.success("Image upload Successful");
            }
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
