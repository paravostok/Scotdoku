// scotdoku.js
import settlements from './settlements.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Scotdoku script loaded (dynamic categories)');

  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');

  if (!container || !checkButton || !newPuzzleButton) {
    console.error('❌ Missing required DOM elements.');
    return;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // UTILITY: shuffle an array in‐place (Fisher–Yates)
  // ───────────────────────────────────────────────────────────────────────────
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Build up a list of category‐objects that apply to a given settlement
  //
  // Each category object looks like:
  //   { label: 'some text', fn: settlement => boolean }
  //
  // We only push categories that are TRUE for the chosen “target” settlement.
  // ───────────────────────────────────────────────────────────────────────────
  function getAllCategoriesForSettlement(s) {
    const cats = [];

    // 1) status category (“is a city”, “is a town”, etc.)
    if (s.status) {
      cats.push({
        label: `is a ${s.status}`,
        fn: (x) => x.status === s.status,
      });
    }

    // 2) population threshold category
    if (typeof s.population === 'number') {
      if (s.population > 100000) {
        cats.push({
          label: 'population > 100 000',
          fn: (x) => typeof x.population === 'number' && x.population > 100000,
        });
      } else if (s.population > 50000) {
        cats.push({
          label: 'population > 50 000',
          fn: (x) => typeof x.population === 'number' && x.population > 50000,
        });
      } else if (s.population > 10000) {
        cats.push({
          label: 'population > 10 000',
          fn: (x) => typeof x.population === 'number' && x.population > 10000,
        });
      }
    }

    // 3) “has uni” category
    if (s.has_uni === true) {
      cats.push({
        label: 'has uni',
        fn: (x) => x.has_uni === true,
      });
    }

    // 4) region category (e.g. “Central Belt”, “Highlands”, etc.)
    if (s.region) {
      cats.push({
        label: s.region,
        fn: (x) => x.region === s.region,
      });
    }

    // 5) “largest settlement in council”
    if (s.largest_settlement === true) {
      cats.push({
        label: 'largest settlement in council',
        fn: (x) => x.largest_settlement === true && x.council === s.council,
      });
    }

    // 6) geography_type: “coastal”, “on river”, or “landlocked”
    if (s.geography_type) {
      // if it’s “coastal” or “on river”, push that exact category.
      if (s.geography_type === 'coastal') {
        cats.push({
          label: 'coastal',
          fn: (x) => x.geography_type === 'coastal',
        });
      } else if (s.geography_type === 'on river') {
        cats.push({
          label: 'on river',
          fn: (x) => x.geography_type === 'on river',
        });
      } else if (s.geography_type === 'landlocked') {
        cats.push({
          label: 'landlocked',
          fn: (x) => x.geography_type === 'landlocked',
        });
      }
    }

    return cats;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Select a random “target” settlement each day (or on "New Puzzle" click).
  //    We only pick from settlements whose status ≠ “area” (so we use only towns/cities/new towns/market towns).
  // ───────────────────────────────────────────────────────────────────────────
  function getRandomTargetSettlement() {
    const pool = settlements.filter((s) => s.status !== 'area');
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Build (or rebuild) the 3×3 grid with 6 categories derived from one target.
  //
  // Each time we call this, we:
  //   • Clear out #scotdoku-container
  //   • Re‐append the top‐left corner + the three (1,2)-(1,4) placeholders
  //   • Randomly pick one target → gather all categories that apply to it
  //   • Shuffle, take first 6, split into rowCats and colCats
  //   • Create row labels & 3×3 text inputs
  // ───────────────────────────────────────────────────────────────────────────
  let currentRowCategories = [];
  let currentColCategories = [];
  let currentTarget = null;

  function buildNewPuzzle() {
    // 3.1 pick a random target
    currentTarget = getRandomTargetSettlement();
    console.log('🎯 Today\'s target settlement is (hidden from player):', currentTarget.name);

    // 3.2 gather all categories that are TRUE for currentTarget
    const allCats = getAllCategoriesForSettlement(currentTarget);
    if (allCats.length < 6) {
      console.warn(`⚠️ Only found ${allCats.length} categories for ${currentTarget.name}.`);
      // We could fall back to fewer, but for now proceed anyway.
    }

    // 3.3 shuffle & take up to 6
    shuffleArray(allCats);
    const chosen6 = allCats.slice(0, 6);

    // 3.4 split into rows (first 3) and columns (next 3)
    currentRowCategories = chosen6.slice(0, 3);
    currentColCategories = chosen6.slice(3, 6);

    // 3.5 clear existing grid completely:
    container.innerHTML = '';

    // 3.5a re‐append the static “empty corner” and placeholders for col labels:
    const corner = document.createElement('div');
    corner.className = 'label-cell';
    corner.style.gridRow = 1;
    corner.style.gridColumn = 1;
    container.appendChild(corner);

    for (let j = 0; j < 3; j++) {
      const colLabel = document.createElement('div');
      colLabel.className = 'label-cell';
      colLabel.style.gridRow = 1;
      colLabel.style.gridColumn = j + 2; // columns 2,3,4
      colLabel.textContent = currentColCategories[j]?.label || '';
      colLabel.id = `col-label-${j}`;
      container.appendChild(colLabel);
    }

    // 3.5b build each of the 3 rows: row label + 3 text inputs
    for (let i = 0; i < 3; i++) {
      // Row label at (row i+2, col 1)
      const rowLabel = document.createElement('div');
      rowLabel.className = 'label-cell';
      rowLabel.textContent = currentRowCategories[i]?.label || '';
      rowLabel.style.gridRow = i + 2;
      rowLabel.style.gridColumn = 1;
      container.appendChild(rowLabel);

      // 3 text‐input cells in that row
      for (let j = 0; j < 3; j++) {
        const cellWrapper = document.createElement('div');
        cellWrapper.className = 'select-cell';
        cellWrapper.style.gridRow = i + 2;
        cellWrapper.style.gridColumn = j + 2;
        cellWrapper.id = `cell-${i}-${j}`;
        cellWrapper.dataset.row = i;
        cellWrapper.dataset.col = j;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${i}-${j}`;
        input.placeholder = 'type name…';
        input.autocomplete = 'off';
        input.spellcheck = false;

        cellWrapper.appendChild(input);
        container.appendChild(cellWrapper);
      }
    }

    // Clear any previous result message
    resultMessage.textContent = '';
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. “Check” logic (same as before, but now using currentRowCategories & currentColCategories)
  // ───────────────────────────────────────────────────────────────────────────
  checkButton.addEventListener('click', () => {
    if (!currentRowCategories.length || !currentColCategories.length) {
      console.warn('⚠️ No puzzle has been built yet. Click “New Puzzle.”');
      return;
    }

    let allCorrect = true;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const input = document.getElementById(`input-${i}-${j}`);
        const wrapper = document.getElementById(`cell-${i}-${j}`);
        const typed = input.value.trim().toLowerCase();

        if (!typed) {
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

        const settlementObj = settlements.find((s) => s.name === typed);
        if (!settlementObj) {
          console.warn(`⚠️ Typed entry “${typed}” not found.`);
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

        // test row & column categories against settlementObj
        const rowPass = currentRowCategories[i].fn(settlementObj);
        const colPass = currentColCategories[j].fn(settlementObj);

        if (rowPass && colPass) {
          wrapper.classList.remove('incorrect');
          wrapper.classList.add('correct');
        } else {
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
        }
      }
    }

    if (allCorrect) {
      resultMessage.textContent = '✅ All 9 entries are correct!';
      resultMessage.style.color = 'green';
    } else {
      resultMessage.textContent = '❌ Some entries are incorrect.';
      resultMessage.style.color = 'red';
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. “New Puzzle” logic: simply rebuild from scratch
  // ───────────────────────────────────────────────────────────────────────────
  newPuzzleButton.addEventListener('click', () => {
    buildNewPuzzle();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. On initial load, build the first puzzle
  // ───────────────────────────────────────────────────────────────────────────
  buildNewPuzzle();
});
