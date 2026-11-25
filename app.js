let isEditMode = false;
let currentFilter = 'ALL';

// 台北捷運全線完整車站資料庫
const ALL_MRT_STATIONS = [
  // === 文湖線 (BR) 與南港展覽館交會 ===
  { id: 'BR24-BL23', line: 'BR', name: '南港展覽館', x: 92.8, y: 42.8 },
  { id: 'BR23', line: 'BR', name: '南港軟體園區', x: 92.8, y: 38.0 },
  { id: 'BR22', line: 'BR', name: '東湖', x: 92.8, y: 33.2 },
  { id: 'BR21', line: 'BR', name: '葫洲', x: 89.2, y: 28.5 },
  { id: 'BR20', line: 'BR', name: '大湖公園', x: 84.5, y: 24.5 },
  { id: 'BR19', line: 'BR', name: '內湖', x: 78.2, y: 22.8 },
  { id: 'BR18', line: 'BR', name: '文德', x: 72.5, y: 22.8 },
  { id: 'BR17', line: 'BR', name: '港墘', x: 66.8, y: 22.8 },
  { id: 'BR16', line: 'BR', name: '西湖', x: 61.5, y: 22.8 },
  { id: 'BR15', line: 'BR', name: '劍南路', x: 56.5, y: 25.5 },
  { id: 'BR14', line: 'BR', name: '大直', x: 56.5, y: 29.8 },
  { id: 'BR13', line: 'BR', name: '松山機場', x: 56.5, y: 34.8 },
  { id: 'BR12', line: 'BR', name: '中山國中', x: 56.5, y: 39.2 },
  { id: 'BR11-G16', line: 'BR', name: '南京復興', x: 56.5, y: 44.2 },
  { id: 'BR10-BL15', line: 'BR', name: '忠孝復興', x: 56.5, y: 52.8 },
  { id: 'BR09-R05', line: 'BR', name: '大安', x: 56.5, y: 60.8 },
  { id: 'BR08', line: 'BR', name: '科技大樓', x: 56.5, y: 65.5 },
  { id: 'BR07', line: 'BR', name: '六張犁', x: 61.2, y: 69.5 },
  { id: 'BR06', line: 'BR', name: '麟光', x: 65.5, y: 72.5 },
  { id: 'BR05', line: 'BR', name: '辛亥', x: 65.5, y: 76.2 },
  { id: 'BR04', line: 'BR', name: '萬芳醫院', x: 65.5, y: 79.8 },
  { id: 'BR03', line: 'BR', name: '萬芳社區', x: 69.5, y: 79.8 },
  { id: 'BR02', line: 'BR', name: '木柵', x: 74.2, y: 79.8 },
  { id: 'BR01', line: 'BR', name: '動物園', x: 78.8, y: 79.8 },

  // === 淡水信義線 (R) ===
  { id: 'R28', line: 'R', name: '淡水', x: 14.5, y: 12.8 },
  { id: 'R27', line: 'R', name: '紅樹林', x: 16.5, y: 16.2 },
  { id: 'R26', line: 'R', name: '竹圍', x: 16.5, y: 19.8 },
  { id: 'R25', line: 'R', name: '關渡', x: 16.5, y: 23.2 },
  { id: 'R24', line: 'R', name: '忠義', x: 20.5, y: 25.5 },
  { id: 'R23', line: 'R', name: '復興崗', x: 24.8, y: 25.5 },
  { id: 'R22', line: 'R', name: '北投', x: 29.2, y: 25.5 },
  { id: 'R22A', line: 'R', name: '新北投', x: 34.5, y: 22.8 },
  { id: 'R21', line: 'R', name: '奇岩', x: 33.5, y: 27.8 },
  { id: 'R20', line: 'R', name: '唭哩岸', x: 36.8, y: 30.2 },
  { id: 'R19', line: 'R', name: '石牌', x: 40.2, y: 32.8 },
  { id: 'R18', line: 'R', name: '明德', x: 42.2, y: 35.8 },
  { id: 'R17', line: 'R', name: '芝山', x: 42.2, y: 38.8 },
  { id: 'R16', line: 'R', name: '士林', x: 42.2, y: 41.8 },
  { id: 'R15', line: 'R', name: '劍潭', x: 42.2, y: 44.8 },
  { id: 'R14', line: 'R', name: '圓山', x: 42.2, y: 47.8 },
  { id: 'R13-O11', line: 'R', name: '民權西路', x: 42.2, y: 44.2 },
  { id: 'R12', line: 'R', name: '雙連', x: 42.2, y: 47.5 },
  { id: 'R11-G14', line: 'R', name: '中山', x: 42.2, y: 50.8 },
  { id: 'R10-BL12', line: 'R', name: '台北車站', x: 42.2, y: 55.2 },
  { id: 'R09', line: 'R', name: '台大醫院', x: 42.2, y: 58.5 },
  { id: 'R08-G10', line: 'R', name: '中正紀念堂', x: 42.2, y: 61.8 },
  { id: 'R07-O06', line: 'R', name: '東門', x: 47.5, y: 61.8 },
  { id: 'R06', line: 'R', name: '大安森林公園', x: 52.0, y: 61.8 },
  { id: 'R04', line: 'R', name: '信義安和', x: 61.5, y: 61.8 },
  { id: 'R03', line: 'R', name: '台北101/世貿', x: 66.8, y: 61.8 },
  { id: 'R02', line: 'R', name: '象山', x: 71.8, y: 61.8 },
  { id: 'R01', line: 'R', name: '廣慈/奉天宮', x: 76.5, y: 61.8 },

  // === 松山新店線 (G) ===
  { id: 'G19', line: 'G', name: '松山', x: 74.5, y: 44.2 },
  { id: 'G18', line: 'G', name: '南京三民', x: 68.5, y: 44.2 },
  { id: 'G17', line: 'G', name: '台北小巨蛋', x: 62.5, y: 44.2 },
  { id: 'G15-O08', line: 'G', name: '松江南京', x: 50.5, y: 44.2 },
  { id: 'G13', line: 'G', name: '北門', x: 35.5, y: 49.5 },
  { id: 'G12-BL11', line: 'G', name: '西門', x: 33.8, y: 55.2 },
  { id: 'G11', line: 'G', name: '小南門', x: 35.8, y: 59.5 },
  { id: 'G09-O05', line: 'G', name: '古亭', x: 45.5, y: 64.8 },
  { id: 'G08', line: 'G', name: '台電大樓', x: 48.5, y: 68.2 },
  { id: 'G07', line: 'G', name: '公館', x: 51.5, y: 71.5 },
  { id: 'G06', line: 'G', name: '萬隆', x: 54.5, y: 75.2 },
  { id: 'G05', line: 'G', name: '景美', x: 54.5, y: 79.2 },
  { id: 'G04-Y07', line: 'G', name: '大坪林', x: 54.5, y: 83.2 },
  { id: 'G03', line: 'G', name: '七張', x: 54.5, y: 87.2 },
  { id: 'G03A', line: 'G', name: '小碧潭', x: 49.5, y: 90.2 },
  { id: 'G02', line: 'G', name: '新店區公所', x: 54.5, y: 91.2 },
  { id: 'G01', line: 'G', name: '新店', x: 54.5, y: 95.0 },

  // === 中和新蘆線 (O) ===
  { id: 'O54', line: 'O', name: '蘆洲', x: 20.5, y: 33.2 },
  { id: 'O53', line: 'O', name: '三民高中', x: 23.8, y: 36.2 },
  { id: 'O52', line: 'O', name: '徐匯中學', x: 26.8, y: 39.2 },
  { id: 'O51', line: 'O', name: '三和國中', x: 29.8, y: 42.2 },
  { id: 'O50', line: 'O', name: '三重國小', x: 32.8, y: 45.2 },
  { id: 'O21', line: 'O', name: '迴龍', x: 5.5, y: 74.2 },
  { id: 'O20', line: 'O', name: '丹鳳', x: 8.8, y: 71.2 },
  { id: 'O19', line: 'O', name: '輔大', x: 11.8, y: 68.2 },
  { id: 'O18', line: 'O', name: '新莊', x: 14.8, y: 65.2 },
  { id: 'O17-Y18', line: 'O', name: '頭前庄', x: 17.8, y: 62.2 },
  { id: 'O16', line: 'O', name: '先嗇宮', x: 20.8, y: 59.2 },
  { id: 'O15', line: 'O', name: '三重', x: 23.8, y: 55.2 },
  { id: 'O14', line: 'O', name: '菜寮', x: 27.5, y: 51.8 },
  { id: 'O13', line: 'O', name: '台北橋', x: 31.2, y: 48.8 },
  { id: 'O12', line: 'O', name: '大橋頭', x: 36.8, y: 45.2 },
  { id: 'O10', line: 'O', name: '中山國小', x: 47.5, y: 41.2 },
  { id: 'O09', line: 'O', name: '行天宮', x: 50.5, y: 42.8 },
  { id: 'O07-BL14', line: 'O', name: '忠孝新生', x: 50.5, y: 52.8 },
  { id: 'O04', line: 'O', name: '頂溪', x: 38.5, y: 69.8 },
  { id: 'O03', line: 'O', name: '永安市場', x: 35.5, y: 73.5 },
  { id: 'O02-Y11', line: 'O', name: '景安', x: 35.5, y: 77.8 },
  { id: 'O01', line: 'O', name: '南勢角', x: 35.5, y: 81.8 },

  // === 板南線 (BL) ===
  { id: 'BL22', line: 'BL', name: '南港', x: 86.5, y: 44.2 },
  { id: 'BL21', line: 'BL', name: '昆陽', x: 81.5, y: 46.5 },
  { id: 'BL20', line: 'BL', name: '後山埤', x: 77.5, y: 49.5 },
  { id: 'BL19', line: 'BL', name: '永春', x: 73.5, y: 52.8 },
  { id: 'BL18', line: 'BL', name: '市政府', x: 68.5, y: 52.8 },
  { id: 'BL17', line: 'BL', name: '國父紀念館', x: 64.2, y: 52.8 },
  { id: 'BL16', line: 'BL', name: '忠孝敦化', x: 60.2, y: 52.8 },
  { id: 'BL13', line: 'BL', name: '善導寺', x: 46.2, y: 55.2 },
  { id: 'BL10', line: 'BL', name: '龍山寺', x: 29.5, y: 58.5 },
  { id: 'BL09', line: 'BL', name: '江子翠', x: 25.2, y: 61.5 },
  { id: 'BL08', line: 'BL', name: '新埔', x: 21.5, y: 64.5 },
  { id: 'BL07-Y16', line: 'BL', name: '板橋', x: 17.8, y: 67.8 },
  { id: 'BL06', line: 'BL', name: '府中', x: 16.5, y: 71.8 },
  { id: 'BL05', line: 'BL', name: '亞東醫院', x: 16.5, y: 75.8 },
  { id: 'BL04', line: 'BL', name: '海山', x: 16.5, y: 79.8 },
  { id: 'BL03', line: 'BL', name: '土城', x: 16.5, y: 83.8 },
  { id: 'BL02', line: 'BL', name: '永寧', x: 16.5, y: 87.8 },
  { id: 'BL01', line: 'BL', name: '頂埔', x: 16.5, y: 91.8 },

  // === 環狀線 (Y) ===
  { id: 'Y20', line: 'Y', name: '新北產業園區', x: 13.5, y: 52.8 },
  { id: 'Y19', line: 'Y', name: '幸福', x: 16.2, y: 57.5 },
  { id: 'Y17', line: 'Y', name: '新埔民生', x: 19.5, y: 64.8 },
  { id: 'Y15', line: 'Y', name: '板新', x: 21.8, y: 71.2 },
  { id: 'Y14', line: 'Y', name: '中原', x: 25.5, y: 74.2 },
  { id: 'Y13', line: 'Y', name: '橋和', x: 29.2, y: 76.5 },
  { id: 'Y12', line: 'Y', name: '中和', x: 32.5, y: 77.8 },
  { id: 'Y10', line: 'Y', name: '景平', x: 39.5, y: 77.8 },
  { id: 'Y09', line: 'Y', name: '秀朗橋', x: 43.8, y: 79.5 },
  { id: 'Y08', line: 'Y', name: '十四張', x: 48.8, y: 81.5 }
];

const defaultState = {
  stampedStations: [],
  customCoords: {},
  customSpots: [
    { id: 'c1', name: '台北市立動物園', stamped: false },
    { id: 'c2', name: '國立故宮博物院', stamped: false },
    { id: 'c3', name: '台北101觀景台', stamped: false },
    { id: 'c4', name: '北門郵局', stamped: false },
    { id: 'c5', name: '松山文創園區', stamped: false },
    { id: 'c6', name: '華山1914文創園區', stamped: false }
  ]
};

let appData = JSON.parse(localStorage.getItem('taipeiFullMrtStamps')) || defaultState;

const stationLayer = document.getElementById('stationLayer');
const stationChecklist = document.getElementById('stationChecklist');
const spotList = document.getElementById('spotList');
const progressText = document.getElementById('progressText');
const editBtn = document.getElementById('editBtn');
const editBanner = document.getElementById('editBanner');
const addSpotForm = document.getElementById('addSpotForm');

// 單一框框拖曳狀態變數
let draggingPinState = null;

function saveData() {
  localStorage.setItem('taipeiFullMrtStamps', JSON.stringify(appData));
  updateProgress();
}

function updateProgress() {
  const totalMrt = ALL_MRT_STATIONS.length;
  const stampedMrt = appData.stampedStations.length;
  const totalCustom = appData.customSpots.length;
  const stampedCustom = appData.customSpots.filter(s => s.stamped).length;

  const current = stampedMrt + stampedCustom;
  const total = totalMrt + totalCustom;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  progressText.textContent = `總進度：${current} / ${total} 站 (${pct}%)`;
}

function setBannerDefaultText() {
  editBanner.innerHTML = `<strong>編輯模式開啟中：</strong>「<b>直接點一下</b>」框框可標記已蓋章；「<b>按住框框拖曳</b>」可直接移動對準車站編號；拖曳空白處可移動整張地圖。`;
}

// 切換編輯模式
editBtn.addEventListener('click', () => {
  isEditMode = !isEditMode;
  document.body.classList.toggle('editing', isEditMode);
  editBtn.classList.toggle('active', isEditMode);
  editBtn.textContent = isEditMode ? '完成編輯' : '編輯地圖';
  editBanner.classList.toggle('hidden', !isEditMode);
  addSpotForm.classList.toggle('hidden', !isEditMode);
  setBannerDefaultText();
  renderAll();
});

// 路線篩選（建議微調對位時可以切單一路線，畫面最乾淨！）
document.getElementById('lineFilter').addEventListener('change', (e) => {
  currentFilter = e.target.value;
  renderAll();
});

function toggleStationStamp(stationId) {
  if (!isEditMode) return;
  const idx = appData.stampedStations.indexOf(stationId);
  if (idx === -1) {
    appData.stampedStations.push(stationId);
  } else {
    appData.stampedStations.splice(idx, 1);
  }
  saveData();
  renderAll();
}

// 渲染地圖上的熱區標籤與下方清單
function renderAll() {
  stationLayer.innerHTML = '';
  stationChecklist.innerHTML = '';

  const filteredStations = ALL_MRT_STATIONS.filter(st => {
    if (currentFilter === 'ALL') return true;
    return st.line === currentFilter || st.id.includes(currentFilter);
  });

  filteredStations.forEach(st => {
    const isStamped = appData.stampedStations.includes(st.id);
    const coords = appData.customCoords[st.id] || { x: st.x, y: st.y };

    // 1. 建立跟車站編號膠囊一樣大的小框框
    const pin = document.createElement('div');
    const isTransfer = st.id.includes('-');
    pin.className = `map-pin ${isTransfer ? 'transfer' : ''} ${isStamped ? 'stamped' : ''}`;
    pin.style.left = `${coords.x}%`;
    pin.style.top = `${coords.y}%`;
    pin.title = `${st.name} (${st.id})`;

    // 滑鼠懸停時在上方提示列顯示這是哪一站，方便找站
    pin.addEventListener('mouseenter', () => {
      if (!isEditMode || draggingPinState) return;
      editBanner.innerHTML = `目前游標指向：<strong>${st.name} (${st.id})</strong> — 點一下切換狀態，或按住直接拖曳對準編號框`;
    });

    pin.addEventListener('mouseleave', () => {
      if (!isEditMode || draggingPinState) return;
      setBannerDefaultText();
    });

    // 按住小框框開始拖曳（阻止觸發底圖平移）
    pin.addEventListener('mousedown', (e) => {
      if (!isEditMode || e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      const rect = stationLayer.getBoundingClientRect();
      const mousePctX = ((e.clientX - rect.left) / rect.width) * 100;
      const mousePctY = ((e.clientY - rect.top) / rect.height) * 100;

      draggingPinState = {
        id: st.id,
        name: st.name,
        pinEl: pin,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        // 記住滑鼠游標與框框中心點的原始差距
        offsetX: coords.x - mousePctX,
        offsetY: coords.y - mousePctY,
        hasMoved: false
      };
      pin.classList.add('dragging');
      editBanner.innerHTML = `正在移動：<strong>${st.name} (${st.id})</strong> — 拖到正確編號框上放開即可自動存檔`;
    });

    stationLayer.appendChild(pin);

    // 2. 建立下方同步清單卡片
    const card = document.createElement('div');
    card.className = `spot-card ${isStamped ? 'stamped' : ''}`;
    card.dataset.line = st.line;
    card.innerHTML = `<span>${st.name}</span><small style="opacity:0.6">${st.id.split('-')[0]}</small>`;

    card.addEventListener('click', () => {
      toggleStationStamp(st.id);
    });

    stationChecklist.appendChild(card);
  });

  renderCustomSpots();
}

// 全域監聽小框框拖曳過程
window.addEventListener('mousemove', (e) => {
  if (!draggingPinState) return;

  const dx = e.clientX - draggingPinState.startMouseX;
  const dy = e.clientY - draggingPinState.startMouseY;

  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    draggingPinState.hasMoved = true;
  }

  if (draggingPinState.hasMoved) {
    const rect = stationLayer.getBoundingClientRect();
    const mousePctX = ((e.clientX - rect.left) / rect.width) * 100;
    const mousePctY = ((e.clientY - rect.top) / rect.height) * 100;

    // 加上最初點下去時的偏移量，完全消除跳動
    const pctX = Math.min(Math.max(mousePctX + draggingPinState.offsetX, 0), 100);
    const pctY = Math.min(Math.max(mousePctY + draggingPinState.offsetY, 0), 100);

    draggingPinState.pinEl.style.left = `${pctX.toFixed(2)}%`;
    draggingPinState.pinEl.style.top = `${pctY.toFixed(2)}%`;
    draggingPinState.latestX = parseFloat(pctX.toFixed(2));
    draggingPinState.latestY = parseFloat(pctY.toFixed(2));
  }
});

// 放開滑鼠：若有拖曳就儲存新座標；若只是原地點擊就切換已蓋章狀態
window.addEventListener('mouseup', () => {
  if (!draggingPinState) return;

  const { id, pinEl, hasMoved, latestX, latestY } = draggingPinState;
  pinEl.classList.remove('dragging');
  draggingPinState = null;
  setBannerDefaultText();

  if (hasMoved && latestX !== undefined) {
    appData.customCoords[id] = { x: latestX, y: latestY };
    saveData();
  } else {
    // 原地點擊 -> 切換蓋章狀態
    toggleStationStamp(id);
  }
});

// ==================== 其他景點 ====================
function renderCustomSpots() {
  spotList.innerHTML = '';
  appData.customSpots.forEach(spot => {
    const card = document.createElement('div');
    card.className = `spot-card ${spot.stamped ? 'stamped' : ''}`;

    const label = document.createElement('span');
    label.textContent = spot.name;
    card.appendChild(label);

    card.addEventListener('click', () => {
      if (!isEditMode) return;
      spot.stamped = !spot.stamped;
      saveData();
      renderCustomSpots();
    });

    if (isEditMode) {
      const delBtn = document.createElement('button');
      delBtn.textContent = '刪除';
      delBtn.className = 'delete-btn';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        appData.customSpots = appData.customSpots.filter(s => s.id !== spot.id);
        saveData();
        renderCustomSpots();
      });
      card.appendChild(delBtn);
    }

    spotList.appendChild(card);
  });
}

function addNewSpot() {
  const input = document.getElementById('newSpotInput');
  const name = input.value.trim();
  if (!name) return;

  appData.customSpots.push({
    id: 'c_' + Date.now(),
    name: name,
    stamped: false
  });
  input.value = '';
  saveData();
  renderCustomSpots();
}

document.getElementById('addSpotBtn').addEventListener('click', addNewSpot);
document.getElementById('newSpotInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addNewSpot();
});

// ==================== 整張地圖縮放與平移 ====================
const mapViewport = document.getElementById('mapViewport');
const mapCanvas = document.getElementById('mapCanvas');
let scale = 1, translateX = 0, translateY = 0, isPanningMap = false, panStartX = 0, panStartY = 0;

function updateTransform() {
  mapCanvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

document.getElementById('zoomInBtn').addEventListener('click', () => {
  scale = Math.min(scale + 0.35, 4);
  updateTransform();
});

document.getElementById('zoomOutBtn').addEventListener('click', () => {
  scale = Math.max(scale - 0.35, 0.6);
  updateTransform();
});

document.getElementById('zoomResetBtn').addEventListener('click', () => {
  scale = 1; translateX = 0; translateY = 0;
  updateTransform();
});

mapViewport.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.18 : 0.18;
  scale = Math.min(Math.max(scale + delta, 0.6), 4);
  updateTransform();
});

mapViewport.addEventListener('mousedown', (e) => {
  if (draggingPinState) return;
  isPanningMap = true;
  panStartX = e.clientX - translateX;
  panStartY = e.clientY - translateY;
});

window.addEventListener('mousemove', (e) => {
  if (!isPanningMap || draggingPinState) return;
  translateX = e.clientX - panStartX;
  translateY = e.clientY - panStartY;
  updateTransform();
});

window.addEventListener('mouseup', () => { isPanningMap = false; });

// ==================== JSON 備份匯出/匯入（含自訂座標） ====================
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `taipei-mrt-stamps-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
});

const importFile = document.getElementById('importFile');
document.getElementById('importBtn').addEventListener('click', () => importFile.click());
importFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (Array.isArray(parsed.stampedStations)) {
        appData = parsed;
        saveData();
        renderAll();
        alert('集章紀錄與對位座標還原成功！');
      }
    } catch {
      alert('檔案格式錯誤');
    }
  };
  reader.readAsText(file);
});

// 初始化
renderAll();
updateProgress();