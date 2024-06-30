function getURL(classResult) {
  const url = {
    Acacia: "acacia",
    Alibangbang: "alibangbang",
    Apitong: "apitong",
    Asis: "asis",
    Balayong: "balayong",
    Balete: "balete",
    Bayabas: "bayabas",
    Betis: "betis",
    Dao: "dao",
    Dita: "dita",
    Guyabano: "guyabano",
    Ilang_Ilang: "ilang-ilang",
    Ipil: "ipil",
    Kalios: "kalios",
    Kamagong: "kamagong",
    Langka: "langka",
    Mahogany: "mahogany",
    Mangga: "mangga",
    Mulawin: "mulawin",
    Narra: "narra",
    "Palo Maria": "palo-maria",
    Sintores: "sintores",
    Yakal: "yakal",
  };

  return url[classResult] || "N/A";
}

function getEnglishName(classResult) {
  const englishNames = {
    Acacia: "Acacia",
    Alibangbang: "Butterfly Tree",
    Apitong: "Apitong",
    Asis: "Asis",
    Balayong: "Palawan Cherry",
    Balete: "Balete",
    Bayabas: "Guava",
    Betis: "Madhuca betis",
    Dao: "Pacific Walnut",
    Dita: "Blackboard",
    Guyabano: "Soursop",
    Ilang_Ilang: "Ylang-ylang",
    Ipil: "Ironwood",
    Kalios: "Sandpaper",
    Kamagong: "Mountain persimmon",
    Langka: "Jackfruit",
    Mahogany: "Mahogany",
    Mangga: "Mango",
    Mulawin: "Small-flower Chaste",
    Narra: "Rosewood",
    "Palo Maria": "Palo Maria",
    Sintores: "Mandarin Orange",
    Yakal: "Yakal",
  };

  return englishNames[classResult] || "N/A";
}

function getScientificName(classResult) {
  const scientificNames = {
    Acacia: "Acacia",
    Alibangbang: "Bauhinia purpurea",
    Apitong: "Dipterocarpus grandiflorus",
    Asis: "Asis",
    Balayong: "Cassia nodosa",
    Balete: "Ficus balete",
    Bayabas: "Psidium guajava",
    Betis: "Azaola betis Blanco",
    Dao: "Dracontomelon dao",
    Dita: "Alstonia scholaris",
    Guyabano: "Annona muricata",
    Ilang_Ilang: "Cananga odorata",
    Ipil: "Intsia bijuga",
    Kalios: "Streblus asper",
    Kamagong: "Diospyros blancoi",
    Langka: "Artocarpus heterophyllus",
    Mahogany: "Swietenia macrophylla",
    Mangga: "Mangifera indica",
    Mulawin: "Vitex parviflora",
    Narra: "Pterocarpus indicus",
    "Palo Maria": "Calophyllum inophyllum",
    Sintores: "Citrus reticulata Blanco",
    Yakal: "Shorea astylosa",
  };

  return scientificNames[classResult] || "N/A";
}
