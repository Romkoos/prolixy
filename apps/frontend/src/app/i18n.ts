import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: {
        title: "Prolixy Admin",
        language: "Language"
      },
      nav: {
        dashboard: "Dashboard",
        settings: "Settings",
        config: "Config",
        openMenu: "Open navigation menu"
      },
      page: {
        dashboard: {
          title: "Dashboard",
          empty: "Dashboard is currently empty."
        },
        settings: {
          title: "Settings",
          theme: "Theme",
          darkMode: "Dark mode",
          language: "Language",
          english: "English",
          russian: "Russian"
        },
        config: {
          title: "Config",
          placeholder: "Categories management UI will be added here.",
          addButton: "Add category",
          editButton: "Edit category",
          deleteButton: "Delete category",
          loading: "Loading categories...",
          empty: "No categories yet.",
          createTitle: "Create category",
          editTitle: "Edit category",
          nameLabel: "Category name",
          cancelButton: "Cancel",
          saveButton: "Save",
          createSuccess: "Category created.",
          updateSuccess: "Category updated.",
          deleteSuccess: "Category deleted.",
          loadError: "Failed to load categories.",
          saveError: "Failed to save category.",
          deleteError: "Failed to delete category.",
          validationRequired: "Category name is required."
        }
      }
    }
  },
  ru: {
    translation: {
      app: {
        title: "Prolixy Админ",
        language: "Язык"
      },
      nav: {
        dashboard: "Панель",
        settings: "Настройки",
        config: "Конфиг",
        openMenu: "Открыть навигационное меню"
      },
      page: {
        dashboard: {
          title: "Панель",
          empty: "Панель пока пустая."
        },
        settings: {
          title: "Настройки",
          theme: "Тема",
          darkMode: "Темный режим",
          language: "Язык",
          english: "Английский",
          russian: "Русский"
        },
        config: {
          title: "Конфиг",
          placeholder: "Интерфейс управления категориями будет добавлен здесь.",
          addButton: "Добавить категорию",
          editButton: "Редактировать категорию",
          deleteButton: "Удалить категорию",
          loading: "Загрузка категорий...",
          empty: "Категорий пока нет.",
          createTitle: "Создать категорию",
          editTitle: "Изменить категорию",
          nameLabel: "Название категории",
          cancelButton: "Отмена",
          saveButton: "Сохранить",
          createSuccess: "Категория создана.",
          updateSuccess: "Категория обновлена.",
          deleteSuccess: "Категория удалена.",
          loadError: "Не удалось загрузить категории.",
          saveError: "Не удалось сохранить категорию.",
          deleteError: "Не удалось удалить категорию.",
          validationRequired: "Название категории обязательно."
        }
      }
    }
  }
} as const;

/**
 * Initializes i18n resources for English and Russian.
 */
export const initI18n = async (): Promise<void> => {
  if (i18n.isInitialized) {
    return;
  }

  const storedLanguage =
    typeof window !== "undefined" && window.localStorage.getItem("prolixy.language") === "ru"
      ? "ru"
      : "en";

  await i18n.use(initReactI18next).init({
    resources,
    lng: storedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });
};
