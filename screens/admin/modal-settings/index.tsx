import { View, Text, Pressable, Modal, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { style } from "./style";
import {
  ArrowRightIcon,
  ChevronRight,
  Check,
  Trash2,
} from "lucide-react-native";
import { SETTINGS_PAGE, store } from "../../../storge/store";

interface ModalAcessoProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface PageConfig {
  id: string;
  label: string;
  toPage: string;
}

export function ModalConfigurations({
  visible,
  onClose,
  onConfirm,
}: ModalAcessoProps) {
  const pages = [
    { id: "home", label: "Home" },
    { id: "form", label: "Formulário" },
    { id: "roullete", label: "Roleta" },
    { id: "carousel", label: "Carrocel" },
    { id: "SettingsMidia", label: "Configurações de mídia" },
  ];

  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>(
    pages.map((page) => ({
      id: page.id,
      label: page.label,
      toPage: "home", // Página padrão inicial
    }))
  );

  const [selectingFor, setSelectingFor] = useState<string | null>(null);

  const handleSelectDestination = (pageId: string, destinationId: string) => {
    setPageConfigs((prev) =>
      prev.map((config) =>
        config.id === pageId ? { ...config, toPage: destinationId } : config
      )
    );
    setSelectingFor(null);
  };

  const handleConfirm = () => {
    pageConfigs.forEach((config) => {
      store.setRow(SETTINGS_PAGE, config.id, {
        currentPage: config.id,
        toPage: config.toPage,
      });
    });
    onConfirm();
    onClose();
    Alert.alert(
      "Configurações finalizadas",
      "Feche e abra seu app para visualizar as alterações"
    );
  };

  const getPageLabel = (pageId: string) => {
    return pages.find((p) => p.id === pageId)?.label || pageId;
  };

  const loadSavedConfigs = async () => {
    try {
      const savedData = store.getTable(SETTINGS_PAGE);

      if (savedData && Object.keys(savedData).length > 0) {
        const loadedConfigs: PageConfig[] = pages.map((page) => {
          const savedConfig = savedData[page.id];
          console.log(savedConfig);
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
  };

  useEffect(() => {
    if (visible) {
      loadSavedConfigs();
    }
  }, [visible]);

  const handleDeleteAllRoutes = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja deletar todas as configurações de rotas? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => {
            // Reseta todas as configurações para o padrão (home)
            const resetConfigs = pages.map((page) => ({
              id: page.id,
              label: page.label,
              toPage: "home",
            }));

            setPageConfigs(resetConfigs);

            // Remove do storage
            resetConfigs.forEach((config) => {
              store.setRow(SETTINGS_PAGE, config.id, {
                currentPage: config.id,
                toPage: "home",
              });
            });

            Alert.alert(
              "Rotas deletadas",
              "Todas as configurações foram resetadas para o padrão"
            );
          },
        },
      ]
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={style.Teste}>
        <View style={style.modalBox}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={style.modalTitle}>
              Configurações de Direcionamento
            </Text>
            <Pressable onPress={handleDeleteAllRoutes} style={{ padding: 8 }}>
              <Trash2 size={24} color="#ef4444" />
            </Pressable>
          </View>
          <Text style={style.subtitleText}>
            Configure qual será a próxima página após cada tela
          </Text>
          <ScrollView style={style.pagesList}>
            {pageConfigs.map((config) => (
              <View key={config.id}>
                <Pressable
                  style={style.pageItem}
                  onPress={() => setSelectingFor(config.id)}
                >
                  <View style={style.pageItemLeft}>
                    <Text style={style.pageLabel}>{config.label}</Text>
                    <ArrowRightIcon size={20} color="#666" />
                    <Text style={style.nextPageLabel}>
                      {getPageLabel(config.toPage)}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#999" />
                </Pressable>
                {/* Menu de seleção */}
                {selectingFor === config.id && (
                  <View style={style.selectionMenu}>
                    {pages.map((page) => (
                      <Pressable
                        key={page.id}
                        style={style.selectionItem}
                        onPress={() =>
                          handleSelectDestination(config.id, page.id)
                        }
                      >
                        <Text style={style.selectionLabel}>{page.label}</Text>
                        {config.toPage === page.id && (
                          <Check size={20} color="#4CAF50" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={style.modalButtonContainer}>
            <Pressable
              style={[style.modalButton, style.cancelButton]}
              onPress={onClose}
            >
              <Text style={style.modalButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[style.modalButton, style.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={style.modalButtonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
