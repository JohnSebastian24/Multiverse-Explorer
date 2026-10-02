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

import { SafeAreaView, } from "react-native-safe-area-context";

import EpisodeCard from "../../components/EpisodeCard";
import ScrollTopButton from "../../components/ScrollTopButton";
import { appColors } from "../../constants/theme";
import { useScrollToTop } from "expo-router/react-navigation";
import TopNavigationButtons from "../../components/TopNavigationButtons";
import {
    Episode,
    extractIdsFromUrls,
    getCharacterById,
    getEpisodesByIds,
} from "../../services/rickAndMortyApi";

export default function CharacterEpisodesScreen() {
    const router = useRouter();
    const listRef =
        useRef<FlatList<Episode>>(null);

    useScrollToTop(listRef);
    const { characterId } =
        useLocalSearchParams<{
            characterId: string;
        }>();

    const [episodes, setEpisodes] =
        useState<Episode[]>([]);

    const [characterName, setCharacterName] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    const [showScrollTop, setShowScrollTop] =
        useState(false);

    async function loadEpisodes() {
        try {
            setLoading(true);
            setError(false);

            /*
             * Primero obtenemos el personaje,
             * porque allí vienen las URLs de
             * todos sus episodios.
             */
            const character =
                await getCharacterById(
                    characterId
                );

            setCharacterName(
                character.name
            );

            /*
             * Convertimos:
             *
             * /episode/1
             * /episode/2
             *
             * en:
             *
             * [1, 2]
             */
            const episodeIds =
                extractIdsFromUrls(
                    character.episode
                );

            /*
             * Después consultamos todos esos
             * episodios.
             */
            const data =
                await getEpisodesByIds(
                    episodeIds
                );

            setEpisodes(data);
        } catch (err) {
            console.log(
                "No se pudieron cargar los episodios:",
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

        setShowScrollTop((current) => {
            if (current === shouldShow) {
                return current;
            }

            return shouldShow;
        });
    }

    useEffect(() => {
        if (characterId) {
            loadEpisodes();
        }
    }, [characterId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color={appColors.primary}
                />

                <Text style={styles.loadingText}>
                    Buscando episodios en el multiverso...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorIcon}>
                    📺
                </Text>

                <Text style={styles.errorTitle}>
                    No pudimos encontrar los episodios
                </Text>

                <Text style={styles.errorText}>
                    El portal tuvo problemas para consultar esta dimensión.
                </Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={loadEpisodes}
                >
                    <Text
                        style={styles.retryText}
                    >
                        Intentar nuevamente
                    </Text>
                </Pressable>

                <Pressable
                    onPress={handleBack}
                    style={styles.backErrorButton}
                >
                    <Text
                        style={styles.backErrorText}
                    >
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
                onScroll={handleScroll}
                scrollEventThrottle={16}
                data={episodes}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.content
                }
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.badge}>
                            GUÍA INTERDIMENSIONAL
                        </Text>

                        <Text style={styles.title}>
                            Episodios
                        </Text>

                        <Text style={styles.subtitle}>
                            Apariciones de {characterName}
                        </Text>

                        <View style={styles.counter}>
                            <Ionicons
                                name="tv-outline"
                                size={18}
                                color={appColors.primary}
                            />

                            <Text
                                style={styles.counterText}
                            >
                                {episodes.length}{" "}
                                {episodes.length === 1
                                    ? "episodio"
                                    : "episodios"}
                            </Text>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <EpisodeCard
                        episode={item}
                        onPress={() =>
                            router.push(
                                `/episode/${item.id}` as Href
                            )
                        }
                    />
                )}
            />
            <TopNavigationButtons
                onBack={handleBack}
                onHome={() =>
                    router.replace("/")
                }
            />

            <ScrollTopButton
                visible={showScrollTop}
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
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",

        paddingHorizontal: 20,
        paddingBottom: 35,
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
        fontSize: 14,
        marginTop: 15,
        textAlign: "center",
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
        marginTop: 16,
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

    title: {
        color: appColors.text,
        fontSize: 36,
        fontWeight: "900",
        marginTop: 7,
    },

    subtitle: {
        color: appColors.textMuted,
        fontSize: 15,
        marginTop: 5,
    },

    counter: {
        alignSelf: "flex-start",

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: appColors.surface,

        borderWidth: 1,
        borderColor: appColors.border,

        borderRadius: 20,

        paddingHorizontal: 13,
        paddingVertical: 8,

        marginTop: 18,
    },

    counterText: {
        color: appColors.textSoft,
        fontSize: 12,
        fontWeight: "700",
        marginLeft: 7,
    },
});