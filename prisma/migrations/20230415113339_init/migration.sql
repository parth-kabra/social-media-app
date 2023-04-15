-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "pfp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileLink" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "profileLink" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "pfp" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userKey" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pfp" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userKey_key" ON "User"("userKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
