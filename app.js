let isEditMode = false;

const defaultState = {
  // 儲存使用者在地圖上點擊建立的印記：{ id, x, y, isTransfer }
  mapPins: [],
  customSpots: [
    { id: 'c1', name: '台北市立動物園', stamped: false },
    { id: 'c2', name: '國立故宮博物院', stamped: false },
    { id: 'c3', name: '台北101觀景台', stamped: false },
    { id: 'c4', name: '北門郵局', stamped: false },
    { id: 'c5', name: '松山文創園區', stamped: false },
    { id: 'c6', name: '華山1914文創園區', stamped: false }
  ]
};

let appData = JSON.parse(localStorage.getItem('taipeiStampPinMap_v1')) || defaultState;

const stationLayer = document.getElementById('stationLayer');
const spotList = document.getElementById('spotList');
const progressText = document.getElementById('progressText');
const modeHintText = document.getElementById('modeHintText');
const editBtn = document.getElementById('editBtn');
const editBanner = document.getElementById('editBanner');
const addSpotForm = document.getElementById('addSpotForm');

let draggingPinState = null;
let panMoved = false;

function saveData() {
  localStorage.setItem('taipeiStampPinMap_v1', JSON.stringify(appData));
  updateProgress();
}

function updateProgress() {
  const mrtCount = appData.mapPins.length;
  const customCount = appData.customSpots.filter(s => s.stamped).length;
  const totalCustom = appData.customSpots.length;

  progressText.textContent = `已蒐集：捷運 ${mrtCount} 站 ＋ 景點 ${customCount}/${totalCustom} 處`;
}

// 切換編輯模式
editBtn.addEventListener('click', () => {
  isEditMode = !isEditMode;
  document.body.classList.toggle('editing', isEditMode);
  editBtn.classList.toggle('active', isEditMode);
  editBtn.textContent = isEditMode ? '完成編輯' : '編輯地圖';
  editBanner.classList.toggle('hidden', !isEditMode);
  addSpotForm.classList.toggle('hidden', !isEditMode);
  modeHintText.textContent = isEditMode
    ? '編輯中：點底圖新增印記（按住 Shift 點擊可建雙格轉乘寬印記），點已有印記可移除'
    : '目前為瀏覽模式（灰色標記代表已蓋章）';
  renderPins();
  renderCustomSpots();
});

// 渲染地圖上的所有印記
function renderPins() {
  stationLayer.innerHTML = '';

  appData.mapPins.forEach(pinData => {
    const pin = document.createElement('div');
    pin.className = `map-pin ${pinData.isTransfer ? 'transfer' : ''}`;
    pin.style.left = `${pinData.x}%`;
    pin.style.top = `${pinData.y}%`;
    pin.title = '點一下取消此印記，或按住拖曳微調位置';

    // 按住已有印記：可微調位置；原地點一下：移除此印記
    pin.addEventListener('mousedown', (e) => {
      if (!isEditMode || e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      const rect = stationLayer.getBoundingClientRect();
      const mousePctX = ((e.clientX - rect.left) / rect.width) * 100;
      const mousePctY = ((e.clientY - rect.top) / rect.height) * 100;

      draggingPinState = {
        pinObj: pinData,
        pinEl: pin,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        offsetX: pinData.x - mousePctX,
        offsetY: pinData.y - mousePctY,
        hasMoved: false
      };
      pin.classList.add('dragging');
    });

    stationLayer.appendChild(pin);
  });
}

// 點擊底圖空白處 -> 在游標正中心新增一個印記
stationLayer.addEventListener('click', (e) => {
  if (!isEditMode || panMoved) return;
  if (e.target !== stationLayer) return;

  const rect = stationLayer.getBoundingClientRect();
  const pctX = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
  const pctY = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

  appData.mapPins.push({
    id: 'p_' + Date.now(),
    x: pctX,
    y: pctY,
    isTransfer: e.shiftKey // 若按住 Shift 點擊，建立雙格轉乘站寬度
  });

  saveData();
  renderPins();
});

// 全域監聽印記微調拖曳
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

    const pctX = Math.min(Math.max(mousePctX + draggingPinState.offsetX, 0), 100);
    const pctY = Math.min(Math.max(mousePctY + draggingPinState.offsetY, 0), 100);

    draggingPinState.pinEl.style.left = `${pctX.toFixed(2)}%`;
    draggingPinState.pinEl.style.top = `${pctY.toFixed(2)}%`;
    draggingPinState.latestX = parseFloat(pctX.toFixed(2));
    draggingPinState.latestY = parseFloat(pctY.toFixed(2));
  }
});

window.addEventListener('mouseup', () => {
  if (!draggingPinState) return;

  const { pinObj, pinEl, hasMoved, latestX, latestY } = draggingPinState;
  pinEl.classList.remove('dragging');
  draggingPinState = null;

  if (hasMoved && latestX !== undefined) {
    pinObj.x = latestX;
    pinObj.y = latestY;
    saveData();
  } else {
    // 原地點一下已存在的印記 -> 取消/移除該站印記
    appData.mapPins = appData.mapPins.filter(p => p.id !== pinObj.id);
    saveData();
    renderPins();
  }
});

// ==================== 台北市其他景點 ====================
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
  panMoved = false;
  panStartX = e.clientX - translateX;
  panStartY = e.clientY - translateY;
});

window.addEventListener('mousemove', (e) => {
  if (!isPanningMap || draggingPinState) return;
  const dx = e.clientX - (panStartX + translateX);
  const dy = e.clientY - (panStartY + translateY);
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) panMoved = true;

  translateX = e.clientX - panStartX;
  translateY = e.clientY - panStartY;
  updateTransform();
});

window.addEventListener('mouseup', () => { isPanningMap = false; });

// ==================== JSON 備份匯出/匯入 ====================
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
      if (Array.isArray(parsed.mapPins)) {
        appData = parsed;
        saveData();
        renderPins();
        renderCustomSpots();
        alert('集章紀錄還原成功！');
      }
    } catch {
      alert('檔案格式錯誤');
    }
  };
  reader.readAsText(file);
});

// 初始化
renderPins();
renderCustomSpots();
updateProgress();