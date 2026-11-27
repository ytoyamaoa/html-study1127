const canvas = document.getElementById("chartCanvas");
const ctx = canvas.getContext("2d");

// UI要素の取得
const lineWidthRange = document.getElementById("lineWidthRange");
const lineWidthValue = document.getElementById("lineWidthValue");
const fillToggle = document.getElementById("fillToggle");
const pointToggle = document.getElementById("pointToggle");
const presetBtn = document.getElementById("presetBtn");
const randomBtn = document.getElementById("randomBtn");

// グラフ用データ（0〜100の範囲）
const presets = [
  [25, 45, 38, 72, 65, 90, 82],
  [80, 60, 40, 30, 50, 75, 95],
  [15, 30, 60, 55, 40, 68, 50]
];
let presetIndex = 0;
let data = [...presets[0]];

// 描画エリアの余白設定
const padding = 40;
const chartWidth = canvas.width - padding * 2;
const chartHeight = canvas.height - padding * 2;

// 配列の値（0〜100）をCanvas上の (x, y) 座標に変換する関数
function getCoordinates(values) {
  const stepX = chartWidth / (values.length - 1);
  return values.map((val, index) => {
    const x = padding + stepX * index;
    // Canvasは下がプラスなので、最大値100から引いて上下を反転させる
    const y = padding + chartHeight * (1 - val / 100);
    return { x, y, val };
  });
}

// 背景の補助線（グリッド）を描く関数
function drawGrid() {
  ctx.save();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#64748b";

  for (let i = 0; i <= 4; i++) {
    const ratio = i / 4;
    const y = padding + chartHeight * ratio;
    const label = Math.round(100 * (1 - ratio));

    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();

    ctx.fillText(String(label), 10, y + 4);
  }
  ctx.restore();
}

// メインの描画関数
function draw() {
  // 1. 前の描画内容をすべて消去する
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. 背景グリッドを描く
  drawGrid();

  const points = getCoordinates(data);
  const bottomY = padding + chartHeight;

  // 3. エリアの塗りつぶし（closePath + fill の応用）
  if (fillToggle.checked) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, bottomY); // 左下の基準点から開始
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, bottomY); // 右下の基準点へ下ろす
    ctx.closePath();
    ctx.fillStyle = "rgba(37, 99, 235, 0.18)";
    ctx.fill();
  }

  // 4. 折れ線の描画
  ctx.beginPath();
  points.forEach((p, index) => {
    if (index === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  });
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = Number(lineWidthRange.value);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  // 5. 各頂点の丸印と数値ラベルの描画
  if (pointToggle.checked) {
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#1d4ed8";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#1e293b";
      ctx.font = "12px sans-serif";
      ctx.fillText(String(p.val), p.x - 8, p.y - 10);
    });
  }
}

// イベントリスナー登録（UI操作のたびに再描画）
lineWidthRange.addEventListener("input", () => {
  lineWidthValue.textContent = lineWidthRange.value;
  draw();
});

fillToggle.addEventListener("change", draw);
pointToggle.addEventListener("change", draw);

presetBtn.addEventListener("click", () => {
  presetIndex = (presetIndex + 1) % presets.length;
  data = [...presets[presetIndex]];
  draw();
});

randomBtn.addEventListener("click", () => {
  data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 91) + 5);
  draw();
});

// 初回描画
draw();
