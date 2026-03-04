import { Image } from "expo-image";
import { Pressable } from "react-native";
import { memo } from "react";

interface ImageCarouselItemProps {
  uri: string;
  width: number;
  height: number;
  handleNextPage: () => void;
}

// ✅ Memo para evitar re-renders desnecessários
export const ImageCarouselItem = memo(function ImageCarouselItem({
  uri,
  width,
  height,
  handleNextPage,
}: ImageCarouselItemProps) {
  return (
    <Pressable
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      onPress={handleNextPage}
    >
      <Image
        source={{ uri }}
        style={{ width, height }}
        contentFit="contain"
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={uri}
        priority="high"
      />
    </Pressable>
  );
});
