// prisma/seed.ts

import {
  PrismaClient,
  Prisma,
  User,
  SettingsDefaults,
  MonthlyBudget,
  MonthlyIncome,
} from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { faker } from "@faker-js/faker";
import minimist from "minimist";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Destructure SEEDING_PASSWORD from environment variables with a fallback
const { SEEDING_PASSWORD = "defaultPassword123" } = process.env;

// Define ICONS as an array of strings
const ICONS = [
  "DollarSign",
  "CreditCard",
  "Wallet",
  "PiggyBank",
  "Banknote",
  "Coins",
  "ChartBar",
  "Receipt",
  "ShoppingBag",
  "Briefcase",
  "Gift",
  "Truck",
];

/**
 * Selects a random icon from the ICONS array.
 * @returns {string} Random icon name.
 */
function getRandomIcon(): string {
  return ICONS[Math.floor(Math.random() * ICONS.length)];
}

/**
 * Parses command-line arguments and returns an object with the desired counts.
 * @returns {object} Parsed arguments with default values.
 */
function parseArguments() {
  const args = minimist(process.argv.slice(2), {
    alias: {
      c: "categories",
      t: "tags",
      e: "expenses",
      r: "reset",
    },
    default: {
      categories: 5,
      tags: 5,
      expenses: 10,
      reset: false,
    },
  });

  return {
    categories: Number(args.categories),
    tags: Number(args.tags),
    expenses: Number(args.expenses),
    reset: Boolean(args.reset),
  };
}

/**
 * Resets all data in the database by deleting all records from all tables.
 * The deletion order is crucial to respect foreign key constraints.
 * @param tx Prisma.TransactionClient
 */
async function resetData(tx: Prisma.TransactionClient): Promise<void> {
  console.log("[INFO] Resetting all data...");

  // Delete ExpenseNotes first because they depend on Expenses
  await tx.expenseNote.deleteMany({});
  console.log("[INFO] Deleted all ExpenseNotes.");

  // Delete Expenses next
  await tx.expense.deleteMany({});
  console.log("[INFO] Deleted all Expenses.");

  // Delete Tags
  await tx.tag.deleteMany({});
  console.log("[INFO] Deleted all Tags.");

  // Delete MonthlyIncomes
  await tx.monthlyIncome.deleteMany({});
  console.log("[INFO] Deleted all MonthlyIncomes.");

  // Delete MonthlyBudgets
  await tx.monthlyBudget.deleteMany({});
  console.log("[INFO] Deleted all MonthlyBudgets.");

  // Delete Categories
  await tx.category.deleteMany({});
  console.log("[INFO] Deleted all Categories.");

  // Delete SettingsDefaults
  await tx.settingsDefaults.deleteMany({});
  console.log("[INFO] Deleted all SettingsDefaults.");

  // Delete Sessions
  await tx.session.deleteMany({});
  console.log("[INFO] Deleted all Sessions.");

  // Delete Users
  await tx.user.deleteMany({});
  console.log("[INFO] Deleted all Users.");

  console.log("[INFO] Database reset completed successfully.");
}

/**
 * Creates a single user with associated data.
 * @param tx Prisma.TransactionClient
 * @returns {Promise<User>} Created user
 */
async function createUser(tx: Prisma.TransactionClient): Promise<User> {
  // Hash the password using argon2
  const passwordHash = await hash(SEEDING_PASSWORD, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // Create the user
  const user = await tx.user.create({
    data: {
      username: faker.internet.userName().replace(/[^a-zA-Z0-9]/g, ""),
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

/**
 * Creates SettingsDefaults for a given user.
 * @param tx Prisma.TransactionClient
 * @param userId string
 * @returns {Promise<SettingsDefaults>} Created settings
 */
async function createSettings(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<SettingsDefaults> {
  const defaultBudget = Number(
    faker.finance.amount({
      min: 30000,
      max: 40000,
      dec: 2,
    }),
  );
  const defaultIncome = Number(
    faker.finance.amount({
      min: 40001,
      max: 80000,
      dec: 2,
    }),
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

/**
 * Creates multiple categories for a given user.
 * @param tx Prisma.TransactionClient
 * @param userId string
 * @param count number
 * @returns {Promise<Prisma.BatchPayload>} Created categories
 */
async function createCategories(
  tx: Prisma.TransactionClient,
  userId: string,
  count: number = 5,
): Promise<Prisma.BatchPayload> {
  const categoriesData: Prisma.CategoryCreateManyInput[] = [];

  for (let i = 0; i < count; i++) {
    categoriesData.push({
      userId,
      name: faker.commerce.department(),
      icon: getRandomIcon(),
      color: faker.color.rgb({ format: "hex" }),
    });
  }

  const categories = await tx.category.createMany({
    data: categoriesData,
    skipDuplicates: true,
  });

  console.log(
    `[INFO] Categories for User ID: ${userId} - Names: ${categoriesData.map((cat) => cat.name).join(", ")}`,
  );

  return categories;
}

/**
 * Creates multiple tags for a given user.
 * @param tx Prisma.TransactionClient
 * @param userId string
 * @param count number
 * @returns {Promise<Prisma.BatchPayload>} Created tags
 */
async function createTags(
  tx: Prisma.TransactionClient,
  userId: string,
  count: number = 5,
): Promise<Prisma.BatchPayload> {
  const tagsData: Prisma.TagCreateManyInput[] = [];

  for (let i = 0; i < count; i++) {
    tagsData.push({
      name: faker.word.noun({ length: { min: 3, max: 10 } }),
      userId,
    });
  }

  const tags = await tx.tag.createMany({
    data: tagsData,
    skipDuplicates: true,
  });

  console.log(
    `[INFO] Tags for User ID: ${userId} - Names: ${tagsData.map((tag) => tag.name).join(", ")}`,
  );

  return tags;
}

/**
 * Creates monthlyBudget entries from January of the current year to December of the next year.
 * @param tx Prisma.TransactionClient
 * @param userId string
 * @param defaultBudget number
 * @param currentYear number
 * @returns {Promise<MonthlyBudget[]>} Created budgets
 */
async function createMonthlyBudgets(
  tx: Prisma.TransactionClient,
  userId: string,
  defaultBudget: number,
  currentYear: number,
): Promise<MonthlyBudget[]> {
  const budgets: MonthlyBudget[] = [];

  // Define the start and end years
  const startYear = currentYear;
  const endYear = currentYear + 1;

  // Iterate through each year
  for (let year = startYear; year <= endYear; year++) {
    // Iterate through each month from January (1) to December (12)
    for (let month = 1; month <= 12; month++) {
      const budget = await tx.monthlyBudget.create({
        data: {
          amount: Number(
            faker.finance.amount({ min: 29999, max: defaultBudget, dec: 2 }),
          ),
          month,
          year,
          userId,
        },
      });

      console.log(
        `[INFO] Created MonthlyBudget - User ID: ${userId} | Month: ${month}, Year: ${year} | Amount: ${budget.amount}`,
      );

      budgets.push(budget);
    }
  }

  return budgets;
}

/**
 * Creates monthlyIncome entries from January of the current year to December of the next year.
 * @param tx Prisma.TransactionClient
 * @param userId string
 * @param defaultIncome number
 * @param currentYear number
 * @returns {Promise<MonthlyIncome[]>} Created incomes
 */
async function createMonthlyIncomes(
  tx: Prisma.TransactionClient,
  userId: string,
  defaultIncome: number,
  currentYear: number,
): Promise<MonthlyIncome[]> {
  const incomes: MonthlyIncome[] = [];

  // Define the start and end years
  const startYear = currentYear;
  const endYear = currentYear + 1;

  // Iterate through each year
  for (let year = startYear; year <= endYear; year++) {
    // Iterate through each month from January (1) to December (12)
    for (let month = 1; month <= 12; month++) {
      const income = await tx.monthlyIncome.create({
        data: {
          amount: Number(
            faker.finance.amount({ min: 40000, max: defaultIncome, dec: 2 }),
          ),
          month,
          year,
          userId,
        },
      });

      console.log(
        `[INFO] Created MonthlyIncome - User ID: ${userId} | Month: ${month}, Year: ${year} | Amount: ${income.amount}`,
      );

      incomes.push(income);
    }
  }

  return incomes;
}

/**
 * Creates expenses and associated notes for a given user.
 * @param tx Prisma.TransactionClient
 * @param userId string
 * @param expenseCount number
 */
async function createExpenses(
  tx: Prisma.TransactionClient,
  userId: string,
  expenseCount: number,
): Promise<void> {
  // Fetch categories and tags for the user
  const categories = await tx.category.findMany({
    where: { userId },
  });

  const tags = await tx.tag.findMany({
    where: { userId },
  });

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

  // Get current date details
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startDate = new Date(currentYear, currentMonth, 1);

  for (let i = 0; i < expenseCount; i++) {
    // Get current due date details + 28 days
    const dueDate: Date = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 28);

    const randomCategory = faker.helpers.arrayElement(categories);
    const randomTags = faker.helpers.arrayElements(
      tags,
      faker.number.int({ min: 1, max: 3 }),
    );

    try {
      const expense = await tx.expense.create({
        data: {
          description: faker.lorem.sentence(),
          amount: Number(
            faker.finance.amount({
              min: 1000,
              max: 10000,
              dec: 2,
            }),
          ),
          type: faker.helpers.arrayElement([
            "ONE_TIME",
            "RECURRING",
            "TRANSFER",
          ]),
          paymentMethod: faker.helpers.arrayElement([
            "CREDIT_CARD",
            "DEBIT_CARD",
            "CASH",
            "BANK_TRANSFER",
            "DIGITAL_BANK",
            "OTHER",
          ]),
          categoryId: randomCategory.id,
          userId,
          startDate: startDate,
          dueDate: dueDate,
          isPaid: faker.datatype.boolean(),
          tags: {
            connect: randomTags.map((tag) => ({ id: tag.id })),
          },
        },
      });

      console.log(
        `[INFO] Expense created - Description: "${expense.description}", Amount: ${expense.amount}`,
      );

      const noteCount = faker.number.int({ min: 0, max: 3 });
      if (noteCount > 0) {
        const expenseNotesData: Prisma.ExpenseNoteCreateManyInput[] = [];

        for (let j = 0; j < noteCount; j++) {
          expenseNotesData.push({
            expenseId: expense.id,
            note: faker.lorem.sentence(),
          });
        }

        await tx.expenseNote.createMany({
          data: expenseNotesData,
        });

        console.log(
          `[INFO] Created ${noteCount} ExpenseNotes for Expense ID: ${expense.id}`,
        );
      }
    } catch (error) {
      console.error(
        `[ERROR] Failed to create Expense for User ID: ${userId} - Error: ${error}`,
      );
    }
  }

  console.log(
    `[INFO] Total of ${expenseCount} Expenses created for User ID: ${userId}`,
  );
}

/**
 * Main seeding function.
 */
async function main() {
  try {
    const {
      categories: categoryCount,
      tags: tagCount,
      expenses: expenseCount,
      reset,
    } = parseArguments();

    if (reset) {
      await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await resetData(tx);
        },
        {
          maxWait: 5000,
          timeout: 10000,
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    }

    await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 1. Create User
        const user = await createUser(tx);

        // 2. Create SettingsDefaults
        const settings = await createSettings(tx, user.id);

        // 3. Create Categories
        await createCategories(tx, user.id, categoryCount);

        // 4. Create Tags
        await createTags(tx, user.id, tagCount);

        // 5. Create MonthlyBudgets
        const currentYear = new Date().getFullYear();
        await createMonthlyBudgets(
          tx,
          user.id,
          settings.defaultBudget,
          currentYear,
        );

        // 6. Create MonthlyIncomes
        await createMonthlyIncomes(
          tx,
          user.id,
          settings.defaultIncome,
          currentYear,
        );

        // 7. Create Expenses and ExpenseNotes
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
