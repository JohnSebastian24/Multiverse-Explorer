import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "expo-router/react-navigation";
import { Href, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    Character,
    getCharacters,
} from "../../services/rickAndMortyApi";

import {
    translateSpecies,
    translateStatus,
} from "../../utils/translations";

export default function HomeScreen() {
    const router = useRouter();

    // Referencia directa a la lista.
    const listRef = useRef<FlatList<Character>>(null);

    useScrollToTop(listRef);

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

    const scrollTopAnimation =
        useRef(new Animated.Value(0)).current;

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
        Animated.timing(
            scrollTopAnimation,
            {
                toValue: showScrollTop ? 1 : 0,
                duration: 180,
                useNativeDriver: Platform.OS !== "web",
            }
        ).start();
    }, [showScrollTop, scrollTopAnimation]);

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
                    color="#97ce4c"
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
        <SafeAreaView style={styles.container}>
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
                                color="#97ce4c"
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
                                color="#97ce4c"
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
                    <Pressable
                        style={styles.card}
                        onPress={() =>
                            router.push(
                                `/character/${item.id}` as Href
                            )
                        }
                    >
                        <Image
                            source={item.image}
                            style={styles.characterImage}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={200}
                        />

                        <View
                            style={styles.cardContent}
                        >
                            <Text
                                style={
                                    styles.characterName
                                }
                                numberOfLines={1}
                            >
                                {item.name}
                            </Text>

                            <View
                                style={
                                    styles.statusContainer
                                }
                            >
                                <View
                                    style={[
                                        styles.statusDot,
                                        {
                                            backgroundColor:
                                                item.status ===
                                                    "Alive"
                                                    ? "#97ce4c"
                                                    : item.status ===
                                                        "Dead"
                                                        ? "#ef4444"
                                                        : "#9ca3af",
                                        },
                                    ]}
                                />

                                <Text
                                    style={
                                        styles.statusText
                                    }
                                >
                                    {translateStatus(
                                        item.status
                                    )}
                                </Text>
                            </View>

                            <Text
                                style={styles.species}
                            >
                                {translateSpecies(
                                    item.species
                                )}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />

            <Animated.View
                style={[
                    styles.scrollTopWrapper,
                    {
                        pointerEvents:
                            showScrollTop
                                ? "auto"
                                : "none",

                        opacity: scrollTopAnimation,

                        transform: [
                            {
                                scale:
                                    scrollTopAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.85, 1],
                                    }),
                            },
                        ],
                    },
                ]}
            >
                <Pressable
                    style={styles.scrollTopButton}
                    onPress={scrollToTop}
                >
                    <Ionicons
                        name="arrow-up"
                        size={25}
                        color="#090e17"
                    />
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}

interface FilterButtonProps {
    label: string;
    active: boolean;
    onPress: () => void;
}

function FilterButton({
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
    container: {
        flex: 1,
        backgroundColor: "#090e17",
    },

    center: {
        flex: 1,
        backgroundColor: "#090e17",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },

    loadingText: {
        color: "#ffffff",
        marginTop: 16,
        fontSize: 16,
        fontWeight: "600",
    },

    errorIcon: {
        fontSize: 60,
        marginBottom: 20,
    },

    errorTitle: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "800",
        textAlign: "center",
    },

    errorText: {
        color: "#9ca3af",
        fontSize: 15,
        textAlign: "center",
        marginTop: 12,
        lineHeight: 22,
    },

    retryButton: {
        marginTop: 25,
        backgroundColor: "#97ce4c",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
    },

    retryButtonText: {
        color: "#090e17",
        fontWeight: "800",
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    header: {
        paddingTop: 25,
        paddingBottom: 24,
    },

    badge: {
        color: "#97ce4c",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 2,
        marginBottom: 8,
    },

    title: {
        color: "#ffffff",
        fontSize: 38,
        fontWeight: "900",
    },

    subtitle: {
        color: "#00b5cc",
        fontSize: 38,
        fontWeight: "900",
        marginTop: -5,
    },

    description: {
        color: "#9ca3af",
        marginTop: 12,
        fontSize: 15,
    },

    filters: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 20,
    },

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

    row: {
        justifyContent: "space-between",
    },

    card: {
        width: "48%",
        backgroundColor: "#111827",
        borderRadius: 18,
        marginBottom: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#1f2937",
    },

    characterImage: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#172033",
    },

    cardContent: {
        padding: 12,
    },

    characterName: {
        color: "#ffffff",
        fontWeight: "800",
        fontSize: 15,
    },

    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },

    statusText: {
        color: "#d1d5db",
        fontSize: 12,
    },

    species: {
        color: "#6b7280",
        fontSize: 12,
        marginTop: 4,
    },

    footerLoader: {
        alignItems: "center",
        paddingVertical: 25,
    },

    footerText: {
        color: "#9ca3af",
        marginTop: 8,
        fontSize: 12,
    },

    loadMoreErrorContainer: {
        alignItems: "center",
        paddingVertical: 22,
    },

    loadMoreErrorText: {
        color: "#9ca3af",
        fontSize: 13,
    },

    loadMoreRetryButton: {
        backgroundColor: "#172033",
        borderWidth: 1,
        borderColor: "#97ce4c",
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 20,
        marginTop: 10,
    },
    loadMoreRetryText: {
        color: "#97ce4c",
        fontWeight: "700",
    },

    endContainer: {
        alignItems: "center",
        paddingVertical: 35,
    },

    endTitle: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "800",
        marginTop: 10,
    },

    endText: {
        color: "#6b7280",
        fontSize: 12,
        marginTop: 5,
        textAlign: "center",
    },

    scrollTopWrapper: {
        position: "absolute",
        right: 18,
        bottom: 18,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,

        elevation: 8,
    },

    scrollTopButton: {
        width: 50,
        height: 50,
        borderRadius: 25,

        backgroundColor: "#97ce4c",

        justifyContent: "center",
        alignItems: "center",
    },
});