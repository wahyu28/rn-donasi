import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name='home' options={{ headerShown: false }} />
      <Stack.Screen name='donations/index' options={{ title: "Donasi Saya" }} />
      <Stack.Screen
        name='donations/new'
        options={{
          title: "Donasi Baru",
          presentation: "modal",
        }}
      />
      <Stack.Screen name='profile' options={{ title: "Profil Saya" }} />
    </Stack>
  );
}
