import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  const container       = document.getElementById('scotdoku-container');
  const checkButton     = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage   = document.getElementById('result-message');
  if (!container || !checkButton || !newPuzzleButton) return;

  // description map for your categories:
  const categoryDescriptions = {
    'pop. > 100k':        'Population over 100,000',
    'pop. ≤ 100k':        'Population 100,000 or less',
    'pop. > 50k':         'Population over 50,000',
    'pop. ≤ 50k':         'Population 50,000 or less',
    'pop. > 10k':         'Population over 10,000',
    'pop. ≤ 10k':         'Population 10,000 or less',
    '≠ market town':      'Not officially a market town',
    '≠ new town':         'Not designated a new town',
    '≠ town':             'Not designated a town',
    'no spec. status':    'No special category applies',
    'central belt':       'In Scotland’s Central Belt region',
    'east coast':         'Lies on Scotland’s east coast',
    'west coast':         'Lies on Scotland’s west coast',
    'highlands':          'In the Highland area',
    'islands':            'Located on one of Scotland’s islands',
    'borders':            'In the Scottish Borders region',
    'tayside':            'In the Tayside region',
    'fife':               'In Fife',
    'grampian':           'In Grampian (Aberdeen/Aberdeenshire)',
    'northeast':          'In the North East',
    'ayrshire':           'In Ayrshire',
    'forth valley':       'In the Forth Valley (Stirling/Falkirk)',
    'glasgow city region':'Part of the Glasgow City Region',
    // …add any other tags you surfaced in AREA_TAGS, TRAM_TAGS, etc.
  };

  let target, rowCats, colCats;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function abbreviateLabel(label) {
    return label
      .replace('population > 100000', 'pop. > 100k')
      .replace('population <= 100000','pop. ≤ 100k')
      .replace('population > 50000', 'pop. > 50k')
      .replace('population <= 50000','pop. ≤ 50k')
      .replace('population > 10000', 'pop. > 10k')
      .replace('population <= 10000','pop. ≤ 10k')
      .replace('not market town', '≠ market town')
      .replace('not new town',    '≠ new town')
      .replace('not town',        '≠ town')
      .replace('no special designation','no spec. status');
  }

  function getAllCategories(settlement) {
    const cats = settlement.tags.map(tag => ({ label: tag, fn: s => s.tags.includes(tag) }));
    ['new town','market town','town'].forEach(tag =>
      cats.push({ label: `not ${tag}`, fn: s => !s.tags.includes(tag) })
    );
    [10000,50000,100000].forEach(val => {
      cats.push({ label:`population > ${val}`, fn: s => s.population > val });
      cats.push({ label:`population <= ${val}`,fn: s => s.population <= val });
    });
    if (cats.length < 6) cats.push({ label:'no special designation', fn:_=>true });
    return cats;
  }

  function conflicting(a,b) {
    const pairs = [
      ['population > 10000','population <= 10000'],
      ['population > 50000','population <= 50000'],
      ['population > 100000','population <= 100000'],
      ['town','not town'],
      ['new town','not new town'],
      ['market town','not market town'],
    ];
    return pairs.some(([x,y])=> (a.label===x&&b.label===y)||(a.label===y&&b.label===x) );
  }

  function getRandomSettlement() {
    return settlements[Math.floor(Math.random()*settlements.length)];
  }

  function showDescription(cat) {
    const txt = categoryDescriptions[cat] || 'No description available.';
    alert(txt);
  }

  function buildPuzzle() {
    // pick and abbreviate
    target = getRandomSettlement();
    const all = shuffle(getAllCategories(target));
    const chosen = [];
    for (const cat of all) {
      if (chosen.length<6 && chosen.every(c=>!conflicting(c,cat))) {
        chosen.push(cat);
      }
    }
    while (chosen.length<6) chosen.push({ label:'no special designation', fn:_=>true });

    // sort by label-length: shortest → top, longest → left
    chosen.sort((a,b)=>a.label.length - b.label.length);
    colCats = chosen.slice(0,3);
    rowCats = chosen.slice(3,6);

    // clear & set grid
    container.innerHTML = '';
    container.style.gridTemplateRows = `60px repeat(3,1fr)`;

    // corner
    container.appendChild(labelCell('',1,1));

    // top row
    colCats.forEach((cat,j)=>{
      const text = abbreviateLabel(cat.label);
      const el = labelCell(text,1,j+2);
      el.onclick = ()=> showDescription(text);
      container.appendChild(el);
    });

    // left column + inputs
    rowCats.forEach((cat,i)=>{
      const text = abbreviateLabel(cat.label);
      const el = labelCell(text,i+2,1);
      if (text.length>14) el.classList.add('shrink');
      el.onclick = ()=> showDescription(text);
      container.appendChild(el);

      for (let j=0;j<3;j++){
        const cell = document.createElement('div');
        cell.className = 'select-cell';
        cell.style.gridRow = i+2;
        cell.style.gridColumn = j+2;
        const input = document.createElement('input');
        input.id = `input-${i}-${j}`;
        input.type = 'text';
        cell.appendChild(input);
        container.appendChild(cell);
      }
    });

    resultMessage.textContent = '';
  }

  function labelCell(text,r,c){
    const el = document.createElement('div');
    el.className = 'label-cell';
    el.style.gridRow = r;
    el.style.gridColumn = c;
    el.textContent = text;
    return el;
  }

  checkButton.addEventListener('click',()=>{
    let allOk=true;
    const used = new Set();
    document.querySelectorAll('.select-cell')
      .forEach(c=>c.classList.remove('correct','incorrect','golden-settlement'));

    for (let i=0;i<3;i++){
      for (let j=0;j<3;j++){
        const inp = document.getElementById(`input-${i}-${j}`);
        const cell = inp.parentElement;
        const val = inp.value.trim().toLowerCase();
        const obj = settlements.find(s=>s.name.toLowerCase()===val);
        const ok = obj && !used.has(val) && rowCats[i].fn(obj) && colCats[j].fn(obj);
        if (ok) {
          used.add(val);
          cell.classList.add('correct');
          if (val===target.name.toLowerCase()) cell.classList.add('golden-settlement');
        } else {
          cell.classList.add('incorrect');
          allOk = false;
        }
      }
    }
    resultMessage.textContent = allOk ? '✅ All correct!' : '❌ Some incorrect.';
  });

  newPuzzleButton.addEventListener('click', buildPuzzle);
  buildPuzzle();
});
