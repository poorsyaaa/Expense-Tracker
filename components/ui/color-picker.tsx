import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { useMemo } from "react";

// Define color arrays outside of the component to avoid re-rendering
const SOLID_COLORS = [
  "#E2E2E2",
  "#ff75c3",
  "#ffa647",
  "#ffe83f",
  "#9fff5b",
  "#70e2ff",
  "#cd93ff",
  "#09203f",
];

const GRADIENT_COLORS = [
  "linear-gradient(to top left,#accbee,#e7f0fd)",
  "linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)",
  "linear-gradient(to top left,#000000,#434343)",
  "linear-gradient(to top left,#09203f,#537895)",
  "linear-gradient(to top left,#AC32E4,#7918F2,#4801FF)",
  "linear-gradient(to top left,#f953c6,#b91d73)",
  "linear-gradient(to top left,#ee0979,#ff6a00)",
  "linear-gradient(to top left,#F00000,#DC281E)",
  "linear-gradient(to top left,#00c6ff,#0072ff)",
  "linear-gradient(to top left,#4facfe,#00f2fe)",
  "linear-gradient(to top left,#0ba360,#3cba92)",
  "linear-gradient(to top left,#FDFC47,#24FE41)",
  "linear-gradient(to top left,#8a2be2,#0000cd,#228b22,#ccff00)",
  "linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)",
  "linear-gradient(to top left,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)",
  "linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)",
];

export function GradientPicker({
  background,
  setBackground,
  className,
}: Readonly<{
  background: string;
  setBackground: (background: string) => void;
  className?: string;
}>) {
  // Memoize the tab selection based on background content
  const defaultTab = useMemo(
    () => (background.includes("gradient") ? "gradient" : "solid"),
    [background],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex w-[220px] justify-start bg-transparent text-left font-normal",
            !background && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded transition-all"
                style={{ background }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {background ?? "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-4 flex w-full">
            <TabsTrigger value="solid" className="flex-1">
              Solid
            </TabsTrigger>
            <TabsTrigger value="gradient" className="flex-1">
              Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1">
            {SOLID_COLORS.map((color) => (
              <ColorSquare
                key={color}
                color={color}
                onClick={() => setBackground(color)}
              />
            ))}
          </TabsContent>

          <TabsContent value="gradient" className="flex flex-wrap gap-1">
            {GRADIENT_COLORS.map((gradient) => (
              <ColorSquare
                key={gradient}
                color={gradient}
                onClick={() => setBackground(gradient)}
              />
            ))}
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={background}
          className="mt-4 h-8"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}

// Component for rendering color squares (solid or gradient)
const ColorSquare = ({
  color,
  onClick,
}: {
  color: string;
  onClick: () => void;
}) => (
  <div
    role="button"
    tabIndex={0}
    aria-label={`Select color ${color}`}
    style={{ background: color }}
    className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
    onClick={onClick}
  />
);

export const GradientButton = ({
  background,
  children,
}: {
  background: string;
  children: React.ReactNode;
}) => (
  <div
    className="relative rounded-md bg-cover bg-center p-0.5 transition-all"
    style={{ background }}
  >
    <div className="rounded-md bg-popover/80 p-1 text-center text-xs">
      {children}
    </div>
  </div>
);
