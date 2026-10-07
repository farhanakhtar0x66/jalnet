import { Pressable, StyleSheet, Text } from "react-native";
export function Button({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
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
