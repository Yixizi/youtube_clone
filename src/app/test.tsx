// import { db } from "@/db";

// import { videos } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { UTApi } from "uploadthing/server";

// const payload = {
//   type: "video.asset.ready",
//   request_id: null,
//   object: {
//     type: "asset",
//     id: "54N8ddemG9EULSO6D769vwchi912nkgrsGgQCYVLi6Y",
//   },
//   id: "58f1385e-e4ac-8b90-9c1b-a01ad9868343",
//   environment: {
//     name: "new-tube-dev",
//     id: "ba249h",
//   },
//   data: {
//     video_quality: "basic",
//     upload_id: "7wLJGQtW702h2Lau0202a2cDGFuqKHj5eoC0202hJf02VJ8004",
//     tracks: [
//       {
//         type: "audio",
//         primary: true,
//         max_channels: 2,
//         max_channel_layout: "stereo",
//         id: "l6tR02oQ6PwxHeQXyX81bM0000B1e00guDoYyx4Zxx02JbqQ",
//         duration: 10.959002,
//       },
//       {
//         type: "video",
//         max_width: 576,
//         max_height: 1124,
//         max_frame_rate: 30,
//         id: "H4c11mwhhc02XtPKyP1kU200BKAIdpCoM6uQIuOAb6m6g",
//         duration: 11,
//       },
//       {
//         type: "text",
//         text_type: "subtitles",
//         text_source: "generated_vod",
//         status: "preparing",
//         name: "English",
//         language_code: "en",
//         id: "5ZjAGVZ201aOp702K4WNeZxfQ01tSuFN17dJIT4YKlu3YhYdlkPX7IMqA",
//       },
//     ],
//     test: true,
//     status: "ready",
//     resolution_tier: "720p",
//     progress: {
//       state: "completed",
//     },
//     playback_ids: [
//       {
//         policy: "public",
//         id: "yzatsQwwl01Gi029un9Ii8bQ5t2xWCd026ZQD7024jIIKZo",
//       },
//     ],
//     passthrough: "8e1ccaaf-9e7b-4565-9990-69ee9a3972c3",
//     mp4_support: "none",
//     max_stored_resolution: "HD",
//     max_stored_frame_rate: 30,
//     max_resolution_tier: "1080p",
//     master_access: "none",
//     ingest_type: "on_demand_direct_upload",
//     id: "54N8ddemG9EULSO6D769vwchi912nkgrsGgQCYVLi6Y",
//     encoding_tier: "baseline",
//     duration: 10.261133,
//     created_at: 1741182242,
//     aspect_ratio: "144:281",
//   },
//   created_at: "2025-03-05T13:44:03.543000Z",
//   attempts: [],
//   accessor_source: null,
//   accessor: null,
// };
// async function main() {
//   console.log(165166156);
//   const data = payload.data;
//   const playbackId = data.playback_ids?.[0].id;

//   switch (payload.type) {
//     case "video.asset.created": {
//       const data = payload.data;
//       if (!data.upload_id) {
//         return;
//       }

//       await db
//         .update(videos)
//         .set({ muxAssetId: data.id, muxStatus: data.status })
//         .where(eq(videos.muxUploadId, data.upload_id));
//       console.log("created over");
//       break;
//     }
//     case "video.asset.ready": {
//       const data = payload.data;
//       const playbackId = data.playback_ids?.[0].id;

//       if (!playbackId) {
//         return;
//       }
//       if (!data.upload_id) {
//         return;
//       }
//       // https://image.mux.com/dgtkEGIqePjCvfuWj00DQzzln00601a1R01cj974tFftbjU/thumbnail.jpg
//       // https://image.mux.com/dgtkEGIqePjCvfuWj00DQzzln00601a1R01cj974tFftbjU/animated.jpg
//       const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
//       const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
//       const duration = data.duration ? Math.round(data.duration * 1000) : 0;

//       const utapi = new UTApi();
//       // console.log(111111112, tempThumbnailUrl, tempPreviewUrl);

//       const [uploadedThumbnail, uploadedPreview] =
//         await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);
//       //   const uploadedThumbnail = await utapi.uploadFilesFromUrl(
//       //     tempThumbnailUrl,
//       //   );

//       console.log("asassa", 11111111);

//       if (!uploadedThumbnail.data || !uploadedPreview.data) {
//         console.log("没有返回值");
//         return;
//       }

//       const { key: thumbnailKey, ufsUrl: thumbnailUrl } =
//         uploadedThumbnail.data;

//       const { key: previewKey, ufsUrl: previewUrl } = uploadedThumbnail.data;
//       console.log(11111111);

//       await db
//         .update(videos)
//         .set({
//           muxStatus: data.status,
//           muxPlaybackId: playbackId,
//           muxAssetId: data.id,
//           thumbnailUrl,
//           thumbnailKey,
//           previewUrl,
//           duration,
//           previewKey,
//         })
//         .where(eq(videos.muxUploadId, data.upload_id));
//       console.log("ready over");

//       break;
//     }
//     case "video.asset.errored": {
//       const data = payload.data;
//       if (!data.upload_id) {
//         return;
//       }

//       await db
//         .update(videos)
//         .set({
//           muxStatus: data.status,
//         })
//         .where(eq(videos.muxUploadId, data.upload_id));

//       break;
//     }
//     case "video.asset.deleted": {
//       const data = payload.data;
//       if (!data.upload_id) {
//         return;
//       }

//       await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));

//       console.log("deleteId: ", data.upload_id);
//       break;
//     }
//     case "video.asset.track.ready": {
//       const data = payload.data;

//       const assetId = data.asset_id;
//       const trackId = data.id;
//       const status = data.status;

//       if (!assetId) {
//         return;
//       }

//       await db
//         .update(videos)
//         .set({
//           muxTrackId: trackId,
//           muxTrackStatus: status,
//         })
//         .where(eq(videos.muxAssetId, assetId));

//       break;
//     }
//   }
// }

// main();

// import React from "react";

// export interface TestProps {
//   children?: React.ReactNode;
// }

// const Test: React.FC<TestProps> = (props) => {
//   const { children } = props;

//   return null;
// };

// export default Test;
// Test.displayName = "Test";
