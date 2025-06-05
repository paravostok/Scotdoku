// scotdoku.js
import settlements from './settlement.js';
import seedrandom from 'seedrandom'; // make sure this is available

document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Scotdoku script loaded (with daily seed logic)');

  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');

  if (!container || !checkButton || !newPuzzleButton) {
    console.error('❌ Missing required DOM elements.');
    return;
  }

  function getDateSeed() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  function makeSeededRandom(seed) {
    return seedrandom(seed);
  }

  function shuffleArray(arr, rng = Math.random) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getRandomTargetSettlement(rng = Math.random) {
    const pool = settlements.filter((s) => s.status !== 'area');
    const idx = Math.floor(rng() * pool.length);
    return pool[idx];
  }

  function getAllCategoriesForSettlement(s) {
    const cats = [];

    if (typeof s.status === 'string' && s.status.length) {
      cats.push({
        label: `status: ${s.status}`,
        fn: (x) => x.status === s.status,
      });
    } else {
      cats.push({
        label: 'no special designation',
        fn: (_) => true,
      });
    }

    if (typeof s.council === 'string' && s.council.length) {
      cats.push({
        label: `council: ${s.council}`,
        fn: (x) => x.council === s.council,
      });
    }

    if (typeof s.name === 'string' && s.name.length) {
      const firstLetter = s.name.charAt(0).toLowerCase();
      cats.push({
        label: `first letter: ${firstLetter}`,
        fn: (x) => x.name.charAt(0).toLowerCase() === firstLetter,
      });
    }

    if (typeof s.region === 'string' && s.region.length) {
      cats.push({
        label: s.region,
        fn: (x) => x.region === s.region,
      });
    }

    if (typeof s.geography_type === 'string' && s.geography_type.length) {
      cats.push({
        label: s.geography_type,
        fn: (x) => x.geography_type === s.geography_type,
      });
    }

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

    if (s.has_uni === true) {
      cats.push({
        label: 'has uni',
        fn: (x) => x.has_uni === true,
      });
    }

    if (s.largest_settlement === true) {
      cats.push({
        label: 'largest settlement in council',
        fn: (x) => x.largest_settlement === true && x.council === s.council,
      });
    }

    if (cats.length < 6) {
      cats.push({
        label: 'no special designation',
        fn: (_) => true,
      });
    }

    return cats;
  }

  let currentRowCategories = [];
  let currentColCategories = [];
  let currentTarget = null;

  function buildNewPuzzle(rng = Math.random) {
    currentTarget = getRandomTargetSettlement(rng);
    console.log('🎯 Puzzle seed target:', currentTarget.name);

    const allCats = getAllCategoriesForSettlement(currentTarget);
    shuffleArray(allCats, rng);
    const chosen6 = allCats.slice(0, 6);

    currentRowCategories = chosen6.slice(0, 3);
    currentColCategories = chosen6.slice(3, 6);

    container.innerHTML = '';

    const corner = document.createElement('div');
    corner.className = 'label-cell';
    corner.style.gridRow = 1;
    corner.style.gridColumn = 1;
    container.appendChild(corner);

    for (let j = 0; j < 3; j++) {
      const colLabel = document.createElement('div');
      colLabel.className = 'label-cell';
      colLabel.style.gridRow = 1;
      colLabel.style.gridColumn = j + 2;
      colLabel.textContent = currentColCategories[j].label;
      container.appendChild(colLabel);
    }

    for (let i = 0; i < 3; i++) {
      const rowLabel = document.createElement('div');
      rowLabel.className = 'label-cell';
      rowLabel.textContent = currentRowCategories[i].label;
      rowLabel.style.gridRow = i + 2;
      rowLabel.style.gridColumn = 1;
      container.appendChild(rowLabel);

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

    resultMessage.textContent = '';
  }

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
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

        const settlementObj = settlements.find((s) => s.name === typed);
        if (!settlementObj) {
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

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

  // use seeded random for default daily puzzle
  const todaySeed = getDateSeed();
  const todayRNG = makeSeededRandom(todaySeed);
  buildNewPuzzle(todayRNG);

  // use true randomness when clicking “New Puzzle”
  newPuzzleButton.addEventListener('click', () => {
    buildNewPuzzle(Math.random);
  });
});
