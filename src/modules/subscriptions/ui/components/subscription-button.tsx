import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export interface SubscriptionButtonProps {
  children?: React.ReactNode;
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = (props) => {
  const { children, onClick, disabled, isSubscribed, className, size } = props;

  return (
    <Button
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      disabled={disabled}
      onClick={onClick}
    >
      {isSubscribed ? "Subscription" : "Not Subscription"}
    </Button>
  );
};

export default SubscriptionButton;
SubscriptionButton.displayName = "SubscriptionButton";
