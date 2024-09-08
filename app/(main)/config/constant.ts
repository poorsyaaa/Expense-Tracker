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

export const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
}));
export const years = Array.from(
  { length: 2050 - 2024 + 1 },
  (_, i) => 2024 + i,
);
