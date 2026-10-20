import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MatchCard } from "../components/MatchCard";
import { UpdatedAgo } from "../components/UpdatedAgo";
import { useFavorites } from "../hooks/useFavorites";
import { useGetMatches } from "../hooks/useGetMatches";

type Filter = "all" | "upcoming" | "finished";
const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "upcoming", label: "Предстоящие" },
  { key: "finished", label: "Завершённые" },
];

type Props = { dark: boolean; onToggleTheme: () => void };

export function MatchesScreen({ dark, onToggleTheme }: Props) {
  const { matches, loading, refreshing, error, updatedAt, refresh } =
    useGetMatches();
  const { isFavorite, toggle } = useFavorites();
  const [filter, setFilter] = useState<Filter>("all");
  const visibleMatches = useMemo(
    () =>
      (matches ?? []).filter(
        (match) =>
          filter === "all" ||
          (filter === "upcoming" && match.status === "scheduled") ||
          (filter === "finished" && match.status === "finished"),
      ),
    [filter, matches],
  );
  const filterCounts = useMemo(
    () => ({
      all: matches?.length ?? 0,
      upcoming:
        matches?.filter((match) => match.status === "scheduled").length ?? 0,
      finished:
        matches?.filter((match) => match.status === "finished").length ?? 0,
    }),
    [matches],
  );
  const hasOtherStatuses = matches?.some(
    (match) => match.status !== "scheduled" && match.status !== "finished",
  );

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, dark && styles.darkText]}>Матчи тура</Text>
        <Pressable
          style={[styles.themeButton, dark && styles.darkButton]}
          onPress={onToggleTheme}
          accessibilityRole="button"
          accessibilityLabel={
            dark ? "Включить светлую тему" : "Включить тёмную тему"
          }
        >
          <Text style={[styles.themeText, dark && styles.darkText]}>
            {dark ? "☀️ Светлая" : "🌙 Тёмная"}
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <View style={styles.message}>
          <ActivityIndicator color={dark ? "#93c5fd" : undefined} />
          <Text style={dark && styles.darkText}>Загрузка матчей...</Text>
        </View>
      ) : (
        <>
          <View style={styles.toolbar}>
            <View>
              {updatedAt && <UpdatedAgo since={updatedAt} dark={dark} />}
            </View>
            <Pressable
              style={[styles.refreshButton, dark && styles.darkButton]}
              onPress={() => void refresh()}
              disabled={refreshing}
            >
              <Text style={[styles.refreshText, dark && styles.darkButtonText]}>
                {refreshing ? "Обновление…" : "Обновить"}
              </Text>
            </Pressable>
          </View>

          {error && (
            <View style={[styles.errorBox, dark && styles.darkErrorBox]}>
              <Text style={[styles.errorText, dark && styles.darkErrorText]}>
                Не удалось загрузить данные с сервера. Показаны сохранённые
                матчи.
              </Text>
              <Pressable
                onPress={() => void refresh()}
                accessibilityRole="button"
              >
                <Text style={[styles.retryText, dark && styles.darkErrorText]}>
                  Повторить
                </Text>
              </Pressable>
            </View>
          )}

          <View style={styles.filters}>
            {filters.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                style={[
                  styles.filterButton,
                  dark && styles.darkButton,
                  filter === item.key && styles.selectedFilter,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === item.key }}
              >
                <Text
                  style={[
                    styles.filterText,
                    dark && styles.darkButtonText,
                    filter === item.key && styles.selectedFilterText,
                  ]}
                >
                  {item.label} ({filterCounts[item.key]})
                </Text>
              </Pressable>
            ))}
          </View>
          {hasOtherStatuses && (
            <Text style={[styles.filterHint, dark && styles.darkSecondary]}>
              Идущие, перенесённые и другие статусы доступны во вкладке «Все».
            </Text>
          )}

          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {visibleMatches.length ? (
              visibleMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  favorite={isFavorite(match.id)}
                  onToggleFavorite={() => toggle(match.id)}
                  dark={dark}
                />
              ))
            ) : (
              <Text style={[styles.empty, dark && styles.darkSecondary]}>
                {matches?.length
                  ? `Матчей в категории «${filters.find((item) => item.key === filter)?.label}» пока нет.`
                  : "Матчей пока нет."}
              </Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  darkContainer: { backgroundColor: "#111827" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  darkText: { color: "#f9fafb" },
  themeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  themeText: { color: "#374151", fontWeight: "600" },
  message: {
    marginTop: 12,
    alignItems: "center",
    gap: 10,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  refreshButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e0e7ff",
  },
  refreshText: { color: "#3730a3", fontWeight: "600" },
  darkButton: { backgroundColor: "#374151" },
  darkButtonText: { color: "#e5e7eb" },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
  },
  errorText: { color: "#991b1b" },
  darkErrorBox: { backgroundColor: "#451a1a" },
  darkErrorText: { color: "#fecaca" },
  retryText: { marginTop: 6, color: "#b91c1c", fontWeight: "700" },
  filters: { flexDirection: "row", gap: 8, marginVertical: 16 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  selectedFilter: { backgroundColor: "#1d4ed8" },
  filterText: { color: "#374151", fontSize: 13 },
  selectedFilterText: { color: "#fff", fontWeight: "600" },
  filterHint: {
    marginTop: -8,
    marginBottom: 12,
    color: "#6b7280",
    fontSize: 12,
  },
  darkSecondary: { color: "#9ca3af" },
  list: { paddingBottom: 24 },
  empty: { padding: 24, textAlign: "center", color: "#6b7280" },
});
