import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import {
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  Banknote,
  Coins,
  ChartBar,
  Receipt,
  ShoppingBag,
  Briefcase,
  Gift,
  Truck,
} from "lucide-react";

// Define the ICONS object with explicit keys and strict types
const ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  Banknote,
  Coins,
  ChartBar,
  Receipt,
  ShoppingBag,
  Briefcase,
  Gift,
  Truck,
};

// Memoize the IconPicker component to prevent unnecessary re-renders
export const IconPicker = React.memo(function IconPicker({
  icon = "DollarSign", // Default value for the icon
  setIcon,
  className,
}: {
  icon: string | undefined;
  setIcon: (icon: string) => void;
  className?: string;
}) {
  // Memoize the selected icon component
  const IconComponent = useMemo(() => ICONS[icon], [icon]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex w-[150px] justify-start bg-transparent text-left font-normal",
            !icon && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex w-full items-center gap-2">
            {icon ? (
              <IconComponent className="h-4 w-4" />
            ) : (
              <span className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">{icon || "Pick an icon"}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(ICONS).map((iconKey) => (
            <IconButton
              key={iconKey}
              iconKey={iconKey}
              currentIcon={icon}
              setIcon={setIcon}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
});

// Memoized individual icon button to avoid unnecessary renders
const IconButton = React.memo(function IconButton({
  iconKey,
  currentIcon,
  setIcon,
}: {
  iconKey: string;
  currentIcon: string;
  setIcon: (icon: string) => void;
}) {
  // Get the icon component for this key
  const IconComponent = useMemo(() => ICONS[iconKey], [iconKey]);

  return (
    <Button
      variant={currentIcon === iconKey ? "secondary" : "ghost"} // Change style based on selection
      size="icon" // Compact size
      className={cn("flex items-center justify-center p-2")}
      onClick={() => setIcon(iconKey)}
    >
      <IconComponent className="h-5 w-5" />
    </Button>
  );
});
