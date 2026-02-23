import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ScreenBackground from "../components/layout/ScreenBackground";
import HUDBar from "../components/game/HUDBar";
import GlassCard from "../components/game/GlassCard";
import NeonButton from "../components/game/NeonButton";
import RiskGauge from "../components/game/RiskGauge";
import { COLORS, categoryColor } from "../utils/theme";
import { analyzeToken } from "../services/aiService";
import { useGameStore } from "../store/gameStore";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Result = Awaited<ReturnType<typeof analyzeToken>>;

export default function ScannerScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "Scanner">>();
  const { addXP, addScanResult } = useGameStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const canScan = input.trim().length > 0 && !loading;
  const placeholder = useMemo(() => (Math.random() > 0.5 ? "SafeMoon" : "0x1234..."), []);

  const scan = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeToken(input.trim());
      setResult(res);
      addXP(10);
      addScanResult({
        tokenName: res.tokenName,
        riskScore: res.riskScore,
        category: res.category,
        confidence: res.confidence,
        reasons: res.reasons,
        scannedAt: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  }, [addScanResult, addXP, input]);

  return (
    <ScreenBackground scanline>
      <HUDBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>AI Scam Coin Scanner</Text>
        <Text style={styles.sub}>Paste a token name or contract. The AI simulation returns a realistic risk breakdown.</Text>

        <GlassCard glow="purple" style={{ marginTop: 16 }}>
          <Text style={styles.label}>TOKEN / CONTRACT</Text>
          <View style={styles.inputRow}>
            <Ionicons name="search" size={16} color={COLORS.textMuted} />
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={scan}
            />
          </View>
          <View style={{ height: 14 }} />
          <NeonButton
            title={loading ? "Analyzing..." : "Scan Token"}
            fullWidth
            onPress={scan}
            disabled={!canScan}
            left={loading ? <ActivityIndicator /> : <Ionicons name="scan" size={18} color={COLORS.neonGreen} />}
          />
        </GlassCard>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.neonGreen} />
            <Text style={styles.loadingText}>Analyzing smart-contract signals...</Text>
          </View>
        ) : null}

        {result ? (
          <View style={{ marginTop: 16, gap: 12 }}>
            <GlassCard glow={result.category === "SAFE" ? "green" : "none"}>
              <Text style={styles.section}>RISK ASSESSMENT</Text>
              <View style={{ alignItems: "center" }}>
                <RiskGauge score={result.riskScore} category={result.category} />
                <Text style={styles.conf}>
                  Confidence: <Text style={styles.confStrong}>{result.confidence}%</Text>
                </Text>
              </View>
              <View style={{ height: 10 }} />
              <NeonButton
                title="View Coin Detail"
                fullWidth
                variant={result.category === "SCAM" ? "danger" : result.category === "SUSPICIOUS" ? "purple" : "green"}
                  onPress={() => {
                    const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
                    parent?.navigate("CoinDetail", { tokenName: result.tokenName, symbol: result.symbol });
                  }}
                left={<Ionicons name="analytics" size={18} color={categoryColor(result.category)} />}
              />
              <Text style={styles.xp}>+10 XP</Text>
            </GlassCard>

            <GlassCard>
              <Text style={styles.section}>RISK FACTORS</Text>
              <View style={{ marginTop: 8, gap: 8 }}>
                {result.reasons.map((r, i) => (
                  <View key={`${i}-${r}`} style={styles.reasonRow}>
                    <View style={[styles.dot, { backgroundColor: categoryColor(result.category) }]} />
                    <Text style={styles.reason}>{r}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900" },
  sub: { color: COLORS.textMuted, marginTop: 8, lineHeight: 20 },
  label: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.1 },
  inputRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 15 },
  loading: { paddingVertical: 28, alignItems: "center", gap: 10 },
  loadingText: { color: COLORS.textMuted, fontWeight: "800", letterSpacing: 1.2 },
  section: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.2 },
  conf: { marginTop: 10, color: COLORS.textMuted },
  confStrong: { color: COLORS.text, fontWeight: "900" },
  xp: { marginTop: 10, textAlign: "center", color: COLORS.neonGreen, fontWeight: "900", letterSpacing: 1.2 },
  reasonRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  dot: { width: 7, height: 7, borderRadius: 7, marginTop: 6 },
  reason: { flex: 1, color: "rgba(255,255,255,0.82)", lineHeight: 18 },
});

