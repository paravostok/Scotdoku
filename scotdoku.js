// scotdoku.js - simplified tags-driven implementation
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');
  if (!container || !checkButton || !newPuzzleButton) return;

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

    // 1) positive categories for each tag
    tags.forEach(tag => {
      cats.push({
        label: tag,
        fn: x => x.tags.includes(tag)
      });
    });

    // 2) negative categories for selected tags
    ['new town','market town','town'].forEach(tag => {
      cats.push({
        label: `not ${tag}`,
        fn: x => !x.tags.includes(tag)
      });
    });

    // 3) population thresholds
    cats.push({ label: 'population > 10000', fn: x => x.population > 10000 });
    cats.push({ label: 'population <= 10000', fn: x => x.population <= 10000 });
    cats.push({ label: 'population > 50000', fn: x => x.population > 50000 });
    cats.push({ label: 'population <= 50000', fn: x => x.population <= 50000 });

    // ensure at least 6 categories
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
    const chosen = allCats.slice(0, 6);
    rowCats = chosen.slice(0, 3);
    colCats = chosen.slice(3, 6);

    container.innerHTML = '';
    // corner
    const corner = document.createElement('div');
    corner.className = 'label-cell';
    corner.style.gridRow = 1;
    corner.style.gridColumn = 1;
    container.appendChild(corner);

    // column labels
    colCats.forEach((cat, j) => {
      const el = document.createElement('div');
      el.className = 'label-cell';
      el.style.gridRow = 1;
      el.style.gridColumn = j + 2;
      el.textContent = cat.label;
      container.appendChild(el);
    });

    // rows + inputs
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
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const input = document.getElementById(`input-${i}-${j}`);
        const cell = input.parentElement;
        const val = input.value.trim().toLowerCase();
        const obj = settlements.find(s => s.name.toLowerCase() === val);
        const ok = obj && rowCats[i].fn(obj) && colCats[j].fn(obj);
        cell.classList.toggle('correct', ok);
        cell.classList.toggle('incorrect', !ok);
        if (!ok) allCorrect = false;
      }
    }
    resultMessage.textContent = allCorrect ? '✅ All correct!' : '❌ Some incorrect.';
  });

  newPuzzleButton.addEventListener('click', buildPuzzle);
  buildPuzzle();
});
