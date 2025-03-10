
// import { db } from "@/db";

// import { videos } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { UTApi } from "uploadthing/server";

// const payload = {
//   type: "video.asset.ready",
//   request_id: null,
//   object: {
//     type: "asset",
//     id: "d00jdAI3shFRxTCfD8saOmUyGo88uHHHU6vVUlyKrVFQ",
//   },
//   id: "372b88da-0991-de13-9029-d5d9ba786a51",
//   environment: {
//     name: "new-tube-dev",
//     id: "ba249h",
//   },
//   data: {
//     video_quality: "basic",
//     upload_id: "aTfS02rELQYaiTj6Sxhbd8vsUTQTkMTbeNfWAMxNaXLs",
//     tracks: [
//       {
//         type: "video",
//         max_width: 1280,
//         max_height: 720,
//         max_frame_rate: 30,
//         id: "IuFA33JMb9HmH18z00AtHNXBOXMiL6v400ud00EtCLkaq8",
//         duration: 14.766667,
//       },
//       {
//         type: "text",
//         text_type: "subtitles",
//         text_source: "generated_vod",
//         status: "preparing",
//         name: "English",
//         language_code: "en",
//         id: "HvyPdEQz00glZn02nI98rjn9p00Q02FCVzQsI9ONpKKxneR3Ex5EzwYhig",
//       },
//       {
//         type: "audio",
//         status: "ready",
//         primary: true,
//         name: "Default",
//         max_channels: 2,
//         language_code: "und",
//         id: "UGP9ycaD4s1R69OLETwC02WcqfvW7VVT00nUXUpSSjnWuKcHLhjhkAxQ",
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
//         id: "Tx01mrp75VrRtFugRwouVNJnfiyksNCCVVxUyp1zgkoY",
//       },
//     ],
//     passthrough: "8e1ccaaf-9e7b-4565-9990-69ee9a3972c3",
//     mp4_support: "none",
//     max_stored_resolution: "HD",
//     max_stored_frame_rate: 30,
//     max_resolution_tier: "1080p",
//     master_access: "none",
//     ingest_type: "on_demand_direct_upload",
//     id: "d00jdAI3shFRxTCfD8saOmUyGo88uHHHU6vVUlyKrVFQ",
//     encoding_tier: "baseline",
//     duration: 10.021333,
//     created_at: 1740158861,
//     aspect_ratio: "16:9",
//   },
//   created_at: "2025-02-21T17:27:42.702000Z",
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
//       console.log(111111112, tempThumbnailUrl, tempPreviewUrl);

//       // const [uploadedThumbnail, uploadedPreview] =
//       //   await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);
//       const uploadedThumbnail = await utapi.uploadFilesFromUrl(
//         tempThumbnailUrl,
//       );

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
