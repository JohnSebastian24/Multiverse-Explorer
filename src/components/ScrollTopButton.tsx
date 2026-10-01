import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { appColors } from "../constants/theme";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";

interface ScrollTopButtonProps {
  visible: boolean;
  onPress: () => void;
}

export default function ScrollTopButton({
  visible,
  onPress,
}: ScrollTopButtonProps) {
  const animation =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver:
        Platform.OS !== "web",
    }).start();
  }, [visible, animation]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          pointerEvents:
            visible ? "auto" : "none",

          opacity: animation,

          transform: [
            {
              scale:
                animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    0.85,
                    1,
                  ],
                }),
            },
          ],
        },
      ]}
    >
      <Pressable
        style={styles.button}
        onPress={onPress}
      >
        <Ionicons
          name="arrow-up"
          size={25}
          color={appColors.textDark}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
  position: "absolute",
  right: 18,
  bottom: 18,

  width: 50,
  height: 50,
  borderRadius: 25,

  ...(Platform.OS === "web"
    ? {
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.30)",
      }
    : {
        shadowColor: appColors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
      }),
},

  button: {
    width: 50,
    height: 50,

    borderRadius: 25,

    backgroundColor: appColors.primary,

    justifyContent: "center",
    alignItems: "center",
  },
});