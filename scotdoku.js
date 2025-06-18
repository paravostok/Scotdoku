// scotdoku.js - final working version with golden cell and uniqueness
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');
  if (!container || !checkButton || !newPuzzleButton) return;

  let target = null;

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

    tags.forEach(tag => {
      cats.push({ label: tag, fn: x => x.tags.includes(tag) });
    });

    ['new town','market town','town'].forEach(tag => {
      cats.push({ label: `not ${tag}`, fn: x => !x.tags.includes(tag) });
    });

    cats.push({ label: 'population > 10000', fn: x => x.population > 10000 });
    cats.push({ label: 'population <= 10000', fn: x => x.population <= 10000 });
    cats.push({ label: 'population > 50000', fn: x => x.population > 50000 });
    cats.push({ label: 'population <= 50000', fn: x => x.population <= 50000 });
    cats.push({ label: 'population > 100000', fn: x => x.population > 100000 });
    cats.push({ label: 'population <= 100000', fn: x => x.population <= 100000 });

    if (cats.length < 6) {
      cats.push({ label: 'no special designation', fn: _ => true });
    }
    return cats;
  }

  function conflictingCats(cat1, cat2) {
    const pairs = [
      ['population > 10000', 'population <= 10000'],
      ['population > 50000', 'population <= 50000'],
      ['population > 100000', 'population <= 100000'],
      ['town', 'not town'],
      ['new town', 'not new town'],
      ['market town', 'not market town']
    ];
    return pairs.some(([a, b]) =>
      (cat1.label === a && cat2.label === b) || (cat1.label === b && cat2.label === a)
    );
  }

  function getRandomSettlement() {
    return settlements[Math.floor(Math.random() * settlements.length)];
  }

  let rowCats = [], colCats = [];
  function buildPuzzle() {
    target = getRandomSettlement();
    let allCats = getAllCategories(target);
    shuffle(allCats);
    const chosen = [];

    for (let i = 0; i < allCats.length && chosen.length < 6; i++) {
      const cat = allCats[i];
      if (chosen.every(c => !conflictingCats(c, cat))) {
        chosen.push(cat);
      }
    }

    while (chosen.length < 6) {
      chosen.push({ label: 'no special designation', fn: _ => true });
    }

    rowCats = chosen.slice(0, 3);
    colCats = chosen.slice(3, 6);

    container.innerHTML = '';
    const corner = document.createElement('div');
    corner.className = 'label-cell';
    corner.style.gridRow = 1;
    corner.style.gridColumn = 1;
    container.appendChild(corner);

    colCats.forEach((cat, j) => {
      const el = document.createElement('div');
      el.className = 'label-cell';
      el.style.gridRow = 1;
      el.style.gridColumn = j + 2;
      el.textContent = cat.label;
      container.appendChild(el);
    });

    rowCats.forEach((cat, i) => {
      const rowLabel = document.createElement('div');
      rowLabel.className = 'label-cell';
      rowLabel.style.gridRow = i + 2;
      rowLabel.style.gridColumn = 1;
      rowLabel.textContent = cat.label;
      container.appendChild(rowLabel);

      for (let j = 0; j < 3; j++) {
        const cell = document.createElement('div');
        cell.className = 'select-cell';
        cell.style.gridRow = i + 2;
        cell.style.gridColumn = j + 2;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${i}-${j}`;
        cell.appendChild(input);
        container.appendChild(cell);
      }
    });

    resultMessage.textContent = '';
  }

  checkButton.addEventListener('click', () => {
    let allCorrect = true;
    const used = new Set();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const input = document.getElementById(`input-${i}-${j}`);
        const cell = input.parentElement;
        const val = input.value.trim().toLowerCase();
        const obj = settlements.find(s => s.name.toLowerCase() === val);
        const duplicate = used.has(val);
        const ok = obj && rowCats[i].fn(obj) && colCats[j].fn(obj) && !duplicate;

        used.add(val);

        cell.classList.remove('correct', 'incorrect', 'golden');
        if (ok) {
          cell.classList.add('correct');
          if (val === target.name.toLowerCase()) {
            cell.classList.add('golden');
          }
        } else {
          cell.classList.add('incorrect');
        }

        if (!ok) allCorrect = false;
      }
    }

    resultMessage.textContent = allCorrect ? '✅ All correct!' : '❌ Some incorrect or duplicates.';
  });

  newPuzzleButton.addEventListener('click', buildPuzzle);
  buildPuzzle();
});
