const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const Animal = require("../models/Animal");

const animals = [
  {
    species_name: "Indian Peafowl",
    category: "bird",
    conservation_status: "least_concern",
    info_description: "India's national bird, known for its iridescent blue-green plumage and elaborate courtship display. Males sport a magnificent tail of elongated upper tail coverts decorated with eye-spots.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/800px-Peacock_Plumage.jpg",
    habitat: "Forests, farmland, near human settlements",
    region_found: "Indian subcontinent",
  },
  {
    species_name: "Asiatic Lion",
    category: "mammal",
    conservation_status: "endangered",
    info_description: "Found only in the Gir Forest of Gujarat, this subspecies is smaller than its African relative. The last surviving population numbers about 674 individuals, making it one of the world's rarest large cats.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Asiatic_lion_male.jpg/800px-Asiatic_lion_male.jpg",
    habitat: "Dry deciduous forest, scrubland",
    region_found: "Gir National Park, Gujarat",
  },
  {
    species_name: "Indian Star Tortoise",
    category: "reptile",
    conservation_status: "vulnerable",
    info_description: "Recognized by its distinctive star-patterned shell, frequently targeted by illegal wildlife trade. It is one of the most sought-after species in the pet trade globally.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Indian_star_tortoise_%28Geochelone_elegans%29_2.jpg/800px-Indian_star_tortoise_%28Geochelone_elegans%29_2.jpg",
    habitat: "Dry areas, scrub forest, grassland",
    region_found: "India, Sri Lanka, Pakistan",
  },
  {
    species_name: "Bengal Tiger",
    category: "mammal",
    conservation_status: "endangered",
    info_description: "The national animal of India, the Bengal tiger is the most numerous tiger subspecies. India is home to about 70% of the world's wild tigers, housed across 53 tiger reserves.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24_-_Tigerportr%C3%A4t.jpg/800px-24_-_Tigerportr%C3%A4t.jpg",
    habitat: "Tropical rainforests, mangroves, grasslands",
    region_found: "India, Bangladesh, Nepal, Bhutan",
  },
  {
    species_name: "Indian Elephant",
    category: "mammal",
    conservation_status: "endangered",
    info_description: "Slightly smaller than its African cousin, the Indian elephant is revered in Indian culture and plays a key ecological role as a keystone species in maintaining forest ecosystems.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Elephas_maximus_%28Bandipur%29.jpg/800px-Elephas_maximus_%28Bandipur%29.jpg",
    habitat: "Tropical evergreen forests, semi-evergreen forests, dry deciduous forests",
    region_found: "South and Southeast Asia",
  },
  {
    species_name: "Great Indian Bustard",
    category: "bird",
    conservation_status: "critically_endangered",
    info_description: "One of the heaviest flying birds, now critically endangered with fewer than 150 individuals remaining. Power lines and habitat loss are the primary threats to its survival.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Ardeotis_nigriceps_1.jpg/800px-Ardeotis_nigriceps_1.jpg",
    habitat: "Arid and semi-arid grasslands, scrublands",
    region_found: "Rajasthan, Gujarat, Maharashtra",
  },
  {
    species_name: "Indian Cobra",
    category: "reptile",
    conservation_status: "least_concern",
    info_description: "The spectacled cobra is one of the Big Four snakes in India responsible for most snakebite incidents. It is revered in Hindu mythology and worshipped during Nag Panchami.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Naja_naja_-_Kapuziner.jpg/800px-Naja_naja_-_Kapuziner.jpg",
    habitat: "Forests, plains, agricultural fields, urban areas",
    region_found: "Indian subcontinent",
  },
  {
    species_name: "Snow Leopard",
    category: "mammal",
    conservation_status: "vulnerable",
    info_description: "Known as the 'Ghost of the Mountains', snow leopards inhabit the high altitude Himalayan regions. They are elusive, solitary predators perfectly adapted to cold, rocky terrain.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Irbis4.jpg/800px-Irbis4.jpg",
    habitat: "Alpine and subalpine zones above 3000m",
    region_found: "Ladakh, Himachal Pradesh, Uttarakhand, Sikkim",
  },
  {
    species_name: "Indian Pangolin",
    category: "mammal",
    conservation_status: "endangered",
    info_description: "The world's most trafficked mammal, covered in protective keratin scales. They feed primarily on ants and termites using their long, sticky tongue.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Indian_Pangolin_%28Manis_crassicaudata%29.jpg/800px-Indian_Pangolin_%28Manis_crassicaudata%29.jpg",
    habitat: "Forests, grasslands, degraded habitats",
    region_found: "Indian subcontinent, parts of Southeast Asia",
  },
  {
    species_name: "Ganges River Dolphin",
    category: "mammal",
    conservation_status: "endangered",
    info_description: "India's national aquatic animal, this freshwater dolphin is essentially blind and navigates using echolocation. Fewer than 2000 individuals remain in fragmented river habitats.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Platanista_gangetica.png/800px-Platanista_gangetica.png",
    habitat: "Freshwater river systems",
    region_found: "Ganges-Brahmaputra-Meghna river system",
  },
  {
    species_name: "Red Panda",
    category: "mammal",
    conservation_status: "endangered",
    info_description: "A small arboreal mammal with reddish-brown fur and a long bushy tail. Despite its name, it is not closely related to the giant panda. The state animal of Sikkim.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Red_Panda_%2825193861686%29.jpg/800px-Red_Panda_%2825193861686%29.jpg",
    habitat: "Temperate forests with bamboo understory",
    region_found: "Eastern Himalayas — Sikkim, Darjeeling, Arunachal Pradesh",
  },
  {
    species_name: "Indian Rhinoceros",
    category: "mammal",
    conservation_status: "vulnerable",
    info_description: "The greater one-horned rhinoceros has a single horn and distinctive armor-like skin folds. Kaziranga National Park in Assam holds the largest population.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Indian_rhinoceros_%28Rhinoceros_unicornis%29_4.jpg/800px-Indian_rhinoceros_%28Rhinoceros_unicornis%29_4.jpg",
    habitat: "Grasslands, swamps near rivers",
    region_found: "Assam, West Bengal, Nepal",
  },
  {
    species_name: "King Cobra",
    category: "reptile",
    conservation_status: "vulnerable",
    info_description: "The world's longest venomous snake, reaching up to 18 feet. Despite its fearsome reputation, it is generally shy and avoids human confrontation. It feeds primarily on other snakes.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg/800px-12_-_The_Mystical_King_Cobra_and_Coffee_Forests.jpg",
    habitat: "Dense highland forests, bamboo thickets",
    region_found: "Western Ghats, Northeast India, Andaman Islands",
  },
  {
    species_name: "Nilgiri Tahr",
    category: "mammal",
    conservation_status: "endangered",
    info_description: "A stocky wild goat endemic to the Nilgiri Hills and Western Ghats. Males develop a dark, saddle-like patch on their backs. About 2500 individuals survive in the wild.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/NilgiriTahr.jpg/800px-NilgiriTahr.jpg",
    habitat: "Montane grasslands and shrublands above 1200m",
    region_found: "Western Ghats — Tamil Nadu, Kerala",
  },
  {
    species_name: "Malabar Giant Squirrel",
    category: "mammal",
    conservation_status: "least_concern",
    info_description: "One of the world's largest squirrels with a head-body length up to 45cm. Known for its striking multi-colored fur of maroon, purple, orange, and cream.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Ratufa_indica_-_Bhimashankar.jpg/800px-Ratufa_indica_-_Bhimashankar.jpg",
    habitat: "Upper canopy of tropical deciduous and evergreen forests",
    region_found: "Western Ghats, peninsular India",
  },
  {
    species_name: "Indian Purple Frog",
    category: "amphibian",
    conservation_status: "endangered",
    info_description: "A living fossil discovered in 2003, this bloated purple frog spends most of its life underground. It emerges only for about two weeks each year during monsoon to mate.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Nasikabatrachus_sahyadrensis.jpg/800px-Nasikabatrachus_sahyadrensis.jpg",
    habitat: "Underground burrows in Western Ghats forests",
    region_found: "Western Ghats — Kerala, Karnataka",
  },
];

const seedAnimals = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Animal.deleteMany({});
    console.log("🗑️  Cleared existing animals");

    const created = await Animal.insertMany(animals);
    console.log(`🌿 Seeded ${created.length} animal species`);

    await mongoose.disconnect();
    console.log("✅ Done! Database disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedAnimals();
