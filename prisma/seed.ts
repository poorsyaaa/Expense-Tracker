import { PrismaClient, Prisma, User, SettingsDefaults } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { faker } from "@faker-js/faker";
import minimist from "minimist";

// Initialize Prisma Client
const prisma = new PrismaClient();

const { SEEDING_USERNAME, SEEDING_PASSWORD = "test12345" } = process.env;

// Helper function to parse command-line arguments
function parseArguments() {
  const args = minimist(process.argv.slice(2), {
    alias: {
      cg: "categoryGroups",
      c: "categories",
      t: "tags",
      e: "expenses",
      r: "reset",
    },
    default: {
      categoryGroups: 3,
      categories: 5,
      tags: 5,
      expenses: 10,
      reset: false,
    },
  });

  return {
    categoryGroups: Number(args.categoryGroups),
    categories: Number(args.categories),
    tags: Number(args.tags),
    expenses: Number(args.expenses),
    reset: Boolean(args.reset),
  };
}

// Function to reset all data in the database
async function resetData(tx: Prisma.TransactionClient): Promise<void> {
  console.log("[INFO] Resetting all data...");
  await tx.expenseNote.deleteMany({});
  await tx.expense.deleteMany({});
  await tx.tag.deleteMany({});
  await tx.monthlyIncome.deleteMany({});
  await tx.monthlyBudget.deleteMany({});
  await tx.category.deleteMany({});
  await tx.categoryGroup.deleteMany({});
  await tx.settingsDefaults.deleteMany({});
  await tx.session.deleteMany({});
  await tx.user.deleteMany({});
  console.log("[INFO] Database reset completed successfully.");
}

// Function to create a single user with associated data
async function createUser(tx: Prisma.TransactionClient): Promise<User> {
  const passwordHash = await hash(SEEDING_PASSWORD, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const user = await tx.user.create({
    data: {
      username:
        SEEDING_USERNAME ??
        faker.internet.userName().replace(/[^a-zA-Z0-9]/g, ""),
      displayName: faker.person.fullName(),
      email: faker.internet.exampleEmail(),
      isEmailVerified: false,
      passwordHash,
      avatarUrl: faker.image.avatar(),
    },
  });

  console.log(
    `[INFO] User created - Username: ${user.username}, Email: ${user.email}`,
  );
  return user;
}

// Function to create SettingsDefaults for a given user
async function createSettings(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<SettingsDefaults> {
  const defaultBudget = Number(
    faker.finance.amount({ min: 30000, max: 40000, dec: 2 }),
  );
  const defaultIncome = Number(
    faker.finance.amount({ min: 40001, max: 80000, dec: 2 }),
  );

  const settings = await tx.settingsDefaults.create({
    data: {
      userId,
      defaultBudget,
      defaultIncome,
      currency: "PHP",
      locale: "en-US",
      timeZone: "UTC",
      dateFormat: "MM/DD/YYYY",
      defaultPaymentMethod: "DIGITAL_BANK",
    },
  });

  console.log(
    `[INFO] SettingsDefaults created for User ID: ${userId} | Default Budget: ${settings.defaultBudget}, Default Income: ${settings.defaultIncome}`,
  );
  return settings;
}

// Function to create multiple category groups for a user
async function createCategoryGroups(
  tx: Prisma.TransactionClient,
  userId: string,
  count: number = 3,
): Promise<void> {
  for (let i = 0; i < count; i++) {
    await tx.categoryGroup.create({
      data: {
        userId,
        name: faker.commerce.department(),
      },
    });
  }
  console.log(`[INFO] ${count} Category Groups created for User ID: ${userId}`);
}

// Function to create multiple categories for a given user and category group
async function createCategories(
  tx: Prisma.TransactionClient,
  userId: string,
  count: number = 5,
): Promise<void> {
  const categoryGroups = await tx.categoryGroup.findMany({
    where: { userId },
  });

  if (categoryGroups.length === 0) {
    console.warn(
      `[WARN] No category groups found for User ID: ${userId}. Skipping creation of Categories.`,
    );
    return;
  }

  const createdCategoryNames = new Set<string>();
  const categoriesData: Prisma.CategoryCreateManyInput[] = [];

  while (categoriesData.length < count) {
    let categoryName = faker.commerce.product();

    while (createdCategoryNames.has(categoryName)) {
      categoryName = faker.commerce.product();
    }

    const randomCategoryGroup = faker.helpers.arrayElement(categoryGroups);

    categoriesData.push({
      userId,
      name: categoryName,
      icon: faker.internet.emoji(),
      color: faker.color.rgb({ format: "hex" }),
      categoryGroupId: randomCategoryGroup.id,
    });

    createdCategoryNames.add(categoryName);
  }

  await tx.category.createMany({
    data: categoriesData,
    skipDuplicates: true,
  });

  console.log(
    `[INFO] Successfully created ${categoriesData.length} unique categories for User ID: ${userId}.`,
  );
}

// Function to create multiple tags for a given user
async function createTags(
  tx: Prisma.TransactionClient,
  userId: string,
  count: number = 5,
): Promise<void> {
  const createdTagNames = new Set<string>();
  const tagsData: Prisma.TagCreateManyInput[] = [];

  while (tagsData.length < count) {
    let tagName = faker.word.noun({ length: { min: 3, max: 10 } });

    while (createdTagNames.has(tagName)) {
      tagName = faker.word.noun({ length: { min: 3, max: 10 } });
    }

    tagsData.push({
      name: tagName,
      userId,
    });

    createdTagNames.add(tagName);
  }

  await tx.tag.createMany({
    data: tagsData,
    skipDuplicates: true,
  });

  console.log(
    `[INFO] Successfully created ${tagsData.length} unique tags for User ID: ${userId}.`,
  );
}

// Function to create monthly budgets for the last 12 months
async function createMonthlyBudgets(
  tx: Prisma.TransactionClient,
  userId: string,
  defaultBudget: number,
): Promise<void> {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  for (let i = 0; i < 12; i++) {
    await tx.monthlyBudget.upsert({
      where: {
        userId_month_year: {
          userId,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
      },
      update: {
        amount: Number(
          faker.finance.amount({ min: 29999, max: defaultBudget, dec: 2 }),
        ),
      },
      create: {
        amount: Number(
          faker.finance.amount({ min: 29999, max: defaultBudget, dec: 2 }),
        ),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        userId,
      },
    });

    date.setMonth(date.getMonth() - 1);
  }

  console.log(`[INFO] Monthly Budgets created for User ID: ${userId}`);
}

// Function to create monthly incomes for the last 12 months
async function createMonthlyIncomes(
  tx: Prisma.TransactionClient,
  userId: string,
  defaultIncome: number,
): Promise<void> {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  for (let i = 0; i < 12; i++) {
    await tx.monthlyIncome.upsert({
      where: {
        userId_month_year: {
          userId,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
      },
      update: {
        amount: Number(
          faker.finance.amount({ min: 40000, max: defaultIncome, dec: 2 }),
        ),
      },
      create: {
        amount: Number(
          faker.finance.amount({ min: 40000, max: defaultIncome, dec: 2 }),
        ),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        userId,
      },
    });

    date.setMonth(date.getMonth() - 1);
  }

  console.log(`[INFO] Monthly Incomes created for User ID: ${userId}`);
}

// Function to generate a random date within the last 12 months
const getRandomDateWithinLast12Months = (): Date => {
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setMonth(currentDate.getMonth() - 11);

  if (currentDate.getMonth() < 11) {
    pastDate.setFullYear(currentDate.getFullYear() - 1);
  }

  const startTimestamp = pastDate.getTime();
  const endTimestamp = currentDate.getTime();

  const randomTimestamp = faker.number.int({
    min: startTimestamp,
    max: endTimestamp,
  });

  return new Date(randomTimestamp);
};

// Function to create expenses and associated notes for a given user
async function createExpenses(
  tx: Prisma.TransactionClient,
  userId: string,
  expenseCount: number,
): Promise<void> {
  const categories = await tx.category.findMany({ where: { userId } });
  const tags = await tx.tag.findMany({ where: { userId } });

  if (categories.length === 0) {
    console.warn(
      `[WARN] No categories found for User ID: ${userId}. Skipping creation of Expenses.`,
    );
    return;
  }

  if (tags.length === 0) {
    console.warn(
      `[WARN] No tags found for User ID: ${userId}. Skipping creation of Expenses.`,
    );
    return;
  }

  for (let i = 0; i < expenseCount; i++) {
    const startDate = getRandomDateWithinLast12Months();
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 28);

    const randomCategory = faker.helpers.arrayElement(categories);
    const randomTags = faker.helpers.arrayElements(
      tags,
      faker.number.int({ min: 1, max: 3 }),
    );

    await tx.expense.create({
      data: {
        description: faker.lorem.sentence(),
        amount: Number(faker.finance.amount({ min: 1000, max: 10000, dec: 2 })),
        type: faker.helpers.arrayElement(["ONE_TIME", "RECURRING", "TRANSFER"]),
        paymentMethod: faker.helpers.arrayElement([
          "CREDIT_CARD",
          "DEBIT_CARD",
          "CASH",
          "BANK_TRANSFER",
          "DIGITAL_BANK",
          "SAVINGS",
          "OTHER",
        ]),
        categoryId: randomCategory.id,
        userId,
        startDate,
        dueDate,
        isPaid: faker.datatype.boolean(),
        tags: { connect: randomTags.map((tag) => ({ id: tag.id })) },
        expenseNote: faker.datatype.boolean()
          ? { create: { note: faker.lorem.sentence() } }
          : undefined,
      },
    });
  }

  console.log(`[INFO] ${expenseCount} Expenses created for User ID: ${userId}`);
}

// Main seeding function
async function main() {
  try {
    const {
      categories: categoryCount,
      categoryGroups: categoryGroupCount,
      tags: tagCount,
      expenses: expenseCount,
      reset,
    } = parseArguments();

    if (reset) {
      await prisma.$transaction(async (tx) => await resetData(tx), {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    }

    await prisma.$transaction(
      async (tx) => {
        const user = await createUser(tx);
        const settings = await createSettings(tx, user.id);
        await createCategoryGroups(tx, user.id, categoryGroupCount);
        await createCategories(tx, user.id, categoryCount);
        await createTags(tx, user.id, tagCount);
        await createMonthlyBudgets(tx, user.id, settings.defaultBudget);
        await createMonthlyIncomes(tx, user.id, settings.defaultIncome);
        await createExpenses(tx, user.id, expenseCount);
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    console.log(
      "[INFO] Seeding completed successfully within the transaction.",
    );
  } catch (error) {
    console.error("[ERROR] An error occurred during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
