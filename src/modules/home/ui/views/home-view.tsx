import React, { memo } from "react";
import CategoriesSection from "../sections/categories-section";
import HomeVideoSection from "../sections/home-video-section";

export interface HomeViewProps {
  categoryId?: string;
}

const HomeView: React.FC<HomeViewProps> = memo((props) => {
  const { categoryId } = props;

  return (
    <div
      className=" max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col
     gap-y-6 "
    >
      <CategoriesSection categoryId={categoryId}></CategoriesSection>
      <HomeVideoSection categoryId={categoryId} />
    </div>
  );
});

export default HomeView;
HomeView.displayName = "HomeView";
