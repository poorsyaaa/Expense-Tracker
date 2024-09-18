import {
  MonthlyBudget,
  MonthlyIncome,
  Prisma,
  PrismaClient,
  SettingsDefaults,
  User,
} from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const { SEEDING_PASSWORD = "" } = process.env;

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

function getRandomIcon() {
  return ICONS[Math.floor(Math.random() * ICONS.length)];
}

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
      username: "admin123",
      displayName: faker.person.fullName(),
      email: faker.internet.exampleEmail(),
      isEmailVerified: false,
      passwordHash,
      avatarUrl: faker.image.avatar(),
    },
  });

  console.log(`User created: ${user.username} - ${user.email}`);

  return user;
}

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
      dateFormat: "MM/dd/yyyy",
      defaultPaymentMethod: "DIGITAL_BANK",
    },
  });

  console.log(`SettingsDefaults created for user ID - ${userId}:`, settings);

  return settings;
}

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
    `${categories.count} Categories created for user ID - ${userId}:`,
    categories,
  );

  return categories;
}

async function createMonthlyBudgets(
  tx: Prisma.TransactionClient,
  userId: string,
  defaultBudget: number,
  currentYear: number,
): Promise<MonthlyBudget[]> {
  const years = [currentYear, currentYear + 1];
  const month = new Date().getMonth() + 1; // current month (1-12)

  const budgets: MonthlyBudget[] = [];

  for (const year of years) {
    const budget = await tx.monthlyBudget.create({
      data: {
        amount: defaultBudget,
        month,
        year,
        userId,
      },
    });

    console.log(
      `MonthlyBudget created for ${month}/${year} for user ID - ${userId}:`,
      budget,
    );

    budgets.push(budget);
  }

  return budgets;
}

async function createMonthlyIncomes(
  tx: Prisma.TransactionClient,
  userId: string,
  defaultIncome: number,
  currentYear: number,
): Promise<MonthlyIncome[]> {
  const years = [currentYear, currentYear + 1];
  const month = new Date().getMonth() + 1; // current month (1-12)

  const incomes: MonthlyIncome[] = [];

  for (const year of years) {
    const income = await tx.monthlyIncome.create({
      data: {
        amount: defaultIncome,
        month,
        year,
        userId,
      },
    });

    console.log(
      `MonthlyIncome created for ${month}/${year} for user ID - ${userId}:`,
      income,
    );

    incomes.push(income);
  }

  return incomes;
}

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

  console.log(`${tags.count} Tags created for user ID - ${userId}:`, tags);

  return tags;
}

async function createExpenses(
  tx: Prisma.TransactionClient,
  userId: string,
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
      `No categories found for user ID - ${userId}. Skipping expenses creation.`,
    );
    return;
  }

  if (tags.length === 0) {
    console.warn(
      `No tags found for user ID - ${userId}. Skipping expenses creation.`,
    );
    return;
  }

  const expenseCount = 10;

  for (let i = 0; i < expenseCount; i++) {
    const randomCategory = faker.helpers.arrayElement(categories);
    const randomTags = faker.helpers.arrayElements(
      tags,
      faker.number.int({ min: 1, max: 3 }),
    );

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
        type: faker.helpers.arrayElement(["ONE_TIME", "RECURRING", "TRANSFER"]),
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
        recurring: faker.datatype.boolean(),
        frequency: faker.helpers.arrayElement([
          "DAILY",
          "WEEKLY",
          "MONTHLY",
          "YEARLY",
          null,
        ]),
        startDate: faker.date.past(),
        endDate: faker.datatype.boolean() ? faker.date.future() : null,
        dueDate: faker.datatype.boolean() ? faker.date.future() : null,
        isPaid: faker.datatype.boolean(),
        tags: {
          connect: randomTags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    console.log(`Expense created: ${expense.description}`);

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
        `${noteCount} ExpenseNotes created for expense ID: ${expense.id}`,
      );
    }
  }

  console.log(`${expenseCount} Expenses created for user ID - ${userId}`);
}

async function resetData(tx: Prisma.TransactionClient): Promise<void> {
  console.log("Resetting all data...");

  await tx.expenseNote.deleteMany({});
  console.log("All ExpenseNotes deleted.");

  await tx.expense.deleteMany({});
  console.log("All Expenses deleted.");

  await tx.tag.deleteMany({});
  console.log("All Tags deleted.");

  await tx.monthlyIncome.deleteMany({});
  console.log("All MonthlyIncomes deleted.");

  await tx.monthlyBudget.deleteMany({});
  console.log("All MonthlyBudgets deleted.");

  await tx.category.deleteMany({});
  console.log("All Categories deleted.");

  await tx.settingsDefaults.deleteMany({});
  console.log("All SettingsDefaults deleted.");

  await tx.session.deleteMany({});
  console.log("All Sessions deleted.");

  await tx.user.deleteMany({});
  console.log("All Users deleted.");

  console.log("Database reset completed.");
}

async function main() {
  try {
    await prisma.$transaction(
      async (tx) => {
        // 0. Reset data
        await resetData(tx);

        // 1. Create User
        const user = await createUser(tx);

        // 2. Create SettingsDefaults
        const settings = await createSettings(tx, user.id);

        // 3. Create Categories
        await createCategories(tx, user.id, 5);

        // 4. Create Tags
        await createTags(tx, user.id, 5);

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
        await createExpenses(tx, user.id);
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  } catch (error) {
    console.error("Error seeding", error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
