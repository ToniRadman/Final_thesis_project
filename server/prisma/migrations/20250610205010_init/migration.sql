/*
  Warnings:

  - You are about to drop the column `group` on the `Part` table. All the data in the column will be lost.
  - Added the required column `category` to the `Part` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Part" DROP COLUMN "group",
ADD COLUMN     "category" "VehicleCategory" NOT NULL;
