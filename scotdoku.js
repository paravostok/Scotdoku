// scotdoku.js
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Scotdoku script loaded (text‐input mode)');

  const container = document.getElementById('scotdoku-container');
  if (!container) {
    console.error('❌ Scotdoku container (#scotdoku-container) not found!');
    return;
  }
  console.log('✅ Found container:', container);

  // ——————————————————————————————
  // 1. DEFINE CATEGORIES
  // ——————————————————————————————
  // Each category is { label: '...', fn: (s) => boolean }.
  // Adjust these as you see fit.
  const rowCategories = [
    { label: 'is a city', fn: (s) => s.status === 'city' },
    { label: 'population > 50 000', fn: (s) => typeof s.population === 'number' && s.population > 50000 },
    { label: 'coastal', fn: (s) => s.geography_type === 'coastal' },
  ];
  const colCategories = [
    { label: 'Central Belt', fn: (s) => s.region === 'Central Belt' },
    { label: 'has uni', fn: (s) => s.has_uni === true },
    { label: 'new town', fn: (s) => s.status === 'new town' },
  ];

  // ——————————————————————————————
  // 2. FILL COLUMN LABELS
  // ——————————————————————————————
  colCategories.forEach((cat, j) => {
    const el = document.getElementById(`col-label-${j}`);
    if (!el) {
      console.warn(`⚠️ Column label element col-label-${j} not found.`);
      return;
    }
    el.textContent = cat.label;
  });

  // ——————————————————————————————
  // 3. BUILD ROW LABELS + TEXT INPUT CELLS
  // ——————————————————————————————
  for (let i = 0; i < 3; i++) {
    // 3a) Row label at (row i+2, col 1)
    const rowLabel = document.createElement('div');
    rowLabel.className = 'label-cell';
    rowLabel.textContent = rowCategories[i].label;
    rowLabel.style.gridRow = i + 2;   // rows 2,3,4
    rowLabel.style.gridColumn = 1;    // column 1
    container.appendChild(rowLabel);

    // 3b) Create 3 text‐input cells in that row
    for (let j = 0; j < 3; j++) {
      const cellWrapper = document.createElement('div');
      cellWrapper.className = 'select-cell'; // we’re reusing the same styling
      cellWrapper.style.gridRow = i + 2;    // row 2..4
      cellWrapper.style.gridColumn = j + 2; // col 2..4
      cellWrapper.id = `cell-${i}-${j}`;
      cellWrapper.dataset.row = i;
      cellWrapper.dataset.col = j;

      // TEXT INPUT instead of <select>
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `input-${i}-${j}`;
      input.placeholder = 'type name...';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.style.width = '100%';

      cellWrapper.appendChild(input);
      container.appendChild(cellWrapper);
    }
  }

  console.log('✅ Grid (labels + text‐inputs) appended');

  // ——————————————————————————————
  // 4. VALIDATION ON “Check” BUTTON
  // ——————————————————————————————
  const checkButton = document.getElementById('check-button');
  const resultMessage = document.getElementById('result-message');

  if (!checkButton) {
    console.error('❌ #check-button not found.');
    return;
  }
  checkButton.addEventListener('click', () => {
    let allCorrect = true;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const input = document.getElementById(`input-${i}-${j}`);
        const wrapper = document.getElementById(`cell-${i}-${j}`);
        const typed = input.value.trim().toLowerCase();

        if (!typed) {
          // No text entered: mark incorrect
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

        // Find matching settlement by name (lowercase)
        const settlementObj = settlements.find((s) => s.name === typed);
        if (!settlementObj) {
          // Not a valid name from the list
          console.warn(`⚠️ Settlement “${typed}” not found in array.`);
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

        // Run category checks
        const rowPass = rowCategories[i].fn(settlementObj);
        const colPass = colCategories[j].fn(settlementObj);

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

    // Display summary
    if (allCorrect) {
      resultMessage.textContent = '✅ All 9 entries are correct!';
      resultMessage.style.color = 'green';
    } else {
      resultMessage.textContent = '❌ Some entries are incorrect.';
      resultMessage.style.color = 'red';
    }
  });
});
