export const navLinks = [
  {
    name: "Dashboard",
    href: "/",
  },
  {
    name: "Expenses",
    href: "/expenses",
  },
  {
    name: "Reports",
    href: "/reports",
  },
  {
    name: "Settings",
    href: "/settings",
  },
];

export const settingsNavLinks = [
  { name: "General", href: "/settings/general" },
  { name: "Category", href: "/settings/category" },
  { name: "Budget", href: "/settings/budget" },
];

export const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
}));

export const years = Array.from(
  { length: 2050 - 2024 + 1 },
  (_, i) => 2024 + i,
);

export const paymentMethods = [
  { label: "Credit Card", value: "CREDIT_CARD" },
  { label: "Debit Card", value: "DEBIT_CARD" },
  { label: "Cash", value: "CASH" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Digital Bank", value: "DIGITAL_BANK" },
  { label: "Other", value: "OTHER" },
];

export const currencies = [
  { label: "USD", value: "USD" },
  { label: "PHP", value: "PHP" },
  { label: "EUR", value: "EUR" },
];

export const localeLanguages = [
  { label: "English (United States)", value: "en-US" },
  { label: "English (United Kingdom)", value: "en-GB" },
  { label: "German (Germany)", value: "de-DE" },
  { label: "French (France)", value: "fr-FR" },
];

export const timeZones = [
  { label: "Coordinated Universal Time (UTC)", value: "UTC" },
  { label: "Greenwich Mean Time (GMT)", value: "Europe/London" },
  { label: "Central European Time (CET)", value: "Europe/Berlin" },
  { label: "Eastern Standard Time (EST)", value: "America/New_York" },
  { label: "Pacific Standard Time (PST)", value: "America/Los_Angeles" },
  { label: "Philippine Standard Time (PST)", value: "Asia/Manila" },
  { label: "India Standard Time (IST)", value: "Asia/Kolkata" },
];

export const dateFormats = [
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
];
