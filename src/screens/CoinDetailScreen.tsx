import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import ScreenBackground from "../components/layout/ScreenBackground";
import GlassCard from "../components/game/GlassCard";
import NeonButton from "../components/game/NeonButton";
import RiskGauge from "../components/game/RiskGauge";
import { COLORS, categoryColor } from "../utils/theme";
import { analyzeToken } from "../services/aiService";
import { useGameStore } from "../store/gameStore";
import type { RootStackParamList } from "../navigation/types";

type Result = Awaited<ReturnType<typeof analyzeToken>>;

export default function CoinDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "CoinDetail">>();
  const route = useRoute<RouteProp<RootStackParamList, "CoinDetail">>();
  const { addXP } = useGameStore();

  const tokenName: string = route.params?.tokenName ?? "Unknown Token";
  const symbol: string = route.params?.symbol ?? "TOKN";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [guess, setGuess] = useState<"SAFE" | "SUSPICIOUS" | "SCAM" | null>(null);
  const [awarded, setAwarded] = useState(false);

  const headerColor = useMemo(() => (result ? categoryColor(result.category) : COLORS.electricPurple), [result]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    analyzeToken(tokenName)
      .then((r) => {
        if (!mounted) return;
        setResult(r);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [tokenName]);

  useEffect(() => {
    if (!result || !guess || awarded) return;
    if (guess === result.category) {
      addXP(25);
      setAwarded(true);
    }
  }, [addXP, awarded, guess, result]);

  return (
    <ScreenBackground>
      <View style={styles.topBar}>
        <NeonButton
          title="Close"
          variant="purple"
          onPress={() => navigation.goBack()}
          left={<Ionicons name="close" size={18} color={COLORS.electricPurple} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>COIN INTEL</Text>
        <Text style={styles.title}>
          {tokenName} <Text style={[styles.symbol, { color: headerColor }]}>${symbol}</Text>
        </Text>
        <Text style={styles.sub}>Make a prediction, then compare it to the AI risk engine.</Text>

        <GlassCard glow="purple" style={{ marginTop: 16 }}>
          <Text style={styles.section}>YOUR PREDICTION</Text>
          <View style={styles.predRow}>
            <NeonButton title="Safe" variant="green" onPress={() => setGuess("SAFE")} />
            <NeonButton title="Suspicious" variant="purple" onPress={() => setGuess("SUSPICIOUS")} />
            <NeonButton title="Scam" variant="danger" onPress={() => setGuess("SCAM")} />
          </View>
          <Text style={styles.predHint}>
            Guess correctly: <Text style={{ color: COLORS.neonGreen, fontWeight: "900" }}>+25 XP</Text>
          </Text>
        </GlassCard>

        <GlassCard glow={result?.category === "SAFE" ? "green" : "none"} style={{ marginTop: 12 }}>
          <Text style={styles.section}>AI RISK ANALYSIS</Text>
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={COLORS.neonGreen} />
              <Text style={styles.loadingText}>Synthesizing on-chain signals…</Text>
            </View>
          ) : result ? (
            <>
              <View style={{ alignItems: "center", marginTop: 6 }}>
                <RiskGauge score={result.riskScore} category={result.category} />
                <Text style={styles.conf}>
                  Confidence: <Text style={styles.confStrong}>{result.confidence}%</Text>
                </Text>
              </View>
              <View style={{ height: 10 }} />
              <Text style={styles.section}>WHY</Text>
              <View style={{ marginTop: 8, gap: 8 }}>
                {result.reasons.map((r, i) => (
                  <View key={`${i}-${r}`} style={styles.reasonRow}>
                    <View style={[styles.dot, { backgroundColor: categoryColor(result.category) }]} />
                    <Text style={styles.reason}>{r}</Text>
                  </View>
                ))}
              </View>
              {guess ? (
                <View style={styles.outcome}>
                  <Ionicons
                    name={guess === result.category ? "checkmark-circle" : "close-circle"}
                    size={18}
                    color={guess === result.category ? COLORS.neonGreen : COLORS.dangerRed}
                  />
                  <Text style={styles.outcomeText}>
                    {guess === result.category ? "Prediction correct! +25 XP" : "Prediction missed. Try again next token."}
                  </Text>
                </View>
              ) : null}
            </>
          ) : null}
        </GlassCard>

        <View style={{ height: 26 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 16, paddingTop: 16, alignItems: "flex-end" },
  content: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 40 },
  kicker: { color: COLORS.textMuted, letterSpacing: 2.6, fontSize: 11, fontWeight: "900" },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900", marginTop: 8 },
  symbol: { fontWeight: "900" },
  sub: { color: COLORS.textMuted, marginTop: 10, lineHeight: 20 },
  section: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.2 },
  predRow: { flexDirection: "row", gap: 10, marginTop: 10, flexWrap: "wrap" },
  predHint: { marginTop: 12, color: COLORS.textMuted },
  loading: { paddingVertical: 22, alignItems: "center", gap: 10 },
  loadingText: { color: COLORS.textMuted, fontWeight: "800", letterSpacing: 1.2 },
  conf: { marginTop: 10, color: COLORS.textMuted },
  confStrong: { color: COLORS.text, fontWeight: "900" },
  reasonRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  dot: { width: 7, height: 7, borderRadius: 7, marginTop: 6 },
  reason: { flex: 1, color: "rgba(255,255,255,0.82)", lineHeight: 18 },
  outcome: { marginTop: 14, flexDirection: "row", alignItems: "center", gap: 8 },
  outcomeText: { color: COLORS.textMuted, fontWeight: "800" },
});

