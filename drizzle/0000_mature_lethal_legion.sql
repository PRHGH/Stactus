CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated" timestamp DEFAULT now() NOT NULL
);
