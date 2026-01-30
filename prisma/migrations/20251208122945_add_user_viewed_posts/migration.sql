-- CreateTable
CREATE TABLE "user_viewed_posts" (
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_viewed_posts_pkey" PRIMARY KEY ("user_id","post_id")
);

-- AddForeignKey
ALTER TABLE "user_viewed_posts" ADD CONSTRAINT "user_viewed_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_viewed_posts" ADD CONSTRAINT "user_viewed_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
