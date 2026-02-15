import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import type { CategoryDto } from "@prolixy/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "../../../api";

type DialogMode = "create" | "edit";

/**
 * Config page with category CRUD controls.
 */
export const ConfigPage = (): JSX.Element => {
  const { t } = useTranslation();
  const [items, setItems] = useState<readonly CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [draftName, setDraftName] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadCategories = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const nextItems = await fetchCategories();
      setItems(nextItems);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : t("page.config.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const dialogTitle = useMemo(
    () => (dialogMode === "create" ? t("page.config.createTitle") : t("page.config.editTitle")),
    [dialogMode, t]
  );

  const onOpenCreateDialog = (): void => {
    setDialogMode("create");
    setDraftName("");
    setActiveCategory(null);
    setErrorMessage(null);
    setIsDialogOpen(true);
  };

  const onOpenEditDialog = (category: CategoryDto): void => {
    setDialogMode("edit");
    setDraftName(category.name);
    setActiveCategory(category);
    setErrorMessage(null);
    setIsDialogOpen(true);
  };

  const onCloseDialog = (): void => {
    if (isSaving) {
      return;
    }
    setIsDialogOpen(false);
    setDraftName("");
    setActiveCategory(null);
  };

  const onSave = async (): Promise<void> => {
    const trimmedName = draftName.trim();
    if (trimmedName.length === 0) {
      setErrorMessage(t("page.config.validationRequired"));
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      if (dialogMode === "create") {
        await createCategory({ name: trimmedName });
        setSuccessMessage(t("page.config.createSuccess"));
      } else if (activeCategory) {
        await updateCategory(activeCategory.id, { name: trimmedName });
        setSuccessMessage(t("page.config.updateSuccess"));
      }

      setIsDialogOpen(false);
      await loadCategories();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : t("page.config.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (id: string): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await deleteCategory(id);
      setSuccessMessage(t("page.config.deleteSuccess"));
      await loadCategories();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : t("page.config.deleteError"));
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t("page.config.title")}</Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onOpenCreateDialog}>
          {t("page.config.addButton")}
        </Button>
      </Box>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">{t("page.config.loading")}</Typography>
          </Stack>
        ) : items.length === 0 ? (
          <Typography color="text.secondary">{t("page.config.empty")}</Typography>
        ) : (
          <Stack spacing={1}>
            {items.map((item) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ wordBreak: "break-word" }}>{item.name}</Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    aria-label={t("page.config.editButton")}
                    onClick={() => onOpenEditDialog(item)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label={t("page.config.deleteButton")}
                    onClick={() => void onDelete(item.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      <Dialog open={isDialogOpen} onClose={onCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label={t("page.config.nameLabel")}
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog} disabled={isSaving}>
            {t("page.config.cancelButton")}
          </Button>
          <Button onClick={() => void onSave()} variant="contained" disabled={isSaving}>
            {t("page.config.saveButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
