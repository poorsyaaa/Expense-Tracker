"use client";

import { useSettings } from "@/context/settingsContext";
import GeneralSettingsForm from "../../_components/general-settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { default_settings, isLoading } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Update your default budget, income, payment method, and other
          preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="mx-auto my-3 animate-spin" />
        ) : (
          <GeneralSettingsForm {...default_settings} />
        )}
      </CardContent>
    </Card>
  );
}
