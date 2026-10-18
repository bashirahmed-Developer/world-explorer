// Offline fallback data with comprehensive details across all continents
// Ensures the application works flawlessly even if REST Countries API is unreachable or rate-limited
const FALLBACK_COUNTRIES = [
  {
    name: { common: "Pakistan", official: "Islamic Republic of Pakistan", nativeName: { urd: { official: "اسلامی جمہوریہ پاکستان", common: "پاکستان" } } },
    cca2: "PK", cca3: "PAK", ccn3: "586",
    capital: ["Islamabad"],
    region: "Asia",
    subregion: "Southern Asia",
    languages: { urd: "Urdu", eng: "English" },
    latlng: [30.0, 70.0],
    area: 881912,
    population: 241499431,
    flags: {
      png: "https://flagcdn.com/w320/pk.png",
      svg: "https://flagcdn.com/pk.svg",
      alt: "The flag of Pakistan is composed of a green field with a vertical white stripe on the hoist side, and a large white crescent and five-pointed star centered in the field."
    },
    currencies: { PKR: { name: "Pakistani rupee", symbol: "₨" } },
    borders: ["AFG", "CHN", "IND", "IRN"],
    timezones: ["UTC+05:00"],
    continents: ["Asia"],
    tld: [".pk"]
  },
  {
    name: { common: "United States", official: "United States of America", nativeName: { eng: { official: "United States of America", common: "United States" } } },
    cca2: "US", cca3: "USA", ccn3: "840",
    capital: ["Washington, D.C."],
    region: "Americas",
    subregion: "North America",
    languages: { eng: "English" },
    latlng: [38.0, -97.0],
    area: 9372610,
    population: 331893745,
    flags: {
      png: "https://flagcdn.com/w320/us.png",
      svg: "https://flagcdn.com/us.svg",
      alt: "The flag of the United States of America features thirteen alternating horizontal stripes of red and white, with a blue rectangle in the canton bearing fifty small white five-pointed stars."
    },
    currencies: { USD: { name: "United States dollar", symbol: "$" } },
    borders: ["CAN", "MEX"],
    timezones: ["UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00", "UTC-07:00", "UTC-06:00", "UTC-05:00", "UTC-04:00"],
    continents: ["North America"],
    tld: [".us"]
  },
  {
    name: { common: "United Kingdom", official: "United Kingdom of Great Britain and Northern Ireland", nativeName: { eng: { official: "United Kingdom of Great Britain and Northern Ireland", common: "United Kingdom" } } },
    cca2: "GB", cca3: "GBR", ccn3: "826",
    capital: ["London"],
    region: "Europe",
    subregion: "Northern Europe",
    languages: { eng: "English" },
    latlng: [54.0, -2.0],
    area: 242900,
    population: 67215293,
    flags: {
      png: "https://flagcdn.com/w320/gb.png",
      svg: "https://flagcdn.com/gb.svg",
      alt: "The flag of the United Kingdom combines the red cross of Saint George, the white saltire of Saint Andrew, and the red saltire of Saint Patrick."
    },
    currencies: { GBP: { name: "British pound", symbol: "£" } },
    borders: ["IRL"],
    timezones: ["UTC-08:00", "UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00", "UTC+00:00", "UTC+01:00", "UTC+02:00", "UTC+06:00"],
    continents: ["Europe"],
    tld: [".uk"]
  },
  {
    name: { common: "Germany", official: "Federal Republic of Germany", nativeName: { deu: { official: "Bundesrepublik Deutschland", common: "Deutschland" } } },
    cca2: "DE", cca3: "DEU", ccn3: "276",
    capital: ["Berlin"],
    region: "Europe",
    subregion: "Western Europe",
    languages: { deu: "German" },
    latlng: [51.0, 9.0],
    area: 357114,
    population: 83240525,
    flags: {
      png: "https://flagcdn.com/w320/de.png",
      svg: "https://flagcdn.com/de.svg",
      alt: "The flag of Germany is composed of three equal horizontal bands of black, red and gold."
    },
    currencies: { EUR: { name: "Euro", symbol: "€" } },
    borders: ["AUT", "BEL", "CZE", "DNK", "FRA", "LUX", "NLD", "POL", "CHE"],
    timezones: ["UTC+01:00"],
    continents: ["Europe"],
    tld: [".de"]
  },
  {
    name: { common: "Japan", official: "Japan", nativeName: { jpn: { official: "日本国", common: "日本" } } },
    cca2: "JP", cca3: "JPN", ccn3: "392",
    capital: ["Tokyo"],
    region: "Asia",
    subregion: "Eastern Asia",
    languages: { jpn: "Japanese" },
    latlng: [36.0, 138.0],
    area: 377930,
    population: 125836021,
    flags: {
      png: "https://flagcdn.com/w320/jp.png",
      svg: "https://flagcdn.com/jp.svg",
      alt: "The flag of Japan features a crimson-red circle centered on a white rectangular field."
    },
    currencies: { JPY: { name: "Japanese yen", symbol: "¥" } },
    borders: [],
    timezones: ["UTC+09:00"],
    continents: ["Asia"],
    tld: [".jp"]
  },
  {
    name: { common: "Turkey", official: "Republic of Türkiye", nativeName: { tur: { official: "Türkiye Cumhuriyeti", common: "Türkiye" } } },
    cca2: "TR", cca3: "TUR", ccn3: "792",
    capital: ["Ankara"],
    region: "Asia",
    subregion: "Western Asia",
    languages: { tur: "Turkish" },
    latlng: [39.0, 35.0],
    area: 783562,
    population: 84680273,
    flags: {
      png: "https://flagcdn.com/w320/tr.png",
      svg: "https://flagcdn.com/tr.svg",
      alt: "The flag of Turkey features a white crescent moon and an eight-pointed star centered on a red field."
    },
    currencies: { TRY: { name: "Turkish lira", symbol: "₺" } },
    borders: ["ARM", "AZE", "BGR", "GEO", "GRC", "IRN", "IRQ", "SYR"],
    timezones: ["UTC+03:00"],
    continents: ["Asia"],
    tld: [".tr"]
  },
  {
    name: { common: "Saudi Arabia", official: "Kingdom of Saudi Arabia", nativeName: { ara: { official: "المملكة العربية السعودية", common: "المملكة العربية السعودية" } } },
    cca2: "SA", cca3: "SAU", ccn3: "682",
    capital: ["Riyadh"],
    region: "Asia",
    subregion: "Western Asia",
    languages: { ara: "Arabic" },
    latlng: [25.0, 45.0],
    area: 2149690,
    population: 34813867,
    flags: {
      png: "https://flagcdn.com/w320/sa.png",
      svg: "https://flagcdn.com/sa.svg",
      alt: "The flag of Saudi Arabia features the Shahada in white script above a horizontal saber on a green field."
    },
    currencies: { SAR: { name: "Saudi riyal", symbol: "﷼" } },
    borders: ["IRQ", "JOR", "KWT", "OMN", "QAT", "ARE", "YEM"],
    timezones: ["UTC+03:00"],
    continents: ["Asia"],
    tld: [".sa"]
  },
  {
    name: { common: "United Arab Emirates", official: "United Arab Emirates", nativeName: { ara: { official: "الإمارات العربية المتحدة", common: "دولة الإمارات العربية المتحدة" } } },
    cca2: "AE", cca3: "ARE", ccn3: "784",
    capital: ["Abu Dhabi"],
    region: "Asia",
    subregion: "Western Asia",
    languages: { ara: "Arabic" },
    latlng: [24.0, 54.0],
    area: 83600,
    population: 9890400,
    flags: {
      png: "https://flagcdn.com/w320/ae.png",
      svg: "https://flagcdn.com/ae.svg",
      alt: "The flag of the United Arab Emirates features a vertical red band and three horizontal bands of green, white and black."
    },
    currencies: { AED: { name: "United Arab Emirates dirham", symbol: "د.إ" } },
    borders: ["OMN", "SAU"],
    timezones: ["UTC+04:00"],
    continents: ["Asia"],
    tld: [".ae"]
  },
  {
    name: { common: "Canada", official: "Canada", nativeName: { eng: { official: "Canada", common: "Canada" }, fra: { official: "Canada", common: "Canada" } } },
    cca2: "CA", cca3: "CAN", ccn3: "124",
    capital: ["Ottawa"],
    region: "Americas",
    subregion: "North America",
    languages: { eng: "English", fra: "French" },
    latlng: [60.0, -95.0],
    area: 9984670,
    population: 38005238,
    flags: {
      png: "https://flagcdn.com/w320/ca.png",
      svg: "https://flagcdn.com/ca.svg",
      alt: "The flag of Canada is composed of red vertical bands on each side and a central white square bearing a red maple leaf."
    },
    currencies: { CAD: { name: "Canadian dollar", symbol: "$" } },
    borders: ["USA"],
    timezones: ["UTC-08:00", "UTC-07:00", "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC-03:30"],
    continents: ["North America"],
    tld: [".ca"]
  },
  {
    name: { common: "Brazil", official: "Federative Republic of Brazil", nativeName: { por: { official: "República Federativa do Brasil", common: "Brasil" } } },
    cca2: "BR", cca3: "BRA", ccn3: "076",
    capital: ["Brasília"],
    region: "Americas",
    subregion: "South America",
    languages: { por: "Portuguese" },
    latlng: [-10.0, -55.0],
    area: 8515767,
    population: 212559409,
    flags: {
      png: "https://flagcdn.com/w320/br.png",
      svg: "https://flagcdn.com/br.svg",
      alt: "The flag of Brazil features a green field centered with a large yellow rhombus displaying a blue celestial disc."
    },
    currencies: { BRL: { name: "Brazilian real", symbol: "R$" } },
    borders: ["ARG", "BOL", "COL", "GUF", "GUY", "PRY", "PER", "SUR", "URY", "VEN"],
    timezones: ["UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00"],
    continents: ["South America"],
    tld: [".br"]
  },
  {
    name: { common: "Australia", official: "Commonwealth of Australia", nativeName: { eng: { official: "Commonwealth of Australia", common: "Australia" } } },
    cca2: "AU", cca3: "AUS", ccn3: "036",
    capital: ["Canberra"],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    languages: { eng: "English" },
    latlng: [-27.0, 133.0],
    area: 7692024,
    population: 25687041,
    flags: {
      png: "https://flagcdn.com/w320/au.png",
      svg: "https://flagcdn.com/au.svg",
      alt: "The flag of Australia has a blue field with the Union Jack in the canton, the Commonwealth Star below, and the Southern Cross constellation."
    },
    currencies: { AUD: { name: "Australian dollar", symbol: "$" } },
    borders: [],
    timezones: ["UTC+05:00", "UTC+06:30", "UTC+07:00", "UTC+08:00", "UTC+09:30", "UTC+10:00", "UTC+10:30", "UTC+11:00"],
    continents: ["Oceania"],
    tld: [".au"]
  },
  {
    name: { common: "France", official: "French Republic", nativeName: { fra: { official: "République française", common: "France" } } },
    cca2: "FR", cca3: "FRA", ccn3: "250",
    capital: ["Paris"],
    region: "Europe",
    subregion: "Western Europe",
    languages: { fra: "French" },
    latlng: [46.0, 2.0],
    area: 551695,
    population: 67391582,
    flags: {
      png: "https://flagcdn.com/w320/fr.png",
      svg: "https://flagcdn.com/fr.svg",
      alt: "The flag of France is a tricolour featuring three vertical bands coloured blue, white, and red."
    },
    currencies: { EUR: { name: "Euro", symbol: "€" } },
    borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"],
    timezones: ["UTC+01:00"],
    continents: ["Europe"],
    tld: [".fr"]
  },
  {
    name: { common: "China", official: "People's Republic of China", nativeName: { zho: { official: "中华人民共和国", common: "中国" } } },
    cca2: "CN", cca3: "CHN", ccn3: "156",
    capital: ["Beijing"],
    region: "Asia",
    subregion: "Eastern Asia",
    languages: { zho: "Chinese" },
    latlng: [35.0, 105.0],
    area: 9706961,
    population: 1402112000,
    flags: {
      png: "https://flagcdn.com/w320/cn.png",
      svg: "https://flagcdn.com/cn.svg",
      alt: "The flag of China has a red field with five golden stars in the canton."
    },
    currencies: { CNY: { name: "Chinese yuan", symbol: "¥" } },
    borders: ["AFG", "BTN", "MMR", "HKG", "IND", "KAZ", "PRK", "KGZ", "LAO", "MAC", "MNG", "NPL", "PAK", "RUS", "TJK", "VNM"],
    timezones: ["UTC+08:00"],
    continents: ["Asia"],
    tld: [".cn"]
  },
  {
    name: { common: "Egypt", official: "Arab Republic of Egypt", nativeName: { ara: { official: "جمهورية مصر العربية", common: "مصر" } } },
    cca2: "EG", cca3: "EGY", ccn3: "818",
    capital: ["Cairo"],
    region: "Africa",
    subregion: "Northern Africa",
    languages: { ara: "Arabic" },
    latlng: [27.0, 30.0],
    area: 1002450,
    population: 102334403,
    flags: {
      png: "https://flagcdn.com/w320/eg.png",
      svg: "https://flagcdn.com/eg.svg",
      alt: "The flag of Egypt is a tricolour featuring three equal horizontal bands of red, white and black, with the golden Eagle of Saladin centered in the white band."
    },
    currencies: { EGP: { name: "Egyptian pound", symbol: "E£" } },
    borders: ["ISR", "LBY", "PSE", "SDN"],
    timezones: ["UTC+02:00"],
    continents: ["Africa"],
    tld: [".eg"]
  },
  {
    name: { common: "South Africa", official: "Republic of South Africa", nativeName: { afr: { official: "Republiek van Suid-Afrika", common: "South Africa" }, eng: { official: "Republic of South Africa", common: "South Africa" } } },
    cca2: "ZA", cca3: "ZAF", ccn3: "710",
    capital: ["Pretoria", "Bloemfontein", "Cape Town"],
    region: "Africa",
    subregion: "Southern Africa",
    languages: { afr: "Afrikaans", eng: "English", xho: "Xhosa", zul: "Zulu" },
    latlng: [-29.0, 24.0],
    area: 1221037,
    population: 59308690,
    flags: {
      png: "https://flagcdn.com/w320/za.png",
      svg: "https://flagcdn.com/za.svg",
      alt: "The flag of South Africa features two equal horizontal bands of red and blue separated by a central green horizontal band that splits into a horizontal 'Y'."
    },
    currencies: { ZAR: { name: "South African rand", symbol: "R" } },
    borders: ["BWA", "LSO", "MOZ", "NAM", "SWZ", "ZWE"],
    timezones: ["UTC+02:00"],
    continents: ["Africa"],
    tld: [".za"]
  },
  {
    name: { common: "Italy", official: "Italian Republic", nativeName: { ita: { official: "Repubblica Italiana", common: "Italia" } } },
    cca2: "IT", cca3: "ITA", ccn3: "380",
    capital: ["Rome"],
    region: "Europe",
    subregion: "Southern Europe",
    languages: { ita: "Italian" },
    latlng: [42.83333333, 12.83333333],
    area: 301336,
    population: 59554023,
    flags: {
      png: "https://flagcdn.com/w320/it.png",
      svg: "https://flagcdn.com/it.svg",
      alt: "The flag of Italy features three equal vertical bands of green, white and red."
    },
    currencies: { EUR: { name: "Euro", symbol: "€" } },
    borders: ["AUT", "FRA", "SMR", "SVN", "CHE", "VAT"],
    timezones: ["UTC+01:00"],
    continents: ["Europe"],
    tld: [".it"]
  },
  {
    name: { common: "India", official: "Republic of India", nativeName: { hin: { official: "भारत गणराज्य", common: "भारत" }, eng: { official: "Republic of India", common: "India" } } },
    cca2: "IN", cca3: "IND", ccn3: "356",
    capital: ["New Delhi"],
    region: "Asia",
    subregion: "Southern Asia",
    languages: { eng: "English", hin: "Hindi" },
    latlng: [20.0, 77.0],
    area: 3287590,
    population: 1380004385,
    flags: {
      png: "https://flagcdn.com/w320/in.png",
      svg: "https://flagcdn.com/in.svg",
      alt: "The flag of India is composed of three equal horizontal bands of saffron, white and green with the blue Ashoka Chakra wheel in the center."
    },
    currencies: { INR: { name: "Indian rupee", symbol: "₹" } },
    borders: ["BGD", "BTN", "MMR", "CHN", "NPL", "PAK"],
    timezones: ["UTC+05:30"],
    continents: ["Asia"],
    tld: [".in"]
  },
  {
    name: { common: "Argentina", official: "Argentine Republic", nativeName: { spa: { official: "República Argentina", common: "Argentina" } } },
    cca2: "AR", cca3: "ARG", ccn3: "032",
    capital: ["Buenos Aires"],
    region: "Americas",
    subregion: "South America",
    languages: { spa: "Spanish" },
    latlng: [-34.0, -64.0],
    area: 2780400,
    population: 45376763,
    flags: {
      png: "https://flagcdn.com/w320/ar.png",
      svg: "https://flagcdn.com/ar.svg",
      alt: "The flag of Argentina features three equal horizontal bands of light blue and white with the yellow Sun of May in the center."
    },
    currencies: { ARS: { name: "Argentine peso", symbol: "$" } },
    borders: ["BOL", "BRA", "CHL", "PRY", "URY"],
    timezones: ["UTC-03:00"],
    continents: ["South America"],
    tld: [".ar"]
  },
  {
    name: { common: "Spain", official: "Kingdom of Spain", nativeName: { spa: { official: "Reino de España", common: "España" } } },
    cca2: "ES", cca3: "ESP", ccn3: "724",
    capital: ["Madrid"],
    region: "Europe",
    subregion: "Southern Europe",
    languages: { spa: "Spanish" },
    latlng: [40.0, -4.0],
    area: 505992,
    population: 47351567,
    flags: {
      png: "https://flagcdn.com/w320/es.png",
      svg: "https://flagcdn.com/es.svg",
      alt: "The flag of Spain features three horizontal stripes of red, yellow and red, with the Spanish coat of arms in the yellow stripe."
    },
    currencies: { EUR: { name: "Euro", symbol: "€" } },
    borders: ["AND", "FRA", "GIB", "PRT", "MAR"],
    timezones: ["UTC+01:00"],
    continents: ["Europe"],
    tld: [".es"]
  },
  {
    name: { common: "Malaysia", official: "Malaysia", nativeName: { msa: { official: "Malaysia", common: "Malaysia" } } },
    cca2: "MY", cca3: "MYS", ccn3: "458",
    capital: ["Kuala Lumpur"],
    region: "Asia",
    subregion: "South-Eastern Asia",
    languages: { msa: "Malay" },
    latlng: [2.5, 112.5],
    area: 330803,
    population: 32365998,
    flags: {
      png: "https://flagcdn.com/w320/my.png",
      svg: "https://flagcdn.com/my.svg",
      alt: "The flag of Malaysia features 14 alternating red and white stripes with a blue canton bearing a yellow crescent and 14-point star."
    },
    currencies: { MYR: { name: "Malaysian ringgit", symbol: "RM" } },
    borders: ["BRN", "IDN", "THA"],
    timezones: ["UTC+08:00"],
    continents: ["Asia"],
    tld: [".my"]
  }
];
