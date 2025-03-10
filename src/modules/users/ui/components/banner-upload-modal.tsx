import React from "react";
import ResponsiveModal from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

export interface BannerUploadModalProps {
  children?: React.ReactNode;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BannerUploadModal: React.FC<BannerUploadModalProps> = (props) => {
  const { children, userId, open, onOpenChange } = props;
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      title="Upload a banner"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint={'bannerUploader'}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
export default BannerUploadModal;
BannerUploadModal.displayName = "BannerUploadModal";
