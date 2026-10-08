import { ScrollView, StyleSheet } from "react-native";
import { Button } from "../Button";
import { MyWater } from "./MyWater";

export function WaterHub({ close }: { close: () => void }) {
  return (
    <ScrollView
      contentContainerStyle={styles.body}
      keyboardShouldPersistTaps="handled"
    >
      <MyWater />
      <Button title="Close / return to map" onPress={close} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  body: { padding: 22, gap: 16, paddingBottom: 48 },
});
