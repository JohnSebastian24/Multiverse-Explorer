import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "expo-router/react-navigation";
import { Href, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Character, getCharacters, } from "../../services/rickAndMortyApi";
import FilterButton from "../../components/FilterButton";
import ScrollTopButton from "../../components/ScrollTopButton";
import CharacterCard from "../../components/CharacterCard";
import { appColors } from "../../constants/theme";
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

export default function HomeScreen() {
    const router = useRouter();

    // Referencia directa a la lista.
    const listRef = useRef<FlatList<Character>>(null);

    // Bloqueo inmediato para evitar peticiones duplicadas
    // cuando se hace scroll muy rápido.
    const loadingMoreRef = useRef(false);

    // Guarda el filtro que realmente está activo.
    const activeFilterRef = useRef("");

    // Al volver a pulsar la pestaña Inicio,
    // React Navigation intentará llevar la lista arriba.
    useScrollToTop(listRef);

    const [characters, setCharacters] = useState<Character[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [statusFilter, setStatusFilter] = useState("");

    const [showScrollTop, setShowScrollTop] = useState(false);

    async function loadCharacters(
        pageToLoad = 1,
        status = activeFilterRef.current
    ) {
        const isFirstPage = pageToLoad === 1;

        // Esta comprobación es inmediata.
        // A diferencia del state, useRef cambia al instante.
        if (!isFirstPage && loadingMoreRef.current) {
            return;
        }

        if (!isFirstPage && !hasMore) {
            return;
        }

        const requestedFilter = status;

        try {
            if (isFirstPage) {
                setLoading(true);
                setError(false);
            } else {
                loadingMoreRef.current = true;

                setLoadingMore(true);
                setLoadMoreError(false);
            }

            const data = await getCharacters(
                pageToLoad,
                requestedFilter || undefined
            );

            /*
             * Si el usuario cambió de filtro mientras
             * esta petición estaba viajando por internet,
             * ignoramos la respuesta vieja.
             */
            if (
                requestedFilter !== activeFilterRef.current
            ) {
                return;
            }

            if (isFirstPage) {
                setCharacters(data.results);
            } else {
                /*
                 * Además evitamos personajes duplicados
                 * si alguna petición llegara repetida.
                 */
                setCharacters((current) => {
                    const existingIds = new Set(
                        current.map((character) => character.id)
                    );

                    const newCharacters =
                        data.results.filter(
                            (character) =>
                                !existingIds.has(character.id)
                        );

                    return [
                        ...current,
                        ...newCharacters,
                    ];
                });
            }

            setPage(pageToLoad);

            setHasMore(
                data.info.next !== null
            );
        } catch (err) {
            /*
             * Si mientras tanto cambiamos de filtro,
             * ignoramos errores de la petición anterior.
             */
            if (
                requestedFilter !== activeFilterRef.current
            ) {
                return;
            }

            if (isFirstPage) {
                setError(true);
            } else {
                /*
                 * Un error cargando la página 5 o 6
                 * NO debe convertir toda la aplicación
                 * en una pantalla de error.
                 */
                setLoadMoreError(true);
            }

            /*
             * Usamos log y no console.error.
             * Expo Go mostraba el cuadro rojo porque
             * console.error es visible durante desarrollo.
             */
            if (__DEV__) {
                console.log(
                    "No se pudo completar la petición:",
                    err
                );
            }
        } finally {
            if (
                requestedFilter === activeFilterRef.current
            ) {
                if (isFirstPage) {
                    setLoading(false);
                } else {
                    setLoadingMore(false);
                }
            }

            if (!isFirstPage) {
                loadingMoreRef.current = false;
            }
        }
    }

    useEffect(() => {
        activeFilterRef.current = "";

        loadCharacters(1, "");
    }, []);

    function handleFilter(status: string) {
        /*
         * Cambiamos el ref ANTES de enviar la petición.
         * Esto permite invalidar peticiones anteriores.
         */
        activeFilterRef.current = status;

        setStatusFilter(status);

        setCharacters([]);

        setPage(1);
        setHasMore(true);

        setError(false);
        setLoadMoreError(false);

        loadCharacters(1, status);
    }

    function loadMoreCharacters() {
        if (
            loading ||
            loadingMore ||
            loadingMoreRef.current ||
            !hasMore ||
            loadMoreError
        ) {
            return;
        }

        loadCharacters(
            page + 1,
            activeFilterRef.current
        );
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

        const shouldShow = offset > 600;

        setShowScrollTop((current) => {
            if (current === shouldShow) {
                return current;
            }

            return shouldShow;
        });
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color={appColors.primary}
                />

                <Text style={styles.loadingText}>
                    Abriendo portal...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorIcon}>
                    🛸
                </Text>

                <Text style={styles.errorTitle}>
                    No pudimos conectar con esta dimensión
                </Text>

                <Text style={styles.errorText}>
                    Revisa tu conexión a internet e inténtalo nuevamente.
                </Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={() =>
                        loadCharacters(
                            1,
                            activeFilterRef.current
                        )
                    }
                >
                    <Text
                        style={styles.retryButtonText}
                    >
                        Intentar nuevamente
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right"]}
        >
            <FlatList
                ref={listRef}
                data={characters}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                numColumns={2}
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={5}
                updateCellsBatchingPeriod={50}
                columnWrapperStyle={styles.row}
                contentContainerStyle={
                    styles.listContent
                }
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onEndReached={
                    loadMoreCharacters
                }
                onEndReachedThreshold={0.35}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Pressable
                            onPress={() =>
                                router.push("/about" as Href)
                            }
                            hitSlop={10}
                            style={({ pressed }) => [
                                styles.aboutButton,
                                pressed &&
                                styles.aboutButtonPressed,
                            ]}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={25}
                                color={appColors.primary}
                            />
                        </Pressable>
                        <Text style={styles.badge}>
                            BASE DE DATOS MULTIVERSAL
                        </Text>

                        <Text style={styles.title}>
                            Rick & Morty
                        </Text>

                        <Text style={styles.subtitle}>
                            Explorador
                        </Text>

                        <Text
                            style={styles.description}
                        >
                            Explora personajes de todas las dimensiones.
                        </Text>

                        <View
                            style={styles.filters}
                        >
                            <FilterButton
                                label="Todos"
                                active={
                                    statusFilter === ""
                                }
                                onPress={() =>
                                    handleFilter("")
                                }
                            />

                            <FilterButton
                                label="Vivos"
                                active={
                                    statusFilter ===
                                    "alive"
                                }
                                onPress={() =>
                                    handleFilter(
                                        "alive"
                                    )
                                }
                            />

                            <FilterButton
                                label="Muertos"
                                active={
                                    statusFilter ===
                                    "dead"
                                }
                                onPress={() =>
                                    handleFilter(
                                        "dead"
                                    )
                                }
                            />

                            <FilterButton
                                label="Desconocidos"
                                active={
                                    statusFilter ===
                                    "unknown"
                                }
                                onPress={() =>
                                    handleFilter(
                                        "unknown"
                                    )
                                }
                            />
                        </View>
                    </View>
                }
                ListFooterComponent={
                    loadingMore ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator
                                size="small"
                                color={appColors.primary}
                            />

                            <Text style={styles.footerText}>
                                Explorando otra dimensión...
                            </Text>
                        </View>
                    ) : loadMoreError ? (
                        <View
                            style={
                                styles.loadMoreErrorContainer
                            }
                        >
                            <Text
                                style={
                                    styles.loadMoreErrorText
                                }
                            >
                                El portal perdió la conexión.
                            </Text>

                            <Pressable
                                style={
                                    styles.loadMoreRetryButton
                                }
                                onPress={() => {
                                    setLoadMoreError(false);

                                    loadCharacters(
                                        page + 1,
                                        activeFilterRef.current
                                    );
                                }}
                            >
                                <Text
                                    style={
                                        styles.loadMoreRetryText
                                    }
                                >
                                    Reintentar
                                </Text>
                            </Pressable>
                        </View>
                    ) : !hasMore &&
                        characters.length > 0 ? (
                        <View style={styles.endContainer}>
                            <Ionicons
                                name="planet-outline"
                                size={30}
                                color={appColors.primary}
                            />

                            <Text style={styles.endTitle}>
                                Fin del multiverso
                            </Text>

                            <Text style={styles.endText}>
                                Has explorado todos los personajes disponibles.
                            </Text>
                        </View>
                    ) : null
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

    center: {
        flex: 1,
        backgroundColor: appColors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },

    loadingText: {
        color: appColors.text,
        marginTop: 16,
        fontSize: 16,
        fontWeight: "600",
    },

    errorIcon: {
        fontSize: 60,
        marginBottom: 20,
    },

    errorTitle: {
        color: appColors.text,
        fontSize: 24,
        fontWeight: "800",
        textAlign: "center",
    },

    errorText: {
        color: appColors.textMuted,
        fontSize: 15,
        textAlign: "center",
        marginTop: 12,
        lineHeight: 22,
    },

    retryButton: {
        marginTop: 25,
        backgroundColor: appColors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
    },

    retryButtonText: {
        color: appColors.textDark,
        fontWeight: "800",
    },

    aboutButton: {
        position: "absolute",

        top: 20,
        right: 0,

        width: 44,
        height: 44,

        borderRadius: 22,

        backgroundColor: appColors.surface,

        borderWidth: 1,
        borderColor: appColors.border,

        justifyContent: "center",
        alignItems: "center",

        zIndex: 5,
    },

    aboutButtonPressed: {
        opacity: 0.7,

        transform: [
            {
                scale: 0.94,
            },
        ],
    },

    listContent: {
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",

        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    header: {
        paddingTop: 25,
        paddingBottom: 24,
    },

    badge: {
        color: appColors.primary,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 2,
        marginBottom: 8,
    },

    title: {
        color: appColors.text,
        fontSize: 38,
        fontWeight: "900",
    },

    subtitle: {
        color: appColors.secondary,
        fontSize: 38,
        fontWeight: "900",
        marginTop: -5,
    },

    description: {
        color: appColors.textMuted,
        marginTop: 12,
        fontSize: 15,
    },

    filters: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 20,
    },

    row: {
        justifyContent: "space-between",
    },

    footerLoader: {
        alignItems: "center",
        paddingVertical: 25,
    },

    footerText: {
        color: appColors.textMuted,
        marginTop: 8,
        fontSize: 12,
    },

    loadMoreErrorContainer: {
        alignItems: "center",
        paddingVertical: 22,
    },

    loadMoreErrorText: {
        color: appColors.textMuted,
        fontSize: 13,
    },

    loadMoreRetryButton: {
        backgroundColor: appColors.surfaceLight,
        borderWidth: 1,
        borderColor: appColors.primary,
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 20,
        marginTop: 10,
    },

    loadMoreRetryText: {
        color: appColors.primary,
        fontWeight: "700",
    },

    endContainer: {
        alignItems: "center",
        paddingVertical: 35,
    },

    endTitle: {
        color: appColors.text,
        fontSize: 17,
        fontWeight: "800",
        marginTop: 10,
    },

    endText: {
        color: appColors.textDisabled,
        fontSize: 12,
        marginTop: 5,
        textAlign: "center",
    },
});