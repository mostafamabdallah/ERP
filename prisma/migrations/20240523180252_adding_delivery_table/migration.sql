-- CreateTable
CREATE TABLE "DeliveryMan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DeliveryMan_pkey" PRIMARY KEY ("id")
);
