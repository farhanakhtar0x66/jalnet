import { Pressable, StyleSheet, Text } from "react-native";
export function Button({
  title,
  onPress,
  disabled = false,
  accessibilityLabel,
  selected,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  selected?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{
        disabled,
        ...(selected === undefined ? {} : { selected }),
      }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#125b70",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.45 },
  label: { color: "white", fontWeight: "600", fontSize: 15 },
});
