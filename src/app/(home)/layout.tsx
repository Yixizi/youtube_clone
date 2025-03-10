import HomeLayout from "@/modules/home/ui/layouts/home-layout";
import React, { memo } from "react";

export interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return <HomeLayout>{children}</HomeLayout>;
});

export default Layout;
Layout.displayName = "Layout";
