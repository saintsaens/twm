export const adjectives = [
    "resplendent", "inimitable", "iridescent", "sinuous", "ethereal", "sonorous",
    "candescent", "celestial", "opalescent", "enigmatic", "effulgent", "ephemeral",
    "phantasmal", "majestic", "eloquent", "eccentric", "radiant", "luminous",
    "fabled", "sublime", "transcendent", "elusive", "exquisite", "seraphic",
    "venerable", "mythic", "bewitching", "arcane", "mesmeric", "timeless",
    "arcadian", "serene", "phantom", "silken", "radiant", "verdant", 
    "mystic", "arcane", "wondrous", "glimmering", "whimsical", "fabled",
    "arcadian", "somber", "luminous", "velvet", "ethereal", "translucent",
    "diaphanous", "sylvan", "celestial", "enchanting", "nebulous", "ancient",
    "melancholy", "otherworldly", "halcyon", "sacred", "nocturnal", "secretive"
];

export const names = [
    "markhor", "pangolin", "quokka", "kakapo", "fossa",
    "vaquita", "binturong", "dhole", "civet", "takin", "caracal", "axolotl",
    "genet", "saiga", "manul", "bongo", "quoll", "ibex", "kudu", "ratel",
    "nyala", "sifaka", "dhole", "oryx", "kinkajou", "margay", "raccoon dog", "galago",
    "okapi", "ocelot", "dugong", "tapir", "taruca", "uromastyx", "zebu", "kinkajou", 
    "chital", "tarsier", "kodiak", "eagle", "pronghorn", "muskrat", "albatross", 
    "mongoose", "meerkat", "macaw", "numbat", "loris", "coati", "weasel", "lemur", 
    "oryx", "echidna", "goral", "galah", "bonobo", "cassowary", "kagu"
];

export function generateName() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = names[Math.floor(Math.random() * names.length)].replace(" ", "-");
    return `${adjective}-${animal}`;
}
