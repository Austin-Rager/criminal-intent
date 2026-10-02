import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { themes, useTheme } from "../context/ContextTheme";

export default function SettingsScreen() {
  const { theme, setThemeByName } = useTheme();

  const light = themes.filter((t) => !t.isDark);
  const dark = themes.filter((t) => t.isDark);

  const renderGroup = (title: string, group: typeof themes) => (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, { color: theme.subtext }]}>{title}</Text>
      {group.map((t) => {
        const selected = t.name === theme.name;
        return (
          <Pressable
            key={t.name}
            onPress={() => setThemeByName(t.name)}
            style={[
              styles.option,
              {
                backgroundColor: theme.card,
                borderColor: selected ? theme.primary : theme.border,
                borderWidth: selected ? 2 : 1,
              },
            ]}
          >
            <View style={[styles.swatch, { backgroundColor: t.primary }]} />
            <Text style={[styles.optionText, { color: theme.text }]}>
              {t.name}
            </Text>
            {selected && (
              <Text style={{ color: theme.primary, fontWeight: "bold" }}>
                Selected
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      {renderGroup("Light themes", light)}
      {renderGroup("Dark themes", dark)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  group: { marginBottom: 24 },
  groupTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  swatch: { width: 24, height: 24, borderRadius: 12, marginRight: 12 },
  optionText: { flex: 1, fontSize: 16 },
});