import { categoriesRouter } from "@/modules/categories/server/procedures";
import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedures";
import { videoRouter } from "@/modules/videos/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/server/procedures";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedures";

import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { commentReactionsRouter } from "@/modules/comment-reactions/server/procedures";
import { suggestionsRouter } from "@/modules/suggestions/server/procedures";
import { searchRouter } from "@/modules/search/server/procedures";
import { playlistsRouter } from "@/modules/playlists/server/procedures";
import { userRouter } from "@/modules/users/server/procedures";

export const appRouter = createTRPCRouter({
  users: userRouter,
  categories: categoriesRouter,
  studio: studioRouter,
  video: videoRouter,
  videoViews: videoViewsRouter,
  viewReactions: videoReactionsRouter,
  commentReactions: commentReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  suggestions: suggestionsRouter,
  homeSearch: searchRouter,
  playlists: playlistsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
