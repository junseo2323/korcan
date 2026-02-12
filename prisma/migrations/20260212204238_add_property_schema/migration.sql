-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "period" TEXT NOT NULL DEFAULT 'MONTHLY',
    "type" TEXT NOT NULL DEFAULT 'RENT',
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" REAL NOT NULL DEFAULT 0.0,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "region" TEXT NOT NULL,
    "features" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Like" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT,
    "productId" TEXT,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT,
    CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("id", "postId", "productId", "userId") SELECT "id", "postId", "productId", "userId" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");
CREATE UNIQUE INDEX "Like_userId_productId_key" ON "Like"("userId", "productId");
CREATE UNIQUE INDEX "Like_userId_propertyId_key" ON "Like"("userId", "propertyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
