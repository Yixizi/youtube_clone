import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/Image";
import Link from "next/link";
import React, { memo } from "react";
import SearchInput from "./search-input";
import AuthButton from "@/modules/auth/ui/components/auth-button";
import { Button } from "@/components/ui/button";
import { ClapperboardIcon } from "lucide-react";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";

import StudioText from "./studio-text";
import { useClerk } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";

export interface HomeNavbarProps {}

const HomeNavbar: React.FC<HomeNavbarProps> = memo((props) => {
  return (
    <div className=" fixed top-0 left-0 right-0 h-16 bg-white items-center px-2 pr-5 z-50">
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
              <p className="text-xl font-semibold tracking-tight hidden md:block">
                NewTuBe
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>

        <div className=" flex-shrink-0 items-center flex gap-4">
          <StudioText />
          <AuthButton />
        </div>
      </div>
    </div>
  );
});

export default HomeNavbar;
HomeNavbar.displayName = "HomeNavbar";
