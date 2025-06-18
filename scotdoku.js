// scotdoku.js
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');
  const header = document.querySelector('.header');
  if (!container || !checkButton || !newPuzzleButton || !header) return;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getAllCategories(settlement) {
    const cats = [];
    settlement.tags.forEach(tag => {
      cats.push({ label: tag, fn: s => s.tags.includes(tag) });
    });
    ['new town', 'market town', 'town'].forEach(tag => {
      cats.push({ label: `not ${tag}`, fn: s => !s.tags.includes(tag) });
    });
    const popChecks = [10000, 50000, 100000];
    popChecks.forEach(val => {
      cats.push({ label: `population > ${val}`, fn: s => s.population > val });
      cats.push({ label: `population <= ${val}`, fn: s => s.population <= val });
    });
    if (cats.length < 6) cats.push({ label: 'no special designation', fn: () => true });
    return cats;
  }

  function conflicting(a, b) {
    const conflicts = [
      ['population > 10000', 'population <= 10000'],
      ['population > 50000', 'population <= 50000'],
      ['population > 100000', 'population <= 100000'],
      ['town', 'not town'],
      ['new town', 'not new town'],
      ['market town', 'not market town']
    ];
    return conflicts.some(([x, y]) =>
      (a.label === x && b.label === y) || (a.label === y && b.label === x)
    );
  }

  let rowCats = [];
  let colCats = [];
  let target;

  function buildPuzzle() {
    // clear previous state
    header.classList.remove('chosen');
    container.innerHTML = '';
    resultMessage.textContent = '';

    // pick target and highlight header
    target = settlements[Math.floor(Math.random() * settlements.length)];
    header.textContent = `🔍 ${target.name.charAt(0).toUpperCase() + target.name.slice(1)}`;
    header.classList.add('chosen');

    // choose 6 non-conflicting categories
    const allCats = shuffle(getAllCategories(target));
    const chosen = [];
    allCats.forEach(cat => {
      if (chosen.length < 6 && chosen.every(c => !conflicting(c, cat))) {
        chosen.push(cat);
      }
    });
    while (chosen.length < 6) {
      chosen.push({ label: 'no special designation', fn: () => true });
    }
    rowCats = chosen.slice(0, 3);
    colCats = chosen.slice(3, 6);

    // build grid: 4x4 labels + 3x3 inputs
    // header corner
    container.appendChild(createLabel('', 1, 1));
    // column headers
    colCats.forEach((cat, j) => container.appendChild(createLabel(cat.label, 1, j + 2)));
    // rows
    rowCats.forEach((cat, i) => {
      container.appendChild(createLabel(cat.label, i + 2, 1));
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.gridRow = i + 2;
        cell.style.gridColumn = j + 2;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${i}-${j}`;
        cell.appendChild(input);
        container.appendChild(cell);
      }
    });
  }

  function createLabel(text, row, col) {
    const el = document.createElement('div');
    el.className = 'grid-cell';
    el.style.gridRow = row;
    el.style.gridColumn = col;
    el.textContent = text;
    return el;
  }

  function checkPuzzle() {
    const entries = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        entries.push(document.getElementById(`input-${i}-${j}`).value.trim().toLowerCase());
      }
    }
    const counts = entries.reduce((acc, v) => {
      if (v) acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});

    let allCorrect = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const input = document.getElementById(`input-${i}-${j}`);
        const cell = input.parentElement;
        const val = input.value.trim().toLowerCase();
        const settlement = settlements.find(s => s.name.toLowerCase() === val);
        let ok = settlement && rowCats[i].fn(settlement) && colCats[j].fn(settlement);
        if (val && counts[val] > 1) ok = false;
        cell.classList.toggle('correct', ok);
        cell.classList.toggle('incorrect', !ok);
        if (!ok) allCorrect = false;
      }
    }
    resultMessage.textContent = allCorrect ? '✅ All correct!' : '❌ Some incorrect.';
  }

  checkButton.addEventListener('click', checkPuzzle);
  newPuzzleButton.addEventListener('click', buildPuzzle);

  buildPuzzle();
});
