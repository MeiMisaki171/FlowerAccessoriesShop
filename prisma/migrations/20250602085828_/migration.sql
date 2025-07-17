/*
  Warnings:

  - You are about to drop the `AppUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DBHC` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Cart] DROP CONSTRAINT [Cart_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DBHC] DROP CONSTRAINT [DBHC_MA_CHA_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [Order_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Category] ADD [parentId] INT;

-- AlterTable
ALTER TABLE [dbo].[Order] ADD [discount] FLOAT(53),
[shippingFee] FLOAT(53) NOT NULL CONSTRAINT [Order_shippingFee_df] DEFAULT 0,
[voucher] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Product] ADD [discount] FLOAT(53) CONSTRAINT [Product_discount_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[ProductImage] ADD [isCover] BIT NOT NULL CONSTRAINT [ProductImage_isCover_df] DEFAULT 0;

-- DropTable
DROP TABLE [dbo].[AppUser];

-- DropTable
DROP TABLE [dbo].[DBHC];

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [phone] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [provider] NVARCHAR(1000) NOT NULL CONSTRAINT [User_provider_df] DEFAULT 'local',
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'USER',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_phone_key] UNIQUE NONCLUSTERED ([phone]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Voucher] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [discount] FLOAT(53) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Voucher_isActive_df] DEFAULT 1,
    [validUntil] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Voucher_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Voucher_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Voucher_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[dbhc] (
    [ID] INT NOT NULL,
    [MA_DBHC] NVARCHAR(10) NOT NULL,
    [MA_CHA] NVARCHAR(10),
    [TEN] NVARCHAR(200),
    [TINH_TRANG] CHAR(1) CONSTRAINT [DF__dbhc__TINH_TRANG__2CBDA3B5] DEFAULT '1',
    CONSTRAINT [PK__dbhc__3214EC27F336CA56] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Category] ADD CONSTRAINT [Category_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[Category]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Cart] ADD CONSTRAINT [Cart_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
