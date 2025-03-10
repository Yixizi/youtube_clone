import React, { useState } from "react";
import { UserGetOneOutput } from "../../type";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BannerUploadModal from "./banner-upload-modal";

export interface UserPageBannerProps {
  children?: React.ReactNode;
  user: UserGetOneOutput;
}

const UserPageBanner: React.FC<UserPageBannerProps> = (props) => {
  const { user } = props;
  const { userId } = useAuth();
  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);

  return (
    <div className=" relative group">
      <BannerUploadModal
        userId={user.id}
        open={isBannerUploadModalOpen}
        onOpenChange={setIsBannerUploadModalOpen}
      />
      <div
        className={cn(
          "w-full max-h-[200px] h-[15vh] md:h-[25vh]  bg-gradient-to-r from-gray-100  to-gray-200 ",
          "rounded-xl",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100",
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {user.clerkId === userId && (
          <Button
            onClick={() => setIsBannerUploadModalOpen(true)}
            type="button"
            size={"icon"}
            className=" absolute top-4 right-4 rounded-full bg-black/50
             hover:bg-black/100 opacity-100 md:opacity-0 group-hover:opacity-100 
              transition-opacity duration-300"
          >
            <Edit2Icon />
          </Button>
        )}
      </div>
    </div>
  );
};
export const UserPageBannerSkeleton = () => {
  return <Skeleton className=" w-full max-h-[200px] h-[15vh] md:h-[25vh] " />;
};

export default UserPageBanner;
UserPageBanner.displayName = "UserPageBanner";
