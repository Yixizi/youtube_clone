"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_URL } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { memo, useState } from "react";

export interface SearchInputProps {}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const router = useRouter();
  const isMobile = useIsMobile(640);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const [open, setOpen] = useState(false);

  // Then in the Drawer
  <Drawer open={open} onOpenChange={setOpen}>
    // ...
  </Drawer>;
  const [value, setValue] = useState(query);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = new URL("/search", APP_URL);
    const newQuery = value.trim();

    url.searchParams.set("query", encodeURIComponent(newQuery));

    if (newQuery === "") {
      url.searchParams.delete("query");
    }
    if (categoryId) {
      url.searchParams.set("categoryId", categoryId);
    }

    setValue(newQuery);
    router.push(url.toString());
    setOpen(false);
  };

  if (!isMobile && typeof isMobile === "boolean") {
    return (
      <form onSubmit={handleSearch} className="flex max-w-[600px] w-full">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="搜索"
            className="w-full pl-4 pr-12 py-2 rounded-l-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
            >
              <XIcon className="size-5 text-gray-500" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-6 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 disabled:opacity-50"
        >
          <SearchIcon className="size-5" />
        </button>
      </form>
    );
  }
  return (
    <Drawer direction="top" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        onClick={(e) => {
          e.currentTarget.blur();
        }}
        className="ml-auto h-10 px-4 rounded-full bg-white shadow-sm hover:bg-gray-50"
      >
        <SearchIcon className="size-5" />
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerContent
          inert={!open ? true : undefined}
          className="rounded-t-lg p-4 min-h-[30vh] bottom-[70%]"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerTitle className=" justify-center items-center text-center py-8 block">
            搜索窗
          </DrawerTitle>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="搜索"
                className="w-full pl-4 pr-12 py-2 rounded-full border focus:outline-none  focus:ring-2 focus:ring-blue-500"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => setValue("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                >
                  <XIcon className="size-5 text-gray-500" />
                </button>
              )}
            </div>
            <DrawerClose
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
              asChild
            >
              <Button type="submit" disabled={!value.trim()}>
                搜索
              </Button>
            </DrawerClose>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};

export default SearchInput;
SearchInput.displayName = "SearchInput";
