/*
  Warnings:

  - You are about to alter the column `rating` on the `place_reviews` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(2,1)`.
  - You are about to drop the column `open` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `media_url` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `posts` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `recipe_ingredients` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(10,2)`.
  - The `difficulty` column on the `recipes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `registered_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `chat_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_saved_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_viewed_posts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[post_id]` on the table `recipes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `created_at` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `contacts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `direct_messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `followed_at` on table `follows` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `place_reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `place_reviews` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `location` to the `places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_type` to the `places` table without a default value. This is not possible if the table is not empty.
  - Made the column `media_type` on table `post_media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `post_media` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `post_type` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `post_id` to the `recipes` table without a default value. This is not possible if the table is not empty.
  - Made the column `steps` on table `recipes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_private` on table `user_settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `language` on table `user_settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notify_likes` on table `user_settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notify_comments` on table `user_settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notify_follows` on table `user_settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `theme` on table `user_settings` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PERSON', 'RESTAURANT', 'BAR');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('PHOTO', 'VIDEO', 'TEXT', 'RECIPE');

-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('TRENDING', 'ITALIAN', 'MEXICAN', 'JAPANESE', 'CHINESE', 'DESSERTS', 'VEGAN', 'QUICK_EASY', 'BURGER', 'SEAFOOD', 'COCKTAILS', 'BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS', 'HEALTHY', 'COMFORT_FOOD', 'STREET_FOOD');

-- CreateEnum
CREATE TYPE "PlaceFilter" AS ENUM ('BURGER', 'SEAFOOD', 'ITALIAN', 'MEXICAN', 'CHINESE', 'JAPANESE', 'COCKTAIL', 'WINE', 'HAPPY_HOUR', 'NIGHTLIFE');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_followed_id_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "group_messages" DROP CONSTRAINT "group_messages_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_messages" DROP CONSTRAINT "group_messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "group_users" DROP CONSTRAINT "group_users_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_users" DROP CONSTRAINT "group_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "place_reviews" DROP CONSTRAINT "place_reviews_place_id_fkey";

-- DropForeignKey
ALTER TABLE "place_reviews" DROP CONSTRAINT "place_reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_media" DROP CONSTRAINT "post_media_post_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_id_fkey";

-- DropForeignKey
ALTER TABLE "user_saved_posts" DROP CONSTRAINT "user_saved_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "user_saved_posts" DROP CONSTRAINT "user_saved_posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_viewed_posts" DROP CONSTRAINT "user_viewed_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "user_viewed_posts" DROP CONSTRAINT "user_viewed_posts_user_id_fkey";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "direct_messages" ADD COLUMN     "media_url" TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "read_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "follows" ALTER COLUMN "followed_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "place_reviews" ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "photo_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "places" DROP COLUMN "open",
DROP COLUMN "rating",
DROP COLUMN "tags",
DROP COLUMN "type",
ADD COLUMN     "filters" "PlaceFilter"[],
ADD COLUMN     "is_open" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "place_type" "UserType" NOT NULL,
ADD COLUMN     "specialty" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "media_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "post_media" ALTER COLUMN "media_type" SET NOT NULL,
ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "content",
DROP COLUMN "media_url",
DROP COLUMN "type",
ADD COLUMN     "categories" "PostCategory"[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "post_type" "PostType" NOT NULL,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "recipe_ingredients" ADD COLUMN     "notes" TEXT,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "estimated_cost" DECIMAL(10,2),
ADD COLUMN     "post_id" UUID NOT NULL,
ADD COLUMN     "servings" INTEGER,
ALTER COLUMN "steps" SET NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "DifficultyLevel";

-- AlterTable
ALTER TABLE "user_settings" ALTER COLUMN "is_private" SET NOT NULL,
ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "notify_likes" SET NOT NULL,
ALTER COLUMN "notify_comments" SET NOT NULL,
ALTER COLUMN "notify_follows" SET NOT NULL,
ALTER COLUMN "theme" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bio",
DROP COLUMN "birth_date",
DROP COLUMN "location",
DROP COLUMN "photo_url",
DROP COLUMN "registered_at",
DROP COLUMN "username",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'PERSON',
ALTER COLUMN "updated_at" SET NOT NULL;

-- DropTable
DROP TABLE "chat_groups";

-- DropTable
DROP TABLE "group_members";

-- DropTable
DROP TABLE "group_messages";

-- DropTable
DROP TABLE "group_users";

-- DropTable
DROP TABLE "groups";

-- DropTable
DROP TABLE "user_saved_posts";

-- DropTable
DROP TABLE "user_viewed_posts";

-- CreateTable
CREATE TABLE "person_profiles" (
    "user_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT,
    "photo_url" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "birth_date" DATE NOT NULL,

    CONSTRAINT "person_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "business_profiles" (
    "user_id" UUID NOT NULL,
    "business_name" TEXT NOT NULL,
    "photo_url" TEXT,
    "bio" TEXT,
    "location" TEXT NOT NULL,
    "specialty" TEXT,
    "phone" TEXT,
    "website" TEXT,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "story_type" "StoryType" NOT NULL,
    "media_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewed_stories" (
    "user_id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viewed_stories_pkey" PRIMARY KEY ("user_id","story_id")
);

-- CreateTable
CREATE TABLE "saved_posts" (
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "saved_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_posts_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "viewed_posts" (
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viewed_posts_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "allergens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "allergens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergen_ingredients" (
    "allergen_id" UUID NOT NULL,
    "ingredient_id" UUID NOT NULL,

    CONSTRAINT "allergen_ingredients_pkey" PRIMARY KEY ("allergen_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "user_allergies" (
    "user_id" UUID NOT NULL,
    "allergen_id" UUID NOT NULL,

    CONSTRAINT "user_allergies_pkey" PRIMARY KEY ("user_id","allergen_id")
);

-- CreateTable
CREATE TABLE "preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" UUID NOT NULL,
    "preference_id" UUID NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id","preference_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_profiles_username_key" ON "person_profiles"("username");

-- CreateIndex
CREATE INDEX "person_profiles_username_idx" ON "person_profiles"("username");

-- CreateIndex
CREATE INDEX "person_profiles_location_idx" ON "person_profiles"("location");

-- CreateIndex
CREATE INDEX "business_profiles_business_name_idx" ON "business_profiles"("business_name");

-- CreateIndex
CREATE INDEX "business_profiles_location_idx" ON "business_profiles"("location");

-- CreateIndex
CREATE INDEX "stories_user_id_idx" ON "stories"("user_id");

-- CreateIndex
CREATE INDEX "stories_expires_at_idx" ON "stories"("expires_at");

-- CreateIndex
CREATE INDEX "stories_created_at_idx" ON "stories"("created_at" DESC);

-- CreateIndex
CREATE INDEX "viewed_stories_user_id_idx" ON "viewed_stories"("user_id");

-- CreateIndex
CREATE INDEX "viewed_stories_story_id_idx" ON "viewed_stories"("story_id");

-- CreateIndex
CREATE INDEX "saved_posts_user_id_idx" ON "saved_posts"("user_id");

-- CreateIndex
CREATE INDEX "viewed_posts_user_id_idx" ON "viewed_posts"("user_id");

-- CreateIndex
CREATE INDEX "viewed_posts_post_id_idx" ON "viewed_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "allergens_name_key" ON "allergens"("name");

-- CreateIndex
CREATE INDEX "allergens_name_idx" ON "allergens"("name");

-- CreateIndex
CREATE INDEX "user_allergies_user_id_idx" ON "user_allergies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "preferences_name_key" ON "preferences"("name");

-- CreateIndex
CREATE INDEX "preferences_name_idx" ON "preferences"("name");

-- CreateIndex
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "comments"("created_at" DESC);

-- CreateIndex
CREATE INDEX "direct_messages_created_at_idx" ON "direct_messages"("created_at" DESC);

-- CreateIndex
CREATE INDEX "follows_follower_id_idx" ON "follows"("follower_id");

-- CreateIndex
CREATE INDEX "follows_followed_id_idx" ON "follows"("followed_id");

-- CreateIndex
CREATE INDEX "follows_followed_at_idx" ON "follows"("followed_at");

-- CreateIndex
CREATE INDEX "ingredients_name_idx" ON "ingredients"("name");

-- CreateIndex
CREATE INDEX "likes_post_id_idx" ON "likes"("post_id");

-- CreateIndex
CREATE INDEX "place_reviews_place_id_idx" ON "place_reviews"("place_id");

-- CreateIndex
CREATE INDEX "place_reviews_rating_idx" ON "place_reviews"("rating");

-- CreateIndex
CREATE INDEX "places_place_type_idx" ON "places"("place_type");

-- CreateIndex
CREATE INDEX "places_location_idx" ON "places"("location");

-- CreateIndex
CREATE INDEX "places_filters_idx" ON "places"("filters");

-- CreateIndex
CREATE INDEX "post_media_post_id_idx" ON "post_media"("post_id");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "posts_post_type_idx" ON "posts"("post_type");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at" DESC);

-- CreateIndex
CREATE INDEX "posts_categories_idx" ON "posts"("categories");

-- CreateIndex
CREATE INDEX "recipe_ingredients_recipe_id_idx" ON "recipe_ingredients"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_post_id_key" ON "recipes"("post_id");

-- CreateIndex
CREATE INDEX "recipes_difficulty_idx" ON "recipes"("difficulty");

-- CreateIndex
CREATE INDEX "recipes_time_required_idx" ON "recipes"("time_required");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_user_type_idx" ON "users"("user_type");

-- AddForeignKey
ALTER TABLE "person_profiles" ADD CONSTRAINT "person_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewed_stories" ADD CONSTRAINT "viewed_stories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewed_stories" ADD CONSTRAINT "viewed_stories_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewed_posts" ADD CONSTRAINT "viewed_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewed_posts" ADD CONSTRAINT "viewed_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_reviews" ADD CONSTRAINT "place_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_reviews" ADD CONSTRAINT "place_reviews_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergen_ingredients" ADD CONSTRAINT "allergen_ingredients_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "allergens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergen_ingredients" ADD CONSTRAINT "allergen_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_allergies" ADD CONSTRAINT "user_allergies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_allergies" ADD CONSTRAINT "user_allergies_allergen_id_fkey" FOREIGN KEY ("allergen_id") REFERENCES "allergens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_preference_id_fkey" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
