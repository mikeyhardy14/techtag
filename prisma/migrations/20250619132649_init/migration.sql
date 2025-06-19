-- CreateTable
CREATE TABLE "code_rules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "characters" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "manufacture" TEXT NOT NULL
);
