import Ionicons from "@react-native-vector-icons/ionicons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeProvider, useTheme } from "../context/ContextTheme";

function SettingsButton() {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() => router.push("/settings")}
      hitSlop={10}
      accessibilityLabel="Settings"
    >
      <Ionicons name="settings-sharp" size={24} color={theme.headerText} />
    </Pressable>
  );
}

function AddButton() {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/crime/[id]", params: { id: "new" } })
      }
      hitSlop={10}
      accessibilityLabel="Add crime"
    >
      <Ionicons name="add" size={32} color={theme.headerText} />
    </Pressable>
  );
}

function IndexHeaderRight() {
  return (
    <View style={styles.row}>
      <AddButton />
      <SettingsButton />
    </View>
  );
}

function ThemedStack() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Criminal Intent",
            headerRight: () => <IndexHeaderRight />,
          }}
        />
        <Stack.Screen
          name="crime/[id]"
          options={{
            title: "Crime Detail",
            headerRight: () => <SettingsButton />,
          }}
        />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});