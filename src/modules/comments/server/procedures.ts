import { db } from "@/db";
import {
  commentInsertSchema,
  commentReactions,
  comments,
  users,
} from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { z } from "zod";

const parentComment = alias(comments, "parent_comment");
const originComment = alias(comments, "origin_comment");
const parentUser = alias(users, "parent_user");
// type ParentUser = typeof parentUser.$inferSelect;
const originUser = alias(users, "origin_user");
// type OriginUser = typeof originUser.$inferSelect;

export const commentsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.userId, userId), eq(comments.id, id)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deletedComment;
    }),

  create: protectedProcedure
    .input(
      z.object({
        parentId: z.string().uuid().nullish(),
        originId: z.string().uuid().nullish(),
        videoId: z.string().uuid(),
        value: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { videoId, value, parentId, originId } = input;
      const { id: userId } = ctx.user;

      const [existingComment] = await db
        .select()
        .from(comments)
        .where(inArray(comments.id, parentId ? [parentId] : []));

      if (!existingComment && parentId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // if(existingComment&&parentId&&existingComment.parentId){}

      const [createdComment] = await db
        .insert(comments)
        .values({ userId, videoId, value, parentId, originId })
        .returning();

      return createdComment;
    }),

  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updateAt: z.date(),
          })
          .nullish(),
        parentId: z.string().uuid().nullish(),
        originId: z.string().uuid().nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { clerkUserId } = ctx;
      const { videoId, cursor, limit, parentId, originId } = input;
      let userId;

      const [user] = await db
        .select()
        .from(users)
        // .where(clerkUserId ? eq(users.clerkId, clerkUserId) : undefined);
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(inArray(commentReactions.userId, userId ? [userId] : [])),
      );

      const replies = db.$with("replies").as(
        db
          .select({
            // parentId: comments.parentId,
            originId: comments.originId,
            count: count(comments.id).as("count"),
          })
          .from(comments)
          .where(isNotNull(comments.originId))
          .groupBy(
            comments.originId,
          ),
      );


      const [[totalData], data] = await Promise.all([
        db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
        db
          .with(viewerReactions, replies)
          .select({
            ...getTableColumns(comments),
            user: users,
            likeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, "like"),
                eq(commentReactions.commentId, comments.id),
              ),
            ),
            dislikeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, "dislike"),
                eq(commentReactions.commentId, comments.id),
              ),
            ),
            viewerReaction: viewerReactions.type,
            replyCount: replies.count,
            parent: {
              ...getTableColumns(parentComment),
            },
            parentUser: {
              ...getTableColumns(parentUser),
            },
            origin: {
              ...getTableColumns(originComment),
            },
            originUser: getTableColumns(originUser),
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              originId
                ? eq(comments.originId, originId)
                : isNull(comments.originId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updateAt),
                    and(
                      eq(comments.updatedAt, cursor.updateAt),
                      lt(comments.id, cursor.id),
                    ),
                  )
                : undefined,
            ),
          )
          .innerJoin(users, eq(comments.userId, users.id))
          .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
          .leftJoin(replies, eq(comments.id, replies.originId))
          .leftJoin(
            parentComment,
            eq(comments.parentId, parentComment.id), // 使用列引用
          )
          .leftJoin(parentUser, eq(parentComment.userId, parentUser.id))
          .leftJoin(
            originComment,
            eq(comments.originId, originComment.id), // 使用列引用
          )
          .leftJoin(originUser, eq(originComment.userId, originUser.id))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      // const data =

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updateAt: lastItem.updatedAt,
          }
        : null;

      return {
        totalCount: totalData.count,
        items,
        nextCursor,
      };
    }),
});
