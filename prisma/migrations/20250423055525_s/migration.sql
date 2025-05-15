/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Cart] DROP CONSTRAINT [Cart_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [Order_userId_fkey];

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[AppUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [phone] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [fullName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [provider] NVARCHAR(1000) NOT NULL CONSTRAINT [AppUser_provider_df] DEFAULT 'local',
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [AppUser_role_df] DEFAULT 'USER',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppUser_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [AppUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppUser_phone_key] UNIQUE NONCLUSTERED ([phone]),
    CONSTRAINT [AppUser_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[DBHC] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [MA_DBHC] CHAR(10) NOT NULL,
    [MA_CHA] CHAR(10),
    [TEN] NVARCHAR(255) NOT NULL,
    [TINH_TRANG] BIT NOT NULL CONSTRAINT [DBHC_TINH_TRANG_df] DEFAULT 1,
    CONSTRAINT [DBHC_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [DBHC_MA_DBHC_key] UNIQUE NONCLUSTERED ([MA_DBHC])
);

-- AddForeignKey
ALTER TABLE [dbo].[Cart] ADD CONSTRAINT [Cart_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[AppUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[AppUser]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DBHC] ADD CONSTRAINT [DBHC_MA_CHA_fkey] FOREIGN KEY ([MA_CHA]) REFERENCES [dbo].[DBHC]([MA_DBHC]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
