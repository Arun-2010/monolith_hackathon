import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenBackground from "../components/layout/ScreenBackground";
import HUDBar from "../components/game/HUDBar";
import GlassCard from "../components/game/GlassCard";
import { COLORS } from "../utils/theme";
import { LEADERBOARD_DATA } from "../services/aiService";
import { useGameStore } from "../store/gameStore";

export default function LeaderboardScreen() {
  const { username, level, xp, totalCaptures, accuracy } = useGameStore();

  const rows = useMemo(() => {
    const mine = { rank: "—", name: username, level, xp, captures: totalCaptures, accuracy };
    return [mine, ...LEADERBOARD_DATA];
  }, [accuracy, level, totalCaptures, username, xp]);

  return (
    <ScreenBackground>
      <HUDBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.sub}>Climb the ranks with captures, scans, and prediction accuracy.</Text>

        <GlassCard glow="purple" style={{ marginTop: 16 }}>
          <View style={styles.headerRow}>
            <Ionicons name="podium" size={18} color={COLORS.electricPurple} />
            <Text style={styles.section}>GLOBAL HUNTERS</Text>
          </View>

          <View style={{ marginTop: 10, gap: 10 }}>
            {rows.map((r, idx) => {
              const isMine = idx === 0;
              return (
                <View key={`${r.name}-${idx}`} style={[styles.row, isMine ? styles.mine : null]}>
                  <Text style={[styles.rank, isMine ? { color: COLORS.neonGreen } : null]}>{r.rank}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.name, isMine ? { color: COLORS.neonGreen } : null]} numberOfLines={1}>
                      {r.name}
                    </Text>
                    <Text style={styles.meta}>
                      LVL {r.level} • {r.captures} captures • {r.accuracy}% acc
                    </Text>
                  </View>
                  <Text style={styles.xp}>{r.xp} XP</Text>
                </View>
              );
            })}
          </View>
        </GlassCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900" },
  sub: { color: COLORS.textMuted, marginTop: 8, lineHeight: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  section: { color: COLORS.textMuted, fontSize: 11, fontWeight: "900", letterSpacing: 2.2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  mine: {
    borderColor: "rgba(0,255,163,0.22)",
    backgroundColor: "rgba(0,255,163,0.08)",
  },
  rank: { width: 28, textAlign: "center", color: COLORS.textMuted, fontWeight: "900" },
  name: { color: COLORS.text, fontWeight: "900" },
  meta: { color: COLORS.textMuted, marginTop: 2, fontSize: 11 },
  xp: { color: COLORS.electricPurple, fontWeight: "900" },
});

