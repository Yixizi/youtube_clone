import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React, { useState } from "react";

export interface VideoDescriptionProps {
  children?: React.ReactNode;

  compactViews: string;
  expandedViews: string;
  compactData: string;
  expandedDate: string;
  description: string | null;
}

const VideoDescription: React.FC<VideoDescriptionProps> = (props) => {
  const {
    children,
    compactData,
    compactViews,
    expandedDate,
    description,
    expandedViews,
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded((current) => !current)}
      className=" bg-secondary/50 
    rounded-xl p-3  cursor-pointer hover:bg-seconder/70 transition"
    >
      <div className=" flex gap-2 text-sm mb-2">
        <span className=" font-medium">
          {isExpanded ? expandedViews : compactViews}
        </span>
        <span className=" font-medium">
          {isExpanded ? expandedDate : compactData}
        </span>
      </div>

      <div className="relative">
        <p
          className={cn(
            "text-sm  whitespace-pre-wrap",
            !isExpanded && "line-clamp-2",
          )}
        >
          {description || "No description"}
        </p>

        <div className=" flex items-center gap-1 mt-4 text-sm font-medium">
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDescription;
VideoDescription.displayName = "VideoDescription";
