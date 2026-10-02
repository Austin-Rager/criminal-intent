import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ContextTheme";
import { Crime, getAllCrimes } from "../storage/crimeStorage";

export default function IndexScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [crimes, setCrimes] = useState<Crime[]>([]);

  // Reload from storage every time this screen comes back into focus,
  // so a crime saved on the detail screen shows up when you go back.
  useFocusEffect(
    useCallback(() => {
      getAllCrimes().then((all) => {
        const sorted = [...all].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setCrimes(sorted);
      });
    }, [])
  );

  const renderItem = ({ item }: { item: Crime }) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/crime/[id]", params: { id: item.id } })
      }
      style={[
        styles.row,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.rowText}>
        <Text
          style={[styles.title, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.title || "(Untitled)"}
        </Text>
        <Text style={[styles.date, { color: theme.subtext }]}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      {item.solved && (
        <MaterialDesignIcons
          name="handcuffs"
          size={28}
          color={theme.primary}
        />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={crimes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.subtext }]}>
            No crimes yet. Tap + to add one.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  rowText: { flex: 1, marginRight: 12 },
  title: { fontSize: 17, fontWeight: "600" },
  date: { fontSize: 13, marginTop: 4 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16 },
});