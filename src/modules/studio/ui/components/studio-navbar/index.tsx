import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import AuthButton from "@/modules/auth/ui/components/auth-button";
import StudioUploadModal from "./studio-upload-modal";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";

export interface StudioNavbarProps {}

const StudioNavbar: React.FC<StudioNavbarProps> = memo((props) => {
  return (
    <div
      className=" fixed top-0 left-0 right-0 h-16 bg-white items-center
     px-2 pr-5 z-50 border-b shadow-md"
    >
      <div className=" flex items-center gap-4 w-full">
        <div className=" flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link prefetch href={"/"}>
            <div className="flex items-center gap-2 p-4">
              <Image
                src={THUMBNAIL_FALLBACK}
                alt="Logo"
                height={32}
                width={32}
              />
              <p className="hidden md:block text-xl font-semibold tracking-tight">
                NewTuBe
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1"></div>

        <div className=" flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </div>
  );
});

export default StudioNavbar;
StudioNavbar.displayName = "StudioNavbar";
