import React from "react";
import UserSection from "../sections/user-section";
import UserVideosSection from "../sections/user-videos-section";

export interface UserViewProps {
  children?: React.ReactNode;
  userId: string;
}

const UserView: React.FC<UserViewProps> = (props) => {
  const { userId } = props;

  return (
    <div className=" flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6">
      <UserSection userId={userId} />
      <UserVideosSection userId={userId} />
    </div>
  );
};

export default UserView;
UserView.displayName = "UserView";
