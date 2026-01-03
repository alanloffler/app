import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Loader } from "@components/Loader";
import { PageHeader } from "@components/pages/PageHeader";

import { type MouseEvent, useEffect, useState } from "react";

import type { TSyncMode } from "@settings/interfaces/sync-mode.type";
import { usePermission } from "@permissions/hooks/usePermission";
import { useSettingsStore } from "@settings/stores/settings.store";

export default function NotificationsSettings() {
  const canEditSettings = usePermission("settings-update");
  const { notificationsSettings, loadingNotificationsSettings, updateNotificationsSetting } = useSettingsStore();

  const resendApiKeySetting = notificationsSettings.find((setting) => setting.key === "resendApiKey");
  const emailFromSetting = notificationsSettings.find((setting) => setting.key === "emailFrom");

  const [apiKeyValue, setApiKeyValue] = useState<string>(resendApiKeySetting?.value || "");
  const [emailFromValue, setEmailFromValue] = useState<string>(emailFromSetting?.value || "");
  const [passwordField, setPasswordField] = useState<boolean>(true);

  useEffect(() => {
    if (resendApiKeySetting) {
      setApiKeyValue(resendApiKeySetting.value);
    }
  }, [resendApiKeySetting]);

  useEffect(() => {
    if (emailFromSetting) {
      setEmailFromValue(emailFromSetting.value);
    }
  }, [emailFromSetting]);

  function togglePasswordField(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setPasswordField(!passwordField);
  }

  function handleSave(id: string, value: string, syncMode: TSyncMode): void {
    updateNotificationsSetting(id, value, syncMode);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Configuraciones de la aplicación" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <Card className="relative col-span-1 gap-3 lg:col-span-5 2xl:col-span-5">
          <CardHeader>
            <CardTitle>Notificaciones por email</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-8">
            {resendApiKeySetting && (
              <div className="flex items-center gap-3">
                <label className="select-none hover:cursor-pointer" htmlFor={resendApiKeySetting.id}>
                  {resendApiKeySetting.title}
                </label>
                <Input
                  className="w-90"
                  disabled={!canEditSettings || loadingNotificationsSettings[resendApiKeySetting.id]}
                  id={resendApiKeySetting.id}
                  type={passwordField ? "password" : "text"}
                  defaultValue={resendApiKeySetting.value}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                />
                <Button
                  variant="default"
                  disabled={!canEditSettings || loadingNotificationsSettings[resendApiKeySetting.id]}
                  onClick={() => handleSave(resendApiKeySetting.id, apiKeyValue, "remote")}
                >
                  {loadingNotificationsSettings[resendApiKeySetting.id] ? (
                    <Loader color="white" text="Guardando" />
                  ) : (
                    "Guardar"
                  )}
                </Button>
                {!canEditSettings && <LockKeyhole className="text-muted-foreground h-3.5 w-3.5" />}
                <button
                  type="button"
                  className="p-1 transition-colors duration-150 hover:text-sky-500"
                  onClick={(e) => togglePasswordField(e)}
                >
                  {passwordField ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            )}
            {emailFromSetting && (
              <div className="flex items-center gap-3">
                <label className="select-none hover:cursor-pointer" htmlFor={emailFromSetting.id}>
                  {emailFromSetting.title}
                </label>
                <Input
                  className="w-90"
                  disabled={!canEditSettings || loadingNotificationsSettings[emailFromSetting.id]}
                  id={emailFromSetting.id}
                  defaultValue={emailFromSetting.value}
                  onChange={(e) => setEmailFromValue(e.target.value)}
                />
                <Button
                  variant="default"
                  disabled={!canEditSettings || loadingNotificationsSettings[emailFromSetting.id]}
                  onClick={() => handleSave(emailFromSetting.id, emailFromValue, "remote")}
                >
                  {loadingNotificationsSettings[emailFromSetting.id] ? (
                    <Loader color="white" text="Guardando" />
                  ) : (
                    "Guardar"
                  )}
                </Button>
                {!canEditSettings && <LockKeyhole className="text-muted-foreground h-3.5 w-3.5" />}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
