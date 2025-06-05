// scotdoku.js
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Scotdoku script loaded (expanded category set)');

  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');

  if (!container || !checkButton || !newPuzzleButton) {
    console.error('❌ Missing required DOM elements. Make sure index.html has #scotdoku-container, #check-button, and #new-puzzle-button.');
    return;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Utility: shuffle an array in‐place (Fisher–Yates)
  // ───────────────────────────────────────────────────────────────────────────
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Build a list of “category objects” that apply to settlement `s`.
  //
  // Each category object is:
  //   { label: 'some text', fn: settlement => boolean }
  //
  // We will always include at least:
  //   • status: <status>          (e.g. "status: city")
  //   • council: <council name>    (e.g. "council: fife council")
  //   • first letter: <A-Z>        (e.g. "first letter: e")
  //   • region: <Highlands|Islands|Central Belt|Borders>
  //   • geography_type: <coastal|on river|landlocked>
  //
  // Then optional:
  //   • population threshold
  //   • has_uni
  //   • largest settlement in council
  //
  // Finally, if we still have fewer than 6 categories, we push a fallback “no special designation” category.
  // ───────────────────────────────────────────────────────────────────────────
  function getAllCategoriesForSettlement(s) {
    const cats = [];

    // 1) Status (always present in your 200-entry array)
    if (typeof s.status === 'string' && s.status.length) {
      cats.push({
        label: `status: ${s.status}`,
        fn: (x) => x.status === s.status,
      });
    } else {
      // if for some reason status is missing or empty
      cats.push({
        label: 'no special designation',
        fn: (_) => true,
      });
    }

    // 2) Council
    if (typeof s.council === 'string' && s.council.length) {
      cats.push({
        label: `council: ${s.council}`,
        fn: (x) => x.council === s.council,
      });
    }

    // 3) First letter of name (A–Z)
    if (typeof s.name === 'string' && s.name.length) {
      const firstLetter = s.name.charAt(0).toLowerCase();
      cats.push({
        label: `first letter: ${firstLetter}`,
        fn: (x) => x.name.charAt(0).toLowerCase() === firstLetter,
      });
    }

    // 4) Region (Highlands, Islands, Central Belt, Borders)
    if (typeof s.region === 'string' && s.region.length) {
      cats.push({
        label: s.region,
        fn: (x) => x.region === s.region,
      });
    }

    // 5) Geography type (coastal, on river, landlocked)
    if (typeof s.geography_type === 'string' && s.geography_type.length) {
      cats.push({
        label: s.geography_type,
        fn: (x) => x.geography_type === s.geography_type,
      });
    }

    // 6) Population thresholds
    if (typeof s.population === 'number') {
      if (s.population > 100000) {
        cats.push({
          label: 'population > 100 000',
          fn: (x) => typeof x.population === 'number' && x.population > 100000,
        });
      }
      if (s.population > 50000) {
        cats.push({
          label: 'population > 50 000',
          fn: (x) => typeof x.population === 'number' && x.population > 50000,
        });
      }
      if (s.population > 10000) {
        cats.push({
          label: 'population > 10 000',
          fn: (x) => typeof x.population === 'number' && x.population > 10000,
        });
      }
    }

    // 7) has_uni
    if (s.has_uni === true) {
      cats.push({
        label: 'has uni',
        fn: (x) => x.has_uni === true,
      });
    }

    // 8) largest_settlement in council
    if (s.largest_settlement === true) {
      cats.push({
        label: 'largest settlement in council',
        fn: (x) => x.largest_settlement === true && x.council === s.council,
      });
    }

    // 9) Fallback “no special designation,” ensures we hit at least 6
    if (cats.length < 6) {
      cats.push({
        label: 'no special designation',
        fn: (_) => true,
      });
    }
    // Even if cats.length is exactly 5, we now have 6. If it was fewer, we still have at least 6.
    // (Note: if we somehow had more than 6, we'll shuffle & pick only 6 later.)

    return cats;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Pick a random “target” settlement each time (exclude status="area" if desired).
  // ───────────────────────────────────────────────────────────────────────────
  function getRandomTargetSettlement() {
    // You asked to “choose a random new town/city each day,” so we exclude status === "area"
    const pool = settlements.filter((s) => s.status !== 'area');
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Build (or rebuild) the 3×3 grid with 6 categories derived from one target:
  //    • Choose target
  //    • Gather all categories (≥6 guaranteed by fallback)
  //    • Shuffle & take first 6 => rowCats (0..2) + colCats (3..5)
  //    • Rebuild the HTML grid
  // ───────────────────────────────────────────────────────────────────────────
  let currentRowCategories = [];
  let currentColCategories = [];
  let currentTarget = null;

  function buildNewPuzzle() {
    // 3.1 pick a random target
    currentTarget = getRandomTargetSettlement();
    console.log('🎯 Today’s target settlement:', currentTarget.name);

    // 3.2 gather all categories for that target
    const allCats = getAllCategoriesForSettlement(currentTarget);
    // shuffle & take exactly 6
    shuffleArray(allCats);
    const chosen6 = allCats.slice(0, 6);

    // 3.3 split into rows and columns
    currentRowCategories = chosen6.slice(0, 3);
    currentColCategories = chosen6.slice(3, 6);

    // 3.4 clear out existing grid:
    container.innerHTML = '';

    // 3.4a re‐append the fixed “empty corner” at (1,1)
    const corner = document.createElement('div');
    corner.className = 'label-cell';
    corner.style.gridRow = 1;
    corner.style.gridColumn = 1;
    container.appendChild(corner);

    // 3.4b add column labels at (1,2), (1,3), (1,4)
    for (let j = 0; j < 3; j++) {
      const colLabel = document.createElement('div');
      colLabel.className = 'label-cell';
      colLabel.style.gridRow = 1;
      colLabel.style.gridColumn = j + 2;
      colLabel.textContent = currentColCategories[j].label;
      colLabel.id = `col-label-${j}`;
      container.appendChild(colLabel);
    }

    // 3.4c build 3 rows (rows 2..4), each with a row label + 3 text inputs
    for (let i = 0; i < 3; i++) {
      // row label at (i+2, 1)
      const rowLabel = document.createElement('div');
      rowLabel.className = 'label-cell';
      rowLabel.textContent = currentRowCategories[i].label;
      rowLabel.style.gridRow = i + 2;
      rowLabel.style.gridColumn = 1;
      container.appendChild(rowLabel);

      // 3 text‐input cells in columns 2..4
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

    // clear any previous result text
    resultMessage.textContent = '';
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. “Check” logic: test each of the 9 inputs against its row & column categories
  // ───────────────────────────────────────────────────────────────────────────
  checkButton.addEventListener('click', () => {
    if (!currentRowCategories.length || !currentColCategories.length) {
      console.warn('⚠️ No puzzle built yet. Click “New Puzzle.”');
      return;
    }

    let allCorrect = true;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const input = document.getElementById(`input-${i}-${j}`);
        const wrapper = document.getElementById(`cell-${i}-${j}`);
        const typed = input.value.trim().toLowerCase();

        if (!typed) {
          // empty: incorrect
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

        // run row‐ and column tests
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

    // display summary
    if (allCorrect) {
      resultMessage.textContent = '✅ All 9 entries are correct!';
      resultMessage.style.color = 'green';
    } else {
      resultMessage.textContent = '❌ Some entries are incorrect.';
      resultMessage.style.color = 'red';
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. “New Puzzle” logic: re‐generate from scratch
  // ───────────────────────────────────────────────────────────────────────────
  newPuzzleButton.addEventListener('click', () => {
    buildNewPuzzle();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. On initial load, create the first puzzle
  // ───────────────────────────────────────────────────────────────────────────
  buildNewPuzzle();
});
