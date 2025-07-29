import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1753772846205 implements MigrationInterface {
    name = 'InitialSchema1753772846205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(50) NOT NULL, "googleId" character varying, "name" character varying(100), "picture" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "is_new_item_at_bottom" boolean NOT NULL, "is_display_rich" boolean NOT NULL, "is_checked_item_at_bottom" boolean NOT NULL, "is_dark_theme" boolean NOT NULL, "is_sharing" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notes" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "title" character varying(100) NOT NULL, "description" text NOT NULL, "bg_color" text, "bg_image" text, "is_archived" boolean NOT NULL, "archived_at" TIMESTAMP WITH TIME ZONE, "is_edited" boolean NOT NULL, "edited_at" TIMESTAMP WITH TIME ZONE, "is_reminder" boolean NOT NULL, "reminder_at" TIMESTAMP WITH TIME ZONE, "latitude" double precision, "longitude" double precision, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "storage" ("id" SERIAL NOT NULL, "ref_id" integer NOT NULL, "type" character varying(10) NOT NULL, "url" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "labels" ("id" SERIAL NOT NULL, "notes_id" integer NOT NULL, "description" character varying(50) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c0c4e97f76f1f3a268c7a70b925" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "labels"`);
        await queryRunner.query(`DROP TABLE "storage"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
