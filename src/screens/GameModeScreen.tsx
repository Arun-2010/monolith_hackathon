import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import ScreenBackground from "../components/layout/ScreenBackground";
import HUDBar from "../components/game/HUDBar";
import GlassCard from "../components/game/GlassCard";
import NeonButton from "../components/game/NeonButton";
import TokenCard from "../components/game/TokenCard";
import { COLORS } from "../utils/theme";
import { analyzeToken, generateRandomToken } from "../services/aiService";
import { useGameStore } from "../store/gameStore";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Reveal = Awaited<ReturnType<typeof analyzeToken>>;
type Entry = ReturnType<typeof generateRandomToken> & { reveal?: Reveal; loading?: boolean };

export default function GameModeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "Game">>();
  const { addXP, addScanResult } = useGameStore();

  const initial = useMemo<Entry[]>(
    () => Array.from({ length: 8 }).map(() => ({ ...generateRandomToken() })),
    []
  );
  const [deck, setDeck] = useState<Entry[]>(initial);

  const reveal = useCallback(
    async (id: string) => {
      setDeck((prev) => prev.map((t) => (t.id === id ? { ...t, loading: true } : t)));
      const token = deck.find((t) => t.id === id);
      const res = await analyzeToken(token?.name);
      setDeck((prev) => prev.map((t) => (t.id === id ? { ...t, reveal: res, loading: false } : t)));

      addXP(10);
      addScanResult({
        tokenName: res.tokenName,
        riskScore: res.riskScore,
        category: res.category,
        confidence: res.confidence,
        reasons: res.reasons,
        scannedAt: Date.now(),
      });
    },
    [addScanResult, addXP, deck]
  );

  return (
    <ScreenBackground>
      <HUDBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Game Mode</Text>
        <Text style={styles.sub}>Explore a deck of virtual tokens. Reveal risk, earn XP, and open coin intel.</Text>

        <GlassCard glow="purple" style={{ marginTop: 16 }}>
          <Text style={styles.section}>MISSION</Text>
          <View style={styles.missionRow}>
            <Ionicons name="sparkles" size={18} color={COLORS.electricPurple} />
            <Text style={styles.missionText}>Reveal tokens to earn XP. Correct predictions pay extra in Coin Detail.</Text>
          </View>
        </GlassCard>

        <View style={{ marginTop: 14, gap: 12 }}>
          {deck.map((t) => (
            <View key={t.id} style={{ gap: 10 }}>
              <TokenCard
                name={t.name}
                symbol={t.symbol}
                hue={t.hue}
                riskScore={t.reveal?.riskScore}
                category={t.reveal?.category}
                onPress={() =>
                  navigation
                    .getParent<NativeStackNavigationProp<RootStackParamList>>()
                    ?.navigate("CoinDetail", {
                      tokenId: t.id,
                      tokenName: t.reveal?.tokenName ?? t.name,
                      symbol: t.reveal?.symbol ?? t.symbol,
                    })
                }
              />
              {!t.reveal ? (
                <NeonButton
                  title={t.loading ? "Revealing..." : "Reveal Risk (+10 XP)"}
                  fullWidth
                  onPress={() => reveal(t.id)}
                  disabled={!!t.loading}
                  left={<Ionicons name="eye" size={18} color={COLORS.neonGreen} />}
                />
              ) : null}
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
        <NeonButton
          title="Regenerate Deck"
          variant="purple"
          fullWidth
          onPress={() => setDeck(Array.from({ length: 8 }).map(() => ({ ...generateRandomToken() })))}
          left={<Ionicons name="refresh" size={18} color={COLORS.electricPurple} />}
        />
        <View style={{ height: 46 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900" },
  sub: { color: COLORS.textMuted, marginTop: 8, lineHeight: 20 },
  section: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.2 },
  missionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  missionText: { flex: 1, color: COLORS.textMuted, lineHeight: 18 },
});

