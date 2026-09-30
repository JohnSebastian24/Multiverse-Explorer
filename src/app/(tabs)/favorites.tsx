import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Favoritos</Text>

        <Text style={styles.subtitle}>
          Tus personajes favoritos aparecerán aquí.
        </Text>
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
    padding: 24,
    paddingTop: 50,
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 8,
  },
});