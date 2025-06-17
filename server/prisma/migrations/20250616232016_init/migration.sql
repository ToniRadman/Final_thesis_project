/*
  Warnings:

  - You are about to alter the column `total` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `SaleItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "SaleItem" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- u SQL migraciji:
ALTER TABLE "Inventory"
ADD CONSTRAINT check_either_car_or_part
CHECK (
  ("carId" IS NOT NULL AND "partId" IS NULL)
  OR
  ("carId" IS NULL AND "partId" IS NOT NULL)
);