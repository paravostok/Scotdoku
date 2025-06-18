/* scotdoku.js */
import settlements from './settlement.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scotdoku-container');
  const checkButton = document.getElementById('check-button');
  const newPuzzleButton = document.getElementById('new-puzzle-button');
  const resultMessage = document.getElementById('result-message');
  if (!container || !checkButton || !newPuzzleButton) return;

  let selectedTown = null;
  let rowCats = [], colCats = [];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getAllCategories(s) {
    const cats = [];
    s.tags.forEach(tag => cats.push({ label: tag, fn: x => x.tags.includes(tag) }));
    ['new town','market town','town'].forEach(tag =>
      cats.push({ label: `not ${tag}`, fn: x => !x.tags.includes(tag) })
    );
    [10000,50000,100000].forEach(val => {
      cats.push({ label: `population > ${val}`, fn: x => x.population > val });
      cats.push({ label: `population <= ${val}`, fn: x => x.population <= val });
    });
    if (cats.length < 6) cats.push({ label: 'no special designation', fn: _=>true });
    return cats;
  }

  function conflicting(a,b) {
    const pairs = [
      ['population > 10000','population <= 10000'],
      ['population > 50000','population <= 50000'],
      ['population > 100000','population <= 100000'],
      ['town','not town'],['new town','not new town'],['market town','not market town']
    ];
    return pairs.some(([x,y])=>
      (a.label===x&&b.label===y)||(a.label===y&&b.label===x)
    );
  }

  function getRandomSettlement() {
    return settlements[Math.floor(Math.random()*settlements.length)];
  }

  function buildPuzzle() {
    selectedTown = null;
    const target = getRandomSettlement();
    const allCats = shuffle(getAllCategories(target));
    const chosen = [];
    allCats.forEach(cat => {
      if (chosen.length<6 && chosen.every(c=>!conflicting(c,cat))) chosen.push(cat);
    });
    while(chosen.length<6) chosen.push({ label:'no special designation', fn:_=>true });
    rowCats = chosen.slice(0,3);
    colCats = chosen.slice(3);

    container.innerHTML='';
    container.style.gridTemplateRows = `60px repeat(3, 1fr)`;
    // corner
    container.appendChild(labelCell('',1,1));
    colCats.forEach((cat,j)=>container.appendChild(labelCell(cat.label,1,j+2)));
    rowCats.forEach((cat,i)=>{
      container.appendChild(labelCell(cat.label,i+2,1));
      for(let j=0;j<3;j++){
        const cell=document.createElement('div');
        cell.className='select-cell';
        cell.style.gridRow=i+2;
        cell.style.gridColumn=j+2;
        const input=document.createElement('input');
        input.type='text';input.id=`in-${i}-${j}`;
        input.addEventListener('input',()=>{
          document.querySelectorAll('.select-cell').forEach(c=>c.classList.remove('selected-town'));
          const v=input.value.trim().toLowerCase();
          if(v){const o=settlements.find(s=>s.name.toLowerCase()===v);
            if(o){cell.classList.add('selected-town');selectedTown=v;}
          }
        });
        cell.appendChild(input);
        container.appendChild(cell);
      }
    });
    resultMessage.textContent='';
  }

  function labelCell(txt,r,c){
    const el=document.createElement('div');el.className='label-cell';
    el.style.gridRow=r;el.style.gridColumn=c;el.textContent=txt;return el;
  }

  checkButton.addEventListener('click',()=>{
    let okAll=true; const used=new Set();
    for(let i=0;i<3;i++)for(let j=0;j<3;j++){
      const inp=document.getElementById(`in-${i}-${j}`);
      const cell=inp.parentElement;
      const v=inp.value.trim().toLowerCase();
      const o=settlements.find(s=>s.name.toLowerCase()===v);
      const unique=!used.has(v);
      let ok=o&&rowCats[i].fn(o)&&colCats[j].fn(o)&&unique;
      used.add(v);
      cell.classList.remove('correct','incorrect');
      if(v===selectedTown) cell.classList.add('selected-town');
      cell.classList.add(ok?'correct':'incorrect');
      if(!ok) okAll=false;
    }
    resultMessage.textContent=okAll?'✅ All correct!':'❌ Some incorrect.';
  });

  newPuzzleButton.addEventListener('click',buildPuzzle);
  buildPuzzle();
});
