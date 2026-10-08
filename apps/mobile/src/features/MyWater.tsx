import type { TankField } from "@jalnet/contracts/water";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import {
  calculateTank,
  editTank,
  parseTankForm,
  simulateTankDay,
  type TankForm,
  tankForm,
} from "../../../../packages/domain/src/water";
import { Button } from "../Button";
import { tankStore } from "./storage";
import { useLocalFeature } from "./useLocalFeature";

const fields: { key: TankField; label: string; helper: string }[] = [
  {
    key: "capacityLitres",
    label: "Tank capacity (litres)",
    helper: "1–1,000,000 L; use your approximate tank capacity.",
  },
  {
    key: "levelPct",
    label: "Current water level (%)",
    helper: "0–100%; enter your estimate, not a meter reading.",
  },
  {
    key: "dailyUseLitres",
    label: "Approximate daily consumption (litres/day)",
    helper:
      "0 or 0.01–1,000,000 L/day. Zero means no finite depletion estimate.",
  },
];
export function MyWater() {
  const state = useLocalFeature(tankStore);
  const sources = state.data
    ? {
        capacityLitres: state.data.capacitySource,
        levelPct: state.data.levelSource,
        dailyUseLitres: state.data.dailyUseSource,
      }
    : null;
  const [form, setForm] = useState<TankForm | null>(null);
  useEffect(() => {
    if (state.data && form === null) setForm(tankForm(state.data));
  }, [state.data, form]);
  const parsed = form ? parseTankForm(form) : null;
  const estimate = parsed?.valid ? calculateTank(parsed.inputs) : null;
  const edit = (field: TankField, text: string) => {
    if (!form || !state.data) return;
    const next = { ...form, [field]: text };
    setForm(next);
    const valid = parseTankForm(next);
    if (valid.valid) state.update(editTank(state.data, valid.inputs, field));
  };
  const reset = () =>
    Alert.alert(
      "Reset My Water demo fixture?",
      "Only this tank is reset: 1,500 L capacity, simulated 60% level, 300 L/day demo consumption. Reports, routes and private drafts are kept.",
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Reset tank only",
          onPress: () => {
            void state.reset().then((value) => {
              if (value) setForm(tankForm(value));
            });
          },
        },
      ],
    );
  return (
    <View style={styles.body}>
      <Text accessibilityRole="header" style={styles.title}>
        My Water
      </Text>
      <Text>
        LOCAL DEVICE · User estimates and simulation; no IoT or live meter.
      </Text>
      {state.loading ? (
        <Text accessibilityLiveRegion="polite">Loading saved tank…</Text>
      ) : null}
      {state.loadError ? (
        <>
          <Text accessibilityRole="alert">{state.loadError}</Text>
          <Button
            title="Retry loading tank"
            disabled={state.loading}
            onPress={() => {
              setForm(null);
              void state.load();
            }}
          />
        </>
      ) : null}
      {!state.loading && !state.loadError && form && state.data ? (
        <>
          {estimate ? (
            <View style={styles.card}>
              <Text style={styles.title}>
                {estimate.remainingLitres.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}{" "}
                L remaining
              </Text>
              <Text>
                {state.data.levelSource === "SIMULATED"
                  ? "SIMULATED"
                  : "USER-ENTERED"}{" "}
                level ·{" "}
                {parsed?.valid
                  ? parsed.inputs.levelPct.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })
                  : ""}
                %
              </Text>
              <Text>
                {estimate.status === "EMPTY"
                  ? "Tank empty in this entered/simulated state."
                  : estimate.hoursRemaining === null
                    ? "Depletion time unavailable: daily consumption is zero."
                    : `~${estimate.hoursRemaining.toLocaleString(undefined, { maximumFractionDigits: 1 })} hours until depletion`}
              </Text>
              <Text>
                ESTIMATE from{" "}
                {state.data.dailyUseSource === "DEMO_FIXTURE"
                  ? "demo"
                  : "USER-ENTERED"}{" "}
                daily consumption. Assumes constant use and no refill; not a
                guaranteed supply forecast.
              </Text>
              <Text>
                Simulated days since level entry/reset:{" "}
                {state.data.simulatedDays}. Time advances only when you simulate
                a day.
              </Text>
            </View>
          ) : (
            <Text accessibilityRole="alert">
              Correct the inputs below to calculate. Invalid edits are not
              saved; your last valid saved values are retained.
            </Text>
          )}
          {fields.map(({ key, label, helper }) => (
            <View style={styles.body} key={key}>
              <Text>{label}</Text>
              <TextInput
                accessibilityLabel={label}
                keyboardType="decimal-pad"
                maxLength={20}
                value={form[key]}
                onChangeText={(text) => edit(key, text)}
                style={styles.input}
              />
              <Text style={styles.small}>{helper}</Text>
              <Text style={styles.small}>
                Source: {sources?.[key].replaceAll("_", " ")}
              </Text>
              {parsed?.errors[key] ? (
                <Text accessibilityRole="alert" style={styles.error}>
                  {parsed.errors[key]}
                </Text>
              ) : null}
            </View>
          ))}
          <Text accessibilityLiveRegion="polite">
            {state.saveStatus === "saving"
              ? "Saving locally…"
              : state.saveStatus === "saved"
                ? "Saved on this device."
                : state.saveStatus === "error"
                  ? "Changes are not saved yet."
                  : "Demo fixture. Edit or reset to save on this device."}
          </Text>
          <Button
            title="Simulate one day of consumption"
            disabled={
              !parsed?.valid ||
              state.loading ||
              state.data.simulatedDays >= 36_500
            }
            onPress={() => {
              if (!state.data || !parsed?.valid) return;
              const next = simulateTankDay(state.data);
              state.update(next);
              setForm(tankForm(next));
            }}
          />
        </>
      ) : null}
      {state.saveError ? (
        <>
          <Text accessibilityRole="alert">{state.saveError}</Text>
          {state.data && !state.loadError ? (
            <Button
              title="Retry saving tank"
              disabled={state.loading || !parsed?.valid}
              onPress={() => {
                if (state.data) state.update(state.data);
              }}
            />
          ) : null}
        </>
      ) : null}
      <Button
        title="Reset My Water demo fixture"
        disabled={state.loading}
        onPress={reset}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  body: { gap: 10 },
  title: { fontSize: 23, fontWeight: "600", color: "#123843" },
  card: { gap: 10, padding: 16, backgroundColor: "#e6efea", borderRadius: 16 },
  input: {
    minHeight: 48,
    padding: 12,
    borderWidth: 1,
    borderColor: "#8babae",
    borderRadius: 10,
    color: "#123843",
  },
  small: { color: "#52676d" },
  error: { color: "#a52525" },
});
