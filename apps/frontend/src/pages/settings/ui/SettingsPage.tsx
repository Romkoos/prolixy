import {
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  Switch,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { usePreferences } from "../../../app/providers/PreferencesProvider";

/**
 * Settings page scaffold.
 */
export const SettingsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { themeMode, language, toggleTheme, setLanguage } = usePreferences();

  const onLanguageChange = (event: SelectChangeEvent): void => {
    const value = event.target.value === "ru" ? "ru" : "en";
    setLanguage(value);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t("page.settings.title")}</Typography>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1">{t("page.settings.theme")}</Typography>
          <FormControlLabel
            control={<Switch checked={themeMode === "dark"} onChange={toggleTheme} />}
            label={t("page.settings.darkMode")}
          />
          <Divider />
          <Typography variant="subtitle1">{t("page.settings.language")}</Typography>
          <Select value={language} onChange={onLanguageChange} size="small" sx={{ maxWidth: 220 }}>
            <MenuItem value="en">{t("page.settings.english")}</MenuItem>
            <MenuItem value="ru">{t("page.settings.russian")}</MenuItem>
          </Select>
        </Stack>
      </Paper>
    </Stack>
  );
};
