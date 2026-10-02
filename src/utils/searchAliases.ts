function normalizeSearch(value: string) {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

const characterAliases: Record<string, string> = {
    // Mr. Poopybutthole
    "senor pantalones de popo": "Mr. Poopybutthole",
    "sr pantalones de popo": "Mr. Poopybutthole",
    "senor popo": "Mr. Poopybutthole",
    "sr popo": "Mr. Poopybutthole",
    "pantalones de popo": "Mr. Poopybutthole",
    "pantalones": "Mr. Poopybutthole",
    "popó": "Mr. Poopybutthole",
    "popo": "Mr. Poopybutthole",

    // Mr. Meeseeks
    "senor meeseeks": "Mr. Meeseeks",
    "sr meeseeks": "Mr. Meeseeks",
    "meeseeks": "Mr. Meeseeks",

    // Birdperson
    "hombre pajaro": "Birdperson",
    "persona pajaro": "Birdperson",
    "hombre ave": "Birdperson",
    "bird person": "Birdperson",

    // Pickle Rick
    "rick pepinillo": "Pickle Rick",
    "pepinillo rick": "Pickle Rick",
    "rick pepino": "Pickle Rick",
    "rick pickle": "Pickle Rick",

    // Evil Morty
    "morty malvado": "Evil Morty",
    "morty malo": "Evil Morty",
    "morty maligno": "Evil Morty",

    // Toxic versions
    "rick toxico": "Toxic Rick",
    "rick venenoso": "Toxic Rick",
    "morty toxico": "Toxic Morty",
    "morty venenoso": "Toxic Morty",

    // Space Beth
    "beth espacial": "Space Beth",
    "beth del espacio": "Space Beth",

    // Evil Rick
    "rick malvado": "Evil Rick",
    "rick malo": "Evil Rick",

    // Tiny Rick
    "rick pequeno": "Tiny Rick",
    "rick chiquito": "Tiny Rick",
    "rick mini": "Tiny Rick",

    // Squanchy
    "squanchi": "Squanchy",
    "squanch": "Squanchy",

    // Scary Terry
    "terry aterrador": "Scary Terry",
    "terry terrorifico": "Scary Terry",

    // Abradolf Lincler
    "abradolfo lincler": "Abradolf Lincler",

    // Unity
    "unidad": "Unity",

    // Noob-Noob
    "novato novato": "Noob-Noob",
    "noob noob": "Noob-Noob",
};

export function resolveCharacterSearch(
    value: string
): string {
    const normalized =
        normalizeSearch(value);

    return (
        characterAliases[normalized] ??
        value.trim()
    );
}