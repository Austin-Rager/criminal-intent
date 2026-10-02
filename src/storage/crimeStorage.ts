import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export type Crime = {
  id: string;
  title: string;
  details: string;
  date: string;
  solved: boolean;
  photoUri: string | null;
};

const STORAGE_KEY = "crimes";

export function newCrimeId(): string {
  return Crypto.randomUUID();
}

export function getAllCrimes(): Promise<Crime[]> {
  return AsyncStorage.getItem(STORAGE_KEY)
    .then((json) => (json ? (JSON.parse(json) as Crime[]) : []))
    .catch(() => []);
}

export function getCrimeById(id: string): Promise<Crime | null> {
  return getAllCrimes().then(
    (crimes) => crimes.find((c) => c.id === id) ?? null
  );
}

// Inserts a new crime or replaces the existing one with the same id.
export function saveCrime(crime: Crime): Promise<void> {
  return getAllCrimes().then((crimes) => {
    const index = crimes.findIndex((c) => c.id === crime.id);
    const updated =
      index >= 0
        ? crimes.map((c) => (c.id === crime.id ? crime : c))
        : [...crimes, crime];
    return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
}