import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { FavoriteButton } from "./FavoriteButton";
import type { Match } from "../hooks/useGetMatches";

type Props = {
  match: Match;
  favorite: boolean;
  onToggleFavorite: () => void;
};

const statuses: Record<string, string> = {
  scheduled: "Запланирован",
  finished: "Завершён",
  live: "Идёт",
  postponed: "Перенесён",
};

export function MatchCard({ match, favorite, onToggleFavorite }: Props) {
  const pulse = useRef(new Animated.Value(0.35)).current;
  const isLive = match.status === "live";
  const start = match.startsAt ? new Date(match.startsAt) : null;
  const date =
    start && !Number.isNaN(start.getTime())
      ? start.toLocaleString()
      : "Дата не указана";
  const progress = Math.min(Math.max(match.minute ?? 0, 0), 90);

  useEffect(() => {
    if (!isLive) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [isLive, pulse]);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.status}>
          {statuses[match.status] ?? "Статус неизвестен"}
        </Text>
        <FavoriteButton active={favorite} onPress={onToggleFavorite} />
      </View>
      <Text style={styles.date}>{date}</Text>
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
      {isLive && match.minute != null ? (
        <View style={styles.liveProgress}>
          <Text style={styles.minute}>{match.minute}′</Text>
          <View style={styles.track}>
            <View
              style={[styles.progress, { width: `${(progress / 90) * 100}%` }]}
            />
            <Animated.View
              style={[
                styles.liveDot,
                { left: `${(progress / 90) * 100}%`, opacity: pulse },
              ]}
            />
          </View>
        </View>
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
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  status: { color: "#2563eb", fontSize: 13, fontWeight: "700" },
  date: { color: "#6b7280", fontSize: 12, marginBottom: 14 },
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
  liveProgress: { marginTop: 10 },
  minute: {
    marginBottom: 6,
    textAlign: "center",
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "600",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#fee2e2",
    overflow: "visible",
    position: "relative",
  },
  progress: { height: 4, borderRadius: 2, backgroundColor: "#ef4444" },
  liveDot: {
    position: "absolute",
    top: -3,
    width: 10,
    height: 10,
    marginLeft: -5,
    borderRadius: 5,
    backgroundColor: "#dc2626",
  },
});
