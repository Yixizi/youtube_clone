import React from "react";
import ResponsiveModal from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

export interface ThumbnailUploadModalProps {
  children?: React.ReactNode;
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThumbnailUploadModal: React.FC<ThumbnailUploadModalProps> = (props) => {
  const { children, videoId, open, onOpenChange } = props;
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.studio.getOne.invalidate({ id: videoId });
    utils.studio.getMany.invalidate();
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint={"thumbnailUploader"}
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
export default ThumbnailUploadModal;
ThumbnailUploadModal.displayName = "ThumbnailUploadModal";
