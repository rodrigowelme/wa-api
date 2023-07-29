-- CreateTable
CREATE TABLE "Chat" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" TEXT NOT NULL,
    "messages" JSONB,
    "newJid" TEXT,
    "oldJid" TEXT,
    "lastMsgTimestamp" BIGINT,
    "lastMessageRecvTimestamp" INTEGER,
    "unreadCount" INTEGER,
    "readOnly" BOOLEAN,
    "endOfHistoryTransfer" BOOLEAN,
    "ephemeralExpiration" INTEGER,
    "ephemeralSettingTimestamp" BIGINT,
    "endOfHistoryTransferType" INTEGER,
    "conversationTimestamp" BIGINT,
    "name" TEXT,
    "pHash" TEXT,
    "notSpam" BOOLEAN,
    "archived" BOOLEAN,
    "disappearingMode" JSONB,
    "unreadMentionCount" INTEGER,
    "markedAsUnread" BOOLEAN,
    "participant" JSONB,
    "tcToken" BYTEA,
    "tcTokenTimestamp" BIGINT,
    "contactPrimaryIdentityKey" BYTEA,
    "pinned" INTEGER,
    "muteEndTime" BIGINT,
    "wallpaper" JSONB,
    "mediaVisibility" TEXT,
    "tcTokenSenderTimestamp" BIGINT,
    "suspended" BOOLEAN,
    "terminated" BOOLEAN,
    "createdAt" BIGINT,
    "createdBy" TEXT,
    "description" TEXT,
    "support" BOOLEAN,
    "isParentGroup" BOOLEAN,
    "parentGroupId" TEXT,
    "isDefaultSubgroup" BOOLEAN,
    "displayName" TEXT,
    "pnJid" TEXT,
    "shareOwnPn" BOOLEAN,
    "pnhDuplicateLidThread" BOOLEAN,
    "lidJid" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "Contact" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(128) NOT NULL,
    "name" VARCHAR(128),
    "notify" VARCHAR(128),
    "verifiedName" VARCHAR(128),
    "imgUrl" VARCHAR(128),
    "status" VARCHAR(128),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "Group" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(128) NOT NULL,
    "owner" TEXT,
    "subject" TEXT NOT NULL,
    "subjectOwner" TEXT,
    "subjectTime" BIGINT,
    "creation" BIGINT,
    "desc" TEXT,
    "descOwner" TEXT,
    "descId" TEXT,
    "restrict" BOOLEAN,
    "announce" BOOLEAN,
    "size" INTEGER,
    "participants" JSONB NOT NULL,
    "ephemeralDuration" INTEGER,
    "inviteCode" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "Message" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(128) NOT NULL,
    "remoteJid" VARCHAR(128) NOT NULL,
    "key" JSONB NOT NULL,
    "message" JSONB,
    "messageTimestamp" BIGINT,
    "status" INTEGER,
    "participant" TEXT,
    "messageC2STimestamp" BIGINT,
    "ignore" BOOLEAN,
    "starred" BOOLEAN,
    "broadcast" BOOLEAN,
    "pushName" TEXT,
    "mediaCiphertextSha256" BYTEA,
    "multicast" BOOLEAN,
    "urlText" BOOLEAN,
    "urlNumber" BOOLEAN,
    "messageStubType" INTEGER,
    "clearMedia" BOOLEAN,
    "messageStubParameters" JSONB,
    "duration" INTEGER,
    "labels" JSONB,
    "paymentInfo" JSONB,
    "finalLiveLocation" JSONB,
    "quotedPaymentInfo" JSONB,
    "ephemeralStartTimestamp" BIGINT,
    "ephemeralDuration" INTEGER,
    "ephemeralOffToOn" BOOLEAN,
    "ephemeralOutOfSync" BOOLEAN,
    "bizPrivacyStatus" JSONB,
    "verifiedBizName" TEXT,
    "mediaData" JSONB,
    "photoChange" JSONB,
    "userReceipt" JSONB,
    "reactions" JSONB,
    "quotedStickerData" JSONB,
    "futureproofData" BYTEA,
    "statusPsa" JSONB,
    "pollUpdates" JSONB,
    "pollAdditionalMetadata" JSONB,
    "agentId" TEXT,
    "statusAlreadyViewed" BOOLEAN,
    "messageSecret" BYTEA,
    "keepInChat" JSONB,
    "originalSelfAuthorUserJidString" TEXT,
    "revokeMessageTimestamp" BIGINT,
    "pinInChat" JSONB,
    "futureproofMessageSecretMessage" JSONB,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("pkId")
);

-- CreateTable
CREATE TABLE "Session" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("pkId")
);

-- CreateIndex
CREATE INDEX "Chat_sessionId_idx" ON "Chat"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_per_session_id_chat" ON "Chat"("sessionId", "id");

-- CreateIndex
CREATE INDEX "Contact_sessionId_idx" ON "Contact"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_per_session_id_contact" ON "Contact"("sessionId", "id");

-- CreateIndex
CREATE INDEX "Group_sessionId_idx" ON "Group"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_per_session_id_group" ON "Group"("sessionId", "id");

-- CreateIndex
CREATE INDEX "Message_sessionId_idx" ON "Message"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_message_key_per_session_id" ON "Message"("sessionId", "remoteJid", "id");

-- CreateIndex
CREATE INDEX "Session_sessionId_id_idx" ON "Session"("sessionId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_id_per_session_id_session" ON "Session"("sessionId", "id");
