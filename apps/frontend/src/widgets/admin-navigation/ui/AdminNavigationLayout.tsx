import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import { type PropsWithChildren, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 260;

interface MenuItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

/**
 * Admin layout with responsive side navigation and top app bar.
 */
export const AdminNavigationLayout = ({ children }: PropsWithChildren): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = useMemo<readonly MenuItem[]>(
    () => [
      { label: t("nav.settings"), path: "/settings", icon: <SettingsIcon /> },
      { label: t("nav.config"), path: "/config", icon: <TuneIcon /> }
    ],
    [t]
  );

  const pageTitle = useMemo((): string => {
    switch (location.pathname) {
      case "/settings":
        return t("nav.settings");
      case "/config":
        return t("nav.config");
      default:
        return t("nav.dashboard");
    }
  }, [location.pathname, t]);

  const onOpenDrawer = (): void => {
    setIsDrawerOpen(true);
  };

  const onCloseDrawer = (): void => {
    setIsDrawerOpen(false);
  };

  const onNavigate = (path: string): void => {
    navigate(path);
    onCloseDrawer();
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t("app.title")}
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => onNavigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={t("nav.openMenu")}
            onClick={onOpenDrawer}
            edge="start"
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={isDrawerOpen}
          onClose={onCloseDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
