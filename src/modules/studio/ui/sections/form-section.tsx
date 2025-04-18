"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/trpc/client";
import {
  CopyCheckIcon,
  CopyIcon,
  DeleteIcon,
  Globe2Icon,
  ImagePlusIcon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparkleIcon,
  TrashIcon,
} from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import {
//   createInsertSchema,
//   createUpdateSchema,
//   createSelectSchema,
// } from "drizzle-zod";
import { z } from "zod";
import { videoUpdateSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import VideoPlayer from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import ThumbnailUploadModal from "../components/thumbnail-upload-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_URL } from "@/constants";

export interface FormSectionProps {
  videoId: string;
}

type videoUpdateSchemaType = z.infer<typeof videoUpdateSchema>;

const FormSectionSuspense: React.FC<FormSectionProps> = (props) => {
  const { videoId } = props;
  const router = useRouter();

  const utils = trpc.useUtils();
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);

  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const update = trpc.video.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("video updated");
    },
    onError: (error) => {
      toast.error("Something went wrong ");
    },
  });

  const remove = trpc.video.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("video removed");
      router.push("/studio");
    },
    onError: (error) => {
      toast.error("Something went wrong ");
    },
  });

  const revalidate = trpc.video.revalidate.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("video revalidated");
    },
    onError: (error) => {
      toast.error("Something went wrong ");
    },
  });

  const restoreThumbnail = trpc.video.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail restored");
      // router.push("/studio");
    },
    onError: (error) => {
      toast.error("Something went wrong ");
    },
  });

  const form = useForm<videoUpdateSchemaType>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });
  const onSubmit = async (data: videoUpdateSchemaType) => {
    update.mutate(data);
  };
  // form.handleSubmit.

  const fullUrl = `${APP_URL}/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // form.formState.isSubmitting
  return (
    <>
      <ThumbnailUploadModal
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={videoId}
      ></ThumbnailUploadModal>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className=" text-2xl font-bold ">Video details</h1>
              <p className=" text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>
            <div className=" flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={update.isPending || !form.formState.isDirty}
              >
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon />
                    <p>Delete</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => revalidate.mutate({ id: videoId })}
                  >
                    <RotateCcwIcon />
                    <p>Revalidate</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                        className="resize-none pr-10"
                        placeholder="Add a description to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => {
                  return (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        <div className=" relative p-0.5 border border-dashed border-neutral-400 h-[84px] w-[153px] group">
                          <Image
                            src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
                            className=" object-cover"
                            fill
                            alt="Thumbnail"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                size={"icon"}
                                className="rounded-full bg-black/50 hover:bg-black/50 absolute
                               top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100"
                              >
                                <MoreVerticalIcon className=" text-white" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              sideOffset={10}
                              align="start"
                              side="right"
                            >
                              <DropdownMenuItem
                                onClick={() => setThumbnailModalOpen(true)}
                              >
                                <ImagePlusIcon className=" size-4 mr-1" />
                                Change
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <SparkleIcon className=" size-4 mr-1" />
                                AI-generated
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  restoreThumbnail.mutate({
                                    id: videoId,
                                  })
                                }
                              >
                                <RotateCcwIcon className=" size-4 mr-1" />
                                Restore
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      disabled={categories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => {
                          return (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div className=" flex flex-col gap-y-8 lg:col-span-2">
              <div className=" flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit">
                <div className=" aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className=" flex justify-between items-center gap-x-2 flex-1">
                    <div className="flex flex-col gap-y-1 w-full">
                      <p className="text-muted-foreground text-sm">
                        Video Link
                      </p>
                      <div className=" flex items-center gap-x-2">
                        <Link
                          prefetch
                          href={`/videos/${video.id}`}
                          className="block flex-1 overflow-hidden"
                        >
                          <div className=" line-clamp-1 text-sm text-blue-300">
                            {fullUrl}
                          </div>
                        </Link>
                        <Button
                          className=" shrink-0 flex"
                          type="button"
                          size={"icon"}
                          variant={"ghost"}
                          onClick={() => {
                            onCopy();
                          }}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className=" flex justify-between items-center">
                    <div className=" flex flex-col gap-y-1">
                      <p className=" text-muted-foreground text-xs">
                        Video status
                      </p>
                      <p className=" text-sm">
                        {snakeCaseToTitle(video.muxStatus || "preparing")}
                      </p>
                    </div>
                  </div>

                  <div className=" flex justify-between items-center">
                    <div className=" flex flex-col gap-y-1">
                      <p className=" text-muted-foreground text-xs">
                        Track status
                      </p>
                      <p className=" text-sm">
                        {snakeCaseToTitle(
                          video.muxTrackStatus || "no_subtitles",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      disabled={categories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"public"}>
                          <div className=" flex items-center">
                            <Globe2Icon /> Public
                          </div>
                        </SelectItem>
                        <SelectItem value={"private"}>
                          <div className=" flex items-center">
                            <LockIcon />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

const FormSectionSkeleton = () => {
  return (
    <div>
      <div className=" flex items-center justify-between mb-6">
        <div className=" space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className=" h-9 w-24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className=" space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className=" h-5 w-16" />
            <Skeleton className=" h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className=" h-5 w-16" />
            <Skeleton className=" h-[220px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className=" h-5 w-16" />
            <Skeleton className=" h-[84px] w-[153px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className=" h-5 w-16" />
            <Skeleton className=" h-8 w-full" />
          </div>
        </div>
        <div className="flex flex-col space-y-8 lg:col-span-2">
          <div className="flex flex-col overflow-hidden space-y-2  gap-4">
            <Skeleton className=" aspect-video " />
            <div className="px-4 py-2 space-y-7">
              <div className=" space-y-2">
                <Skeleton className=" h-4 w-20" />
                <Skeleton className=" h-5 w-full" />
              </div>
              <div className=" space-y-2">
                <Skeleton className=" h-4 w-20" />
                <Skeleton className=" h-5 w-32" />
              </div>
              <div className=" space-y-2">
                <Skeleton className=" h-4 w-20" />
                <Skeleton className=" h-5 w-32" />
              </div>
            </div>
          </div>

          <div className="space-y-2 ">
            <Skeleton className=" h-5 w-20" />
            <Skeleton className=" h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSection: React.FC<FormSectionProps> = (props) => {
  const { videoId } = props;

  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default FormSection;
FormSection.displayName = "FormSection";
