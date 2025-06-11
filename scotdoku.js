// scotdoku.js - adapted for flat tags
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Scotdoku script loaded (tags-driven)');

  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');

  if (!container || !checkButton || !newPuzzleButton) {
    console.error('❌ Missing DOM elements.');
    return;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getAllCategoriesForSettlement(s) {
    const cats = [];
    const t = tags => s.tags.includes(tags);

    // status and its false opposite
    s.tags.forEach(tag => {
      if (['town','new town','market town','city','area'].includes(tag)) {
        const norm = tag === 'new town' || tag === 'market town' ? 'town' : tag;
        cats.push({ label: `status: ${norm}`, fn: x => x.tags.includes(norm) });
      }
    });
    cats.push({ label: 'status: not new town', fn: x => !x.tags.includes('new town') });

    // council tags
    s.tags.filter(tag => tag.endsWith('council')).forEach(c => {
      cats.push({ label: `council: ${c}`, fn: x => x.tags.includes(c) });
    });

    // first letter
    const fl = s.name.charAt(0).toLowerCase();
    cats.push({ label: `first letter: ${fl}`, fn: x => x.name.charAt(0).toLowerCase() === fl });

    // region / area tags
    ['highlands','islands','central belt','borders','northeast','east coast','west coast','tayside','fife','ayrshire','forth valley','city and shire'].forEach(region => {
      cats.push({ label: region, fn: x => x.tags.includes(region) });
    });

    // geography
    ['coastal','on river','landlocked'].forEach(g => {
      cats.push({ label: g, fn: x => x.tags.includes(g) });
    });

    // population thresholds & opposites
    cats.push({ label: 'population > 10000', fn: x => x.population > 10000 });
    cats.push({ label: 'population <= 10000', fn: x => x.population <= 10000 });

    // custom boolean tags if any
    ['has_uni','largest_settlement'].forEach(tag => {
      cats.push({ label: tag.replace('_',' '), fn: x => x.tags.includes(tag) });
      cats.push({ label: `not ${tag.replace('_',' ')}`, fn: x => !x.tags.includes(tag) });
    });

    // ensure at least 6 categories
    if (cats.length < 6) {
      cats.push({ label: 'no special designation', fn: _ => true });
    }

    return cats;
  }

  function getRandomTargetSettlement() {
    const pool = settlements; // include all, or filter out if desired
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let currentRowCategories = [];
  let currentColCategories = [];

  function buildNewPuzzle() {
    const target = getRandomTargetSettlement();
    console.log('🎯 target:', target.name);

    const allCats = getAllCategoriesForSettlement(target);
    shuffleArray(allCats);
    const chosen = allCats.slice(0,6);
    currentRowCategories = chosen.slice(0,3);
    currentColCategories = chosen.slice(3,6);

    container.innerHTML = '';
    // corner
    const corner = document.createElement('div');
    corner.className = 'label-cell';
    corner.style.gridRow = 1; corner.style.gridColumn = 1;
    container.appendChild(corner);

    // column labels
    currentColCategories.forEach((cat,j) => {
      const el = document.createElement('div');
      el.className = 'label-cell';
      el.style.gridRow = 1; el.style.gridColumn = j+2;
      el.textContent = cat.label;
      container.appendChild(el);
    });

    // rows
    currentRowCategories.forEach((cat,i) => {
      const rowLabel = document.createElement('div');
      rowLabel.className = 'label-cell';
      rowLabel.style.gridRow = i+2; rowLabel.style.gridColumn = 1;
      rowLabel.textContent = cat.label;
      container.appendChild(rowLabel);

      for (let j=0;j<3;j++) {
        const cell = document.createElement('div');
        cell.className = 'select-cell';
        cell.style.gridRow = i+2; cell.style.gridColumn = j+2;
        cell.id = `cell-${i}-${j}`;
        const input = document.createElement('input');
        input.type = 'text'; input.id = `input-${i}-${j}`;
        cell.appendChild(input);
        container.appendChild(cell);
      }
    });
    resultMessage.textContent = '';
  }

  checkButton.addEventListener('click', () => {
    let allCorrect = true;
    for (let i=0;i<3;i++) for (let j=0;j<3;j++) {
      const inp = document.getElementById(`input-${i}-${j}`);
      const cell = document.getElementById(`cell-${i}-${j}`);
      const val = inp.value.trim().toLowerCase();
      const obj = settlements.find(s => s.name === val);
      const ok = obj && currentRowCategories[i].fn(obj) && currentColCategories[j].fn(obj);
      cell.classList.toggle('correct', ok);
      cell.classList.toggle('incorrect', !ok);
      if (!ok) allCorrect = false;
    }
    resultMessage.textContent = allCorrect ? '✅ All correct!' : '❌ Some incorrect.';
  });

  newPuzzleButton.addEventListener('click', buildNewPuzzle);
  buildNewPuzzle();
});
