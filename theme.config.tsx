import { PiggyBank } from "lucide-react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <>
      <PiggyBank className="h-6 w-6" />
      <span style={{ marginLeft: "5px" }}>Expense Tracker</span>
    </>
  ),
  project: {
    link: "https://github.com/your-username/expense-tracker",
  },
  chat: {
    link: "https://discord.com/invite/your-invite-code",
  },
  docsRepositoryBase:
    "https://github.com/your-username/expense-tracker-docs/blob/main",
  footer: {
    text: "Expense Tracker Documentation © 2024",
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Expense Tracker Documentation" />
      <meta name="og:title" content="Expense Tracker Documentation" />
    </>
  ),
};

export default config;
