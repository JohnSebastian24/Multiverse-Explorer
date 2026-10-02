import { Ionicons } from "@expo/vector-icons";

import {
    Href,
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import CharacterCard from "../../components/CharacterCard";

import { appColors } from "../../constants/theme";

import FloatingBackButton from "../../components/FloatingBackButton";

import ScrollTopButton from "../../components/ScrollTopButton";
import {
    Character,
    Episode,
    extractIdsFromUrls,
    getCharactersByIds,
    getEpisodeById,
} from "../../services/rickAndMortyApi";

export default function EpisodeDetailScreen() {
    const router = useRouter();

    const listRef =
        useRef<FlatList<Character>>(null);

    const { id } =
        useLocalSearchParams<{
            id: string;
        }>();

    const [episode, setEpisode] =
        useState<Episode | null>(null);

    const [characters, setCharacters] =
        useState<Character[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    const [showFloatingButtons, setShowFloatingButtons] =
        useState(false);

    async function loadEpisode() {
        try {
            setLoading(true);
            setError(false);

            const episodeData =
                await getEpisodeById(id);

            setEpisode(episodeData);

            const characterIds =
                extractIdsFromUrls(
                    episodeData.characters
                );

            const characterData =
                await getCharactersByIds(
                    characterIds
                );

            setCharacters(characterData);
        } catch (err) {
            console.log(
                "No se pudo cargar el episodio:",
                err
            );

            setError(true);
        } finally {
            setLoading(false);
        }
    }

    function handleBack() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    }

    function scrollToTop() {
        listRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
        });
    }

    function handleScroll(
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) {
        const offset =
            event.nativeEvent.contentOffset.y;

        const shouldShow =
            offset > 500;

        setShowFloatingButtons((current) => {
            if (current === shouldShow) {
                return current;
            }

            return shouldShow;
        });
    }

    useEffect(() => {
        if (id) {
            loadEpisode();
        }
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color={appColors.primary}
                />

                <Text style={styles.loadingText}>
                    Sintonizando episodio...
                </Text>
            </View>
        );
    }

    if (error || !episode) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorIcon}>
                    📺
                </Text>

                <Text style={styles.errorTitle}>
                    No pudimos sintonizar este episodio
                </Text>

                <Text style={styles.errorText}>
                    El portal tuvo problemas para obtener la información.
                </Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={loadEpisode}
                >
                    <Text style={styles.retryText}>
                        Intentar nuevamente
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.backErrorButton}
                    onPress={handleBack}
                >
                    <Text style={styles.backErrorText}>
                        Volver
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={listRef}
                data={characters}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Pressable
                            style={styles.backButton}
                            onPress={handleBack}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={23}
                                color={appColors.text}
                            />
                        </Pressable>

                        <Text style={styles.badge}>
                            ARCHIVO INTERDIMENSIONAL
                        </Text>

                        <Text style={styles.episodeCode}>
                            {episode.episode}
                        </Text>

                        <Text style={styles.title}>
                            {episode.name}
                        </Text>

                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoIcon}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={20}
                                        color={appColors.secondary}
                                    />
                                </View>

                                <View>
                                    <Text style={styles.infoLabel}>
                                        Fecha de emisión
                                    </Text>

                                    <Text style={styles.infoValue}>
                                        {episode.air_date}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.infoRow,
                                    styles.lastInfoRow,
                                ]}
                            >
                                <View style={styles.infoIcon}>
                                    <Ionicons
                                        name="people-outline"
                                        size={20}
                                        color={appColors.secondary}
                                    />
                                </View>

                                <View>
                                    <Text style={styles.infoLabel}>
                                        Personajes
                                    </Text>

                                    <Text style={styles.infoValue}>
                                        {characters.length} apariciones
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>
                            Personajes del episodio
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Toca un personaje para consultar su ficha.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <CharacterCard
                        character={item}
                        onPress={() =>
                            router.push(
                                `/character/${item.id}` as Href
                            )
                        }
                    />
                )}
            />
            <FloatingBackButton
                visible={showFloatingButtons}
                onPress={handleBack}
            />

            <ScrollTopButton
                visible={showFloatingButtons}
                onPress={scrollToTop}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.background,
    },

    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    center: {
        flex: 1,
        backgroundColor: appColors.background,

        justifyContent: "center",
        alignItems: "center",

        padding: 30,
    },

    loadingText: {
        color: appColors.textSoft,
        marginTop: 15,
        fontWeight: "600",
    },

    errorIcon: {
        fontSize: 55,
    },

    errorTitle: {
        color: appColors.text,
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 15,
    },

    errorText: {
        color: appColors.textMuted,
        textAlign: "center",
        marginTop: 10,
        lineHeight: 21,
    },

    retryButton: {
        backgroundColor: appColors.primary,
        paddingHorizontal: 22,
        paddingVertical: 13,
        borderRadius: 15,
        marginTop: 24,
    },

    retryText: {
        color: appColors.textDark,
        fontWeight: "800",
    },

    backErrorButton: {
        marginTop: 15,
    },

    backErrorText: {
        color: appColors.textMuted,
    },

    header: {
        paddingTop: 12,
        paddingBottom: 25,
    },

    backButton: {
        width: 44,
        height: 44,

        borderRadius: 22,

        backgroundColor: appColors.surface,

        borderWidth: 1,
        borderColor: appColors.border,

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 25,
    },

    badge: {
        color: appColors.primary,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 2,
    },

    episodeCode: {
        color: appColors.secondary,
        fontSize: 15,
        fontWeight: "800",
        marginTop: 14,
    },

    title: {
        color: appColors.text,
        fontSize: 34,
        fontWeight: "900",
        marginTop: 4,
    },

    infoCard: {
        backgroundColor: appColors.surface,

        borderRadius: 20,

        borderWidth: 1,
        borderColor: appColors.border,

        paddingHorizontal: 18,

        marginTop: 25,
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

    sectionTitle: {
        color: appColors.text,
        fontSize: 21,
        fontWeight: "900",
        marginTop: 30,
    },

    sectionSubtitle: {
        color: appColors.textMuted,
        fontSize: 13,
        marginTop: 5,
        marginBottom: 20,
    },

    row: {
        justifyContent: "space-between",
    },
});