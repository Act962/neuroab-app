import { store as globalAppStore } from "@/storge/store";
import { Stack } from "expo-router";
import { SystemBars } from "react-native-edge-to-edge";
import "react-native-reanimated";
import { Provider as TinybaseProvider } from "tinybase/ui-react";

export default function RootLayout() {
  return (
    <TinybaseProvider store={globalAppStore}>
      <SystemBars style="dark" hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { padding: 8 },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="form" />
        <Stack.Screen name="users" />
        <Stack.Screen name="roullete" />
        <Stack.Screen name="admin" options={{ title: "Painel Admin" }} />
        <Stack.Screen
          name="settings-midia"
          options={{ title: "Configurações de mídia" }}
        />
        <Stack.Screen
          name="carousel"
          options={{ contentStyle: { backgroundColor: "#000" } }}
        />
      </Stack>
    </TinybaseProvider>
  );
}
