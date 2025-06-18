// settlement.js - revamped to use flat tags array

const AREA_TAGS = {
  'aberdeen city council': ['northeast', 'grampian', 'east coast'],
  'aberdeenshire council': ['northeast', 'grampian'],
  'angus council': ['tayside', 'east coast'],
  'argyll and bute council': ['west coast'],
  'clackmannanshire council': ['forth valley'],
  'dumfries and galloway council': ['borders'],
  'dundee city council': ['northeast', 'east coast', 'tayside'],
  'east ayrshire council': ['ayrshire', 'west coast'],
  'east dunbartonshire council': ['central belt'],
  'east renfrewshire council': ['central belt'],
  'east lothian council': ['central belt', 'east coast'],
  'edinburgh city council': ['central belt', 'east coast'],
  'falkirk council': ['forth valley', 'central belt'],
  'fife council': ['fife', 'east coast', 'central belt'],
  'glasgow city council': ['central belt', 'west coast'],
  'highland council': ['highlands'],
  'inverclyde council': ['west coast'],
  'midlothian council': ['central belt'],
  'moray council': ['northeast'],
  'western isles': ['islands', 'west coast'],
  'north ayrshire council': ['ayrshire', 'west coast'],
  'north lanarkshire council': ['central belt'],
  'orkney islands council': ['islands'],
  'perth and kinross council': ['tayside'],
  'renfrewshire council': ['west coast'],
  'scottish borders council': ['borders'],
  'shetland islands council': ['islands'],
  'south ayrshire council': ['ayrshire', 'west coast'],
  'south lanarkshire council': ['central belt'],
  'stirling council': ['forth valley'],
  'west dunbartonshire council': ['west coast'],
  'west lothian council': ['central belt', 'east coast']
};

const GCR_COUNCILS = [
  'glasgow city council',
  'east renfrewshire council',
  'renfrewshire council',
  'east dunbartonshire council',
  'west dunbartonshire council',
  'north lanarkshire council',
  'south lanarkshire council',
  'inverclyde council'
];

const TRAM_TAGS = {
  'edinburgh': ['tram'],
  'coatbridge': ['tram'],
  'leith': ['tram'],
  'new town': ['tram'],
  'haymarket': ['tram'],
  'ingliston': ['tram'],
  'gogar': ['tram'],
  'gogarburn': ['tram'],
  'saughton': ['tram'],
  'newhaven': ['tram'],
  'bankhead': ['tram'],
  'edinburgh park': ['tram'],
  'balgreen': ['tram'],
  'murrayfield': ['tram']
};

const SUBWAY_TAGS = {
  'glasgow': ['subway'],
  'govan': ['subway'],
  'hillhead': ['subway'],
  'partick': ['subway'],
  'cessnock': ['subway'],
  'ibrox': ['subway'],
  'kelvinbridge': ['subway'],
  'cowcaddens': ['subway']
};

const HOSPITAL_TAGS = {
  'aberdeen': ['hospital'],
  'dumfries': ['hospital'],
  'edinburgh': ['hospital'],
  'glasgow': ['hospital'],
  'inverness': ['hospital'],
  'kirkcaldy': ['hospital'],
  'lerwick': ['hospital'],
  'livingston': ['hospital'],
  'paisley': ['hospital'],
  'perth': ['hospital'],
  'stirling': ['hospital'],
  'dundee': ['hospital'],
  'ayr': ['hospital'],
  'kilmarnock': ['hospital'],
  'melrose': ['hospital'],
  'elgin': ['hospital'],
  'falkirk': ['hospital'],
  'fort william': ['hospital'],
  'oban': ['hospital'],
  'stornoway': ['hospital'],
  'banff': ['hospital'],
  'greenock': ['hospital'],
  'wishaw': ['hospital'],
  'clydebank': ['hospital'],
  'motherwell': ['hospital'],
  'dunfermline': ['hospital']
};


const FERRY_TAGS = {
  'gourock': ['ferry'],
  'oban': ['ferry'],
  'lerwick': ['ferry'],
  'brodick': ['ferry'],
  'mallaig': ['ferry'],
  'craignure': ['ferry'],
  'stromness': ['ferry'],
  'rosyth': ['ferry'],
  'wemyss bay': ['ferry'],
  'ullapool': ['ferry'],
  'tarbert': ['ferry'],
  'stornoway': ['ferry'],
  'tingwall': ['ferry']
};

const AIR_TAGS = {
  'edinburgh': ['airport'],
  'dundee': ['airport'],
  'ingliston': ['airport'],
  'dyce': ['airport'],
  'prestwick': ['airport'],
  'paisley': ['airport'],
  'aberdeen': ['airport'],
  'inverness': ['airport'],
  'kirkwall': ['airport'],
  'perth': ['airport'],
  'glasgow': ['airport']
};

const ROYAL_BURGHES = {
  'edinburgh': true,
  'perth': true,
  'stirling': true,
  'dumfries': true,
  'elgin': true,
  'inverness': true,
  'lanark': true,
  'kirkwall': true,
  'dornoch': true,
  'rothesay': true,
  'dundee': true,
  'aberdeen': true,
  'ayr': true,
  'montrose': true,
  'linlithgow': true,
  'rutherglen': true,
  'glasgow': true
};

  const COLLEGE_TAGS = {
  'livingston': ['college'],
  'falkirk': ['college'],
  'cumbernauld': ['college'],
  'motherwell': ['college'],
  'coatbridge': ['college'],
  'glasgow': ['college'],
  'edinburgh': ['college'],
  'dundee': ['college'],
  'arbroath': ['college'],
  'glenrothes': ['college'],
  'galashiels': ['college'],
  'haddington': ['college'],
  'dumfries': ['college'],
  'kilmarnock': ['college'],
  'inverness': ['college'],
  'stornoway': ['college'],
  'lerwick': ['college'],
  'perth': ['college'],
  'elgin': ['college'],
  'oban': ['college'],
  'dunoon': ['college'],
  'greenock': ['college'],
  'paisley': ['college'],
  'east kilbride': ['college']
};

const HIST_TRAMS_TAGS = {
  'glasgow': ['historic trams'],
  'dundee': ['historic trams'],
  'aberdeen': ['historic trams'],  // also fixed typo here
  'perth': ['historic trams'],
  'ayr': ['historic trams'],
  'airdrie': ['historic trams'],
  'dunfermline': ['historic trams'],
  'falkirk': ['historic trams'],
  'hamilton': ['historic trams'],
  'motherwell': ['historic trams'],
  'wishaw': ['historic trams'],
  'musselburgh': ['historic trams'],
  'kilmarnock': ['historic trams'],
  'kirkcaldy': ['historic trams'],
  'paisley': ['historic trams'],
  'stirling': ['historic trams'],
  'edinburgh': ['historic trams']
};

const AREA_TRAIN_STATIONS = {
  // glasgow city council areas
  "anderston": true,
  "anniesland": false,
  "govan": false,
  "hillhead": false,
  "maryhill": true,
  "parkhead": false,
  "partick": true,
  "pollokshields": true,
  "shettleston": true,
  "springburn": true,
  "cessnock": false,
  "ibrox": false,
  "kelvinbridge": false,
  "cowcaddens": false,

  // edinburgh city council areas
  "leith": false,
  "new town": false,
  "old town": false,
  "morningside": false,
  "portobello": false,
  "stockbridge": false,
  "dean village": false,
  "gorgie": false,
  "corstorphine": false,
  "haymarket": true,
  "newhaven": false,
  "ingliston": false,
  "gogar": false,
  "gogarburn": false,
  "saughton": false,
  "bankhead": false,
  "edinburgh park": true,
  "murrayfield": false,
  "balgreen": false,

  // aberdeen city council areas
  "altens": false,
  "bridge of don": false,
  "dyce": true,
  "old aberdeen": false,
  "torry": false,

  // dundee city council areas
  "broughty ferry": false,
  "dundee city centre": true,
  "downfield": false,
  "lochee": false,
  "ninewells": false,

  // cities
  "aberdeen": true,
  "dundee": true,
  "perth": true,
  "glasgow": true,
  "edinburgh": true,
  "stirling": true,
  "dunfermline": true,
  "inverness": true,

  // new towns
  "east kilbride": true,
  "livingston": true,
  "irvine": true,
  "cumbernauld": true,
  "glenrothes": false,

  // major towns
  "paisley": true,
  "hamilton": true,
  "kirkcaldy": true,
  "kilmarnock": true,
  "ayr": true,
  "coatbridge": true,
  "greenock": true,
  "airdrie": true,
  "motherwell": true,
  "rutherglen": true,
  "cambuslang": true,
  "wishaw": true,
  "bearsden": true,
  "newton_mearns": false,
  "clydebank": true,
  "elgin": true,
  "renfrew": false,
  "bishopbriggs": true,
  "bathgate": true,
  "arbroath": true,
  "kirkintilloch": true,
  "musselburgh": true,
  "dumbarton": true,
  "bellshill": true,
  "peterhead": false,
  "st_andrews": false,
  "bonnyrigg": false,
  "barrhead": true,
  "blantyre": true,
  "penicuik": true,
  "grangemouth": false,
  "kilwinning": true,
  "broxburn": false,
  "johnstone": true,
  "viewpark": false,
  "larkhall": true,
  "erskine": false,

  // market & small towns
  "callander": false,
  "crieff": false,
  "aberfeldy": false,
  "kelso": false,
  "jedburgh": false,
  "innerleithen": false,
  "haddington": true,
  "lanark": true,
  "peebles": false,
  "galston": false,
  "kirkwall": true,
  "stromness": false,
  "lerwick": false,
  "stornoway": false,
  "mallaig": false,
  "kirriemuir": false,
  "lochwinnoch": true,
  "armadale": true,
  "silverknowes": false,
  "blackburn": false,
  "uphall": false,
  "helensburgh": true,
  "north berwick": true,
  "westhill": false,
  "whitburn": false,
  "fauldhouse": true,
  "annan": true,
  "alexandria": true,
  "buckie": false,
  "carnoustie": true,
  "dalkeith": true,
  "dunbar": true,
  "ellon": false,
  "forres": true,
  "gretna": true,
  "inverurie": true,

  // other coastal & island settlements
  "kirkintilloch": true,
  "largs": true,
  "montrose": true,
  "stonehaven": true,
  "thurso": true,
  "prestonpans": true,
  "gorebridge": false,
  "linlithgow": true,
  "gourock": true,
  "craignure": false,
  "rosyth": true,
  "wemyss bay": true,
  "ullapool": false,
  "tarbert": false,
  "tingwall": false
};
  
export default (rawSettlements => {
  return rawSettlements.map(s => {
    const tags = [];
    tags.push(s.status);
    tags.push(s.council.toLowerCase());
    tags.push(s.geography_type);
    tags.push(s.region.toLowerCase());

    const area = AREA_TAGS[s.council.toLowerCase()];
    if (area) tags.push(...area);

    const tram = TRAM_TAGS[s.name.toLowerCase()];
    if (tram) tags.push(...tram);

    const subway = SUBWAY_TAGS[s.name.toLowerCase()];
    if (subway) tags.push(...subway);

    const ferry = FERRY_TAGS[s.name.toLowerCase()];
    if (ferry) tags.push(...ferry);

    const air = AIR_TAGS[s.name.toLowerCase()];
    if (air) tags.push(...air);

    const hospital = HOSPITAL_TAGS[s.name.toLowerCase()];
    if (hospital) tags.push(...hospital);

    const hasTrain = AREA_TRAIN_STATIONS[s.name.toLowerCase()];
    if (hasTrain) tags.push('train station');
    
    const college = COLLEGE_TAGS[s.name.toLowerCase()];
    if (college) tags.push(...college);
    
    if (GCR_COUNCILS.includes(s.council.toLowerCase())) {
  tags.push('glasgow city region');
    }

    const historicTrams = HIST_TRAMS_TAGS[s.name.toLowerCase()];
    if (historicTrams) tags.push(...historicTrams);

    if (ROYAL_BURGHES[s.name.toLowerCase()]) {
  tags.push('royal burgh');
    }

    return {
      name: s.name,
      population: s.population,
      tags: Array.from(new Set(tags))
    };
  });
})([
  
  //AREAS//
   { name: 'anderston', status: 'area', population: 7400, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'anniesland', status: 'area', population: 9100, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'govan', status: 'area', population: 11400, council: 'glasgow city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'hillhead', status: 'area', population: 10500, council: 'glasgow city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'maryhill', status: 'area', population: 18200, council: 'glasgow city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'parkhead', status: 'area', population: 9400, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'partick', status: 'area', population: 21000, council: 'glasgow city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'pollokshields', status: 'area', population: 24000, council: 'glasgow city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'shettleston', status: 'area', population: 15000, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'springburn', status: 'area', population: 16500, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'cessnock', status: 'area', population: 4000, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'ibrox', status: 'area', population: 6000, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'kelvinbridge', status: 'area', population: 10500, council: 'glasgow city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'cowcaddens', status: 'area', population: 4500, council: 'glasgow city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },

  { name: 'leith', status: 'area', population: 13000, council: 'edinburgh city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'new town', status: 'area', population: 20500, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'old town', status: 'area', population: 10400, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'morningside', status: 'area', population: 13300, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'portobello', status: 'area', population: 14000, council: 'edinburgh city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'stockbridge', status: 'area', population: 5200, council: 'edinburgh city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'dean village', status: 'area', population: 1500, council: 'edinburgh city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'gorgie', status: 'area', population: 13300, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'corstorphine', status: 'area', population: 18400, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'haymarket', status: 'area', population: 3800, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'newhaven', status: 'area', population: 3000, council: 'edinburgh city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'ingliston', status: 'area', population: 1500, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'gogar', status: 'area', population: 1000, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'gogarburn', status: 'area', population: 1200, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'saughton', status: 'area', population: 3000, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'bankhead', status: 'area', population: 2500, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'edinburgh park', status: 'area', population: 1000, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'murrayfield', status: 'area', population: 7000, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'balgreen', status: 'area', population: 3500, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'silverknowes', status: 'area', population: 2000, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'granton', status: 'area', population: 2000, council: 'edinburgh city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  
  { name: 'altens', status: 'area', population: 4000, council: 'aberdeen city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'bridge of don', status: 'area', population: 11800, council: 'aberdeen city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'dyce', status: 'area', population: 10500, council: 'aberdeen city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'old aberdeen', status: 'area', population: 5500, council: 'aberdeen city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'torry', status: 'area', population: 11500, council: 'aberdeen city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },

  { name: 'broughty ferry', status: 'area', population: 13000, council: 'dundee city council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'dundee city centre', status: 'area', population: 15000, council: 'dundee city council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'downfield', status: 'area', population: 5000, council: 'dundee city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'lochee', status: 'area', population: 12000, council: 'dundee city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },
  { name: 'ninewells', status: 'area', population: 3500, council: 'dundee city council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: null },

  { name: 'dunfermline', status: 'city', population: 55000, council: 'fife council', geography_type: 'on river', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'stirling', status: 'city', population: 38000, council: 'stirling council', geography_type: 'on river', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'perth', status: 'city', population: 47000, council: 'perth and kinross council', geography_type: 'on river', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'inverness', status: 'city', population: 48000, council: 'highland council', geography_type: 'on river', region: 'Highlands', has_uni: true, largest_settlement: true },
  { name: 'edinburgh', status: 'city', population: 530000, council: 'edinburgh city council', geography_type: 'on river', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'glasgow', status: 'city', population: 620000, council: 'glasgow city council', geography_type: 'on river', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'aberdeen', status: 'city', population: 230000, council: 'aberdeen city council', geography_type: 'on river', region: 'Highlands', has_uni: true, largest_settlement: true },
  { name: 'dundee', status: 'city', population: 148000, council: 'dundee council', geography_type: 'coastal', region: 'Central Belt', has_uni: true, largest_settlement: true },

  { name: 'east kilbride', status: 'new town', population: 75000, council: 'south lanarkshire council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'livingston', status: 'new town', population: 57000, council: 'west lothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'cumbernauld', status: 'new town', population: 51000, council: 'north lanarkshire council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'irvine', status: 'new town', population: 34000, council: 'north ayrshire council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: true },

  { name: 'paisley', status: 'town', population: 77000, council: 'renfrewshire council', geography_type: 'on river', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'hamilton', status: 'town', population: 54000, council: 'south lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'kirkcaldy', status: 'town', population: 60200, council: 'fife council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'kilmarnock', status: 'town', population: 47000, council: 'east ayrshire council', geography_type: 'on river', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'ayr', status: 'town', population: 46000, council: 'south ayrshire council', geography_type: 'coastal', region: 'Central Belt', has_uni: true, largest_settlement: true },
  { name: 'coatbridge', status: 'town', population: 44000, council: 'north lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'greenock', status: 'town', population: 41000, council: 'inverclyde council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'glenrothes', status: 'town', population: 38000, council: 'fife council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'airdrie', status: 'town', population: 36000, council: 'north lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'motherwell', status: 'town', population: 33000, council: 'north lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'rutherglen', status: 'town', population: 31000, council: 'south lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'cambuslang', status: 'town', population: 31000, council: 'south lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'wishaw', status: 'town', population: 30000, council: 'north lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'bearsden', status: 'town', population: 28000, council: 'east dunbartonshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'newton mearns', status: 'town', population: 28000, council: 'east renfrewshire council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'clydebank', status: 'town', population: 26000, council: 'west dunbartonshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'elgin', status: 'town', population: 25000, council: 'moray council', geography_type: 'landlocked', region: 'Highlands', has_uni: false, largest_settlement: true },
  { name: 'renfrew', status: 'town', population: 24000, council: 'renfrewshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'bishopbriggs', status: 'town', population: 24000, council: 'east dunbartonshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'bathgate', status: 'town', population: 24000, council: 'west lothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'arbroath', status: 'town', population: 24000, council: 'angus council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'kirkintilloch', status: 'town', population: 22000, council: 'east dunbartonshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'musselburgh', status: 'town', population: 21000, council: 'east lothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'dumbarton', status: 'town', population: 20000, council: 'west dunbartonshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'bellshill', status: 'town', population: 20000, council: 'north lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'peterhead', status: 'town', population: 19000, council: 'aberdeenshire council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'st andrews', status: 'town', population: 18000, council: 'fife council', geography_type: 'coastal', region: 'Central Belt', has_uni: true, largest_settlement: false },
  { name: 'bonnyrigg', status: 'town', population: 18000, council: 'midlothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'barrhead', status: 'town', population: 18000, council: 'east renfrewshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'blantyre', status: 'town', population: 17000, council: 'south lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'penicuik', status: 'town', population: 16000, council: 'midlothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'grangemouth', status: 'town', population: 16000, council: 'falkirk council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'kilwinning', status: 'town', population: 16000, council: 'north ayrshire council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'broxburn', status: 'town', population: 16000, council: 'west lothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'johnstone', status: 'town', population: 16000, council: 'renfrewshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'viewpark', status: 'town', population: 16000, council: 'north lanarkshire council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'larkhall', status: 'town', population: 15000, council: 'south lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'erskine', status: 'town', population: 15000, council: 'renfrewshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },

  { name: 'callander', status: 'market town', population: 3156, council: 'stirling council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'crieff', status: 'market town', population: 7990, council: 'perth and kinross council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'aberfeldy', status: 'market town', population: 1886, council: 'perth and kinross council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'kelso', status: 'market town', population: 6000, council: 'scottish borders council', geography_type: 'landlocked', region: 'Borders', has_uni: false, largest_settlement: false },
  { name: 'jedburgh', status: 'market town', population: 5200, council: 'scottish borders council', geography_type: 'landlocked', region: 'Borders', has_uni: false, largest_settlement: false },
  { name: 'innerleithen', status: 'market town', population: 3152, council: 'scottish borders council', geography_type: 'landlocked', region: 'Borders', has_uni: false, largest_settlement: false },
  { name: 'haddington', status: 'market town', population: 11354, council: 'east lothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'lanark', status: 'market town', population: 8500, council: 'south lanarkshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'peebles', status: 'market town', population: 8000, council: 'scottish borders council', geography_type: 'on river', region: 'Borders', has_uni: false, largest_settlement: false },

  { name: 'galston', status: 'town', population: 13300, council: 'east ayrshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'kirkwall', status: 'town', population: 9000, council: 'orkney islands council', geography_type: 'coastal', region: 'Islands', has_uni: false, largest_settlement: true },
  { name: 'stromness', status: 'town', population: 2300, council: 'orkney islands council', geography_type: 'coastal', region: 'Islands', has_uni: false, largest_settlement: false },
  { name: 'lerwick', status: 'town', population: 7000, council: 'shetland islands council', geography_type: 'coastal', region: 'Islands', has_uni: false, largest_settlement: true },
  { name: 'stornoway', status: 'town', population: 6700, council: 'outer hebrides council', geography_type: 'coastal', region: 'Islands', has_uni: true, largest_settlement: true },
  { name: 'mallaig', status: 'town', population: 3100, council: 'highland council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'kirriemuir', status: 'town', population: 13000, council: 'angus council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'lochwinnoch', status: 'town', population: 4000, council: 'renfrewshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'armadale', status: 'town', population: 13000, council: 'west lothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'blackburn', status: 'town', population: 6000, council: 'west lothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false},
  { name: 'uphall', status: 'town', population: 5000, council: 'west lothian council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'helensburgh', status: 'town', population: 15000, council: 'argyll and bute council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: true },
  { name: 'north berwick', status: 'town', population: 7600, council: 'east lothian council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'westhill', status: 'town', population: 12000, council: 'aberdeenshire council', geography_type: 'landlocked', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'whitburn', status: 'town', population: 15000, council: 'west lothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'fauldhouse', status: 'town', population: 4800, council: 'west lothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'annan', status: 'town', population: 8900, council: 'dumfries and galloway council', geography_type: 'coastal', region: 'Borders', has_uni: false, largest_settlement: false },
  { name: 'arbroath', status: 'town', population: 23800, council: 'angus council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'alexandria', status: 'town', population: 6700, council: 'west dunbartonshire council', geography_type: 'on river', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'buckie', status: 'town', population: 8400, council: 'moray council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'carnoustie', status: 'town', population: 10700, council: 'angus council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'dalkeith', status: 'town', population: 11600, council: 'midlothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: true, largest_settlement: false },
  { name: 'dunbar', status: 'town', population: 8600, council: 'east lothian council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'ellon', status: 'town', population: 8600, council: 'aberdeenshire council', geography_type: 'landlocked', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'forres', status: 'town', population: 8500, council: 'moray council', geography_type: 'landlocked', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'gretna', status: 'town', population: 3000, council: 'dumfries and galloway council', geography_type: 'landlocked', region: 'Borders', has_uni: false, largest_settlement: false },
  { name: 'haddington', status: 'town', population: 8800, council: 'east lothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'inverurie', status: 'town', population: 9600, council: 'aberdeenshire council', geography_type: 'landlocked', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'kirkintilloch', status: 'town', population: 20000, council: 'east dunbartonshire council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'largs', status: 'town', population: 10900, council: 'north ayrshire council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'montrose', status: 'town', population: 11400, council: 'angus council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'penicuik', status: 'town', population: 16000, council: 'midlothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'stonehaven', status: 'town', population: 9400, council: 'aberdeenshire council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'thurso', status: 'town', population: 8500, council: 'highland council', geography_type: 'coastal', region: 'Highlands', has_uni: true, largest_settlement: false },
  { name: 'prestonpans', status: 'town', population: 10400, council: 'east lothian council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'gorebridge', status: 'town', population: 8900, council: 'midlothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'linlithgow', status: 'town', population: 13000, council: 'west lothian council', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'coatbridge', status: 'town', population: 44000, council: 'north lanarkshire', geography_type: 'landlocked', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'gourock', status: 'town', population: 10500, council: 'inverclyde council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'lerwick', status: 'town', population: 6900, council: 'shetland islands council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: true },
  { name: 'mallaig', status: 'village', population: 800, council: 'highland council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'craignure', status: 'village', population: 200, council: 'argyll and bute council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'stromness', status: 'town', population: 2200, council: 'orkney islands council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'rosyth', status: 'town', population: 13800, council: 'fife council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'wemyss bay', status: 'village', population: 2600, council: 'inverclyde council', geography_type: 'coastal', region: 'Central Belt', has_uni: false, largest_settlement: false },
  { name: 'ullapool', status: 'village', population: 1500, council: 'highland council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'tarbert', status: 'village', population: 1300, council: 'argyll and bute council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false },
  { name: 'tingwall', status: 'village', population: 280, council: 'shetland islands council', geography_type: 'coastal', region: 'Highlands', has_uni: false, largest_settlement: false }
]);
