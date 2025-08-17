// 레벨별 시간당 생산량 (1.6배 적용)
const productionPerLevel = [
  16, 56, 65.6, 75.2, 88, 102.4, 118.4, 137.6, 160, 187.2,
  217.6, 252.8, 294.4, 342.4, 398.4, 462.4, 539.2, 625.6, 728, 848,
  985.6, 1147.2, 1332.8, 1550.4, 1803.2, 2097.6, 2440, 2838.4, 3300.8, 3840
];

// 이미지 URL
const imgUrls = {
  wood: 'https://dsen.innogamescdn.com/asset/636f8dd3/graphic/buildings/wood.webp',
  stone: 'https://dsen.innogamescdn.com/asset/636f8dd3/graphic/buildings/stone.webp',
  iron: 'https://dsen.innogamescdn.com/asset/636f8dd3/graphic/buildings/iron.webp'
};

// 총합 초기화
let totalWood = 0, totalStone = 0, totalIron = 0;

// 모든 마을 tr 선택
const villages = document.querySelectorAll('tr.vrow');
villages.forEach(row => {
  const woodLevel = parseInt(row.querySelector('.b_wood')?.textContent.trim(), 10);
  const stoneLevel = parseInt(row.querySelector('.b_stone')?.textContent.trim(), 10);
  const ironLevel = parseInt(row.querySelector('.b_iron')?.textContent.trim(), 10);

  totalWood += woodLevel > 0 ? productionPerLevel[woodLevel - 1] : 0;
  totalStone += stoneLevel > 0 ? productionPerLevel[stoneLevel - 1] : 0;
  totalIron += ironLevel > 0 ? productionPerLevel[ironLevel - 1] : 0;
});
totalWood *= 1.2;
totalStone *= 1.2;
totalIron *= 1.2;

// 드래그 가능한 총합 창 생성
const container = document.createElement('div');
container.id = 'totalResourcePopup';
container.style.position = 'fixed';
container.style.top = '50%';
container.style.left = '50%';
container.style.transform = 'translate(-50%, -50%)'; // 중앙 정렬
container.style.width = '300px';
container.style.backgroundColor = 'rgba(0,0,0,0.9)';
container.style.color = '#fff';
container.style.padding = '15px';
container.style.border = '2px solid #ccc';
container.style.borderRadius = '10px';
container.style.zIndex = 9999;
container.style.cursor = 'move';
container.style.fontFamily = 'Arial, sans-serif';
container.style.textAlign = 'center';
container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
document.body.appendChild(container);

// 내용 추가
container.innerHTML = `
  <div style="text-align:right;"><button id="closeTotalPopup" style="background:red;color:white;border:none;padding:2px 6px;cursor:pointer;border-radius:4px;">X</button></div>
  <h3 style="margin:5px 0;">자원량</h3>
  <p><img src="${imgUrls.wood}" style="width:20px;vertical-align:middle;"> 목재: ${totalWood}</p>
  <p><img src="${imgUrls.stone}" style="width:20px;vertical-align:middle;"> 점토: ${totalStone}</p>
  <p><img src="${imgUrls.iron}" style="width:20px;vertical-align:middle;"> 철: ${totalIron}</p>
`;

document.getElementById('closeTotalPopup').onclick = () => container.remove();

// 드래그 기능
let isDragging = false, offsetX, offsetY;
container.addEventListener('mousedown', e => {
  isDragging = true;
  offsetX = e.clientX - container.offsetLeft;
  offsetY = e.clientY - container.offsetTop;
});
document.addEventListener('mousemove', e => {
  if (isDragging) {
    container.style.left = e.clientX - offsetX + 'px';
    container.style.top = e.clientY - offsetY + 'px';
  }
});

document.addEventListener('mouseup', () => { isDragging = false; });

