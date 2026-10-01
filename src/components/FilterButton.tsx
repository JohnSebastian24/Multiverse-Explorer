import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { appColors } from "../constants/theme";
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
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.border,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  filterButtonActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },

  filterText: {
    color: appColors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  filterTextActive: {
    color: appColors.textDark,
  },
});