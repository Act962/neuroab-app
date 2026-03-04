import { useState, useEffect, useCallback } from "react";
import { SETTINGS_PAGE, store } from "../storge/store";

interface PageConfig {
  id: string;
  label: string;
  toPage: string;
}

export function usePage() {
  const pages = [
    { id: "home", label: "Home" },
    { id: "form", label: "Formulário" },
    { id: "roullete", label: "Roleta" },
    { id: "instructions", label: "Instruções" },
    { id: "carousel", label: "Carrocel" },
  ];

  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>(
    pages.map((page) => ({
      id: page.id,
      label: page.label,
      toPage: "home",
    }))
  );

  const getPageLabel = (pageId: string) => {
    return pages.find((p) => p.id === pageId)?.label || pageId;
  };

  // ✅ Ler DIRETO do storage - elimina problema de estado
  const getNextPage = useCallback((currentPageId: string): string => {
    try {
      const savedData = store.getTable(SETTINGS_PAGE);

      if (savedData && savedData[currentPageId]) {
        return String(savedData[currentPageId].toPage || "home");
      }

      return "home";
    } catch (error) {
      console.error("Erro ao buscar próxima página:", error);
      return "home";
    }
  }, []); // ✅ Sem dependências - função estável

  // ✅ useCallback para função estável
  const loadSavedConfigs = useCallback(async () => {
    try {
      const savedData = store.getTable(SETTINGS_PAGE);

      if (savedData && Object.keys(savedData).length > 0) {
        const loadedConfigs: PageConfig[] = pages.map((page) => {
          const savedConfig = savedData[page.id];
          return {
            id: page.id,
            label: page.label,
            toPage: String(savedConfig?.toPage || "home"),
          };
        });

        setPageConfigs(loadedConfigs);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  }, []); // ✅ Sem dependências - função estável

  // ✅ Carregar automaticamente ao montar o hook
  useEffect(() => {
    loadSavedConfigs();
  }, [loadSavedConfigs]);

  return {
    pageConfigs,
    getPageLabel,
    getNextPage,
    loadSavedConfigs,
  };
}
