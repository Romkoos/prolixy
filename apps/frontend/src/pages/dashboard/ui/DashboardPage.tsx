import { Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Dashboard landing page.
 */
export const DashboardPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t("page.dashboard.title")}</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{t("page.dashboard.empty")}</Typography>
      </Paper>
    </Stack>
  );
};
