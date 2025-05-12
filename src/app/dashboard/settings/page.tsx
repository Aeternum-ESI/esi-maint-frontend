import { SettingsTabs } from "./components/settings-tabs";

export default function SettingsPage() {
  return (
    <div className="container py-8 px-8">
      <div className="space-y-0.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings and configurations.
        </p>
      </div>
      <SettingsTabs />
    </div>
  );
}
