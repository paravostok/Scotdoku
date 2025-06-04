import settlements from './settlements.js';

// ————————————————————————————————————————————————————————————————————————
// 1. DEFINE YOUR CATEGORIES HERE
//
// Each category is a function that takes a settlement‐object and returns true/false.
// You can add or change these to any combination of fields in `settlements.js`.
//
// Examples below:
//   • status === 'city'
//   • population > 50000
//   • geography_type === 'coastal'
//   • has_uni === true
//   • region === 'Highlands'
//   • etc.
//
// We'll hard-code three ROW categories and three COLUMN categories. Feel free to edit.
//
//   rowCategories[i] runs on the selected settlement in row i.
//   colCategories[j] runs on the selected settlement in column j.
// ————————————————————————————————————————————————————————————————————————

const rowCategories = [
  {
    label: 'is a city',
    fn: (s) => s.status === 'city',
  },
  {
    label: 'population > 50 000',
    fn: (s) => typeof s.population === 'number' && s.population > 50000,
  },
  {
    label: 'coastal',
    fn: (s) => s.geography_type === 'coastal',
  },
];

const colCategories = [
  {
    label: 'Central Belt',
    fn: (s) => s.region === 'Central Belt',
  },
  {
    label: 'has uni',
    fn: (s) => s.has_uni === true,
  },
  {
    label: 'New town',
    fn: (s) => s.status === 'new town',
  },
];

// ————————————————————————————————————————————————————————————————————————
// 2. BUILD THE UI GRID
// ————————————————————————————————————————————————————————————————————————

const container = document.getElementById('scotdoku-container');

// Fill column labels (row 0, cols 1–3)
colCategories.forEach((cat, j) => {
  const el = document.getElementById(`col-label-${j}`);
  el.textContent = cat.label;
});

// Now append each of 3 rows: label-cell + 3 select‐cells
for (let i = 0; i < 3; i++) {
  // 1) Row label at (row i+1, col 0)
  const rowLabel = document.createElement('div');
  rowLabel.className = 'label-cell';
  rowLabel.textContent = rowCategories[i].label;
  rowLabel.style.gridRow = i + 2;    // because first row is labels
  rowLabel.style.gridColumn = 1;     // first column
  container.appendChild(rowLabel);

  // 2) 3 cells in that row
  for (let j = 0; j < 3; j++) {
    const cellWrapper = document.createElement('div');
    cellWrapper.className = 'select-cell';
    cellWrapper.dataset.row = i;
    cellWrapper.dataset.col = j;
    cellWrapper.id = `cell-${i}-${j}`;

    // create a <select> of all settlement names
    const select = document.createElement('select');
    select.id = `select-${i}-${j}`;

    // add an empty first option
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '—';
    select.appendChild(emptyOpt);

    // fill with all settlement names, sorted alphabetically
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
    // position in CSS grid
    cellWrapper.style.gridRow = i + 2;
    cellWrapper.style.gridColumn = j + 2;
    container.appendChild(cellWrapper);
  }
}

// ————————————————————————————————————————————————————————————————————————
// 3. VALIDATION LOGIC
// ————————————————————————————————————————————————————————————————————————

const checkButton = document.getElementById('check-button');
const resultMessage = document.getElementById('result-message');

checkButton.addEventListener('click', () => {
  let allCorrect = true;

  // For each cell (i,j): get the selected settlement name → look up its object → run both row/col fns
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const sel = document.getElementById(`select-${i}-${j}`);
      const wrapper = document.getElementById(`cell-${i}-${j}`);
      const chosenName = sel.value;
      if (!chosenName) {
        // no selection → mark incorrect
        wrapper.classList.remove('correct');
        wrapper.classList.add('incorrect');
        allCorrect = false;
        continue;
      }

      // find the settlement object in the big array
      const settlementObj = settlements.find((s) => s.name === chosenName);
      if (!settlementObj) {
        // shouldn't happen if names match
        wrapper.classList.remove('correct');
        wrapper.classList.add('incorrect');
        allCorrect = false;
        continue;
      }

      // run row + column category tests
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

  // update result message
  if (allCorrect) {
    resultMessage.textContent = '✅ All 9 entries are correct!';
    resultMessage.style.color = 'green';
  } else {
    resultMessage.textContent = '❌ Some entries are incorrect.';
    resultMessage.style.color = 'red';
  }
});
