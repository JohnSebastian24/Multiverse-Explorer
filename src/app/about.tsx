import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import TopNavigationButtons from "../components/TopNavigationButtons";
import { appColors } from "../constants/theme";

export default function AboutScreen() {
    const router = useRouter();

    function handleBack() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Ionicons
                                name="planet-outline"
                                size={42}
                                color={appColors.primary}
                            />
                        </View>

                        <Text style={styles.badge}>
                            INFORMACIÓN DEL PROYECTO
                        </Text>

                        <Text style={styles.title}>
                            Acerca de
                        </Text>

                        <Text style={styles.subtitle}>
                            Multiverse Explorer
                        </Text>

                        <Text style={styles.version}>
                            Versión 1.0.0
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <InfoItem
                            icon="person-outline"
                            label="Desarrollado por"
                            value="John Sebastian Muñoz Hurtado"
                        />

                        <InfoItem
                            icon="school-outline"
                            label="Tipo de proyecto"
                            value="Proyecto académico"
                        />

                        <InfoItem
                            icon="code-slash-outline"
                            label="Tecnologías"
                            value="React Native · Expo · TypeScript"
                            last
                        />
                    </View>

                    <Text style={styles.sectionTitle}>
                        Fuente de datos
                    </Text>

                    <View style={styles.card}>
                        <InfoItem
                            icon="cloud-outline"
                            label="API"
                            value="The Rick and Morty API"
                        />

                        <InfoItem
                            icon="git-network-outline"
                            label="Consumo"
                            value="API REST mediante peticiones HTTP GET"
                            last
                        />
                    </View>

                    <Text style={styles.sectionTitle}>
                        Privacidad
                    </Text>

                    <View style={styles.textCard}>
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={25}
                            color={appColors.secondary}
                        />

                        <Text style={styles.cardTitle}>
                            Datos locales
                        </Text>

                        <Text style={styles.paragraph}>
                            Esta aplicación no requiere registro ni inicio
                            de sesión. Los personajes marcados como favoritos
                            se almacenan localmente en el dispositivo.
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>
                        Aviso
                    </Text>

                    <View style={styles.textCard}>
                        <Ionicons
                            name="information-circle-outline"
                            size={25}
                            color={appColors.primary}
                        />

                        <Text style={styles.cardTitle}>
                            Aplicación no oficial
                        </Text>

                        <Text style={styles.paragraph}>
                            Este proyecto fue desarrollado con fines
                            académicos y educativos. No está afiliado,
                            patrocinado ni respaldado oficialmente por
                            Adult Swim ni por los responsables de la
                            franquicia Rick and Morty.
                        </Text>

                        <Text style={styles.paragraph}>
                            Los nombres, personajes, imágenes y demás
                            contenido relacionado con Rick and Morty
                            pertenecen a sus respectivos propietarios.
                            La información mostrada por la aplicación
                            proviene de The Rick and Morty API.
                        </Text>
                    </View>

                    <Text style={styles.footer}>
                        © 2026 · Proyecto académico
                    </Text>
                </View>
            </ScrollView>

            <TopNavigationButtons
                onBack={handleBack}
            />
        </SafeAreaView>
    );
}

interface InfoItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    last?: boolean;
}

function InfoItem({
    icon,
    label,
    value,
    last = false,
}: InfoItemProps) {
    return (
        <View
            style={[
                styles.infoRow,
                last && styles.lastInfoRow,
            ]}
        >
            <View style={styles.infoIcon}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={appColors.secondary}
                />
            </View>

            <View style={styles.infoText}>
                <Text style={styles.infoLabel}>
                    {label}
                </Text>

                <Text style={styles.infoValue}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.background,
    },

    scrollContent: {
        paddingBottom: 50,
    },

    content: {
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",

        paddingHorizontal: 20,
        paddingTop: 85,
    },

    header: {
        alignItems: "center",
        paddingBottom: 25,
    },

    logo: {
        width: 82,
        height: 82,
        borderRadius: 41,

        backgroundColor: appColors.surface,

        borderWidth: 1,
        borderColor: appColors.border,

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 20,
    },

    badge: {
        color: appColors.primary,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 2,
        textAlign: "center",
    },

    title: {
        color: appColors.text,
        fontSize: 36,
        fontWeight: "900",
        marginTop: 8,
    },

    subtitle: {
        color: appColors.secondary,
        fontSize: 18,
        fontWeight: "700",
        marginTop: 5,
    },

    version: {
        color: appColors.textMuted,
        fontSize: 13,
        marginTop: 7,
    },

    sectionTitle: {
        color: appColors.text,
        fontSize: 18,
        fontWeight: "900",
        marginTop: 28,
        marginBottom: 12,
    },

    card: {
        backgroundColor: appColors.surface,

        borderWidth: 1,
        borderColor: appColors.border,

        borderRadius: 20,

        paddingHorizontal: 18,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",

        paddingVertical: 17,

        borderBottomWidth: 1,
        borderBottomColor: appColors.border,
    },

    lastInfoRow: {
        borderBottomWidth: 0,
    },

    infoIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,

        backgroundColor: appColors.surfaceLight,

        justifyContent: "center",
        alignItems: "center",

        marginRight: 14,
    },

    infoText: {
        flex: 1,
    },

    infoLabel: {
        color: appColors.textDisabled,
        fontSize: 12,
        fontWeight: "600",
    },

    infoValue: {
        color: appColors.text,
        fontSize: 15,
        fontWeight: "700",
        marginTop: 3,
    },

    textCard: {
        backgroundColor: appColors.surface,

        borderWidth: 1,
        borderColor: appColors.border,

        borderRadius: 20,

        padding: 18,
    },

    cardTitle: {
        color: appColors.text,
        fontSize: 16,
        fontWeight: "800",
        marginTop: 12,
    },

    paragraph: {
        color: appColors.textMuted,
        fontSize: 14,
        lineHeight: 21,
        marginTop: 10,
    },

    footer: {
        color: appColors.textDisabled,
        fontSize: 12,
        textAlign: "center",
        marginTop: 35,
    },
});