import React, { Suspense } from "react";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ResponsiveModal from "@/components/responsive-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "react-error-boundary";

export interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const formSchema = z.object({
  name: z.string().min(1),
});

type formSchemaType = z.infer<typeof formSchema>;

const PlaylistCreateModal: React.FC<PlaylistCreateModalProps> = (props) => {
  const { open, onOpenChange } = props;
  const utils = trpc.useUtils();
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      toast.success("Playlist created");
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = (values: formSchemaType) => {
    console.log(values);
    create.mutate(values);
  };

  return (
    <ResponsiveModal
      title="Create a playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="My favorite videos"></Input>
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <div className="flex justify-end mt-4">
            <Button disabled={create.isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

export default PlaylistCreateModal;
PlaylistCreateModal.displayName = "PlaylistCreateModal";
