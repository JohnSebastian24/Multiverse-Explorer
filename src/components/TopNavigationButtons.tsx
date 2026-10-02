import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appColors } from "../constants/theme";

interface TopNavigationButtonsProps {
    onBack: () => void;
    onHome?: () => void;
}

export default function TopNavigationButtons({
    onBack,
    onHome,
}: TopNavigationButtonsProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            pointerEvents="box-none"
            style={[
                styles.container,
                {
                    top: insets.top + 10,
                },
            ]}
        >
            <Pressable
                onPress={onBack}
                hitSlop={10}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                ]}
            >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={appColors.text}
                />
            </Pressable>

            {onHome && (
                <Pressable
                    onPress={onHome}
                    hitSlop={10}
                    style={({ pressed }) => [
                        styles.button,
                        styles.homeButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons
                        name="home-outline"
                        size={22}
                        color={appColors.primary}
                    />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",

        left: 18,
        right: 18,

        flexDirection: "row",
        justifyContent: "space-between",

        zIndex: 50,
        elevation: 20,
    },

    button: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: "rgba(9, 14, 23, 0.88)",

        borderWidth: 1,
        borderColor: appColors.border,

        justifyContent: "center",
        alignItems: "center",
    },

    homeButton: {
        borderColor: appColors.primary,
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