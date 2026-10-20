import { StyleSheet, Text, View } from "react-native";
import type { Match } from "../hooks/useGetMatches";

type Props = { match: Match };

const statuses: Record<string, string> = {
  scheduled: "Предстоит",
  finished: "Завершён",
  live: "Идёт",
  postponed: "Перенесён",
};

export function MatchCard({ match }: Props) {
  const start = match.startsAt ? new Date(match.startsAt) : null;
  const date =
    start && !Number.isNaN(start.getTime())
      ? start.toLocaleString()
      : "Дата не указана";

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.status}>
          {statuses[match.status] ?? "Статус неизвестен"}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.teams}>
        <Text style={styles.team} numberOfLines={1}>
          {match.home.name}
        </Text>
        <Text style={styles.score}>
          {match.score ? `${match.score.home} : ${match.score.away}` : "—"}
        </Text>
        <Text style={[styles.team, styles.away]} numberOfLines={1}>
          {match.away.name}
        </Text>
      </View>
      {match.status === "live" && match.minute != null ? (
        <Text style={styles.minute}>{match.minute}′</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  status: { color: "#2563eb", fontSize: 13, fontWeight: "700" },
  date: { color: "#6b7280", fontSize: 12, flexShrink: 1, textAlign: "right" },
  teams: { flexDirection: "row", alignItems: "center", gap: 10 },
  team: { flex: 1, color: "#111827", fontSize: 15, fontWeight: "600" },
  away: { textAlign: "right" },
  score: {
    minWidth: 48,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  minute: { marginTop: 8, textAlign: "center", color: "#dc2626", fontSize: 12 },
});
