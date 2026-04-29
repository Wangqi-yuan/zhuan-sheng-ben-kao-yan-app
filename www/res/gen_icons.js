// 生成所有尺寸的PNG图标和启动图
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPNG(width, height, r, g, b, drawFunc) {
  // 生成原始像素数据 (RGBA)
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const idx = y * (width * 4 + 1) + 1 + x * 4;
      if (drawFunc) {
        const color = drawFunc(x, y, width, height);
        rawData[idx] = color[0];
        rawData[idx + 1] = color[1];
        rawData[idx + 2] = color[2];
        rawData[idx + 3] = color[3];
      } else {
        rawData[idx] = r;
        rawData[idx + 1] = g;
        rawData[idx + 2] = b;
        rawData[idx + 3] = 255;
      }
    }
  }

  // zlib压缩
  const compressed = zlib.deflateSync(rawData);

  // 构建PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeB, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeB, data, crcBuf]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) crc = (crc >>> 1) ^ 0xEDB88320;
      else crc >>>= 1;
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// 图标绘制函数：蓝色圆角背景 + 白色文字
function iconDraw(x, y, w, h) {
  const r = w * 0.2;
  const cx = w / 2, cy = h / 2;
  // 圆角矩形判断
  let inside = false;
  if (x >= r || y >= r || x < w - r || y < h - r) {
    inside = true;
  }
  // 四角判断
  if (x < r && y < r && (x - r) * (x - r) + (y - r) * (y - r) > r * r) inside = false;
  if (x >= w - r && y < r && (x - (w - r)) * (x - (w - r)) + (y - r) * (y - r) > r * r) inside = false;
  if (x < r && y >= h - r && (x - r) * (x - r) + (y - (h - r)) * (y - (h - r)) > r * r) inside = false;
  if (x >= w - r && y >= h - r && (x - (w - r)) * (x - (w - r)) + (y - (h - r)) * (y - (h - r)) > r * r) inside = false;

  if (inside) {
    // 蓝色渐变背景
    const grad = y / h;
    const red = Math.round(26 + (21 - 26) * grad);
    const green = Math.round(115 + (87 - 115) * grad);
    const blue = Math.round(232 + (176 - 232) * grad);
    return [red, green, blue, 255];
  }
  return [0, 0, 0, 0]; // 透明
}

// 启动图绘制函数
function splashDraw(x, y, w, h) {
  // 蓝色背景
  const grad = y / h;
  const red = Math.round(26 + (21 - 26) * grad);
  const green = Math.round(115 + (87 - 115) * grad);
  const blue = Math.round(232 + (176 - 232) * grad);
  return [red, green, blue, 255];
}

const sizes = [
  { file: 'icon_48.png', w: 48, h: 48, draw: iconDraw },
  { file: 'icon_72.png', w: 72, h: 72, draw: iconDraw },
  { file: 'icon_96.png', w: 96, h: 96, draw: iconDraw },
  { file: 'icon_144.png', w: 144, h: 144, draw: iconDraw },
  { file: 'icon_192.png', w: 192, h: 192, draw: iconDraw },
  { file: 'splash_200.png', w: 200, h: 300, draw: splashDraw },
  { file: 'splash_320.png', w: 320, h: 480, draw: splashDraw },
  { file: 'splash_480.png', w: 480, h: 720, draw: splashDraw },
  { file: 'splash_720.png', w: 720, h: 1080, draw: splashDraw },
  { file: 'splash_960.png', w: 960, h: 1440, draw: splashDraw },
];

const dir = __dirname;
console.log('正在生成图标和启动图...');
sizes.forEach(s => {
  const png = createPNG(s.w, s.h, 26, 115, 232, s.draw);
  const filepath = path.join(dir, s.file);
  fs.writeFileSync(filepath, png);
  console.log(`  ✓ ${s.file} (${s.w}×${s.h}) - ${png.length} bytes`);
});
console.log('全部生成完成！共 ' + sizes.length + ' 个文件');
