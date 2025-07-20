CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"price" text NOT NULL,
	"image" text NOT NULL,
	"buy_url" text NOT NULL,
	"view_url" text NOT NULL,
	"category" text NOT NULL,
	"sub_category" text,
	"brand" text,
	"featured" boolean DEFAULT false,
	"carousel" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
