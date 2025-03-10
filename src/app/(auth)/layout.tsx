import React, { memo } from "react";

export interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <div className=" min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
});

export default Layout;
Layout.displayName = "Layout";
