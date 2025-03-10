import StudioLayout from "@/modules/studio/ui/layouts/studio-layout";
import React, { memo } from "react";

export interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return <StudioLayout>{children}</StudioLayout>;
});

export default Layout;
Layout.displayName = "Layout";
