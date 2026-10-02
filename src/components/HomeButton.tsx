import { Ionicons } from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
} from "react-native";

import { appColors } from "../constants/theme";

interface HomeButtonProps {
  onPress: () => void;
}

export default function HomeButton({
  onPress,
}: HomeButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name="home-outline"
        size={22}
        color={appColors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    top: 12,
    right: 18,

    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: appColors.surface,

    borderWidth: 1,
    borderColor: appColors.border,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 20,
    elevation: 10,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },
});