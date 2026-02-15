import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ConfigPage } from "../pages/config";
import { DashboardPage } from "../pages/dashboard";
import { SettingsPage } from "../pages/settings";
import { AdminNavigationLayout } from "../widgets/admin-navigation";
import { PreferencesProvider, usePreferences } from "./providers/PreferencesProvider";

const AppRoutes = (): JSX.Element => {
  const { themeMode } = usePreferences();
  const appTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode
        }
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AdminNavigationLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminNavigationLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export const App = (): JSX.Element => {
  return (
    <PreferencesProvider>
      <AppRoutes />
    </PreferencesProvider>
  );
};
