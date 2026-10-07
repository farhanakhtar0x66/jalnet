import { useQueryClient } from "@tanstack/react-query";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "./Button";

WebBrowser.maybeCompleteAuthSession();
export function SignIn() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const cache = useQueryClient();
  const signIn = async () => {
    setBusy(true);
    setError("");
    try {
      const domain = process.env.EXPO_PUBLIC_COGNITO_DOMAIN;
      const clientId = process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID;
      if (!domain || !clientId)
        throw new Error("Cognito configuration is blocked awaiting SSO.");
      const discovery = {
        authorizationEndpoint: `${domain}/oauth2/authorize`,
        tokenEndpoint: `${domain}/oauth2/token`,
        revocationEndpoint: `${domain}/oauth2/revoke`,
      };
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "jalnet",
        path: "auth",
      });
      const request = new AuthSession.AuthRequest({
        clientId,
        redirectUri,
        scopes: ["openid", "email", "profile"],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
      });
      const result = await request.promptAsync(discovery);
      if (result.type !== "success") return;
      if (!request.codeVerifier || !result.params.code)
        throw new Error("Sign-in did not return a valid authorization code");
      const tokens = await AuthSession.exchangeCodeAsync(
        {
          clientId,
          code: result.params.code,
          redirectUri,
          extraParams: { code_verifier: request.codeVerifier },
        },
        discovery,
      );
      await SecureStore.setItemAsync("jalnet.accessToken", tokens.accessToken);
      if (tokens.refreshToken)
        await SecureStore.setItemAsync(
          "jalnet.refreshToken",
          tokens.refreshToken,
        );
      await SecureStore.setItemAsync(
        "jalnet.expiresAt",
        String(Date.now() + (tokens.expiresIn ?? 3600) * 1000),
      );
      await cache.resetQueries();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={{ gap: 12 }}>
      <Button
        title={busy ? "Signing in…" : "Sign in with Cognito"}
        disabled={busy}
        onPress={() => {
          void signIn();
        }}
      />
      <Button
        title="Sign out"
        disabled={busy}
        onPress={() => {
          setBusy(true);
          setError("");
          void Promise.all([
            SecureStore.deleteItemAsync("jalnet.accessToken"),
            SecureStore.deleteItemAsync("jalnet.refreshToken"),
            SecureStore.deleteItemAsync("jalnet.expiresAt"),
          ])
            .then(() => {
              cache.clear();
            })
            .catch(() =>
              setError("Could not clear the local session. Retry sign out."),
            )
            .finally(() => setBusy(false));
        }}
      />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
    </View>
  );
}
