import {
  eventSchema,
  ledgerEntrySchema,
  savedRouteSchema,
} from "@jalnet/contracts/events";
import { decodePolyline, radiusRing } from "@jalnet/geo";
import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  Layer,
  Map as NativeMap,
} from "@maplibre/maplibre-react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import { api, isLocal } from "./api";
import { Button } from "./Button";
import { cachedApi } from "./cache";
import { foregroundFix } from "./location";
import { ReportFlow } from "./ReportFlow";
import { SignIn } from "./SignIn";
import { demoCenter, type Layer as LayerName, useUI } from "./ui";

const layers: LayerName[] = ["LIVE", "FLOOD", "LEAKS", "DRAINS", "ROUTE_RISK"];
const mapKey = process.env.EXPO_PUBLIC_LOCATION_MAP_KEY;
// Official MapLibre demo basemap; no Amazon rendering verification implied.
const mapStyle = isLocal
  ? "https://demotiles.maplibre.org/style.json"
  : mapKey
    ? `https://maps.geo.${process.env.EXPO_PUBLIC_AWS_REGION ?? "ap-south-1"}.amazonaws.com/v2/styles/Monochrome/descriptor?key=${encodeURIComponent(mapKey)}`
    : null;
const publicSchema = eventSchema.extend({
  provenance: z.string(),
  verificationLabel: z.string(),
});
const riskSchema = z.object({
  route: savedRouteSchema,
  risks: z.array(
    z.object({
      eventId: z.uuid(),
      warning: z.boolean(),
      message: z.string(),
      score: z.number(),
      intersects: z.boolean(),
    }),
  ),
});
export function Home() {
  const camera = useRef<CameraRef>(null);
  const pin = useUI((s) => s.pin);
  const layer = useUI((s) => s.layer);
  const selected = useUI((s) => s.selected);
  const accuracy = useUI((s) => s.accuracyM);
  const [sheet, setSheet] = useState<
    "camera" | "layers" | "routes" | "profile" | null
  >(null);
  const [bbox, setBbox] = useState<[number, number, number, number]>([
    77.2, 28.6, 77.22, 28.63,
  ]);
  const pendingBbox = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mapError, setMapError] = useState("");
  const [routeName, setRouteName] = useState("");
  const [origin, setOrigin] = useState<typeof pin | null>(null);
  const [busy, setBusy] = useState(false);
  const eventResult = useQuery({
    queryKey: ["events", bbox, layer],
    queryFn: () =>
      cachedApi(
        `/v1/events?bbox=${bbox.join(",")}&layers=${layer}`,
        z.array(publicSchema),
      ),
  });
  const events = { ...eventResult, data: eventResult.data?.value };
  const routeResult = useQuery({
    queryKey: ["routes"],
    queryFn: () => cachedApi("/v1/routes", z.array(savedRouteSchema)),
  });
  const routes = { ...routeResult, data: routeResult.data?.value };
  const risk = useQuery({
    queryKey: ["risks", routes.data],
    queryFn: () =>
      Promise.all(
        (routes.data ?? []).map((route) =>
          api(`/v1/routes/${route.id}/risk`, riskSchema),
        ),
      ),
    enabled: !!routes.data && !routeResult.data?.fromCache,
  });
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      api(
        "/v1/me",
        z.object({
          userId: z.string(),
          droplets: z.number(),
          ledger: z.array(ledgerEntrySchema),
        }),
      ),
  });
  const cache = useQueryClient();
  useEffect(
    () => () => {
      if (pendingBbox.current) clearTimeout(pendingBbox.current);
    },
    [],
  );
  const act = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      Alert.alert(
        "Unable to complete",
        error instanceof Error ? error.message : "Try again",
      );
    } finally {
      setBusy(false);
    }
  };
  const recenter = () =>
    Alert.alert(
      "Use foreground location?",
      "JalNet uses it to recenter and place a report. You can tap the map to choose a pin instead.",
      [
        { text: "Choose pin", style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            void act(async () => {
              const permission =
                await Location.requestForegroundPermissionsAsync();
              if (permission.status !== "granted") {
                Alert.alert(
                  "Choose an area",
                  "Location was not granted. Tap the map to choose a pin.",
                );
                return;
              }
              const position = await foregroundFix();
              const point = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };
              useUI.getState().setPin(point, position.coords.accuracy);
              camera.current?.flyTo({
                center: [point.lon, point.lat],
                zoom: 15,
                duration: 800,
              });
            });
          },
        },
      ],
    );
  const feature = events.data?.find((event) => event.id === selected);
  const warnings = (
    routeResult.data?.fromCache ||
    eventResult.data?.fromCache ||
    risk.isError ||
    risk.isFetching ||
    events.isError
      ? []
      : (risk.data ?? [])
  ).flatMap((r) => r.risks.map((w) => ({ ...w, name: r.route.name })));
  const geo: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: (events.data ?? []).map((event) => ({
      type: "Feature",
      id: event.id,
      properties: {
        eventId: event.id,
        severity: event.severity,
        status: event.status,
        confidence: event.confidence,
      },
      geometry: {
        type: "Point",
        coordinates: [event.location.lon, event.location.lat],
      },
    })),
  };
  const routeGeo: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: (routes.data ?? []).map((route) => ({
      type: "Feature",
      properties: { name: route.name },
      geometry: {
        type: "LineString",
        coordinates: decodePolyline(route.polyline),
      },
    })),
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.top}>
        <Text style={styles.brand}>JalNet</Text>
        <Text style={styles.mode}>
          {isLocal
            ? "LOCAL / DEMO · AWS blocked awaiting SSO"
            : "AWS providers · live verification pending"}
        </Text>
      </View>
      {mapStyle ? (
        <NativeMap
          style={styles.map}
          mapStyle={mapStyle}
          attribution
          logo
          onDidFailLoadingMap={() =>
            setMapError(
              "Basemap unavailable. Check network and map configuration.",
            )
          }
          onPress={(event) => {
            const [lon, lat] = event.nativeEvent.lngLat;
            useUI.getState().setPin({ lat, lon });
          }}
          onRegionDidChange={(event) => {
            const bounds = event.nativeEvent.bounds;
            if (pendingBbox.current) clearTimeout(pendingBbox.current);
            pendingBbox.current = setTimeout(() => {
              const [w, s, e, n] = bounds;
              const dx = (e - w) * 0.1,
                dy = (n - s) * 0.1;
              const padded: [number, number, number, number] = [
                Math.max(-180, w - dx),
                Math.max(-85, s - dy),
                Math.min(180, e + dx),
                Math.min(85, n + dy),
              ];
              if (
                (padded[2] - padded[0]) * (padded[3] - padded[1]) <= 0.04 &&
                w < e &&
                s < n
              ) {
                setBbox(
                  padded.map(
                    (value, index) =>
                      (index < 2
                        ? Math.floor(value * 1000)
                        : Math.ceil(value * 1000)) / 1000,
                  ) as typeof padded,
                );
                setMapError("");
              } else
                setMapError("Zoom in to load incidents in a smaller area.");
            }, 400);
          }}
        >
          <Camera
            ref={camera}
            initialViewState={{
              center: [demoCenter.lon, demoCenter.lat],
              zoom: 14,
            }}
          />
          <GeoJSONSource id="routes" data={routeGeo}>
            <Layer
              id="route-lines"
              type="line"
              paint={{
                "line-color": "#217583",
                "line-width": 4,
                "line-opacity": 0.65,
              }}
            />
          </GeoJSONSource>
          <GeoJSONSource
            id="incident-areas"
            data={{
              type: "FeatureCollection",
              features: (events.data ?? []).map((event) => ({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    radiusRing(event.location, event.location.semanticRadiusM),
                  ],
                },
              })),
            }}
          >
            <Layer
              id="incident-area-fill"
              type="fill"
              paint={{ "fill-color": "#28718a", "fill-opacity": 0.12 }}
            />
          </GeoJSONSource>
          <GeoJSONSource
            id="incidents"
            data={geo}
            cluster
            clusterMaxZoom={13}
            onPress={(event) => {
              const id = event.nativeEvent.features?.[0]?.properties?.eventId;
              if (typeof id === "string") useUI.getState().select(id);
              else camera.current?.zoomTo(15, { duration: 500 });
              event.stopPropagation();
            }}
          >
            <Layer
              id="event-points"
              type="circle"
              paint={{
                "circle-color": [
                  "case",
                  ["==", ["get", "status"], "ACTIVE"],
                  "#e07732",
                  "#28718a",
                ],
                "circle-radius": 9,
                "circle-opacity": [
                  "case",
                  ["==", ["get", "status"], "MONITORING"],
                  0.6,
                  1,
                ],
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff",
              }}
            />
          </GeoJSONSource>
          <GeoJSONSource
            id="report-pin"
            data={{
              type: "Feature",
              properties: {},
              geometry: { type: "Point", coordinates: [pin.lon, pin.lat] },
            }}
          >
            <Layer
              id="pin"
              type="circle"
              paint={{
                "circle-radius": 6,
                "circle-color": "#183b44",
                "circle-stroke-width": 3,
                "circle-stroke-color": "#fff",
              }}
            />
          </GeoJSONSource>
        </NativeMap>
      ) : (
        <View style={[styles.map, styles.blocked]}>
          <Text>
            Amazon Location map configuration is blocked awaiting SSO.
          </Text>
        </View>
      )}
      <View style={styles.notice}>
        <Text>
          {(eventResult.data?.fromCache
            ? `Offline cached reports from ${new Date(eventResult.data.cachedAt).toLocaleString()}; current conditions unknown.`
            : "") ||
            mapError ||
            events.error?.message ||
            (events.isFetching
              ? "Refreshing reports…"
              : events.data?.length
                ? `Jal Pulse · ${events.data.length} current reports · tap a marker`
                : "Jal Pulse · No current reports in this area. Conditions may still change.")}
        </Text>
        {eventResult.data?.fromCache ||
        routeResult.data?.fromCache ||
        events.isError ||
        routes.isError ? (
          <Button
            title="Retry connection"
            disabled={events.isFetching || routes.isFetching}
            onPress={() => {
              void cache.invalidateQueries();
            }}
          />
        ) : null}
        {warnings[0] ? (
          <Text style={styles.warning}>
            {warnings[0].name}: {warnings[0].message}
          </Text>
        ) : null}
        <Text style={styles.small}>
          Pin {pin.lat.toFixed(4)}, {pin.lon.toFixed(4)} ·{" "}
          {accuracy === null
            ? "chosen area"
            : `location accuracy ~${Math.round(accuracy)} m`}
        </Text>
      </View>
      <View style={styles.controls}>
        <Button title="Layers" onPress={() => setSheet("layers")} />
        <Button title="Locate" disabled={busy} onPress={recenter} />
      </View>
      <View style={styles.bottom}>
        <Button title="Routes" onPress={() => setSheet("routes")} />
        <Button title="Camera" onPress={() => setSheet("camera")} />
        <Button title="Profile" onPress={() => setSheet("profile")} />
      </View>
      <Modal
        visible={sheet !== null || !!feature}
        animationType="slide"
        onRequestClose={() => {
          setSheet(null);
          useUI.getState().select(null);
        }}
      >
        <View style={styles.modal}>
          {sheet === "camera" ? (
            <ReportFlow close={() => setSheet(null)} />
          ) : (
            <ScrollView contentContainerStyle={styles.sheet}>
              {sheet === "layers" ? (
                <>
                  <Text style={styles.title}>Map layers</Text>
                  {layers.map((value) => (
                    <Button
                      key={value}
                      title={`${layer === value ? "✓ " : ""}${value.replaceAll("_", " ")}`}
                      onPress={() => {
                        useUI.getState().setLayer(value);
                        setSheet(null);
                      }}
                    />
                  ))}
                  <Text>
                    Water Stress, My Water, TankerOS, and route alternatives are
                    unavailable until P0 is complete.
                  </Text>
                </>
              ) : null}
              {sheet === "routes" ? (
                <>
                  <Text style={styles.title}>Saved routes</Text>
                  {isLocal ? (
                    <Text>
                      LOCAL/DEMO: straight-line corridors for intersection
                      testing. These are not calculated road routes or
                      navigation directions.
                    </Text>
                  ) : null}
                  <Text>
                    Tap the map to choose an origin, save it here, then tap your
                    destination and return.
                  </Text>
                  <TextInput
                    accessibilityLabel="Route name"
                    placeholder="Route name"
                    value={routeName}
                    onChangeText={setRouteName}
                    maxLength={80}
                    style={styles.input}
                  />
                  <Button
                    title={
                      origin
                        ? `Origin saved: ${origin.lat.toFixed(4)}, ${origin.lon.toFixed(4)}`
                        : "Use current pin as origin"
                    }
                    onPress={() => setOrigin(pin)}
                  />
                  <Button
                    title="Save route to current pin"
                    disabled={busy || !origin || !routeName.trim()}
                    onPress={() => {
                      void act(async () => {
                        await api(
                          "/v1/routes",
                          z.object({
                            route: savedRouteSchema,
                            provenance: z.string(),
                          }),
                          {
                            name: routeName,
                            origin,
                            destination: pin,
                            travelMode: "Car",
                            activeAlerts: true,
                          },
                        );
                        setOrigin(null);
                        setRouteName("");
                        await cache.invalidateQueries();
                      });
                    }}
                  />
                  {routes.error ? <Text>{routes.error.message}</Text> : null}
                  {(routes.data ?? []).map((route) => (
                    <View key={route.id} style={styles.card}>
                      <Text style={styles.title}>{route.name}</Text>
                      <Text>
                        {routeResult.data?.fromCache || risk.error
                          ? "Route risk unavailable; current conditions unknown."
                          : risk.data?.find((r) => r.route.id === route.id)
                                ?.risks.length
                            ? "Currently reported hazards may affect this route."
                            : "No intersecting reports found. This does not establish safety."}
                      </Text>
                      <Button
                        title={`Delete ${route.name}`}
                        onPress={() => {
                          void act(async () => {
                            await api(
                              `/v1/routes/${route.id}`,
                              z.object({ deleted: z.boolean() }),
                              undefined,
                              "DELETE",
                            );
                            await cache.invalidateQueries();
                          });
                        }}
                      />
                    </View>
                  ))}
                </>
              ) : null}
              {sheet === "profile" ? (
                <>
                  <Text style={styles.title}>Your contributions</Text>
                  {!isLocal ? <SignIn /> : null}
                  <Text style={styles.brand}>
                    {profile.data?.droplets ?? "—"} droplets
                  </Text>
                  <Text>
                    Submission points are provisional and capped. Meaningful
                    awards require independent supporting evidence.
                  </Text>
                  {profile.error ? <Text>{profile.error.message}</Text> : null}
                  {profile.data?.ledger.map((entry) => (
                    <Text key={entry.id}>
                      {entry.amount > 0 ? "+" : ""}
                      {entry.amount} · {entry.reason.replaceAll("_", " ")} ·{" "}
                      {entry.createdAt.slice(0, 10)}
                    </Text>
                  ))}
                  <Text>
                    People-helped estimates are unavailable until a validated
                    measurement is implemented.
                  </Text>
                </>
              ) : null}
              {feature ? (
                <>
                  <Text style={styles.title}>
                    {feature.type.replaceAll("_", " ")}
                  </Text>
                  <Text>
                    Approximate affected-area radius:{" "}
                    {feature.location.semanticRadiusM} m, from the incident
                    category policy. This is not a measured water extent.
                  </Text>
                  <Text>{feature.publicSummary}</Text>
                  <Text>
                    {feature.verificationLabel} · {feature.reportCount}{" "}
                    observations
                  </Text>
                  <Text>
                    Last observed:{" "}
                    {new Date(feature.lastSeenAt).toLocaleString()}
                  </Text>
                  <Text>
                    Severity {feature.severity}/5 · exact depth and road
                    conditions unknown.
                  </Text>
                  {(["CONFIRM", "CLEARED", "NOT_SURE"] as const).map(
                    (action) => (
                      <Button
                        key={action}
                        title={
                          action === "CONFIRM"
                            ? "Still observed"
                            : action === "CLEARED"
                              ? "Appears cleared"
                              : "Not sure"
                        }
                        disabled={busy}
                        onPress={() => {
                          void act(async () => {
                            const permission =
                              await Location.requestForegroundPermissionsAsync();
                            if (permission.status !== "granted")
                              throw new Error(
                                "A current foreground location is required for an independent observation. You can still browse without it.",
                              );
                            const current = await foregroundFix();
                            if (
                              current.coords.accuracy === null ||
                              current.coords.accuracy > 100
                            )
                              throw new Error(
                                "Location accuracy must be within 100 m; try later. Never approach a hazard to verify it.",
                              );
                            await api(
                              `/v1/events/${feature.id}/confirm`,
                              z.object({
                                event: publicSchema,
                                replay: z.boolean(),
                              }),
                              {
                                action,
                                location: {
                                  lat: current.coords.latitude,
                                  lon: current.coords.longitude,
                                },
                                accuracyM: current.coords.accuracy,
                                observedAt: new Date().toISOString(),
                              },
                            );
                            await cache.invalidateQueries();
                          });
                        }}
                      />
                    ),
                  )}
                  <Text>
                    To add independent evidence, close this sheet and capture
                    your own current observation.
                  </Text>
                </>
              ) : null}
              <Button
                title="Close"
                onPress={() => {
                  setSheet(null);
                  useUI.getState().select(null);
                }}
              />
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6f1" },
  top: {
    paddingTop: Platform.OS === "android" ? 34 : 52,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  brand: { fontSize: 27, fontWeight: "700", color: "#173f49" },
  mode: { fontSize: 12, color: "#77531a", marginTop: 4 },
  map: { flex: 1 },
  blocked: { justifyContent: "center", padding: 32 },
  notice: {
    position: "absolute",
    top: 110,
    left: 14,
    right: 14,
    backgroundColor: "#fffffff0",
    padding: 12,
    borderRadius: 16,
    gap: 4,
  },
  warning: { color: "#a64a19", fontWeight: "600" },
  small: { fontSize: 11, color: "#52696d" },
  controls: { position: "absolute", right: 16, bottom: 95, gap: 10 },
  bottom: {
    padding: 14,
    paddingBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modal: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 34 : 55,
    backgroundColor: "#f5f6f1",
  },
  sheet: { padding: 22, gap: 15, paddingBottom: 48 },
  title: { fontSize: 21, fontWeight: "600", color: "#173f49" },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#9ab4b7",
    borderRadius: 12,
  },
  card: { padding: 15, gap: 12, backgroundColor: "#e6efea", borderRadius: 16 },
});
