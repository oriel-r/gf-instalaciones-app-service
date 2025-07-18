import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1749765475040 implements MigrationInterface {
  name = 'InitialSchema1749765475040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "province" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "provinceId" uuid, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "number" character varying NOT NULL, "note" character varying, "postalCode" character varying NOT NULL, "cityId" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" character varying, "title" character varying NOT NULL, "description" character varying, "endDate" TIMESTAMP WITH TIME ZONE, "completed" boolean NOT NULL DEFAULT false, "installationsFinished" character varying NOT NULL DEFAULT '0/0', "progress" numeric(5,2) NOT NULL DEFAULT '0', "notifiedInstallations" integer NOT NULL DEFAULT '0', "finishedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."installation_status_enum" AS ENUM('Pendiente', 'En proceso', 'A revisar', 'Pospuesta', 'Finalizada', 'Rechazada', 'Cancelada')`,
    );
    await queryRunner.query(
      `CREATE TABLE "installation" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" TIMESTAMP WITH TIME ZONE, "images" character varying array, "status" "public"."installation_status_enum" NOT NULL DEFAULT 'Pendiente', "notes" character varying, "endDate" TIMESTAMP WITH TIME ZONE, "startedAt" TIMESTAMP WITH TIME ZONE, "referenceId" character varying NOT NULL DEFAULT ('INS-' || left(uuid_generate_v4()::text,8)), "submittedForReviewAt" TIMESTAMP WITH TIME ZONE, "orderId" uuid NOT NULL, "addressId" uuid NOT NULL, CONSTRAINT "PK_f0cd0b17a45357b5e1da1da1680" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coordinators" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "disabledAt" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "REL_02690eedc405230d49520c0ce4" UNIQUE ("userId"), CONSTRAINT "PK_4f4d48f1f19c8f06b0bbcf395ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."installers_taxcondition_enum" AS ENUM('MONOTRIBUTISTA', 'RESPONSABLE_INSCRIPTO', 'EXENTO_EN_IVA')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."installers_status_enum" AS ENUM('EN PROCESO', 'APROBADO', 'RECHAZADO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "installers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taxCondition" "public"."installers_taxcondition_enum" NOT NULL, "queries" text, "hasPersonalAccidentInsurance" boolean NOT NULL, "canWorkAtHeight" boolean NOT NULL, "canTensionFrontAndBackLonas" boolean NOT NULL, "canInstallCorporealSigns" boolean NOT NULL, "canInstallFrostedVinyl" boolean NOT NULL, "canInstallVinylOnWallsOrGlass" boolean NOT NULL, "canDoCarWrapping" boolean NOT NULL, "hasOwnTransportation" boolean NOT NULL, "status" "public"."installers_status_enum" NOT NULL DEFAULT 'EN PROCESO', "disabledAt" TIMESTAMP, "userId" uuid NOT NULL, "coordinatorId" uuid, CONSTRAINT "REL_3c79b1940ad248ee2fbc8535c0" UNIQUE ("userId"), CONSTRAINT "PK_31b089888c1c18842aea0a0d9c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "disabledAt" TIMESTAMP, "userId" uuid, CONSTRAINT "REL_f8a889c4362d78f056960ca6da" UNIQUE ("userId"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "token" character varying(255) NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_d16bebd73e844c48bca50ff8d3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying NOT NULL, "birthDate" TIMESTAMP NOT NULL, "idNumber" character varying NOT NULL, "location" character varying NOT NULL, "address" character varying NOT NULL, "locality" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "coverage" character varying NOT NULL DEFAULT '+54', "isSubscribed" boolean NOT NULL DEFAULT true, "disabledAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "message" character varying, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "userId" uuid, "roleId" uuid, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1476ca9a6265a586f618ea918fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "mimetype" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_category" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_32b67ddf344608b5c2fb95bc90c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_post_template" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "number_of_content_blocks" integer NOT NULL, CONSTRAINT "PK_6810de73d89ac2bf41e0b6a588e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_post" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_aat" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "isHighlight" boolean NOT NULL DEFAULT true, "status" character varying NOT NULL DEFAULT 'PUBLICADO', "content" jsonb NOT NULL, "blogCategoryId" uuid, "blogPostTemplateId" uuid, CONSTRAINT "PK_694e842ad1c2b33f5939de6fede" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "client_id" ("orderId" uuid NOT NULL, "userRolesId" uuid NOT NULL, CONSTRAINT "PK_0779840e88c350a76e37cd292bc" PRIMARY KEY ("orderId", "userRolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9936bac4aa5e86b17dfe714e08" ON "client_id" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9b0cdff7840fe97bb1f3dbc62" ON "client_id" ("userRolesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "coordinator_id" ("installationId" uuid NOT NULL, "userRolesId" uuid NOT NULL, CONSTRAINT "PK_32993c5778b1099211619274f62" PRIMARY KEY ("installationId", "userRolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4309cc8a0fd8be4386e3fc760e" ON "coordinator_id" ("installationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ea49891ad15a559df35d55eef" ON "coordinator_id" ("userRolesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "installers_installations_installation" ("installersId" uuid NOT NULL, "installationId" uuid NOT NULL, CONSTRAINT "PK_c6686ae6af5a8065c1afb1faea7" PRIMARY KEY ("installersId", "installationId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c73425d8bc9d2ddf0d747a0a45" ON "installers_installations_installation" ("installersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2e21fbd4802ca625e8eeeee718" ON "installers_installations_installation" ("installationId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_receivers_user_roles" ("notificationId" uuid NOT NULL, "userRolesId" uuid NOT NULL, CONSTRAINT "PK_705548eaf9a09d6368bdecf5819" PRIMARY KEY ("notificationId", "userRolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52be36461a912e63c0ec453cbf" ON "notification_receivers_user_roles" ("notificationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2f66c8cda70fb88a7cb1505213" ON "notification_receivers_user_roles" ("userRolesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_95959bed787b5e4fd4be4e94fc5" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_3624b3085165071df70276a4000" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "installation" ADD CONSTRAINT "FK_6367c886100a5fedbd305cde6f7" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "installation" ADD CONSTRAINT "FK_f02cc2756243deffb322a1448c1" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coordinators" ADD CONSTRAINT "FK_02690eedc405230d49520c0ce49" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers" ADD CONSTRAINT "FK_3c79b1940ad248ee2fbc8535c0f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers" ADD CONSTRAINT "FK_7ea4c76da20f13c65da2cdefd76" FOREIGN KEY ("coordinatorId") REFERENCES "coordinators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin" ADD CONSTRAINT "FK_f8a889c4362d78f056960ca6dad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post" ADD CONSTRAINT "FK_2081e1b671f295acf62f0926222" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post" ADD CONSTRAINT "FK_a67e8b14d3bb2bc2a5607848022" FOREIGN KEY ("blogPostTemplateId") REFERENCES "blog_post_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_id" ADD CONSTRAINT "FK_9936bac4aa5e86b17dfe714e08b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_id" ADD CONSTRAINT "FK_c9b0cdff7840fe97bb1f3dbc627" FOREIGN KEY ("userRolesId") REFERENCES "user_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "coordinator_id" ADD CONSTRAINT "FK_4309cc8a0fd8be4386e3fc760ed" FOREIGN KEY ("installationId") REFERENCES "installation"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "coordinator_id" ADD CONSTRAINT "FK_1ea49891ad15a559df35d55eef7" FOREIGN KEY ("userRolesId") REFERENCES "user_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers_installations_installation" ADD CONSTRAINT "FK_c73425d8bc9d2ddf0d747a0a451" FOREIGN KEY ("installersId") REFERENCES "installers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers_installations_installation" ADD CONSTRAINT "FK_2e21fbd4802ca625e8eeeee7182" FOREIGN KEY ("installationId") REFERENCES "installation"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user_roles" ADD CONSTRAINT "FK_52be36461a912e63c0ec453cbfe" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user_roles" ADD CONSTRAINT "FK_2f66c8cda70fb88a7cb15052135" FOREIGN KEY ("userRolesId") REFERENCES "user_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user_roles" DROP CONSTRAINT "FK_2f66c8cda70fb88a7cb15052135"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_receivers_user_roles" DROP CONSTRAINT "FK_52be36461a912e63c0ec453cbfe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers_installations_installation" DROP CONSTRAINT "FK_2e21fbd4802ca625e8eeeee7182"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers_installations_installation" DROP CONSTRAINT "FK_c73425d8bc9d2ddf0d747a0a451"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coordinator_id" DROP CONSTRAINT "FK_1ea49891ad15a559df35d55eef7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coordinator_id" DROP CONSTRAINT "FK_4309cc8a0fd8be4386e3fc760ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_id" DROP CONSTRAINT "FK_c9b0cdff7840fe97bb1f3dbc627"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_id" DROP CONSTRAINT "FK_9936bac4aa5e86b17dfe714e08b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post" DROP CONSTRAINT "FK_a67e8b14d3bb2bc2a5607848022"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post" DROP CONSTRAINT "FK_2081e1b671f295acf62f0926222"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "FK_52ac39dd8a28730c63aeb428c9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin" DROP CONSTRAINT "FK_f8a889c4362d78f056960ca6dad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers" DROP CONSTRAINT "FK_7ea4c76da20f13c65da2cdefd76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installers" DROP CONSTRAINT "FK_3c79b1940ad248ee2fbc8535c0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coordinators" DROP CONSTRAINT "FK_02690eedc405230d49520c0ce49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installation" DROP CONSTRAINT "FK_f02cc2756243deffb322a1448c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installation" DROP CONSTRAINT "FK_6367c886100a5fedbd305cde6f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_3624b3085165071df70276a4000"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_95959bed787b5e4fd4be4e94fc5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2f66c8cda70fb88a7cb1505213"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_52be36461a912e63c0ec453cbf"`,
    );
    await queryRunner.query(`DROP TABLE "notification_receivers_user_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2e21fbd4802ca625e8eeeee718"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c73425d8bc9d2ddf0d747a0a45"`,
    );
    await queryRunner.query(
      `DROP TABLE "installers_installations_installation"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ea49891ad15a559df35d55eef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4309cc8a0fd8be4386e3fc760e"`,
    );
    await queryRunner.query(`DROP TABLE "coordinator_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9b0cdff7840fe97bb1f3dbc62"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9936bac4aa5e86b17dfe714e08"`,
    );
    await queryRunner.query(`DROP TABLE "client_id"`);
    await queryRunner.query(`DROP TABLE "blog_post"`);
    await queryRunner.query(`DROP TABLE "blog_post_template"`);
    await queryRunner.query(`DROP TABLE "blog_category"`);
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(`DROP TABLE "contact_message"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TABLE "installers"`);
    await queryRunner.query(`DROP TYPE "public"."installers_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."installers_taxcondition_enum"`,
    );
    await queryRunner.query(`DROP TABLE "coordinators"`);
    await queryRunner.query(`DROP TABLE "installation"`);
    await queryRunner.query(`DROP TYPE "public"."installation_status_enum"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "province"`);
  }
}
