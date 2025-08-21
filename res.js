(async () => {
    const villages = [];
    document.querySelectorAll('#villages tr').forEach(tr => {
        const link = tr.querySelector('td.nowrap a');
        if (link) {
            const url = new URL(link.href, location.origin);
            const villageId = url.searchParams.get('village');
            villages.push(villageId);
        }
    });

    const villageResources = {};
    const totals = { Wood: 0, Clay: 0, Iron: 0 };

    for (const villageId of villages) {
        try {
            const response = await fetch(`/game.php?village=${villageId}&screen=overview`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const rows = doc.querySelectorAll("#show_prod tr.nowrap");
            const production = {};

            rows.forEach(row => {
                const tds = row.querySelectorAll("td");
                if (tds.length >= 2) {
                    const resourceName = tds[0].innerText.trim().split(/\s+/)[0];
                    const strong = tds[1].querySelector("strong");
                    if (!strong) return;

                    const perHourText = strong.innerText.replace(/\s+/g, '');
                    const cleanNumber = parseInt(perHourText.replace(/\./g, ''), 10);

                    production[resourceName] = cleanNumber;

                    if (totals[resourceName] !== undefined) {
                        totals[resourceName] += cleanNumber;
                    }
                }
            });

            villageResources[villageId] = production;

        } catch (e) {
            console.error(`❌ ${villageId} 실패`, e);
        }
    }

    console.log('🌍 모든 마을 자원 완료', villageResources);
    console.log('📦 전체 합산', totals);

    // ✅ 이미지 URL
    const imgUrls = {
      wood: 'https://dsen.innogamescdn.com/asset/636f8dd3/graphic/buildings/wood.webp',
      stone: 'https://dsen.innogamescdn.com/asset/636f8dd3/graphic/buildings/stone.webp',
      iron: 'https://dsen.innogamescdn.com/asset/636f8dd3/graphic/buildings/iron.webp'
    };

    // 드래그 가능한 총합 창 생성
    const container = document.createElement('div');
    container.id = 'totalResourcePopup';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
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
      <div style="text-align:right;">
        <button id="closeTotalPopup" style="background:red;color:white;border:none;padding:2px 6px;cursor:pointer;border-radius:4px;">X</button>
      </div>
      <h3 style="margin:5px 0;">자원량</h3>
      <p><img src="${imgUrls.wood}" style="width:20px;vertical-align:middle;"> 목재: ${totals.Wood}</p>
      <p><img src="${imgUrls.stone}" style="width:20px;vertical-align:middle;"> 점토: ${totals.Clay}</p>
      <p><img src="${imgUrls.iron}" style="width:20px;vertical-align:middle;"> 철: ${totals.Iron}</p>
    `;

    document.getElementById('closeTotalPopup').onclick = () => container.remove();

    // 드래그 기능
    let isDragging = false, offsetX, offsetY;
    container.addEventListener('mousedown', e => {
      isDragging = true;
      offsetX = e.clientX - container.offsetLeft;
      offsetY = e.clientY - container.offsetTop;
    });
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', e => {
      if (isDragging) {
        container.style.left = e.clientX - offsetX + 'px';
        container.style.top = e.clientY - offsetY + 'px';
      }
    });
})();
