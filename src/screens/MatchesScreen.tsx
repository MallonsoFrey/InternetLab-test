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
import { useGetMatches } from "../hooks/useGetMatches";

type Filter = "all" | "upcoming" | "finished";
const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "upcoming", label: "Предстоящие" },
  { key: "finished", label: "Завершённые" },
];

export function MatchesScreen() {
  const { matches, loading, refreshing, error, updatedAt, refresh } =
    useGetMatches();
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>
      {loading ? (
        <View style={styles.message}>
          <ActivityIndicator />
          <Text>Загрузка матчей...</Text>
        </View>
      ) : (
        <>
          <View style={styles.toolbar}>
            <View>{updatedAt && <UpdatedAgo since={updatedAt} />}</View>
            <Pressable
              style={styles.refreshButton}
              onPress={() => void refresh()}
              disabled={refreshing}
            >
              <Text style={styles.refreshText}>
                {refreshing ? "Обновление…" : "Обновить"}
              </Text>
            </Pressable>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                Не удалось загрузить данные с сервера. Показаны сохранённые
                матчи.
              </Text>
              <Pressable
                onPress={() => void refresh()}
                accessibilityRole="button"
              >
                <Text style={styles.retryText}>Повторить</Text>
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
                  filter === item.key && styles.selectedFilter,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === item.key }}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item.key && styles.selectedFilterText,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {visibleMatches.length ? (
              visibleMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <Text style={styles.empty}>
                Матчей в этой категории пока нет.
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
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
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
  },
  errorText: { color: "#991b1b" },
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
  list: { paddingBottom: 24 },
  empty: { padding: 24, textAlign: "center", color: "#6b7280" },
});
