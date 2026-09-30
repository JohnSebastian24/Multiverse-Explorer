export function translateStatus(status: string) {
  const translations: Record<string, string> = {
    Alive: "Vivo",
    Dead: "Muerto",
    unknown: "Desconocido",
  };

  return translations[status] ?? status;
}

export function translateGender(gender: string) {
  const translations: Record<string, string> = {
    Male: "Masculino",
    Female: "Femenino",
    Genderless: "Sin género",
    unknown: "Desconocido",
  };

  return translations[gender] ?? gender;
}

export function translateUnknown(value: string) {
  if (!value || value.toLowerCase() === "unknown") {
    return "Desconocido";
  }

  return value;
}

export function translateSpecies(species: string) {
  const translations: Record<string, string> = {
    Human: "Humano",
    Alien: "Alienígena",
    Humanoid: "Humanoide",
    Robot: "Robot",
    Animal: "Animal",
    Disease: "Enfermedad",
    Cronenberg: "Cronenberg",
    "Mythological Creature": "Criatura mitológica",
    unknown: "Desconocido",
  };

  return translations[species] ?? species;
}