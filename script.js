const canvas = document.getElementById("polygonCanvas");
const ctx = canvas.getContext("2d");

const sidesRange = document.getElementById("sidesRange");
const sidesValue = document.getElementById("sidesValue");
const showGuideToggle = document.getElementById("showGuideToggle");
const fillPolygonToggle = document.getElementById("fillPolygonToggle");

// キャンバスの中心と正多角形の半径
const cx = canvas.width / 2;
const cy = canvas.height / 2;
const radius = 120;

// 頂点数と開始角度から、各頂点の (x, y) 座標配列を計算する関数
function getPolygonVertices(sides, startAngle = -Math.PI / 2) {
  const vertices = [];
  const stepAngle = (Math.PI * 2) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + stepAngle * i;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    vertices.push({ x, y });
  }

  return vertices;
}

// 外接円と中心から各頂点への補助線を描く関数
function drawGuides(vertices) {
  ctx.save();

  // 外接円（破線）
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 中心から各頂点への線分
  ctx.setLineDash([]);
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  vertices.forEach((v) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(v.x, v.y);
    ctx.stroke();
  });

  // 中心点
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = "#475569";
  ctx.fill();

  ctx.restore();
}

// 正多角形を描画するメイン関数
function drawPolygon() {
  const sides = Number(sidesRange.value);
  sidesValue.textContent = String(sides);

  // 前の描画を消去
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const vertices = getPolygonVertices(sides);

  // 補助線を描画
  if (showGuideToggle.checked) {
    drawGuides(vertices);
  }

  // 正多角形のパスを作成
  ctx.beginPath();
  vertices.forEach((v, index) => {
    if (index === 0) {
      ctx.moveTo(v.x, v.y);
    } else {
      ctx.lineTo(v.x, v.y);
    }
  });
  ctx.closePath();

  // 内側の塗りつぶし
  if (fillPolygonToggle.checked) {
    ctx.fillStyle = "rgba(59, 130, 246, 0.22)";
    ctx.fill();
  }

  // 枠線の描画
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.stroke();

  // 頂点マーカーの描画
  vertices.forEach((v) => {
    ctx.beginPath();
    ctx.arc(v.x, v.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// スライダーやチェックボックスの変更時に再描画
sidesRange.addEventListener("input", drawPolygon);
showGuideToggle.addEventListener("change", drawPolygon);
fillPolygonToggle.addEventListener("change", drawPolygon);

// 初期描画
drawPolygon();
