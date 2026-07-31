-- CreateTable
CREATE TABLE "public"."NotificationTemplate" (
    "id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "templatePath" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InAppNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "metadata" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InAppNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate_type_key" ON "public"."NotificationTemplate"("type");

-- CreateIndex
CREATE INDEX "NotificationTemplate_type_idx" ON "public"."NotificationTemplate"("type");

-- CreateIndex
CREATE INDEX "InAppNotification_userId_idx" ON "public"."InAppNotification"("userId");

-- CreateIndex
CREATE INDEX "InAppNotification_read_idx" ON "public"."InAppNotification"("read");
