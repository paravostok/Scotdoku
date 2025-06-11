// scotdoku.js - fully tags-driven implementation
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');
  if (!container || !checkButton || !newPuzzleButton) return;

  const KNOWN_REGIONS = [
    'central belt','highlands','islands','borders',
    'northeast','east coast','west coast','tayside',
    'fife','ayrshire','forth valley','city and shire'
  ];
  const GEOGRAPHIES = ['coastal','on river','landlocked'];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getAllCategories(s) {
    const cats = [];
    const tags = s.tags;

    // 1) status-based, normalize new/market as town
    const statuses = ['city','town','area'];
    statuses.forEach(status => {
      cats.push({
        label: `status: ${status}`,
        fn: x => x.tags.includes(status) || (status === 'town' && x.tags.some(t => ['new town','market town'].includes(t)))
      });
      cats.push({
        label: `status: not ${status}`,
        fn: x => !(x.tags.includes(status) || (status === 'town' && x.tags.some(t => ['new town','market town'].includes(t))))
      });
    });

    // 2) council tags
    tags.filter(t => t.endsWith('council')).forEach(c => {
      cats.push({ label: `council: ${c}`, fn: x => x.tags.includes(c) });
    });

    // 3) first letter
    const fl = s.name.charAt(0).toLowerCase();
    cats.push({ label: `first letter: ${fl}`, fn: x => x.name.charAt(0).toLowerCase() === fl });

    // 4) region/area
    KNOWN_REGIONS.forEach(r => {
      cats.push({ label: r, fn: x => x.tags.includes(r) });
      cats.push({ label: `not ${r}`, fn: x => !x.tags.includes(r) });
    });

    // 5) geography
    GEOGRAPHIES.forEach(g => {
      cats.push({ label: g, fn: x => x.tags.includes(g) });
      cats.push({ label: `not ${g}`, fn: x => !x.tags.includes(g) });
    });

    // 6) population thresholds
    cats.push({ label: 'population > 10000', fn: x => x.population > 10000 });
    cats.push({ label: 'population <= 10000', fn: x => x.population <= 10000 });
    cats.push({ label: 'population > 50000', fn: x => x.population > 50000 });
    cats.push({ label: 'population <= 50000', fn: x => x.population <= 50000 });
    cats.push({ label: 'population > 100000', fn: x => x.population > 100000 });
    cats.push({ label: 'population <= 100000', fn: x => x.population <= 100000 });

    // ensure at least 6 cats by fallback
    if (cats.length < 6) {
      cats.push({ label: 'no special designation', fn: _ => true });
    }

    return cats;
  }

  function getRandomSettlement() {
    return settlements[Math.floor(Math.random() * settlements.length)];
  }

  let rowCats = [], colCats = [];
  function buildPuzzle() {
    const target = getRandomSettlement();
    const allCats = getAllCategories(target);
    shuffle(allCats);
    const choose = allCats.slice(0,6);
    rowCats = choose.slice(0,3);
    colCats = choose.slice(3,6);

    container.innerHTML = '';
    // corner cell
    const corner = document.createElement('div');
    corner.className = 'label-cell'; corner.style.gridRow = 1; corner.style.gridColumn = 1;
    container.appendChild(corner);

    // column headers
    colCats.forEach((c,i) => {
      const el = document.createElement('div'); el.className = 'label-cell';
      el.style.gridRow = 1; el.style.gridColumn = i+2; el.textContent = c.label;
      container.appendChild(el);
    });

    // rows + inputs
    rowCats.forEach((r,i) => {
      const rowLabel = document.createElement('div');
      rowLabel.className = 'label-cell';
      rowLabel.style.gridRow = i+2; rowLabel.style.gridColumn = 1;
      rowLabel.textContent = r.label;
      container.appendChild(rowLabel);
      for (let j=0; j<3; j++) {
        const cell = document.createElement('div');
        cell.className = 'select-cell';
        cell.style.gridRow = i+2; cell.style.gridColumn = j+2;
        const input = document.createElement('input'); input.type='text'; input.id=`input-${i}-${j}`;
        cell.appendChild(input); container.appendChild(cell);
      }
    });
    resultMessage.textContent = '';
  }

  checkButton.addEventListener('click', () => {
    let correct = true;
    for (let i=0;i<3;i++) for (let j=0;j<3;j++) {
      const inp = document.getElementById(`input-${i}-${j}`);
      const cell = inp.parentElement;
      const val = inp.value.trim().toLowerCase();
      const obj = settlements.find(s=>s.name.toLowerCase()===val);
      const ok = obj && rowCats[i].fn(obj) && colCats[j].fn(obj);
      cell.classList.toggle('correct', ok);
      cell.classList.toggle('incorrect', !ok);
      if (!ok) correct = false;
    }
    resultMessage.textContent = correct ? '✅ All correct!' : '❌ Some incorrect.';
  });

  newPuzzleButton.addEventListener('click', buildPuzzle);
  buildPuzzle();
});
