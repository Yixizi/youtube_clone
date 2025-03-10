"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import React, { memo } from "react";
import { toast } from "sonner";
import StudioUploader from "../studio-uploader";
import { useRouter } from "next/navigation";

interface StudioUploadModalProps {

}

const StudioUploadModal: React.FC<StudioUploadModalProps> = memo((props) => {


  const router = useRouter();

  const utils = trpc.useUtils();
  const create = trpc.video.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSuccess = () => {
    if (!create.data?.video.id) {
      return;
    }

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => {
          create.reset();
        }}
      >
        {create.data?.url ? (
          <StudioUploader
            endpoint={create.data.url}
            onSuccess={() => {
              onSuccess();
            }}
          />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>

      <Button
        variant={"secondary"}
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
});

export default StudioUploadModal;

StudioUploadModal.displayName = "StudioUploadModal";
