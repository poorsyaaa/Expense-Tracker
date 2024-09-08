"use client";

import { useSettings } from "@/context/settingsContext";
import GeneralSettingsForm from "../../_components/general-settings-form";

export default function Page() {
  const { default_settings } = useSettings();

  return <GeneralSettingsForm {...default_settings} />;
}
