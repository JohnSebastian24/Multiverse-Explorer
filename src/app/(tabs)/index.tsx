import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.badge}>MULTIVERSE DATABASE</Text>

        <Text style={styles.title}>
          Rick & Morty
        </Text>

        <Text style={styles.subtitle}>
          Explorer
        </Text>

        <Text style={styles.description}>
          Explora personajes, dimensiones y episodios del multiverso.
        </Text>

        <View style={styles.portal}>
          <Text style={styles.portalEmoji}>🛸</Text>

          <Text style={styles.portalText}>
            Preparando el portal...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090e17",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  badge: {
    color: "#97ce4c",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },

  title: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "900",
  },

  subtitle: {
    color: "#00b5cc",
    fontSize: 42,
    fontWeight: "900",
    marginTop: -5,
  },

  description: {
    color: "#9ca3af",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 18,
    maxWidth: 320,
  },

  portal: {
    marginTop: 40,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  portalEmoji: {
    fontSize: 55,
    marginBottom: 14,
  },

  portalText: {
    color: "#d1d5db",
    fontSize: 15,
    fontWeight: "600",
  },
});