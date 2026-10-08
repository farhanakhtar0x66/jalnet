import { StyleSheet, Text, View } from "react-native";
import { demoSuppliers } from "./demo-data";

export function VisionPreview() {
  return (
    <View style={styles.body}>
      <Text accessibilityRole="header" style={styles.title}>
        TankerOS · DEMO preview
      </Text>
      <Text>
        Fictional supplier discovery. No real supplier is enrolled or contacted;
        no tanker is booked and no payment is processed. Reservation and
        order-status simulation are not implemented, so this preview has no
        booking action.
      </Text>
      {demoSuppliers.map((supplier) => (
        <View key={supplier.id} style={styles.card}>
          <Text>{supplier.name} · DEMO</Text>
          <Text>
            Sample tanker volume: {supplier.capacityLitres.toLocaleString()} L ·
            DEMO
          </Text>
          <Text>
            Sample price: ₹{supplier.samplePriceINR.toLocaleString()} · DEMO,
            not a real quote
          </Text>
        </View>
      ))}
      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.title}>
          HeatSafe · PLANNED
        </Text>
        <Text>
          Future idea: explain heat exposure alongside water access when
          verified data and route providers are available. No heat measurements,
          exposure score, heat-aware routing or live safety guidance is
          implemented.
        </Text>
      </View>
      <Text>
        Future intelligence · PLANNED: verified public-data inputs, optional
        tank meters and predictive features require separate design and
        validation. This roadmap does not promise guaranteed safe routes.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  body: { gap: 12 },
  title: { fontSize: 23, fontWeight: "600", color: "#123843" },
  card: { padding: 16, gap: 10, borderRadius: 16, backgroundColor: "#e6efea" },
});
