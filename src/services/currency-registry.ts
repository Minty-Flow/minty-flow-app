/**
 * Currency Registry Service
 *
 * All ISO 4217 data is retrieved from http://www.currency-iso.org/en/home/tables/table-a1.html
 *
 * Last updated: 12 May 2025 (based on ISO 4217 XML data)
 *
 * List of excluded entries:
 * - Any currency with no currency code
 * - XBA - Bond Markets Unit European Composite Unit (EURCO)
 * - XBB - Bond Markets Unit European Monetary Unit (E.M.U.-6)
 * - XBC - Bond Markets Unit European Unit of Account 9 (E.U.A.-9)
 * - XBD - Bond Markets Unit European Unit of Account 17 (E.U.A.-17)
 * - XTS - Codes specifically reserved for testing purposes
 * - XXX - The codes assigned for transactions where no currency is involved
 * - XAU - Gold
 * - XPD - Palladium
 * - XPT - Platinum
 * - XAG - Silver
 */

import type {
  Currency,
  CurrencySymbolMap,
  CustomCurrencyData,
} from "~/types/currency"

// Currency symbol mapping for common currencies
const CURRENCY_SYMBOLS: CurrencySymbolMap = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  RUB: "₽",
  BRL: "R$",
  INR: "₹",
  KRW: "₩",
  SGD: "S$",
  HKD: "HK$",
  NZD: "NZ$",
  MXN: "$",
  ZAR: "R",
  TRY: "₺",
  THB: "฿",
  IDR: "Rp",
  MYR: "RM",
  PHP: "₱",
  AED: "د.إ",
  SAR: "﷼",
  ILS: "₪",
  ARS: "$",
  CLP: "$",
  COP: "$",
  PEN: "S/",
  UYU: "$U",
  VND: "₫",
  TWD: "NT$",
  PKR: "₨",
  BDT: "৳",
  LKR: "₨",
  EGP: "£",
  NGN: "₦",
  KES: "KSh",
  ETB: "Br",
  GHS: "₵",
  ZMW: "ZK",
  MAD: "د.م.",
  TND: "د.ت",
  DZD: "د.ج",
  IQD: "ع.د",
  JOD: "د.ا",
  KWD: "د.ك",
  LBP: "L£",
  OMR: "﷼",
  QAR: "﷼",
  YER: "﷼",
  AFN: "؋",
  AMD: "֏",
  AZN: "₼",
  BGN: "лв",
  BHD: ".د.ب",
  BND: "B$",
  BOB: "Bs.",
  BWP: "P",
  BYN: "Br",
  BZD: "BZ$",
  CRC: "₡",
  CUP: "₱",
  DOP: "RD$",
  FJD: "FJ$",
  GEL: "₾",
  GIP: "£",
  GTQ: "Q",
  GYD: "GY$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  ISK: "kr",
  JMD: "J$",
  KGS: "лв",
  KHR: "៛",
  KZT: "₸",
  LAK: "₭",
  LRD: "$",
  LSL: "L",
  MDL: "lei",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "P",
  MUR: "₨",
  MVR: "Rf",
  MWK: "MK",
  MZN: "MT",
  NAD: "N$",
  NIO: "C$",
  NPR: "₨",
  PAB: "B/.",
  PGK: "K",
  PYG: "Gs",
  RON: "lei",
  RSD: "Дин.",
  SBD: "SI$",
  SCR: "₨",
  SDG: "ج.س.",
  SHP: "£",
  SLL: "Le",
  SOS: "S",
  SRD: "$",
  SSP: "£",
  STN: "Db",
  SVC: "₡",
  SZL: "E",
  TJS: "ЅМ",
  TMT: "m",
  TOP: "T$",
  TTD: "TT$",
  TZS: "TSh",
  UAH: "₴",
  UGX: "USh",
  UZS: "лв",
  VUV: "Vt",
  WST: "T",
  XCD: "$",
  XCG: "ƒ",
  XDR: "SDR",
  XPF: "₣",
  XOF: "CFA",
  XAF: "FCFA",
  ZWG: "ZWG",
}

// ISO 4217 Currencies
const ISO4217_CURRENCIES: ReadonlyArray<Omit<Currency, "symbol">> = [
  { code: "AED", name: "UAE Dirham", country: "UNITED ARAB EMIRATES (THE)" },
  { code: "AFN", name: "Afghani", country: "AFGHANISTAN" },
  { code: "ALL", name: "Lek", country: "ALBANIA" },
  { code: "AMD", name: "Armenian Dram", country: "ARMENIA" },
  { code: "AOA", name: "Kwanza", country: "ANGOLA" },
  { code: "ARS", name: "Argentine Peso", country: "ARGENTINA" },
  { code: "AUD", name: "Australian Dollar", country: "AUSTRALIA" },
  { code: "AUD", name: "Australian Dollar", country: "CHRISTMAS ISLAND" },
  {
    code: "AUD",
    name: "Australian Dollar",
    country: "COCOS (KEELING) ISLANDS (THE)",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    country: "HEARD ISLAND AND McDONALD ISLANDS",
  },
  { code: "AUD", name: "Australian Dollar", country: "KIRIBATI" },
  { code: "AUD", name: "Australian Dollar", country: "NAURU" },
  { code: "AUD", name: "Australian Dollar", country: "NORFOLK ISLAND" },
  { code: "AUD", name: "Australian Dollar", country: "TUVALU" },
  { code: "AWG", name: "Aruban Florin", country: "ARUBA" },
  { code: "AZN", name: "Azerbaijan Manat", country: "AZERBAIJAN" },
  { code: "BAM", name: "Convertible Mark", country: "BOSNIA AND HERZEGOVINA" },
  { code: "BBD", name: "Barbados Dollar", country: "BARBADOS" },
  { code: "BDT", name: "Taka", country: "BANGLADESH" },
  { code: "BGN", name: "Bulgarian Lev", country: "BULGARIA" },
  { code: "BHD", name: "Bahraini Dinar", country: "BAHRAIN" },
  { code: "BIF", name: "Burundi Franc", country: "BURUNDI" },
  { code: "BMD", name: "Bermudian Dollar", country: "BERMUDA" },
  { code: "BND", name: "Brunei Dollar", country: "BRUNEI DARUSSALAM" },
  {
    code: "BOB",
    name: "Boliviano",
    country: "BOLIVIA (PLURINATIONAL STATE OF)",
  },
  { code: "BOV", name: "Mvdol", country: "BOLIVIA (PLURINATIONAL STATE OF)" },
  { code: "BRL", name: "Brazilian Real", country: "BRAZIL" },
  { code: "BSD", name: "Bahamian Dollar", country: "BAHAMAS (THE)" },
  { code: "BTN", name: "Ngultrum", country: "BHUTAN" },
  { code: "BWP", name: "Pula", country: "BOTSWANA" },
  { code: "BYN", name: "Belarusian Ruble", country: "BELARUS" },
  { code: "BZD", name: "Belize Dollar", country: "BELIZE" },
  { code: "CAD", name: "Canadian Dollar", country: "CANADA" },
  {
    code: "CDF",
    name: "Congolese Franc",
    country: "CONGO (THE DEMOCRATIC REPUBLIC OF THE)",
  },
  { code: "CHE", name: "WIR Euro", country: "SWITZERLAND" },
  { code: "CHF", name: "Swiss Franc", country: "LIECHTENSTEIN" },
  { code: "CHF", name: "Swiss Franc", country: "SWITZERLAND" },
  { code: "CHW", name: "WIR Franc", country: "SWITZERLAND" },
  { code: "CLF", name: "Unidad de Fomento", country: "CHILE" },
  { code: "CLP", name: "Chilean Peso", country: "CHILE" },
  { code: "CNY", name: "Yuan Renminbi", country: "CHINA" },
  { code: "COP", name: "Colombian Peso", country: "COLOMBIA" },
  { code: "COU", name: "Unidad de Valor Real", country: "COLOMBIA" },
  { code: "CRC", name: "Costa Rican Colon", country: "COSTA RICA" },
  { code: "CUP", name: "Cuban Peso", country: "CUBA" },
  { code: "CVE", name: "Cabo Verde Escudo", country: "CABO VERDE" },
  { code: "CZK", name: "Czech Koruna", country: "CZECHIA" },
  { code: "DJF", name: "Djibouti Franc", country: "DJIBOUTI" },
  { code: "DKK", name: "Danish Krone", country: "DENMARK" },
  { code: "DKK", name: "Danish Krone", country: "FAROE ISLANDS (THE)" },
  { code: "DKK", name: "Danish Krone", country: "GREENLAND" },
  { code: "DOP", name: "Dominican Peso", country: "DOMINICAN REPUBLIC (THE)" },
  { code: "DZD", name: "Algerian Dinar", country: "ALGERIA" },
  { code: "EGP", name: "Egyptian Pound", country: "EGYPT" },
  { code: "ERN", name: "Nakfa", country: "ERITREA" },
  { code: "ETB", name: "Ethiopian Birr", country: "ETHIOPIA" },
  { code: "EUR", name: "Euro", country: "ÅLAND ISLANDS" },
  { code: "EUR", name: "Euro", country: "ANDORRA" },
  { code: "EUR", name: "Euro", country: "AUSTRIA" },
  { code: "EUR", name: "Euro", country: "BELGIUM" },
  { code: "EUR", name: "Euro", country: "CROATIA" },
  { code: "EUR", name: "Euro", country: "CYPRUS" },
  { code: "EUR", name: "Euro", country: "ESTONIA" },
  { code: "EUR", name: "Euro", country: "EUROPEAN UNION" },
  { code: "EUR", name: "Euro", country: "FINLAND" },
  { code: "EUR", name: "Euro", country: "FRANCE" },
  { code: "EUR", name: "Euro", country: "FRENCH GUIANA" },
  { code: "EUR", name: "Euro", country: "FRENCH SOUTHERN TERRITORIES (THE)" },
  { code: "EUR", name: "Euro", country: "GERMANY" },
  { code: "EUR", name: "Euro", country: "GREECE" },
  { code: "EUR", name: "Euro", country: "GUADELOUPE" },
  { code: "EUR", name: "Euro", country: "HOLY SEE (THE)" },
  { code: "EUR", name: "Euro", country: "IRELAND" },
  { code: "EUR", name: "Euro", country: "ITALY" },
  { code: "EUR", name: "Euro", country: "LATVIA" },
  { code: "EUR", name: "Euro", country: "LITHUANIA" },
  { code: "EUR", name: "Euro", country: "LUXEMBOURG" },
  { code: "EUR", name: "Euro", country: "MALTA" },
  { code: "EUR", name: "Euro", country: "MARTINIQUE" },
  { code: "EUR", name: "Euro", country: "MAYOTTE" },
  { code: "EUR", name: "Euro", country: "MONACO" },
  { code: "EUR", name: "Euro", country: "MONTENEGRO" },
  { code: "EUR", name: "Euro", country: "NETHERLANDS (THE)" },
  { code: "EUR", name: "Euro", country: "PORTUGAL" },
  { code: "EUR", name: "Euro", country: "RÉUNION" },
  { code: "EUR", name: "Euro", country: "SAINT BARTHÉLEMY" },
  { code: "EUR", name: "Euro", country: "SAINT MARTIN (FRENCH PART)" },
  { code: "EUR", name: "Euro", country: "SAINT PIERRE AND MIQUELON" },
  { code: "EUR", name: "Euro", country: "SAN MARINO" },
  { code: "EUR", name: "Euro", country: "SLOVAKIA" },
  { code: "EUR", name: "Euro", country: "SLOVENIA" },
  { code: "EUR", name: "Euro", country: "SPAIN" },
  { code: "FJD", name: "Fiji Dollar", country: "FIJI" },
  {
    code: "FKP",
    name: "Falkland Islands Pound",
    country: "FALKLAND ISLANDS (THE) [MALVINAS]",
  },
  { code: "GBP", name: "Pound Sterling", country: "GUERNSEY" },
  { code: "GBP", name: "Pound Sterling", country: "ISLE OF MAN" },
  { code: "GBP", name: "Pound Sterling", country: "JERSEY" },
  {
    code: "GBP",
    name: "Pound Sterling",
    country: "UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND (THE)",
  },
  { code: "GEL", name: "Lari", country: "GEORGIA" },
  { code: "GHS", name: "Ghana Cedi", country: "GHANA" },
  { code: "GIP", name: "Gibraltar Pound", country: "GIBRALTAR" },
  { code: "GMD", name: "Dalasi", country: "GAMBIA (THE)" },
  { code: "GNF", name: "Guinean Franc", country: "GUINEA" },
  { code: "GTQ", name: "Quetzal", country: "GUATEMALA" },
  { code: "GYD", name: "Guyana Dollar", country: "GUYANA" },
  { code: "HKD", name: "Hong Kong Dollar", country: "HONG KONG" },
  { code: "HNL", name: "Lempira", country: "HONDURAS" },
  { code: "HTG", name: "Gourde", country: "HAITI" },
  { code: "HUF", name: "Forint", country: "HUNGARY" },
  { code: "IDR", name: "Rupiah", country: "INDONESIA" },
  { code: "ILS", name: "New Israeli Sheqel", country: "ISRAEL" },
  { code: "INR", name: "Indian Rupee", country: "BHUTAN" },
  { code: "INR", name: "Indian Rupee", country: "INDIA" },
  { code: "IQD", name: "Iraqi Dinar", country: "IRAQ" },
  { code: "IRR", name: "Iranian Rial", country: "IRAN (ISLAMIC REPUBLIC OF)" },
  { code: "ISK", name: "Iceland Krona", country: "ICELAND" },
  { code: "JMD", name: "Jamaican Dollar", country: "JAMAICA" },
  { code: "JOD", name: "Jordanian Dinar", country: "JORDAN" },
  { code: "JPY", name: "Yen", country: "JAPAN" },
  { code: "KES", name: "Kenyan Shilling", country: "KENYA" },
  { code: "KGS", name: "Som", country: "KYRGYZSTAN" },
  { code: "KHR", name: "Riel", country: "CAMBODIA" },
  { code: "KMF", name: "Comorian Franc", country: "COMOROS (THE)" },
  {
    code: "KPW",
    name: "North Korean Won",
    country: "KOREA (THE DEMOCRATIC PEOPLE’S REPUBLIC OF)",
  },
  { code: "KRW", name: "Won", country: "KOREA (THE REPUBLIC OF)" },
  { code: "KWD", name: "Kuwaiti Dinar", country: "KUWAIT" },
  {
    code: "KYD",
    name: "Cayman Islands Dollar",
    country: "CAYMAN ISLANDS (THE)",
  },
  { code: "KZT", name: "Tenge", country: "KAZAKHSTAN" },
  {
    code: "LAK",
    name: "Lao Kip",
    country: "LAO PEOPLE’S DEMOCRATIC REPUBLIC (THE)",
  },
  { code: "LBP", name: "Lebanese Pound", country: "LEBANON" },
  { code: "LKR", name: "Sri Lanka Rupee", country: "SRI LANKA" },
  { code: "LRD", name: "Liberian Dollar", country: "LIBERIA" },
  { code: "LSL", name: "Loti", country: "LESOTHO" },
  { code: "LYD", name: "Libyan Dinar", country: "LIBYA" },
  { code: "MAD", name: "Moroccan Dirham", country: "MOROCCO" },
  { code: "MAD", name: "Moroccan Dirham", country: "WESTERN SAHARA" },
  { code: "MDL", name: "Moldovan Leu", country: "MOLDOVA (THE REPUBLIC OF)" },
  { code: "MGA", name: "Malagasy Ariary", country: "MADAGASCAR" },
  { code: "MKD", name: "Denar", country: "NORTH MACEDONIA" },
  { code: "MMK", name: "Kyat", country: "MYANMAR" },
  { code: "MNT", name: "Tugrik", country: "MONGOLIA" },
  { code: "MOP", name: "Pataca", country: "MACAO" },
  { code: "MRU", name: "Ouguiya", country: "MAURITANIA" },
  { code: "MUR", name: "Mauritius Rupee", country: "MAURITIUS" },
  { code: "MVR", name: "Rufiyaa", country: "MALDIVES" },
  { code: "MWK", name: "Malawi Kwacha", country: "MALAWI" },
  { code: "MXN", name: "Mexican Peso", country: "MEXICO" },
  { code: "MXV", name: "Mexican Unidad de Inversion (UDI)", country: "MEXICO" },
  { code: "MYR", name: "Malaysian Ringgit", country: "MALAYSIA" },
  { code: "MZN", name: "Mozambique Metical", country: "MOZAMBIQUE" },
  { code: "NAD", name: "Namibia Dollar", country: "NAMIBIA" },
  { code: "NGN", name: "Naira", country: "NIGERIA" },
  { code: "NIO", name: "Cordoba Oro", country: "NICARAGUA" },
  { code: "NOK", name: "Norwegian Krone", country: "BOUVET ISLAND" },
  { code: "NOK", name: "Norwegian Krone", country: "NORWAY" },
  { code: "NOK", name: "Norwegian Krone", country: "SVALBARD AND JAN MAYEN" },
  { code: "NPR", name: "Nepalese Rupee", country: "NEPAL" },
  { code: "NZD", name: "New Zealand Dollar", country: "COOK ISLANDS (THE)" },
  { code: "NZD", name: "New Zealand Dollar", country: "NEW ZEALAND" },
  { code: "NZD", name: "New Zealand Dollar", country: "NIUE" },
  { code: "NZD", name: "New Zealand Dollar", country: "PITCAIRN" },
  { code: "NZD", name: "New Zealand Dollar", country: "TOKELAU" },
  { code: "OMR", name: "Rial Omani", country: "OMAN" },
  { code: "PAB", name: "Balboa", country: "PANAMA" },
  { code: "PEN", name: "Sol", country: "PERU" },
  { code: "PGK", name: "Kina", country: "PAPUA NEW GUINEA" },
  { code: "PHP", name: "Philippine Peso", country: "PHILIPPINES (THE)" },
  { code: "PKR", name: "Pakistan Rupee", country: "PAKISTAN" },
  { code: "PLN", name: "Zloty", country: "POLAND" },
  { code: "PYG", name: "Guarani", country: "PARAGUAY" },
  { code: "QAR", name: "Qatari Rial", country: "QATAR" },
  { code: "RON", name: "Romanian Leu", country: "ROMANIA" },
  { code: "RSD", name: "Serbian Dinar", country: "SERBIA" },
  { code: "RUB", name: "Russian Ruble", country: "RUSSIAN FEDERATION (THE)" },
  { code: "RWF", name: "Rwanda Franc", country: "RWANDA" },
  { code: "SAR", name: "Saudi Riyal", country: "SAUDI ARABIA" },
  { code: "SBD", name: "Solomon Islands Dollar", country: "SOLOMON ISLANDS" },
  { code: "SCR", name: "Seychelles Rupee", country: "SEYCHELLES" },
  { code: "SDG", name: "Sudanese Pound", country: "SUDAN (THE)" },
  { code: "SEK", name: "Swedish Krona", country: "SWEDEN" },
  { code: "SGD", name: "Singapore Dollar", country: "SINGAPORE" },
  {
    code: "SHP",
    name: "Saint Helena Pound",
    country: "SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA",
  },
  { code: "SLE", name: "Leone", country: "SIERRA LEONE" },
  { code: "SOS", name: "Somali Shilling", country: "SOMALIA" },
  { code: "SRD", name: "Surinam Dollar", country: "SURINAME" },
  { code: "SSP", name: "South Sudanese Pound", country: "SOUTH SUDAN" },
  { code: "STN", name: "Dobra", country: "SAO TOME AND PRINCIPE" },
  { code: "SVC", name: "El Salvador Colon", country: "EL SALVADOR" },
  { code: "SYP", name: "Syrian Pound", country: "SYRIAN ARAB REPUBLIC" },
  { code: "SZL", name: "Lilangeni", country: "ESWATINI" },
  { code: "THB", name: "Baht", country: "THAILAND" },
  { code: "TJS", name: "Somoni", country: "TAJIKISTAN" },
  { code: "TMT", name: "Turkmenistan New Manat", country: "TURKMENISTAN" },
  { code: "TND", name: "Tunisian Dinar", country: "TUNISIA" },
  { code: "TOP", name: "Pa’anga", country: "TONGA" },
  { code: "TRY", name: "Turkish Lira", country: "TÜRKİYE" },
  {
    code: "TTD",
    name: "Trinidad and Tobago Dollar",
    country: "TRINIDAD AND TOBAGO",
  },
  {
    code: "TWD",
    name: "New Taiwan Dollar",
    country: "TAIWAN (PROVINCE OF CHINA)",
  },
  {
    code: "TZS",
    name: "Tanzanian Shilling",
    country: "TANZANIA, UNITED REPUBLIC OF",
  },
  { code: "UAH", name: "Hryvnia", country: "UKRAINE" },
  { code: "UGX", name: "Uganda Shilling", country: "UGANDA" },
  { code: "USD", name: "US Dollar", country: "AMERICAN SAMOA" },
  {
    code: "USD",
    name: "US Dollar",
    country: "BONAIRE, SINT EUSTATIUS AND SABA",
  },
  {
    code: "USD",
    name: "US Dollar",
    country: "BRITISH INDIAN OCEAN TERRITORY (THE)",
  },
  { code: "USD", name: "US Dollar", country: "ECUADOR" },
  { code: "USD", name: "US Dollar", country: "EL SALVADOR" },
  { code: "USD", name: "US Dollar", country: "GUAM" },
  { code: "USD", name: "US Dollar", country: "HAITI" },
  { code: "USD", name: "US Dollar", country: "MARSHALL ISLANDS (THE)" },
  {
    code: "USD",
    name: "US Dollar",
    country: "MICRONESIA (FEDERATED STATES OF)",
  },
  { code: "USD", name: "US Dollar", country: "NORTHERN MARIANA ISLANDS (THE)" },
  { code: "USD", name: "US Dollar", country: "PALAU" },
  { code: "USD", name: "US Dollar", country: "PANAMA" },
  { code: "USD", name: "US Dollar", country: "PUERTO RICO" },
  { code: "USD", name: "US Dollar", country: "TIMOR-LESTE" },
  { code: "USD", name: "US Dollar", country: "TURKS AND CAICOS ISLANDS (THE)" },
  {
    code: "USD",
    name: "US Dollar",
    country: "UNITED STATES MINOR OUTLYING ISLANDS (THE)",
  },
  { code: "USD", name: "US Dollar", country: "UNITED STATES OF AMERICA (THE)" },
  { code: "USD", name: "US Dollar", country: "VIRGIN ISLANDS (BRITISH)" },
  { code: "USD", name: "US Dollar", country: "VIRGIN ISLANDS (U.S.)" },
  {
    code: "USN",
    name: "US Dollar (Next day)",
    country: "UNITED STATES OF AMERICA (THE)",
  },
  {
    code: "UYI",
    name: "Uruguay Peso en Unidades Indexadas (UI)",
    country: "URUGUAY",
  },
  { code: "UYU", name: "Peso Uruguayo", country: "URUGUAY" },
  { code: "UYW", name: "Unidad Previsional", country: "URUGUAY" },
  { code: "UZS", name: "Uzbekistan Sum", country: "UZBEKISTAN" },
  {
    code: "VED",
    name: "Bolívar Soberano",
    country: "VENEZUELA (BOLIVARIAN REPUBLIC OF)",
  },
  {
    code: "VES",
    name: "Bolívar Soberano",
    country: "VENEZUELA (BOLIVARIAN REPUBLIC OF)",
  },
  { code: "VND", name: "Dong", country: "VIET NAM" },
  { code: "VUV", name: "Vatu", country: "VANUATU" },
  { code: "WST", name: "Tala", country: "SAMOA" },
  { code: "XAD", name: "Arab Accounting Dinar", country: "ARAB MONETARY FUND" },
  { code: "XAF", name: "CFA Franc BEAC", country: "CAMEROON" },
  {
    code: "XAF",
    name: "CFA Franc BEAC",
    country: "CENTRAL AFRICAN REPUBLIC (THE)",
  },
  { code: "XAF", name: "CFA Franc BEAC", country: "CHAD" },
  { code: "XAF", name: "CFA Franc BEAC", country: "CONGO (THE)" },
  { code: "XAF", name: "CFA Franc BEAC", country: "EQUATORIAL GUINEA" },
  { code: "XAF", name: "CFA Franc BEAC", country: "GABON" },
  { code: "XCD", name: "East Caribbean Dollar", country: "ANGUILLA" },
  {
    code: "XCD",
    name: "East Caribbean Dollar",
    country: "ANTIGUA AND BARBUDA",
  },
  { code: "XCD", name: "East Caribbean Dollar", country: "DOMINICA" },
  { code: "XCD", name: "East Caribbean Dollar", country: "GRENADA" },
  { code: "XCD", name: "East Caribbean Dollar", country: "MONTSERRAT" },
  {
    code: "XCD",
    name: "East Caribbean Dollar",
    country: "SAINT KITTS AND NEVIS",
  },
  { code: "XCD", name: "East Caribbean Dollar", country: "SAINT LUCIA" },
  {
    code: "XCD",
    name: "East Caribbean Dollar",
    country: "SAINT VINCENT AND THE GRENADINES",
  },
  { code: "XCG", name: "Caribbean Guilder", country: "CURAÇAO" },
  {
    code: "XCG",
    name: "Caribbean Guilder",
    country: "SINT MAARTEN (DUTCH PART)",
  },
  {
    code: "XDR",
    name: "SDR (Special Drawing Right)",
    country: "INTERNATIONAL MONETARY FUND (IMF)",
  },
  { code: "XOF", name: "CFA Franc BCEAO", country: "BENIN" },
  { code: "XOF", name: "CFA Franc BCEAO", country: "BURKINA FASO" },
  { code: "XOF", name: "CFA Franc BCEAO", country: "CÔTE D'IVOIRE" },
  { code: "XOF", name: "CFA Franc BCEAO", country: "GUINEA-BISSAU" },
  { code: "XOF", name: "CFA Franc BCEAO", country: "MALI" },
  { code: "XOF", name: "CFA Franc BCEAO", country: "NIGER (THE)" },
  { code: "XOF", name: "CFA Franc BCEAO", country: "SENEGAL" },
  { code: "XOF", name: "CFA Franc BCEAO", country: "TOGO" },
  { code: "XPF", name: "CFP Franc", country: "FRENCH POLYNESIA" },
  { code: "XPF", name: "CFP Franc", country: "NEW CALEDONIA" },
  { code: "XPF", name: "CFP Franc", country: "WALLIS AND FUTUNA" },
  {
    code: "XSU",
    name: "Sucre",
    country: "SISTEMA UNITARIO DE COMPENSACION REGIONAL DE PAGOS 'SUCRE'",
  },
  {
    code: "XUA",
    name: "ADB Unit of Account",
    country: "MEMBER COUNTRIES OF THE AFRICAN DEVELOPMENT BANK GROUP",
  },
  { code: "YER", name: "Yemeni Rial", country: "YEMEN" },
  { code: "ZAR", name: "Rand", country: "LESOTHO" },
  { code: "ZAR", name: "Rand", country: "NAMIBIA" },
  { code: "ZAR", name: "Rand", country: "SOUTH AFRICA" },
  { code: "ZMW", name: "Zambian Kwacha", country: "ZAMBIA" },
  { code: "ZWG", name: "Zimbabwe Gold", country: "ZIMBABWE" },
] as const

// Crypto currencies supported by exchange rate APIs
const CRYPTO_CURRENCIES: ReadonlyArray<Omit<Currency, "symbol" | "country">> = [
  { code: "BTC", name: "Bitcoin", isCrypto: true },
  { code: "ETH", name: "Ethereum", isCrypto: true },
  { code: "USDT", name: "Tether USDt", isCrypto: true },
  { code: "XRP", name: "XRP", isCrypto: true },
  { code: "BNB", name: "BNB", isCrypto: true },
  { code: "SOL", name: "Solana", isCrypto: true },
  { code: "USDC", name: "USDC", isCrypto: true },
  { code: "DOGE", name: "Dogecoin", isCrypto: true },
  { code: "ADA", name: "Cardano", isCrypto: true },
  { code: "BCH", name: "Bitcoin Cash", isCrypto: true },
  { code: "AVAX", name: "Avalanche", isCrypto: true },
  { code: "TON", name: "Toncoin", isCrypto: true },
  { code: "SHIB", name: "Shiba Inu", isCrypto: true },
  { code: "LTC", name: "Litecoin", isCrypto: true },
  { code: "HBAR", name: "Hedera", isCrypto: true },
  { code: "XMR", name: "Monero", isCrypto: true },
  { code: "DAI", name: "Dai", isCrypto: true },
  { code: "DOT", name: "Polkadot", isCrypto: true },
  { code: "UNI", name: "Uniswap", isCrypto: true },
  { code: "PEPE", name: "Pepe", isCrypto: true },
  { code: "AAVE", name: "Aave", isCrypto: true },
  { code: "APT", name: "Aptos", isCrypto: true },
  { code: "OKB", name: "OKB", isCrypto: true },
  { code: "NEAR", name: "NEAR Protocol", isCrypto: true },
  { code: "ICP", name: "Internet Computer", isCrypto: true },
  { code: "CRO", name: "Cronos", isCrypto: true },
  { code: "ETC", name: "Ethereum Classic", isCrypto: true },
] as const

// Multinational currency country name overrides
const MULTINATION_CURRENCY_COUNTRY_NAME_OVERRIDE: Record<string, string> = {
  USD: "US AND OTHERS",
  EUR: "EUROPEAN UNION",
  XCD: "CARIBBEAN ISLANDS",
  XCG: "CARIBBEAN ISLANDS",
  AUD: "AUSTRALIA AND OTHERS",
}

/**
 * Gets currency symbol from code.
 *
 * @param code - Currency code
 * @returns Currency symbol or code if symbol not found
 * @internal
 */
const getCurrencySymbol = (code: string): string => {
  return CURRENCY_SYMBOLS[code] ?? code
}

/**
 * Currency Registry Service.
 *
 * @remarks
 * Singleton service for managing currency data including:
 * - ISO 4217 currencies
 * - Cryptocurrencies
 * - Custom user-defined currencies
 *
 * Provides methods to:
 * - Look up currency information by code
 * - Validate currency codes
 * - Register custom currencies
 * - Get currency symbols and names
 */
class CurrencyRegistryService {
  private static instance: CurrencyRegistryService | null = null
  private customCurrencies: CustomCurrencyData[] = []

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Gets the singleton instance of the service.
   *
   * @returns The singleton CurrencyRegistryService instance
   */
  static getInstance(): CurrencyRegistryService {
    if (!CurrencyRegistryService.instance) {
      CurrencyRegistryService.instance = new CurrencyRegistryService()
    }
    return CurrencyRegistryService.instance
  }

  /**
   * Gets all ISO 4217 currencies with symbols.
   *
   * @returns Readonly array of all ISO 4217 currencies
   */
  get allIso4217Currencies(): ReadonlyArray<Currency> {
    return ISO4217_CURRENCIES.map((currency) => ({
      ...currency,
      symbol: getCurrencySymbol(currency.code),
    }))
  }

  /**
   * Gets all supported cryptocurrencies with symbols.
   *
   * @returns Readonly array of all cryptocurrencies
   */
  get allCryptoCurrencies(): ReadonlyArray<Currency> {
    return CRYPTO_CURRENCIES.map((currency) => ({
      ...currency,
      country: "",
      symbol: currency.code,
    }))
  }

  /**
   * Gets all currencies (ISO 4217 + crypto + custom).
   *
   * @returns Readonly array of all available currencies
   */
  get allCurrencies(): ReadonlyArray<Currency> {
    return [
      ...this.allIso4217Currencies,
      ...this.allCryptoCurrencies,
      ...this.customCurrencies,
    ]
  }

  /**
   * Gets grouped currencies by code (deduplicated).
   *
   * @remarks
   * For currencies used by multiple countries, combines country names.
   *
   * @returns Record mapping currency codes to Currency objects
   */
  get groupedCurrencies(): Readonly<Record<string, Currency>> {
    // Group ISO 4217 currencies by code
    const iso4217Grouped = new Map<string, Currency>()
    for (const currency of ISO4217_CURRENCIES) {
      const existing = iso4217Grouped.get(currency.code)
      if (existing) {
        // Combine country names
        const countries = existing.country.includes(currency.country)
          ? existing.country
          : `${existing.country}, ${currency.country}`
        iso4217Grouped.set(currency.code, {
          ...existing,
          country:
            MULTINATION_CURRENCY_COUNTRY_NAME_OVERRIDE[currency.code] ??
            countries,
        })
      } else {
        iso4217Grouped.set(currency.code, {
          ...currency,
          symbol: getCurrencySymbol(currency.code),
          country:
            MULTINATION_CURRENCY_COUNTRY_NAME_OVERRIDE[currency.code] ??
            currency.country,
        })
      }
    }

    // Add crypto currencies
    const cryptoMap = new Map<string, Currency>()
    for (const crypto of CRYPTO_CURRENCIES) {
      cryptoMap.set(crypto.code, {
        ...crypto,
        country: "",
        symbol: crypto.code,
      })
    }

    // Add custom currencies
    const customMap = new Map<string, Currency>()
    for (const custom of this.customCurrencies) {
      customMap.set(custom.code, custom)
    }

    // Combine all maps
    return {
      ...Object.fromEntries(iso4217Grouped),
      ...Object.fromEntries(cryptoMap),
      ...Object.fromEntries(customMap),
    }
  }

  /**
   * Checks if a currency code is valid.
   *
   * @param currencyCode - Currency code (case-insensitive)
   * @returns True if the currency code exists in the registry
   */
  isCurrencyCodeValid(currencyCode: string): boolean {
    const normalized = currencyCode.toUpperCase()
    return normalized in this.groupedCurrencies
  }

  /**
   * Registers a custom currency.
   *
   * @param currency - Custom currency data
   * @throws {Error} If currency code is invalid format or already exists
   */
  registerCustomCurrency(currency: CustomCurrencyData): void {
    // Validate currency code format (alphanumeric, uppercase)
    if (!/^[A-Z0-9]+$/.test(currency.code)) {
      throw new Error(
        `Currency code '${currency.code}' is not valid. Must be alphanumeric and uppercase.`,
      )
    }

    // Check if currency already exists
    if (this.groupedCurrencies[currency.code]) {
      throw new Error(`Currency with code '${currency.code}' already exists.`)
    }

    // Ensure isCustom is set
    const customCurrency: CustomCurrencyData = {
      ...currency,
      isCustom: true,
    }

    this.customCurrencies.push(customCurrency)
  }

  /**
   * Gets currency data by code.
   *
   * @param code - Currency code (case-insensitive)
   * @returns Currency object or undefined if not found
   */
  getCurrencyByCode(code: string): Currency | undefined {
    return this.groupedCurrencies[code.toUpperCase()]
  }

  /**
   * Gets currency symbol from code.
   *
   * @param code - Currency code (case-insensitive)
   * @returns Currency symbol or code if symbol not found
   */
  getCurrencySymbol(code: string): string {
    const currency = this.getCurrencyByCode(code)
    return currency?.symbol ?? code
  }

  /**
   * Gets currency name from code.
   *
   * @param code - Currency code (case-insensitive)
   * @returns Currency name or code if not found
   */
  getCurrencyName(code: string): string {
    const currency = this.getCurrencyByCode(code)
    return currency?.name ?? code
  }

  /**
   * Gets currency country information.
   *
   * @param code - Currency code (case-insensitive)
   * @returns Country name or empty string if not found
   */
  getCurrencyCountry(code: string): string {
    const currency = this.getCurrencyByCode(code)
    return currency?.country ?? ""
  }

  /**
   * Checks if a currency is a cryptocurrency.
   *
   * @param code - Currency code (case-insensitive)
   * @returns True if the currency is a cryptocurrency
   */
  isCryptoCurrency(code: string): boolean {
    const currency = this.getCurrencyByCode(code)
    return currency?.isCrypto ?? false
  }

  /**
   * Gets the number of minor units (decimal places) for a currency.
   *
   * @remarks
   * Most currencies use 2 decimal places, but some like JPY use 0.
   *
   * @param currencyCode - Currency code
   * @returns Number of decimal places (0 or 2)
   */
  getCurrencyMinorUnits(currencyCode: string): number {
    // Currencies with no minor units
    const zeroDecimalCurrencies = ["JPY", "KRW", "VND", "CLP", "UGX"]

    if (zeroDecimalCurrencies.includes(currencyCode)) {
      return 0
    }

    // Default to 2 decimal places for most currencies
    return 2
  }

  /**
   * Rounds an amount to the appropriate number of minor units for a currency.
   *
   * @param amount - Amount to round
   * @param currencyCode - Currency code
   * @returns Rounded amount
   */
  roundToCurrencyMinorUnits(amount: number, currencyCode: string): number {
    const minorUnits = this.getCurrencyMinorUnits(currencyCode)
    const multiplier = 10 ** minorUnits
    return Math.round(amount * multiplier) / multiplier
  }
}

// Export singleton instance
export const currencyRegistryService = CurrencyRegistryService.getInstance()

// Export for testing or advanced usage
export { CurrencyRegistryService }
