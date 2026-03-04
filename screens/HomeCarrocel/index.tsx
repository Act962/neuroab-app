import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { ICarouselMedia, useMedia } from "@/hooks/use-midia";
import { usePage } from "@/hooks/use-page";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminModal } from "./components/admin-modal";
import { ImageCarouselItem } from "./components/image-carousel-item";
import { VideoCarouselItem } from "./components/video-carousel";
import { styles } from "./styles";

// ==================== CONSTANTES ====================
const DEFAULT_IMAGE_DURATION = 7;
const VIDEO_END_CHECK_INTERVAL = 100;
const password = "Act@2024";

// ==================== COMPONENTES AUXILIARES ====================

interface EmptyStateProps {
  onAdminPress: () => void;
}

function EmptyState({ onAdminPress }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <MaterialIcons name="image" size={64} color="#ccc" />
      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          color: "#666",
          textAlign: "center",
        }}
      >
        Nenhuma mídia disponível
      </Text>
      <Text
        style={{
          marginTop: 10,
          fontSize: 14,
          color: "#999",
          textAlign: "center",
        }}
      >
        Adicione fotos ou vídeos na tela de administração
      </Text>
      <Pressable
        onPress={onAdminPress}
        style={{
          marginTop: 20,
          backgroundColor: "purple",
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Ir para Admin
        </Text>
      </Pressable>
    </View>
  );
}

function LoadingState() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="purple" />
      <Text style={{ marginTop: 10, color: "#666" }}>Carregando mídias...</Text>
    </View>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

export function CarouselTotem() {
  const router = useRouter();
  const [tasksModalVisible, setTasksModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const progress = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  const { width, height } = Dimensions.get("window");
  const { handleLoadingDatas, carouselMedia, loading } = useMedia();
  const { getNextPage } = usePage();

  // ==================== CLEANUP FUNCTION ====================
  const cleanupTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  // ✅ Forçar garbage collection (apenas dev)
  const forceGC = useCallback(() => {
    if (__DEV__ && global.gc) {
      console.log("🗑️ Forçando garbage collection");
      global.gc();
    }
  }, []);

  // ✅ CRÍTICO: Cleanup total ao desmontar
  useEffect(() => {
    console.log("📺 [CAROUSEL] Mounted");
    isMountedRef.current = true;

    return () => {
      console.log("🗑️ [CAROUSEL] Unmounting - Full cleanup");
      isMountedRef.current = false;
      cleanupTimer();

      if (carouselRef.current) {
        carouselRef.current = null;
      }

      // ✅ Forçar GC após 500ms
      setTimeout(forceGC, 500);

      console.log("✅ [CAROUSEL] Cleanup complete");
    };
  }, [cleanupTimer, forceGC]);

  // ==================== FOCUS EFFECT ====================
  useFocusEffect(
    useCallback(() => {
      console.log("👁️ [CAROUSEL] Focused");

      if (!hasLoadedRef.current && carouselMedia.length === 0) {
        hasLoadedRef.current = true;
        handleLoadingDatas().catch((error) => {
          console.error("Erro ao carregar mídias:", error);
          hasLoadedRef.current = false;
        });
      }

      return () => {
        console.log("👁️ [CAROUSEL] Blurred");
        cleanupTimer();
      };
    }, [handleLoadingDatas, carouselMedia.length, cleanupTimer]),
  );

  // ==================== HANDLERS ====================
  const handleNextPage = useCallback(() => {
    cleanupTimer();

    try {
      const nextPage = getNextPage("carousel");
      console.log(`🚀 Navegando para: ${nextPage || "form"}`);

      if (nextPage && nextPage !== "nada") {
        router.push(nextPage === "home" ? "/" : (`/${nextPage}` as any));
      } else {
        router.push("/form");
      }
    } catch (error) {
      console.error("Erro ao navegar:", error);
      router.push("/form");
    }
  }, [getNextPage, router, cleanupTimer]);

  const handleAdminAccess = useCallback(() => {
    if (adminPassword !== password) {
      Alert.alert("Senha incorreta", "Tente novamente");
      setAdminPassword("");
      return;
    }

    setTasksModalVisible(false);
    router.push("/settings-midia");
    setAdminPassword("");
  }, [router, adminPassword]);

  const goToNext = useCallback(() => {
    if (!isMountedRef.current || carouselMedia.length <= 1) return;

    const nextIndex = (currentIndex + 1) % carouselMedia.length;
    console.log(`➡️ Indo para índice: ${nextIndex}`);
    carouselRef.current?.scrollTo({ index: nextIndex, animated: true });
  }, [carouselMedia.length, currentIndex]);

  const handleVideoEnd = useCallback(() => {
    console.log("🎬 Vídeo terminou");
    if (isMountedRef.current && carouselMedia.length > 1) {
      goToNext();
    }
  }, [carouselMedia.length, goToNext]);

  const handleSnapToItem = useCallback((index: number) => {
    if (isMountedRef.current) {
      console.log(`📍 Snap para índice: ${index}`);
      setCurrentIndex(index);
    }
  }, []);

  const handleModalCancel = useCallback(() => {
    setTasksModalVisible(false);
    setAdminPassword("");
  }, []);

  // ==================== AUTO-PLAY (apenas imagens) ====================
  useEffect(() => {
    cleanupTimer();

    if (!isMountedRef.current || carouselMedia.length <= 1) {
      return;
    }

    const currentItem = carouselMedia[currentIndex];

    if (currentItem?.type === "image") {
      const duration = currentItem.duration || DEFAULT_IMAGE_DURATION;
      const durationMs = duration * 1000;

      console.log(`⏱️ Timer de ${duration}s para imagem`);

      autoPlayTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          console.log("⏱️ Timer expirou, próxima imagem");
          goToNext();
        }
      }, durationMs);
    } else if (currentItem?.type === "video") {
      console.log("🎥 Vídeo ativo, aguardando fim");
    }

    return cleanupTimer;
  }, [currentIndex, carouselMedia, goToNext, cleanupTimer]);

  // ==================== RENDER ITEM ====================
  const renderCarouselItem = useCallback(
    ({ item, index }: { item: ICarouselMedia; index: number }) => {
      const isCurrentIndex = index === currentIndex;
      const isItemActive = isCurrentIndex;

      if (item.type === "video") {
        return (
          <VideoCarouselItem
            key={`video-${item.id}-${index}`}
            VIDEO_END_CHECK_INTERVAL={VIDEO_END_CHECK_INTERVAL}
            uri={item.uri}
            onVideoEnd={handleVideoEnd}
            isActive={isItemActive && hasLoadedRef.current}
            isPaused={false}
            shouldLoop={carouselMedia.length === 1}
            handleNextPage={handleNextPage}
            index={index}
          />
        );
      }

      return (
        <ImageCarouselItem
          key={`image-${item.id}-${index}`}
          uri={item.uri}
          width={width}
          height={height}
          handleNextPage={handleNextPage}
        />
      );
    },
    [
      currentIndex,
      handleVideoEnd,
      handleNextPage,
      width,
      height,
      carouselMedia.length,
    ],
  );

  // ==================== RENDER ====================
  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        {loading ? (
          <LoadingState />
        ) : carouselMedia.length === 0 ? (
          <EmptyState onAdminPress={() => setTasksModalVisible(true)} />
        ) : (
          <>
            {carouselMedia.length === 1 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {renderCarouselItem({ item: carouselMedia[0], index: 0 })}
              </View>
            ) : (
              <Carousel
                loop
                ref={carouselRef}
                width={width}
                height={height}
                autoPlay={false}
                data={carouselMedia}
                onProgressChange={progress}
                onSnapToItem={handleSnapToItem}
                style={{ width: width, height: height }}
                renderItem={renderCarouselItem}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 1,
                  parallaxScrollingOffset: 0,
                }}
                // ✅ CRÍTICO: Não pré-renderizar itens adjacentes
                windowSize={1}
              />
            )}
          </>
        )}
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => setTasksModalVisible(true)}>
          <MaterialIcons name="circle" size={16} color="purple" />
        </Pressable>
      </View>

      <AdminModal
        visible={tasksModalVisible}
        password={adminPassword}
        onChangePassword={setAdminPassword}
        onCancel={handleModalCancel}
        onConfirm={handleAdminAccess}
      />
    </View>
  );
}
