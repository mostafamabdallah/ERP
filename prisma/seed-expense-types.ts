import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialTypes = [
  { nameAr: "اجور", nameEn: "Salaries" },
  { nameAr: "بنزين", nameEn: "Gasoline" },
  { nameAr: "دعاية", nameEn: "Advertising" },
  { nameAr: "تصليح", nameEn: "Maintenance" },
  { nameAr: "رأس مال", nameEn: "Capital" },
  { nameAr: "أخرى", nameEn: "Other" },
];

async function main() {
  console.log("Seeding expense types...");
  for (const type of initialTypes) {
    const existing = await prisma.expenseType.findFirst({
      where: { nameAr: type.nameAr },
    });
    if (!existing) {
      await prisma.expenseType.create({ data: type });
      console.log(`  Created: ${type.nameAr} / ${type.nameEn}`);
    } else {
      console.log(`  Already exists: ${type.nameAr}`);
    }
  }
  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
