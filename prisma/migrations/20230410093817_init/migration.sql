-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "pfp" TEXT NOT NULL,
    "key" TEXT NOT NULL
);
