import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";

interface VideoCarouselItemProps {
  uri: string;
  onVideoEnd: () => void;
  isActive: boolean;
  isPaused: boolean;
  shouldLoop?: boolean;
  VIDEO_END_CHECK_INTERVAL: number;
  handleNextPage: () => void;
  index: number;
}

// ✅ SOLUÇÃO DEFINITIVA: Lock global com ID único
class VideoPlayerLock {
  private currentActiveId: string | null = null;
  private currentActiveUri: string | null = null;

  canActivate(uri: string, videoId: string): boolean {
    // Se não há player ativo, pode ativar
    if (!this.currentActiveId) {
      this.currentActiveId = videoId;
      this.currentActiveUri = uri;
      console.log(
        `🔒 [LOCK] Player ${videoId} obteve lock para ${uri.substring(
          uri.length - 20,
        )}`,
      );
      return true;
    }

    // Se é o mesmo ID, continua ativo
    if (this.currentActiveId === videoId) {
      return true;
    }

    // Outro player está ativo
    console.log(
      `🚫 [LOCK] Player ${videoId} BLOQUEADO - ${this.currentActiveId} está ativo`,
    );
    return false;
  }

  release(videoId: string): void {
    if (this.currentActiveId === videoId) {
      console.log(`🔓 [LOCK] Player ${videoId} liberou lock`);
      this.currentActiveId = null;
      this.currentActiveUri = null;
    }
  }

  forceRelease(): void {
    console.log(`🔓 [LOCK] Liberação forçada`);
    this.currentActiveId = null;
    this.currentActiveUri = null;
  }
}

const globalPlayerLock = new VideoPlayerLock();

export function VideoCarouselItem({
  uri,
  onVideoEnd,
  isActive,
  isPaused,
  shouldLoop = false,
  VIDEO_END_CHECK_INTERVAL,
  handleNextPage,
  index,
}: VideoCarouselItemProps) {
  const { width, height } = Dimensions.get("window");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEndedRef = useRef(false);
  const videoIdRef = useRef(Math.random().toString(36).substr(2, 9));
  const isMountedRef = useRef(true);

  // ✅ Estado para controlar se este player pode renderizar
  const [canRender, setCanRender] = useState(false);

  // ✅ CRÍTICO: Verificar lock quando isActive mudar
  useEffect(() => {
    if (!isActive) {
      setCanRender(false);
      globalPlayerLock.release(videoIdRef.current);
      return;
    }

    // Tentar obter lock
    const hasLock = globalPlayerLock.canActivate(uri, videoIdRef.current);

    if (hasLock) {
      console.log(
        `🎥 [VIDEO-${videoIdRef.current}] Obteve permissão (index: ${index})`,
      );
      setCanRender(true);
    } else {
      console.log(
        `⏳ [VIDEO-${videoIdRef.current}] Aguardando liberação (index: ${index})`,
      );
      setCanRender(false);
    }

    return () => {
      globalPlayerLock.release(videoIdRef.current);
      setCanRender(false);
    };
  }, [isActive, uri, index]);

  // ✅ Player criado apenas se tem permissão
  const player = useVideoPlayer(canRender ? uri : "");

  // ✅ Log de criação
  useEffect(() => {
    if (canRender && player) {
      console.log(
        `🎥 [VIDEO-${videoIdRef.current}] Created for: ${uri.substring(
          uri.length - 30,
        )}`,
      );
    }
  }, [canRender, player, uri]);

  // ✅ Configurar player
  useEffect(() => {
    if (!player || !canRender) return;

    try {
      player.loop = shouldLoop;
      player.muted = false;
    } catch (error) {
      console.log(`[VIDEO-${videoIdRef.current}] Erro ao configurar`);
    }
  }, [player, shouldLoop, canRender]);

  // ✅ Limpar interval
  const clearVideoInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ✅ Verificar se player é válido
  const isPlayerValid = useCallback((p: any): boolean => {
    try {
      return p && typeof p.status !== "undefined";
    } catch {
      return false;
    }
  }, []);

  // ✅ Monitorar fim do vídeo
  useEffect(() => {
    if (!canRender || !isActive || shouldLoop || !isPlayerValid(player)) {
      clearVideoInterval();
      return;
    }

    hasEndedRef.current = false;

    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current || !isPlayerValid(player)) {
        clearVideoInterval();
        return;
      }

      try {
        const playerStatus = player.status;
        const currentTime = player.currentTime;
        const duration = player.duration;

        if (
          playerStatus === "idle" &&
          currentTime > 0 &&
          !hasEndedRef.current
        ) {
          hasEndedRef.current = true;
          clearVideoInterval();
          console.log(`🎬 [VIDEO-${videoIdRef.current}] Vídeo terminou`);
          onVideoEnd();
        }

        if (
          duration > 0 &&
          currentTime >= duration - 0.2 &&
          !hasEndedRef.current
        ) {
          hasEndedRef.current = true;
          clearVideoInterval();
          console.log(
            `🎬 [VIDEO-${videoIdRef.current}] Vídeo terminou (fallback)`,
          );
          onVideoEnd();
        }
      } catch {
        clearVideoInterval();
      }
    }, VIDEO_END_CHECK_INTERVAL);

    return () => {
      clearVideoInterval();
    };
  }, [
    canRender,
    player,
    onVideoEnd,
    shouldLoop,
    isActive,
    VIDEO_END_CHECK_INTERVAL,
    clearVideoInterval,
    isPlayerValid,
  ]);

  // ✅ Controlar play/pause
  useEffect(() => {
    if (!isPlayerValid(player) || !canRender) return;

    try {
      if (isActive && !isPaused) {
        console.log(`▶️ [VIDEO-${videoIdRef.current}] Playing`);
        player.play();
      } else {
        console.log(`⏸️ [VIDEO-${videoIdRef.current}] Paused`);
        player.pause();
      }
    } catch (error) {
      console.log(`[VIDEO-${videoIdRef.current}] Erro ao controlar reprodução`);
    }
  }, [isActive, isPaused, player, isPlayerValid, canRender]);

  // ✅ Reset quando não estiver ativo
  useEffect(() => {
    if (!isActive && isPlayerValid(player) && canRender) {
      try {
        player.pause();
        player.currentTime = 0;
        hasEndedRef.current = false;
        console.log(`🔄 [VIDEO-${videoIdRef.current}] Reset`);
      } catch (error) {
        console.log(`[VIDEO-${videoIdRef.current}] Erro ao resetar`);
      }
    }
  }, [isActive, player, isPlayerValid, canRender]);

  // ✅ CRÍTICO: Cleanup completo ao desmontar
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      console.log(
        `🗑️ [VIDEO-${videoIdRef.current}] Unmounting - Cleaning up...`,
      );
      isMountedRef.current = false;

      clearVideoInterval();
      globalPlayerLock.release(videoIdRef.current);

      if (isPlayerValid(player)) {
        try {
          player.pause();
          player.currentTime = 0;
          player.replace({ uri: "" });
          console.log(`✅ [VIDEO-${videoIdRef.current}] MediaCodec released`);
        } catch (error) {
          console.log(`[VIDEO-${videoIdRef.current}] Player já foi liberado`);
        }
      }

      console.log(`✅ [VIDEO-${videoIdRef.current}] Cleanup complete`);
    };
  }, [clearVideoInterval, isPlayerValid, player]);

  // ✅ Reset hasEnded quando URI mudar
  useEffect(() => {
    hasEndedRef.current = false;
  }, [uri]);

  // ✅ CRÍTICO: Não renderizar se não tem permissão
  if (!canRender) {
    return (
      <Pressable
        onPress={handleNextPage}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View style={{ width, height, backgroundColor: "#000" }} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handleNextPage}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <VideoView
        player={player}
        style={{ width, height }}
        contentFit="contain"
        allowsPictureInPicture={false}
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
      />
    </Pressable>
  );
}
