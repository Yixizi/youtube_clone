"use client";
import { UserAvatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_LIMIT } from "@/constants";
import { commentInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface CommentFormProps {
  children?: React.ReactNode;
  videoId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "reply" | "comment";
  parentId?: string;
  originId?: string;
}

const formSchema = commentInsertSchema.omit({ userId: true });
type CommentInsertType = z.infer<typeof formSchema>;

const CommentForm: React.FC<CommentFormProps> = (props) => {
  const {
    children,
    videoId,
    onSuccess,
    variant = "comment",
    parentId,
    onCancel,
    originId,
  } = props;
  const { user } = useUser();
  const clerk = useClerk();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({
        videoId,
      });
      utils.comments.getMany.invalidate({
        videoId,
        originId,
      });
      form.reset();
      toast.success("Comment added");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Something went wrong");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const utils = trpc.useUtils();

  const form = useForm<CommentInsertType>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      videoId,
      value: "",
      parentId: parentId,
      originId,
    },
  });

  const handleSubmit = (values: CommentInsertType) => {

    create.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        className=" flex gap-4 group mt-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.username || "User"}
        />

        <div className="  flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                        ? "Reply to this comment..."
                        : "Add a comment..."
                    }
                    className=" resize-none bg-transparent overflow-hidden min-h-0"
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=" justify-end gap-2 mt-2 flex">
            {onCancel && (
              <Button
                onClick={handleCancel}
                type="button"
                size={"sm"}
                disabled={create.isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" size={"sm"}>
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
CommentForm.displayName = "CommentForm";
