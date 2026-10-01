import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

interface FilterButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function FilterButton({
  label,
  active,
  onPress,
}: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterButton,
        active &&
          styles.filterButtonActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active &&
            styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  filterButtonActive: {
    backgroundColor: "#97ce4c",
    borderColor: "#97ce4c",
  },

  filterText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
  },

  filterTextActive: {
    color: "#090e17",
  },
});