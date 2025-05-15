/*
  Warnings:

  - You are about to drop the column `account` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_role_df];
ALTER TABLE [dbo].[User] ALTER COLUMN [email] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [password] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[User] DROP COLUMN [account],
[name];
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_role_df] DEFAULT 'USER' FOR [role];
ALTER TABLE [dbo].[User] ADD [fullName] NVARCHAR(1000) NOT NULL,
[phone] NVARCHAR(1000) NOT NULL,
[provider] NVARCHAR(1000) NOT NULL CONSTRAINT [User_provider_df] DEFAULT 'local',
[username] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_phone_key] UNIQUE NONCLUSTERED ([phone]);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
