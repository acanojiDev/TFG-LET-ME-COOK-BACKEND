import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createLoaders(prisma: PrismaClient, userId?: string) {
  return {
    // ============================================
    // USER LOADER - Carga usuarios en batch
    // PostgreSQL usa el índice automáticamente
    // ============================================
    user: new DataLoader(async (userIds: readonly string[]) => {
      const users = await prisma.users.findMany({
        where: { id: { in: userIds as string[] } },
        include: {
          person_profile: true,
          business_profile: true
        }
      });

      // Mantener el orden de los IDs solicitados
      return userIds.map(id => users.find(u => u.id === id) || null);
    }),

    // ============================================
    // POST MEDIA LOADER - USA idx_post_media_batch
    // ============================================
    postMedia: new DataLoader(async (postIds: readonly string[]) => {
      const media = await prisma.post_media.findMany({
        where: { post_id: { in: postIds as string[] } },
        orderBy: { position: 'asc' }
      });

      // Agrupar por post_id
      return postIds.map(postId =>
        media.filter(m => m.post_id === postId)
      );
    }),

    // ============================================
    // LIKE COUNT LOADER - Cuenta likes en batch
    // ============================================
    likeCount: new DataLoader(async (postIds: readonly string[]) => {
      const counts = await prisma.likes.groupBy({
        by: ['post_id'],
        where: { post_id: { in: postIds as string[] } },
        _count: true
      });

      return postIds.map(postId => {
        const result = counts.find(c => c.post_id === postId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // COMMENT COUNT LOADER
    // ============================================
    commentCount: new DataLoader(async (postIds: readonly string[]) => {
      const counts = await prisma.comments.groupBy({
        by: ['post_id'],
        where: { post_id: { in: postIds as string[] } },
        _count: true
      });

      return postIds.map(postId => {
        const result = counts.find(c => c.post_id === postId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // SAVE COUNT LOADER
    // ============================================
    saveCount: new DataLoader(async (postIds: readonly string[]) => {
      const counts = await prisma.saved_posts.groupBy({
        by: ['post_id'],
        where: { post_id: { in: postIds as string[] } },
        _count: true
      });

      return postIds.map(postId => {
        const result = counts.find(c => c.post_id === postId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // VIEW COUNT LOADER
    // ============================================
    viewCount: new DataLoader(async (postIds: readonly string[]) => {
      const counts = await prisma.viewed_posts.groupBy({
        by: ['post_id'],
        where: { post_id: { in: postIds as string[] } },
        _count: true
      });

      return postIds.map(postId => {
        const result = counts.find(c => c.post_id === postId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // USER LIKED POST LOADER - Verifica likes en batch
    // ============================================
    userLikedPost: new DataLoader(
      async (keys: readonly { postId: string }[]) => {
        if (!userId) {
          return keys.map(() => false);
        }

        const postIds = keys.map(k => k.postId);

        const likes = await prisma.likes.findMany({
          where: {
            user_id: userId,
            post_id: { in: postIds }
          }
        });

        return keys.map(key =>
          likes.some(like => like.post_id === key.postId)
        );
      },
      { cacheKeyFn: (key) => `${userId}:${key.postId}` }
    ),

    // ============================================
    // USER SAVED POST LOADER
    // ============================================
    userSavedPost: new DataLoader(
      async (keys: readonly { postId: string }[]) => {
        if (!userId) {
          return keys.map(() => false);
        }

        const postIds = keys.map(k => k.postId);

        const saved = await prisma.saved_posts.findMany({
          where: {
            user_id: userId,
            post_id: { in: postIds }
          }
        });

        return keys.map(key =>
          saved.some(s => s.post_id === key.postId)
        );
      },
      { cacheKeyFn: (key) => `${userId}:${key.postId}` }
    ),

    // ============================================
    // USER VIEWED POST LOADER
    // ============================================
    userViewedPost: new DataLoader(
      async (keys: readonly { postId: string }[]) => {
        if (!userId) {
          return keys.map(() => false);
        }

        const postIds = keys.map(k => k.postId);

        const viewed = await prisma.viewed_posts.findMany({
          where: {
            user_id: userId,
            post_id: { in: postIds }
          }
        });

        return keys.map(key =>
          viewed.some(v => v.post_id === key.postId)
        );
      },
      { cacheKeyFn: (key) => `${userId}:${key.postId}` }
    ),

    // ============================================
    // FOLLOWER COUNT LOADER
    // ============================================
    followerCount: new DataLoader(async (userIds: readonly string[]) => {
      const counts = await prisma.follows.groupBy({
        by: ['followed_id'],
        where: { followed_id: { in: userIds as string[] } },
        _count: true
      });

      return userIds.map(userId => {
        const result = counts.find(c => c.followed_id === userId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // FOLLOWING COUNT LOADER
    // ============================================
    followingCount: new DataLoader(async (userIds: readonly string[]) => {
      const counts = await prisma.follows.groupBy({
        by: ['follower_id'],
        where: { follower_id: { in: userIds as string[] } },
        _count: true
      });

      return userIds.map(userId => {
        const result = counts.find(c => c.follower_id === userId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // POST COUNT LOADER
    // ============================================
    postCount: new DataLoader(async (userIds: readonly string[]) => {
      const counts = await prisma.posts.groupBy({
        by: ['user_id'],
        where: { user_id: { in: userIds as string[] } },
        _count: true
      });

      return userIds.map(userId => {
        const result = counts.find(c => c.user_id === userId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // IS FOLLOWING LOADER
    // ============================================
    isFollowing: new DataLoader(
      async (keys: readonly { followedId: string }[]) => {
        if (!userId) {
          return keys.map(() => false);
        }

        const followedIds = keys.map(k => k.followedId);

        const follows = await prisma.follows.findMany({
          where: {
            follower_id: userId,
            followed_id: { in: followedIds }
          }
        });

        return keys.map(key =>
          follows.some(f => f.followed_id === key.followedId)
        );
      },
      { cacheKeyFn: (key) => `${userId}:${key.followedId}` }
    ),

    // ============================================
    // IS FOLLOWED BY LOADER
    // ============================================
    isFollowedBy: new DataLoader(
      async (keys: readonly { followerId: string }[]) => {
        if (!userId) {
          return keys.map(() => false);
        }

        const followerIds = keys.map(k => k.followerId);

        const follows = await prisma.follows.findMany({
          where: {
            follower_id: { in: followerIds },
            followed_id: userId
          }
        });

        return keys.map(key =>
          follows.some(f => f.follower_id === key.followerId)
        );
      },
      { cacheKeyFn: (key) => `${key.followerId}:${userId}` }
    ),

    // ============================================
    // STORY VIEW COUNT LOADER
    // ============================================
    storyViewCount: new DataLoader(async (storyIds: readonly string[]) => {
      const counts = await prisma.viewed_stories.groupBy({
        by: ['story_id'],
        where: { story_id: { in: storyIds as string[] } },
        _count: true
      });

      return storyIds.map(storyId => {
        const result = counts.find(c => c.story_id === storyId);
        return result?._count || 0;
      });
    }),

    // ============================================
    // USER VIEWED STORY LOADER
    // ============================================
    userViewedStory: new DataLoader(
      async (keys: readonly { storyId: string }[]) => {
        if (!userId) {
          return keys.map(() => false);
        }

        const storyIds = keys.map(k => k.storyId);

        const viewed = await prisma.viewed_stories.findMany({
          where: {
            user_id: userId,
            story_id: { in: storyIds }
          }
        });

        return keys.map(key =>
          viewed.some(v => v.story_id === key.storyId)
        );
      },
      { cacheKeyFn: (key) => `${userId}:${key.storyId}` }
    ),

    // ============================================
    // PLACE AVERAGE RATING LOADER
    // ============================================
    placeAverageRating: new DataLoader(async (placeIds: readonly string[]) => {
      const ratings = await prisma.place_reviews.groupBy({
        by: ['place_id'],
        where: { place_id: { in: placeIds as string[] } },
        _avg: { rating: true }
      });

      return placeIds.map(placeId => {
        const result = ratings.find(r => r.place_id === placeId);
        return result?._avg.rating || null;
      });
    }),

    // ============================================
    // PLACE REVIEW COUNT LOADER
    // ============================================
    placeReviewCount: new DataLoader(async (placeIds: readonly string[]) => {
      const counts = await prisma.place_reviews.groupBy({
        by: ['place_id'],
        where: { place_id: { in: placeIds as string[] } },
        _count: true
      });

      return placeIds.map(placeId => {
        const result = counts.find(c => c.place_id === placeId);
        return result?._count || 0;
      });
    })
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
