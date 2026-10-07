import { reportSchema } from "@jalnet/contracts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetch as nativeFetch } from "expo/fetch";
import { CameraView, useCameraPermissions } from "expo-camera";
import { File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { api, isLocal } from "./api";
import { Button } from "./Button";
import { clearDraft, type LocalDraft, readDraft, saveDraft } from "./drafts";
import { useUI } from "./ui";

const categories = [
  "WATERLOGGING",
  "FLOOD",
  "LEAK",
  "DRAIN_BLOCKAGE",
  "DRAIN_OVERFLOW",
] as const;
const confirmationResult = z.object({
  eventId: z.uuid(),
  replay: z.boolean(),
  report: reportSchema,
});
export function ReportFlow({ close }: { close: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [draft, setDraft] = useState<LocalDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("WATERLOGGING");
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4>(2);
  const [note, setNote] = useState("");
  const [publicRoad, setPublicRoad] = useState(false);
  const [active, setActive] = useState(false);
  const pin = useUI((s) => s.pin);
  const accuracy = useUI((s) => s.accuracyM);
  const queryClient = useQueryClient();
  useEffect(() => {
    readDraft()
      .then((draft) => {
        setDraft(draft);
        if (draft?.location && !useUI.getState().initialized)
          useUI
            .getState()
            .setPin(draft.location, draft.location.accuracyM ?? null);
      })
      .catch((e) => setError(String(e)));
  }, []);
  const report = useQuery({
    queryKey: ["report", draft?.reportId],
    queryFn: () => api(`/v1/reports/${draft?.reportId}`, reportSchema),
    enabled: !!draft?.reportId,
    refetchInterval: (query) =>
      query.state.data?.status === "ANALYZING" ? 1200 : false,
  });
  const act = async (operation: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await operation();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };
  const capture = () =>
    act(async () => {
      const photo = await camera.current?.takePictureAsync({
        quality: 0.85,
        exif: false,
      });
      if (!photo) throw new Error("Camera did not return an image");
      const context = ImageManipulator.manipulate(photo.uri);
      context.resize(
        photo.width > photo.height ? { width: 1280 } : { height: 1280 },
      );
      const rendered = await context.renderAsync();
      const image = await rendered.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.7,
      });
      const source = new File(image.uri);
      if (source.size > 3_750_000)
        throw new Error("Image exceeds 3.75 MB; retake closer");
      const file = new File(Paths.document, `report-${Date.now()}.jpg`);
      source.copy(file);
      const next = {
        uri: file.uri,
        capturedAt: new Date().toISOString(),
        location: {
          ...pin,
          source:
            accuracy === null
              ? ("USER_PIN" as const)
              : ("CURRENT_LOCATION" as const),
          ...(accuracy === null ? {} : { accuracyM: accuracy }),
        },
      };
      await saveDraft(next);
      setDraft(next);
    });
  const upload = () =>
    act(async () => {
      if (!draft) return;
      let current = draft;
      if (!current.reportId) {
        const created = await api("/v1/reports", reportSchema, {
          action: "DRAFT",
          capturedAt: current.capturedAt,
          location: current.location ?? {
            ...pin,
            source: "USER_PIN",
            ...(accuracy === null ? {} : { accuracyM: accuracy }),
          },
        });
        current = { ...current, reportId: created.id };
        await saveDraft(current);
        setDraft(current);
      }
      const latest = await api(`/v1/reports/${current.reportId}`, reportSchema);
      if (!["DRAFT", "UPLOADING"].includes(latest.status)) {
        queryClient.setQueryData(["report", current.reportId], latest);
        return;
      }
      const file = new File(current.uri);
      const presign = await api(
        "/v1/uploads/presign",
        z.object({ url: z.url(), expiresIn: z.number(), reportId: z.uuid() }),
        {
          reportId: current.reportId,
          contentType: "image/jpeg",
          contentLength: file.size,
        },
      );
      const response = await nativeFetch(presign.url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: file,
      });
      if (!response.ok)
        throw new Error("Private upload failed; your draft is saved for retry");
      await api("/v1/reports", reportSchema, {
        action: "UPLOAD_COMPLETE",
        reportId: current.reportId,
      });
      queryClient.setQueryData(
        ["report", current.reportId],
        await api(`/v1/reports/${current.reportId}`, reportSchema),
      );
    });
  const confirm = () =>
    act(async () => {
      if (!draft?.reportId) return;
      await api(`/v1/reports/${draft.reportId}/confirm`, confirmationResult, {
        category,
        severity,
        location: pin,
        stillActive: true,
        note,
        publicRoad,
      });
      await clearDraft();
      const file = new File(draft.uri);
      if (file.exists) file.delete();
      await queryClient.invalidateQueries();
      close();
    });
  const reset = () =>
    Alert.alert(
      "Discard saved draft?",
      "The local image will be deleted. Uploaded private evidence follows retention policy.",
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            void act(async () => {
              if (draft) {
                const file = new File(draft.uri);
                if (file.exists) file.delete();
              }
              await clearDraft();
              setDraft(null);
            });
          },
        },
      ],
    );
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.title}>Report an observation</Text>
      <Text>
        Pin: {pin.lat.toFixed(5)}, {pin.lon.toFixed(5)}. Close this sheet and
        tap the map to correct it.
      </Text>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      {!draft ? (
        permission?.granted ? (
          <>
            <CameraView ref={camera} style={styles.camera} facing="back" />
            <Button
              title={busy ? "Saving image…" : "Capture JPEG"}
              disabled={busy}
              onPress={capture}
            />
          </>
        ) : (
          <>
            <Text>
              JalNet needs camera permission to capture private evidence. Map
              browsing still works without it.
            </Text>
            <Button
              title="Allow camera"
              onPress={() => {
                void requestPermission();
              }}
            />
            <Button
              title="Open app settings"
              onPress={() => {
                void Linking.openSettings();
              }}
            />
          </>
        )
      ) : (
        <>
          <Image source={{ uri: draft.uri }} style={styles.preview} />
          <Text>Private draft saved on this device. It is not public.</Text>
          {!report.data ||
          ["DRAFT", "UPLOADING"].includes(report.data.status) ? (
            <Button
              title={busy ? "Uploading…" : "Upload private evidence"}
              disabled={busy}
              onPress={upload}
            />
          ) : null}
          {report.data?.status === "ANALYZING" ? (
            <Text>Analyzing private evidence…</Text>
          ) : null}
          {report.data?.status === "NEEDS_CONFIRMATION" ? (
            <>
              <Text style={styles.title}>Confirm what you observed</Text>
              <Text>
                {isLocal
                  ? "LOCAL/DEMO: no image model ran. Classify manually."
                  : (report.data.aiAssessment?.publicDraft ??
                    "Analysis unavailable. Classify manually; your report is retained.")}
              </Text>
              <Text>
                {report.data.aiAssessment?.uncertaintyReasons.join(" ")}
              </Text>
              {categories.map((value) => (
                <Button
                  key={value}
                  title={`${category === value ? "✓ " : ""}${value.replaceAll("_", " ")}`}
                  onPress={() => setCategory(value)}
                />
              ))}
              <Text>Severity: {severity}. Qualitative observation only.</Text>
              <View style={styles.row}>
                {([1, 2, 3, 4] as const).map((n) => (
                  <Button
                    key={n}
                    title={String(n)}
                    onPress={() => setSeverity(n)}
                  />
                ))}
              </View>
              <TextInput
                accessibilityLabel="Observation note"
                placeholder="Optional note; avoid personal details"
                maxLength={500}
                value={note}
                onChangeText={setNote}
                style={styles.input}
              />
              <View style={styles.row}>
                <Text style={styles.flex}>
                  I observed this and it is still active
                </Text>
                <Switch
                  accessibilityLabel="I observed this and it is still active"
                  value={active}
                  onValueChange={setActive}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.flex}>
                  This is a public-road issue. Publish an approximate incident
                  pin.
                </Text>
                <Switch
                  accessibilityLabel="Publish approximate public-road incident"
                  value={publicRoad}
                  onValueChange={setPublicRoad}
                />
              </View>
              <Text>
                Private-property reports stay off the public map and earn no
                public-usefulness points.
              </Text>
              <Button
                title={
                  busy
                    ? "Submitting…"
                    : publicRoad
                      ? "Confirm and publish"
                      : "Confirm private report"
                }
                disabled={busy || !active}
                onPress={confirm}
              />
            </>
          ) : null}
          <Button title="Discard draft" disabled={busy} onPress={reset} />
        </>
      )}
      <Button title="Close / keep draft" onPress={close} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  body: { padding: 20, gap: 14, paddingBottom: 48 },
  title: { fontSize: 23, fontWeight: "600", color: "#123843" },
  camera: { height: 320, borderRadius: 20 },
  preview: { height: 200, borderRadius: 18 },
  error: { color: "#a52525" },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  flex: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#8babae",
    padding: 12,
    borderRadius: 10,
  },
});
