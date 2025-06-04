// scotdoku.js
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Scotdoku script loaded');

  const container = document.getElementById('scotdoku-container');
  if (!container) {
    console.error('❌ Scotdoku container (#scotdoku-container) not found!');
    return;
  }
  console.log('✅ Found container:', container);

  // ——————————————————————————————
  // 1. DEFINE CATEGORIES
  // ——————————————————————————————
  // Each cat: { label: 'text', fn: settlement => boolean }
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
  // 3. BUILD ROW LABELS + SELECT CELLS
  // ——————————————————————————————
  for (let i = 0; i < 3; i++) {
    // 3a) Row label at (row i+2, col 1)
    const rowLabel = document.createElement('div');
    rowLabel.className = 'label-cell';
    rowLabel.textContent = rowCategories[i].label;
    rowLabel.style.gridRow = i + 2;   // 2..4
    rowLabel.style.gridColumn = 1;    // always first column
    container.appendChild(rowLabel);

    // 3b) Create 3 select-cells in that row
    for (let j = 0; j < 3; j++) {
      // wrapper DIV
      const cellWrapper = document.createElement('div');
      cellWrapper.className = 'select-cell';
      cellWrapper.style.gridRow = i + 2;    // row 2..4
      cellWrapper.style.gridColumn = j + 2; // col 2..4
      cellWrapper.id = `cell-${i}-${j}`;
      cellWrapper.dataset.row = i;
      cellWrapper.dataset.col = j;

      // the <select> itself
      const select = document.createElement('select');
      select.id = `select-${i}-${j}`;

      // 3b.1 empty default option
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = '—';
      select.appendChild(emptyOpt);

      // 3b.2 fill with all settlement names, sorted
      settlements
        .map((s) => s.name)
        .sort((a, b) => a.localeCompare(b))
        .forEach((name) => {
          const opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          select.appendChild(opt);
        });

      cellWrapper.appendChild(select);
      container.appendChild(cellWrapper);
    }
  }

  console.log('✅ Grid (labels + selects) appended');

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
        const sel = document.getElementById(`select-${i}-${j}`);
        const wrapper = document.getElementById(`cell-${i}-${j}`);
        const chosenName = sel.value;

        if (!chosenName) {
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

        const settlementObj = settlements.find((s) => s.name === chosenName);
        if (!settlementObj) {
          console.warn(`⚠️ Settlement “${chosenName}” not found in array.`)
          wrapper.classList.remove('correct');
          wrapper.classList.add('incorrect');
          allCorrect = false;
          continue;
        }

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

    if (allCorrect) {
      resultMessage.textContent = '✅ All 9 entries are correct!';
      resultMessage.style.color = 'green';
    } else {
      resultMessage.textContent = '❌ Some entries are incorrect.';
      resultMessage.style.color = 'red';
    }
  });
});
