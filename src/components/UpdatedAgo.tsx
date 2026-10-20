import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
  dark?: boolean;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since, dark = false }: Props) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const update = () =>
      setSeconds(
        Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000)),
      );
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [since]);

  const count = seconds < 60 ? seconds : Math.floor(seconds / 60);
  const unit =
    seconds < 60
      ? ["секунду", "секунды", "секунд"]
      : ["минуту", "минуты", "минут"];
  const lastTwoDigits = count % 100;
  const form =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? 2
      : count % 10 === 1
        ? 0
        : count % 10 >= 2 && count % 10 <= 4
          ? 1
          : 2;
  const elapsed = `${count} ${unit[form]}`;

  return (
    <Text style={[styles.text, dark && styles.darkText]}>
      Обновлено {elapsed} назад
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: "#6b7280",
  },
  darkText: { color: "#9ca3af" },
});
