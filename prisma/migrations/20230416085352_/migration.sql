-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "pfp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileLink" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "profileLink" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "pfp" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userKey" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pfp" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userKey_key" ON "User"("userKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
