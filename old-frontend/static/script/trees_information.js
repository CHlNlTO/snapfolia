fetch(treeUrl)
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("tree-div").innerHTML = data;
  });

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
    "Ilang Ilang": "ilang-ilang",
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
    //New Datasets
    Amugis: "amugis",
    Banaba: "banaba",
    Bani: "bani",
    Barako: "barako",
    Binunga: "binunga",
    Duhat: "duhat",
    Eucalyptus: "eucalyptus",
    Hinadyong: "hinadyong",
    Lansones: "lansones",
    "Madre Cacao": "madrecacao",
    "Scramble Egg": "scrambledegg",
    "Native Talisay": "talisay",
    Tibig: "tibig",
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
    "Ilang Ilang": "Ylang-ylang",
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
    //New Datasets
    Amugis: "Amugis",
    Banaba: "Queen's Cape Myrtle",
    Bani: "Pongam",
    Barako: "Liberica Coffee",
    Binunga: "Parasol",
    Duhat: "Malabar Plum",
    Eucalyptus: "Eucalyptus",
    Hinadyong: "Oriental Trema",
    Lansones: "Langsat",
    "Madre Cacao": "Gliricidia Tree",
    "Scramble Egg": "Scrambled Egg",
    "Native Talisay": "Indian Almond",
    Tibig: "Sacking Tree",
  };

  return englishNames[classResult] || "N/A";
}

function getScientificName(classResult) {
  const scientificNames = {
    Acacia: "Acacia",
    Alibangbang: "Bauhinia purpurea",
    Apitong: "Dipterocarpus grandiflorus",
    Asis: "Leucocnide alba",
    Balayong: "Cassia nodosa",
    Balete: "Ficus balete",
    Bayabas: "Psidium guajava",
    Betis: "Azaola betis Blanco",
    Dao: "Dracontomelon dao",
    Dita: "Alstonia scholaris",
    Guyabano: "Annona muricata",
    "Ilang Ilang": "Cananga odorata",
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
    //New Datasets
    Amugis: "Koordersiodendron pinnatum",
    Banaba: "Lagerstroemia speciosa",
    Bani: "Pongamia pinnata",
    Barako: "Coffea liberica",
    Binunga: "Macaranga tanarius",
    Duhat: "Syzygium cumini",
    Eucalyptus: "Eucalyptus globulus",
    Hinadyong: "Trema orientalis",
    Lansones: "Lansium domesticum",
    "Madre Cacao": "Gliricidia Sepium",
    "Scramble Egg": "Senna surattensis",
    "Native Talisay": "Terminalia Catappa",
    Tibig: "Ficus nota",
  };

  return scientificNames[classResult] || "N/A";
}
