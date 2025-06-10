/*
  Warnings:

  - Changed the type of `category` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET');

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "category",
ADD COLUMN     "category" "VehicleCategory" NOT NULL;
