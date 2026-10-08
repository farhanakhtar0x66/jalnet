import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "../Button";
import { MyWater } from "./MyWater";
import { WaterStress } from "./WaterStress";
import { VisionPreview } from "./VisionPreview";

export function WaterHub({ close }: { close: () => void }) {
  const [screen, setScreen] = useState<"tank" | "stress" | "vision">("tank");
  return (
    <ScrollView
      contentContainerStyle={styles.body}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.nav}>
        {(["tank", "stress", "vision"] as const).map((value) => (
          <View key={value} style={styles.tab}>
            <Button
              title={
                value === "tank"
                  ? "My Water"
                  : value === "stress"
                    ? "Stress demo"
                    : "Vision"
              }
              selected={screen === value}
              onPress={() => setScreen(value)}
            />
          </View>
        ))}
      </View>
      {screen === "tank" ? (
        <MyWater />
      ) : screen === "stress" ? (
        <WaterStress />
      ) : (
        <VisionPreview />
      )}
      <Button title="Close / return to map" onPress={close} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  nav: { flexDirection: "row", gap: 8 },
  tab: { flex: 1 },
  body: { padding: 22, gap: 16, paddingBottom: 48 },
});
