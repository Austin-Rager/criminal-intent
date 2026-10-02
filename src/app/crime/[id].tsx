import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useTheme } from "../../context/ContextTheme";
import { getCrimeById, newCrimeId, saveCrime, } from "../../storage/crimeStorage";

export default function CrimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  // For a new crime, generate the uuid once. Saving twice then updates
  // the same record instead of creating a duplicate.
  const [crimeId] = useState<string>(() =>
    id === "new" ? newCrimeId() : String(id)
  );

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());
  const [solved, setSolved] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Load an existing crime from local storage using the uuid.
  useEffect(() => {
    if (id === "new") return;
    getCrimeById(String(id)).then((crime) => {
      if (!crime) return;
      setTitle(crime.title);
      setDetails(crime.details);
      setDate(new Date(crime.date));
      setSolved(crime.solved);
      setPhotoUri(crime.photoUri);
    });
  }, [id]);

  const pickPhoto = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    })
      .then((result) => {
        if (!result.canceled && result.assets.length > 0) {
          setPhotoUri(result.assets[0].uri);
        }
      })
      .catch(() => {
        Alert.alert("Error", "Could not open your photo library.");
      });
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      // Android shows its own native dialog; close it either way.
      setShowPicker(false);
      if (event.type === "set" && selected) setDate(selected);
    } else if (selected) {
      setDate(selected);
    }
  };

  const onSave = () => {
    saveCrime({
      id: crimeId,
      title: title.trim(),
      details: details.trim(),
      date: date.toISOString(),
      solved,
      photoUri,
    })
      .then(() => {
        Alert.alert("Saved", "Your crime was saved successfully.");
      })
      .catch(() => {
        Alert.alert("Error", "Could not save. Please try again.");
      });
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
      color: theme.text,
    },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Photo (top left) + title + camera button */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.photoBox,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <MaterialDesignIcons
              name="image-outline"
              size={40}
              color={theme.subtext}
            />
          )}
        </View>

        <View style={styles.topRight}>
          <TextInput
            style={inputStyle}
            placeholder="Title"
            placeholderTextColor={theme.subtext}
            value={title}
            onChangeText={setTitle}
          />
          <Pressable
            onPress={pickPhoto}
            style={[styles.cameraButton, { backgroundColor: theme.primary }]}
            accessibilityLabel="Choose photo"
          >
            <MaterialDesignIcons
              name="camera"
              size={24}
              color={theme.isDark ? "#000000" : "#ffffff"}
            />
          </Pressable>
        </View>
      </View>

      {/* Details */}
      <Text style={[styles.label, { color: theme.subtext }]}>Details</Text>
      <TextInput
        style={[inputStyle, styles.detailsInput]}
        placeholder="What happened?"
        placeholderTextColor={theme.subtext}
        value={details}
        onChangeText={setDetails}
        multiline
        textAlignVertical="top"
      />

      {/* Date button */}
      <Text style={[styles.label, { color: theme.subtext }]}>Date</Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={[
          styles.dateButton,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.dateText, { color: theme.text }]}>
          {date.toLocaleDateString()}
        </Text>
      </Pressable>

      {/* Solved checkbox */}
      <Pressable
        onPress={() => setSolved((s) => !s)}
        style={styles.checkRow}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: solved }}
      >
        <MaterialDesignIcons
          name={solved ? "checkbox-marked" : "checkbox-blank-outline"}
          size={28}
          color={theme.primary}
        />
        <Text style={[styles.checkLabel, { color: theme.text }]}>Solved</Text>
      </Pressable>

      {/* Save */}
      <Pressable
        onPress={onSave}
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
      >
        <Text
          style={[
            styles.saveText,
            { color: theme.isDark ? "#000000" : "#ffffff" },
          ]}
        >
          Save
        </Text>
      </Pressable>

      {/* Date picker: native dialog on Android, modal sheet on iOS */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalSheet, { backgroundColor: theme.card }]}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                themeVariant={theme.isDark ? "dark" : "light"}
                onChange={onDateChange}
              />
              <Pressable
                onPress={() => setShowPicker(false)}
                style={[styles.doneButton, { backgroundColor: theme.primary }]}
              >
                <Text
                  style={{
                    color: theme.isDark ? "#000000" : "#ffffff",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  topRow: { flexDirection: "row", marginBottom: 16 },
  photoBox: {
    width: 110,
    height: 110,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  photo: { width: "100%", height: "100%" },
  topRight: { flex: 1, justifyContent: "space-between" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  cameraButton: {
    alignSelf: "flex-start",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 8,
  },
  detailsInput: { minHeight: 110 },
  dateButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  dateText: { fontSize: 16 },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkLabel: { fontSize: 17, marginLeft: 10 },
  saveButton: {
    marginTop: 28,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveText: { fontSize: 17, fontWeight: "bold" },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  doneButton: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
});