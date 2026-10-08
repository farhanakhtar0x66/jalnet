import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  calculateStress,
  parseStressForm,
  stressDemoFixture,
  stressFactors,
  stressForm,
} from "../../../../packages/domain/src/water-stress";
import { Button } from "../Button";

export function WaterStress() {
  const [form, setForm] = useState(() => stressForm(stressDemoFixture()));
  const parsed = parseStressForm(form);
  const result = parsed.valid ? calculateStress(parsed.inputs) : null;
  return (
    <View style={styles.body}>
      <Text accessibilityRole="header" style={styles.title}>
        Water Stress
      </Text>
      <Text>
        DEMO INDICATOR · Demo Delhi area · Fictional inputs, not current
        official environmental measurements.
      </Text>
      <View style={styles.card}>
        <Text style={styles.title}>
          {result?.score === null || !result
            ? "No headline score"
            : `${result.score}/100 · ${result.band}`}
        </Text>
        <Text>
          {result?.band === "UNAVAILABLE"
            ? "No data. Add sample pressures to explore the method."
            : result?.band === "LIMITED_DATA"
              ? "Limited data. Less than 60% of weighted inputs is available."
              : !result
                ? "Correct the invalid inputs below to calculate."
                : "Calculated DEMO INDICATOR; not a supply or safety forecast."}
        </Text>
        {result ? (
          <Text>
            Weighted input coverage: {Math.round(result.coverage * 100)}%.
            Coverage describes available sample weights, not scientific
            confidence.
          </Text>
        ) : null}
      </View>
      <Text>
        Inspect and edit the contributing sample pressures. 0 means no sample
        pressure, 100 means maximum sample pressure; clear a field to mark it
        missing. Edits remain fictional, apply immediately and reset when this
        screen reopens.
      </Text>
      {stressFactors.map((factor) => {
        const contribution = result?.contributors.find(
          (item) => item.id === factor.id,
        );
        return (
          <View style={styles.card} key={factor.id}>
            <Text>{factor.label} · DEMO</Text>
            <TextInput
              accessibilityLabel={`${factor.label}, demo pressure from 0 to 100; blank means missing`}
              keyboardType="decimal-pad"
              maxLength={20}
              value={form[factor.id]}
              onChangeText={(value) =>
                setForm((current) => ({ ...current, [factor.id]: value }))
              }
              style={styles.input}
            />
            {parsed.errors[factor.id] ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {parsed.errors[factor.id]}
              </Text>
            ) : null}
            <Text>{factor.meaning}</Text>
            <Text>Base weight: {factor.weight * 100}%.</Text>
            {contribution ? (
              <Text>
                {contribution.value === null
                  ? "Missing · excluded, never treated as zero."
                  : `Effective weight: ${(contribution.effectiveWeight * 100).toFixed(1)}% · contribution: ${contribution.contributionPoints?.toFixed(1)} points.`}
              </Text>
            ) : null}
          </View>
        );
      })}
      <Text accessibilityRole="header" style={styles.title}>
        Method and limitations
      </Text>
      <Text>
        Score = 100 × sum(available pressure × base weight) / sum(available base
        weights), rounded to the nearest integer. Missing factors are excluded
        and weights renormalized. No headline score below 60% coverage. Bands:
        0–24 Low, 25–49 Moderate, 50–74 High, 75–100 Critical.
      </Text>
      <Text>
        These prototype weights/bands are not calibrated or official standards.
        There are no live feeds, measured water volumes, current timestamps or
        personal tank inputs here. This indicator does not change citizen
        incidents, route warnings or droplets. It cannot establish safe routes
        or adequate water supply.
      </Text>
      <Button
        title="Restore Water Stress DEMO inputs"
        onPress={() => setForm(stressForm(stressDemoFixture()))}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  body: { gap: 12 },
  title: { fontSize: 23, fontWeight: "600", color: "#123843" },
  card: { padding: 16, gap: 10, borderRadius: 16, backgroundColor: "#e6efea" },
  input: {
    minHeight: 48,
    padding: 12,
    borderWidth: 1,
    borderColor: "#8babae",
    borderRadius: 10,
    color: "#123843",
  },
  error: { color: "#a52525" },
});
