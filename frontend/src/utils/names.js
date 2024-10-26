const adjectives = [
    "Resplendent", "Inimitable", "Iridescent", "Sinuous", "Ethereal", "Sonorous",
    "Candescent", "Celestial", "Opalescent", "Enigmatic", "Effulgent", "Ephemeral",
    "Phantasmal", "Majestic", "Eloquent", "Eccentric", "Radiant", "Luminous",
    "Fabled", "Sublime", "Transcendent", "Elusive", "Exquisite", "Seraphic",
    "Venerable", "Mythic", "Bewitching", "Arcane", "Mesmeric", "Timeless"
];

const names = [
    "Markhor", "Pangolin", "Quokka", "Kakapo", "Fossa",
    "Vaquita", "Binturong", "Dhole", "Civet", "Takin", "Caracal", "Axolotl",
    "Genet", "Saiga", "Manul", "Bongo", "Quoll", "Ibex", "Kudu", "Ratel",
    "Nyala", "Sifaka", "Dhole", "Oryx", "Kinkajou", "Margay", "Raccoon Dog", "Galago"
];

export function generateName() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = names[Math.floor(Math.random() * names.length)];
    return `${adjective} ${animal}`;
}
