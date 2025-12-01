-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "follower_id" UUID NOT NULL,
    "followed_id" UUID NOT NULL,
    "followed_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id","followed_id")
);

-- CreateTable
CREATE TABLE "group_users" (
    "group_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_users_pkey" PRIMARY KEY ("group_id","user_id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "place_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "place_id" UUID NOT NULL,
    "rating" DECIMAL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "geolocation" point,
    "rating" DECIMAL,
    "open" BOOLEAN,
    "type" TEXT,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_type" TEXT,
    "position" INTEGER DEFAULT 0,

    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "media_url" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "recipe_id" UUID NOT NULL,
    "ingredient_id" UUID NOT NULL,
    "quantity" DECIMAL NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("recipe_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT,
    "difficulty" TEXT,
    "time_required" INTEGER,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_saved_posts" (
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,

    CONSTRAINT "user_saved_posts_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "user_id" UUID NOT NULL,
    "is_private" BOOLEAN DEFAULT false,
    "language" TEXT DEFAULT 'es',
    "notify_likes" BOOLEAN DEFAULT true,
    "notify_comments" BOOLEAN DEFAULT true,
    "notify_follows" BOOLEAN DEFAULT true,
    "theme" TEXT DEFAULT 'light',

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "photo_url" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "birth_date" DATE NOT NULL,
    "registered_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "group_users" ADD CONSTRAINT "group_users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "group_users" ADD CONSTRAINT "group_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "place_reviews" ADD CONSTRAINT "place_reviews_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "place_reviews" ADD CONSTRAINT "place_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_id_fkey" FOREIGN KEY ("id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_saved_posts" ADD CONSTRAINT "user_saved_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_saved_posts" ADD CONSTRAINT "user_saved_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
