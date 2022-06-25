-- CreateTable
CREATE TABLE "Picture" (
    "date" TIMESTAMP(3) NOT NULL,
    "originalImgUrl" TEXT NOT NULL,
    "galleryImgUrl" TEXT,
    "thumbnailImgUrl" TEXT,
    "source" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("originalImgUrl")
);
