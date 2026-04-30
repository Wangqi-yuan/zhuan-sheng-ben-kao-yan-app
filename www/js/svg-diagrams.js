/**
 * 专升本工程力学 — SVG图解库
 * 所有函数返回标准SVG字符串，零外部依赖
 * 适配手机屏幕：viewBox 0 0 400 250
 */
(function() {
  'use strict';

  // ==================== 工具函数 ====================
  function svg(el) { return el; } // pass-through for readability

  function attrs(obj) {
    var parts = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) parts.push(k + '="' + obj[k] + '"');
    }
    return parts.join(' ');
  }

  var COLORS = {
    structural: '#1a1a1a',
    forceArrow: '#d50000',
    reactionForce: '#1a73e8',
    dimension: '#666666',
    fillLight: '#f5f5f5',
    fillBlue: '#e3f2fd',
    fillRed: '#fce4ec',
    accent: '#ff6d00'
  };

  function arrowMarker(id, color) {
    return '<defs><marker id="' + id + '" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="' + (color || COLORS.forceArrow) + '"/></marker></defs>';
  }

  // 受力箭头：x1,y1→x2,y2
  function forceArrow(x1, y1, x2, y2, label, color, markerId) {
    color = color || COLORS.forceArrow;
    markerId = markerId || 'arrowRed';
    var html = arrowMarker(markerId, color);
    html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="2" marker-end="url(#' + markerId + ')"/>';
    if (label) {
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 10;
      html += '<text x="' + mx + '" y="' + my + '" text-anchor="middle" font-size="11" fill="' + color + '">' + label + '</text>';
    }
    return html;
  }

  // 标注尺寸线
  function dimLine(x1, y1, x2, y2, label, offset) {
    offset = offset || 18;
    var html = '';
    html += '<line x1="' + x1 + '" y1="' + (y1 + offset) + '" x2="' + x2 + '" y2="' + (y2 + offset) + '" stroke="' + COLORS.dimension + '" stroke-width="1" stroke-dasharray="4,3"/>';
    html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + (y1 + offset + 8) + '" stroke="' + COLORS.dimension + '" stroke-width="0.8"/>';
    html += '<line x1="' + x2 + '" y1="' + y2 + '" x2="' + x2 + '" y2="' + (y2 + offset + 8) + '" stroke="' + COLORS.dimension + '" stroke-width="0.8"/>';
    if (label) {
      html += '<text x="' + ((x1 + x2) / 2) + '" y="' + (y1 + offset + 14) + '" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">' + label + '</text>';
    }
    return html;
  }

  // SVG包装器
  function wrapSvg(inner, w, h, vb) {
    w = w || 400; h = h || 250; vb = vb || '0 0 ' + w + ' ' + h;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="' + w + '" height="' + h + '" style="max-width:100%;height:auto">' + inner + '</svg>';
  }

  // ==================== 1. 压杆失稳模态图 ====================

  function bucklingPinnedPinned(opts) {
    opts = opts || {};
    var L = opts.L || 'l', mu = opts.mu || 'μ=1.0';
    var inner = '';
    // 两端铰支座三角形
    inner += '<polygon points="80,220 120,220 100,235" fill="' + COLORS.structural + '"/>';
    inner += '<polygon points="320,220 360,220 340,235" fill="' + COLORS.structural + '"/>';
    // 铰支座圆圈
    inner += '<circle cx="100" cy="222" r="5" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="340" cy="222" r="5" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 细长杆（弯曲变形 — 正弦半波）
    inner += '<path d="M100,220 Q220,80 340,220" fill="none" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    // 原始直线（虚线）
    inner += '<line x1="100" y1="220" x2="340" y2="220" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="6,4"/>';
    // 标注
    inner += '<text x="220" y="60" text-anchor="middle" font-size="13" font-weight="bold" fill="' + COLORS.structural + '">' + mu + '</text>';
    inner += '<text x="220" y="252" text-anchor="middle" font-size="12" fill="' + COLORS.dimension + '">两端铰支</text>';
    dimLine(90, 235, 350, 235, L, 8);
    return wrapSvg(inner);
  }

  function bucklingFixedFree(opts) {
    opts = opts || {};
    var L = opts.L || 'l', mu = opts.mu || 'μ=2.0';
    var inner = '';
    // 固定端（墙体阴影）
    inner += '<rect x="90" y="160" width="20" height="80" fill="' + COLORS.dimension + '" opacity="0.4"/>';
    inner += '<line x1="110" y1="160" x2="110" y2="240" stroke="' + COLORS.structural + '" stroke-width="3"/>';
    // 杆（弯曲变形 — 1/4正弦波）
    inner += '<path d="M110,240 Q250,80 350,100" fill="none" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    // 原始直线
    inner += '<line x1="110" y1="240" x2="350" y2="100" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="6,4"/>';
    inner += '<text x="250" y="55" text-anchor="middle" font-size="13" font-weight="bold" fill="' + COLORS.structural + '">' + mu + '</text>';
    inner += '<text x="230" y="260" text-anchor="middle" font-size="12" fill="' + COLORS.dimension + '">一端固定一端自由</text>';
    return wrapSvg(inner);
  }

  function bucklingFixedFixed(opts) {
    opts = opts || {};
    var L = opts.L || 'l', mu = opts.mu || 'μ=0.5';
    var inner = '';
    // 两端固定端
    inner += '<rect x="80" y="160" width="18" height="80" fill="' + COLORS.dimension + '" opacity="0.4"/>';
    inner += '<rect x="340" y="160" width="18" height="80" fill="' + COLORS.dimension + '" opacity="0.4"/>';
    // 杆（弯曲变形 — 1.5个正弦半波，两端有反弯点）
    inner += '<path d="M98,190 Q180,120 220,220 Q260,80 340,190" fill="none" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    // 原始直线
    inner += '<line x1="98" y1="190" x2="340" y2="190" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="6,4"/>';
    inner += '<text x="220" y="55" text-anchor="middle" font-size="13" font-weight="bold" fill="' + COLORS.structural + '">' + mu + '</text>';
    inner += '<text x="220" y="260" text-anchor="middle" font-size="12" fill="' + COLORS.dimension + '">两端固定</text>';
    dimLine(85, 245, 355, 245, L, 8);
    return wrapSvg(inner);
  }

  function bucklingFixedPinned(opts) {
    opts = opts || {};
    var mu = opts.mu || 'μ=0.7';
    var inner = '';
    // 固定端
    inner += '<rect x="80" y="160" width="18" height="80" fill="' + COLORS.dimension + '" opacity="0.4"/>';
    // 铰支座
    inner += '<polygon points="320,220 360,220 340,235" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="340" cy="222" r="5" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 杆（弯曲变形 — 约1.2个正弦半波）
    inner += '<path d="M98,190 Q220,110 280,200 Q320,140 340,220" fill="none" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    inner += '<line x1="98" y1="190" x2="340" y2="220" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="6,4"/>';
    inner += '<text x="220" y="55" text-anchor="middle" font-size="13" font-weight="bold" fill="' + COLORS.structural + '">' + mu + '</text>';
    inner += '<text x="220" y="260" text-anchor="middle" font-size="12" fill="' + COLORS.dimension + '">一端固定一端铰支</text>';
    return wrapSvg(inner);
  }

  function bucklingCompare(opts) {
    opts = opts || {};
    var inner = '';
    inner += '<text x="200" y="20" text-anchor="middle" font-size="13" font-weight="bold" fill="' + COLORS.structural + '">压杆失稳模态对比</text>';
    // 分两栏
    // 左：铰支
    inner += '<polygon points="30,200 70,200 50,215" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="50" cy="202" r="4" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<path d="M50,200 Q120,100 190,200" fill="none" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    inner += '<line x1="50" y1="200" x2="190" y2="200" stroke="' + COLORS.dimension + '" stroke-width="0.6" stroke-dasharray="5,3"/>';
    inner += '<text x="120" y="90" text-anchor="middle" font-size="11" fill="' + COLORS.accent + '">μ=1.0</text>';
    // 右：固定-自由
    inner += '<rect x="250" y="135" width="15" height="65" fill="' + COLORS.dimension + '" opacity="0.4"/>';
    inner += '<path d="M265,200 Q340,100 380,105" fill="none" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    inner += '<line x1="265" y1="200" x2="380" y2="105" stroke="' + COLORS.dimension + '" stroke-width="0.6" stroke-dasharray="5,3"/>';
    inner += '<text x="340" y="85" text-anchor="middle" font-size="11" fill="' + COLORS.accent + '">μ=2.0</text>';
    // 标注
    inner += '<text x="120" y="230" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">两端铰支</text>';
    inner += '<text x="320" y="230" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">一端固定一端自由</text>';
    return wrapSvg(inner);
  }

  // ==================== 2. 支座受力简图 ====================

  function supportFixedHinge(opts) {
    opts = opts || {};
    var inner = '';
    // 上部结构连接
    inner += '<rect x="180" y="60" width="40" height="40" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 铰支座三角形
    inner += '<polygon points="170,130 230,130 200,155" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="200" cy="108" r="6" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 底部线
    inner += '<line x1="150" y1="155" x2="250" y2="155" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 斜线（地面标记）
    for (var i = 0; i < 4; i++) {
      inner += '<line x1="' + (155 + i * 28) + '" y1="155" x2="' + (145 + i * 28) + '" y2="170" stroke="' + COLORS.structural + '" stroke-width="1.2"/>';
    }
    // 反力Fx, Fy
    inner += forceArrow(200, 80, 250, 80, 'F_x', COLORS.reactionForce, 'arrowBlue');
    inner += forceArrow(200, 80, 200, 40, 'F_y', COLORS.reactionForce, 'arrowBlue');
    inner += '<text x="200" y="190" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">固定铰支座</text>';
    return wrapSvg(inner);
  }

  function supportRoller(opts) {
    opts = opts || {};
    var inner = '';
    inner += '<rect x="180" y="50" width="40" height="40" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 辊轴（圆圈）
    inner += '<circle cx="185" cy="135" r="8" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="215" cy="135" r="8" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 底部线
    inner += '<line x1="150" y1="148" x2="250" y2="148" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    for (var i = 0; i < 4; i++) {
      inner += '<line x1="' + (155 + i * 28) + '" y1="148" x2="' + (145 + i * 28) + '" y2="163" stroke="' + COLORS.structural + '" stroke-width="1.2"/>';
    }
    // 反力（仅垂直方向）
    inner += forceArrow(200, 70, 200, 30, 'F_y', COLORS.reactionForce, 'arrowBlue');
    inner += '<text x="200" y="185" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">活动铰支座（辊轴）</text>';
    return wrapSvg(inner);
  }

  function supportFixedEnd(opts) {
    opts = opts || {};
    var inner = '';
    inner += '<rect x="170" y="60" width="60" height="80" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 固定端墙体
    inner += '<rect x="100" y="50" width="30" height="120" fill="' + COLORS.dimension + '" opacity="0.5"/>';
    inner += '<line x1="130" y1="50" x2="130" y2="170" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    // 斜线（墙体填充）
    for (var i = 0; i < 6; i++) {
      inner += '<line x1="102" y1="' + (55 + i * 20) + '" x2="128" y2="' + (50 + i * 20) + '" stroke="' + COLORS.structural + '" stroke-width="0.8"/>';
    }
    // 三个约束反力
    inner += forceArrow(200, 80, 260, 80, 'F_x', COLORS.reactionForce, 'arrowBlue');
    inner += forceArrow(200, 80, 200, 30, 'F_y', COLORS.reactionForce, 'arrowBlue');
    // 力偶矩M（弧形箭头）
    inner += '<path d="M250,120 Q270,100 280,130 Q290,160 260,150" fill="none" stroke="' + COLORS.reactionForce + '" stroke-width="1.8"/>';
    inner += '<text x="295" y="140" font-size="11" fill="' + COLORS.reactionForce + '">M</text>';
    inner += '<text x="200" y="195" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">固定端支座</text>';
    return wrapSvg(inner);
  }

  function supportCable(opts) {
    opts = opts || {};
    var inner = '';
    // 物体
    inner += '<rect x="160" y="120" width="80" height="60" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 柔索
    inner += '<path d="M200,120 Q195,80 200,50 Q205,20 200,20" fill="none" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 拉力箭头（沿柔索方向，背离物体）
    inner += forceArrow(200, 80, 200, 50, 'T', COLORS.forceArrow, 'arrowRed');
    inner += '<text x="200" y="200" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">柔索约束（只能受拉）</text>';
    return wrapSvg(inner);
  }

  // ==================== 3. 截面几何图 ====================

  function sectionRectangular(opts) {
    opts = opts || {};
    var b = opts.b || 'b', h = opts.h || 'h';
    var inner = '';
    // 矩形截面
    inner += '<rect x="140" y="60" width="120" height="100" fill="' + COLORS.fillBlue + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 尺寸标注
    dimLine(140, 160, 260, 160, b, 10);
    // 高度标注（左侧）
    inner += '<line x1="125" y1="60" x2="125" y2="160" stroke="' + COLORS.dimension + '" stroke-width="0.8"/>';
    inner += '<line x1="120" y1="60" x2="130" y2="60" stroke="' + COLORS.dimension + '" stroke-width="0.8"/>';
    inner += '<line x1="120" y1="160" x2="130" y2="160" stroke="' + COLORS.dimension + '" stroke-width="0.8"/>';
    inner += '<text x="112" y="115" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '" transform="rotate(-90,112,115)">' + h + '</text>';
    // 形心标记
    inner += '<circle cx="200" cy="110" r="3" fill="' + COLORS.accent + '"/>';
    inner += '<text x="210" y="112" font-size="10" fill="' + COLORS.accent + '">C</text>';
    // 中性轴z
    inner += '<line x1="130" y1="110" x2="270" y2="110" stroke="' + COLORS.accent + '" stroke-width="1" stroke-dasharray="5,3"/>';
    inner += '<text x="275" y="113" font-size="10" fill="' + COLORS.accent + '">z</text>';
    // 公式
    inner += '<text x="200" y="195" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">I_z=bh³/12, W_z=bh²/6</text>';
    return wrapSvg(inner);
  }

  function sectionCircular(opts) {
    opts = opts || {};
    var d = opts.d || 'd';
    var inner = '';
    inner += '<circle cx="200" cy="120" r="60" fill="' + COLORS.fillBlue + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 直径线
    inner += '<line x1="140" y1="120" x2="260" y2="120" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="4,3"/>';
    inner += dimLine(140, 120, 260, 120, d, 22);
    // 形心
    inner += '<circle cx="200" cy="120" r="3" fill="' + COLORS.accent + '"/>';
    inner += '<text x="210" y="122" font-size="10" fill="' + COLORS.accent + '">C</text>';
    // 中性轴
    inner += '<line x1="130" y1="120" x2="270" y2="120" stroke="' + COLORS.accent + '" stroke-width="1" stroke-dasharray="5,3"/>';
    // 公式
    inner += '<text x="200" y="200" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">I_z=πd⁴/64, W_z=πd³/32</text>';
    return wrapSvg(inner);
  }

  function sectionHollowCircular(opts) {
    opts = opts || {};
    var D = opts.D || 'D', d = opts.d || 'd';
    var inner = '';
    // 外圆
    inner += '<circle cx="200" cy="120" r="65" fill="' + COLORS.fillBlue + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 内圆
    inner += '<circle cx="200" cy="120" r="30" fill="#fff" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 尺寸标注
    inner += dimLine(135, 120, 265, 120, D, 26);
    inner += dimLine(170, 120, 230, 120, d, -18);
    // 形心
    inner += '<circle cx="200" cy="120" r="3" fill="' + COLORS.accent + '"/>';
    // 公式
    inner += '<text x="200" y="205" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">α=d/D, W_t=(πD³/16)(1-α⁴)</text>';
    return wrapSvg(inner);
  }

  // ==================== 4. 梁加载图 ====================

  function beamSimplePoint(opts) {
    opts = opts || {};
    var L = opts.L || 'l', P = opts.P || 'P', a = opts.a || 'a', b = opts.b || 'b';
    var inner = '';
    // 支座
    inner += '<polygon points="80,170 120,170 100,185" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="100" cy="172" r="4" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="320" cy="172" r="7" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="335" cy="172" r="7" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<line x1="300" y1="185" x2="340" y2="185" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 梁
    inner += '<rect x="100" y="155" width="220" height="12" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 集中力
    inner += forceArrow(200, 70, 200, 155, P, COLORS.forceArrow, 'arrowRed');
    // 反力
    inner += forceArrow(100, 185, 100, 210, 'R_A', COLORS.reactionForce, 'arrowBlue');
    inner += forceArrow(320, 185, 320, 210, 'R_B', COLORS.reactionForce, 'arrowBlue');
    // 尺寸
    dimLine(100, 175, 200, 175, a, 8);
    dimLine(200, 175, 320, 175, b, 8);
    dimLine(100, 210, 320, 210, L, 8);
    return wrapSvg(inner);
  }

  function beamSimpleUniform(opts) {
    opts = opts || {};
    var L = opts.L || 'l', q = opts.q || 'q';
    var inner = '';
    // 支座
    inner += '<polygon points="70,170 110,170 90,185" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="90" cy="172" r="4" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="310" cy="172" r="7" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="325" cy="172" r="7" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<line x1="290" y1="185" x2="330" y2="185" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 梁
    inner += '<rect x="90" y="155" width="220" height="14" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 均布荷载（多个小箭头）
    for (var i = 0; i < 9; i++) {
      inner += forceArrow(100 + i * 22, 90, 100 + i * 22, 155, null, COLORS.forceArrow, 'arrowRed');
    }
    // 荷载标注
    inner += '<text x="200" y="75" text-anchor="middle" font-size="12" fill="' + COLORS.forceArrow + '">' + q + '</text>';
    // 反力
    inner += forceArrow(90, 185, 90, 210, 'ql/2', COLORS.reactionForce, 'arrowBlue');
    inner += forceArrow(310, 185, 310, 210, 'ql/2', COLORS.reactionForce, 'arrowBlue');
    dimLine(90, 210, 310, 210, L, 8);
    return wrapSvg(inner);
  }

  function beamCantilever(opts) {
    opts = opts || {};
    var L = opts.L || 'l', P = opts.P || 'P';
    var inner = '';
    // 固定端
    inner += '<rect x="80" y="135" width="18" height="60" fill="' + COLORS.dimension + '" opacity="0.5"/>';
    inner += '<line x1="98" y1="135" x2="98" y2="195" stroke="' + COLORS.structural + '" stroke-width="3"/>';
    for (var i = 0; i < 4; i++) {
      inner += '<line x1="82" y1="' + (140 + i * 15) + '" x2="96" y2="' + (135 + i * 15) + '" stroke="' + COLORS.structural + '" stroke-width="0.8"/>';
    }
    // 梁
    inner += '<rect x="98" y="155" width="250" height="14" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 集中力（自由端）
    inner += forceArrow(348, 140, 348, 162, P, COLORS.forceArrow, 'arrowRed');
    // 固定端反力
    inner += forceArrow(98, 125, 148, 125, 'F_x', COLORS.reactionForce, 'arrowBlue');
    inner += forceArrow(98, 120, 98, 90, 'F_y', COLORS.reactionForce, 'arrowBlue');
    inner += '<text x="160" y="70" font-size="11" fill="' + COLORS.reactionForce + '">M_A</text>';
    inner += '<path d="M120,80 Q140,60 160,90 Q180,120 140,110" fill="none" stroke="' + COLORS.reactionForce + '" stroke-width="1.5"/>';
    dimLine(98, 195, 348, 195, L, 10);
    return wrapSvg(inner);
  }

  function beamMomentCouple(opts) {
    opts = opts || {};
    var L = opts.L || 'l', M = opts.M || 'M';
    var inner = '';
    // 简支梁
    inner += '<polygon points="70,170 110,170 90,185" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="90" cy="172" r="4" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="310" cy="172" r="7" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="325" cy="172" r="7" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<line x1="290" y1="185" x2="330" y2="185" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 梁
    inner += '<rect x="90" y="155" width="220" height="14" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 力偶（弧形箭头）
    inner += '<path d="M200,120 Q230,90 260,130" fill="none" stroke="' + COLORS.forceArrow + '" stroke-width="2"/>';
    inner += '<text x="270" y="125" font-size="12" fill="' + COLORS.forceArrow + '">' + M + '</text>';
    // 反力偶
    inner += '<path d="M80,145 Q60,120 50,145" fill="none" stroke="' + COLORS.reactionForce + '" stroke-width="1.5"/>';
    dimLine(90, 195, 310, 195, L, 8);
    return wrapSvg(inner);
  }

  // ==================== 5. 约束示意图 ====================

  function constraintCable(opts) {
    var inner = '';
    inner += '<rect x="170" y="100" width="60" height="60" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5" rx="4"/>';
    inner += '<path d="M200,100 Q195,60 200,30" fill="none" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    inner += '<text x="200" y="20" text-anchor="middle" font-size="11" fill="' + COLORS.forceArrow + '">T（拉力）</text>';
    inner += '<text x="200" y="185" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">柔索约束</text>';
    return wrapSvg(inner);
  }

  function constraintSmoothSurface(opts) {
    var inner = '';
    // 光滑曲面
    inner += '<path d="M120,160 Q200,80 280,160" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 物块
    inner += '<rect x="175" y="100" width="50" height="40" fill="#fff" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 法线
    inner += '<line x1="200" y1="120" x2="200" y2="158" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="4,3"/>';
    // 反力（沿法线指向物体）
    inner += forceArrow(200, 130, 200, 100, 'F_N', COLORS.reactionForce, 'arrowBlue');
    inner += '<text x="200" y="195" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">光滑面约束（法向压力）</text>';
    return wrapSvg(inner);
  }

  function constraintHinge(opts) {
    var inner = '';
    // 铰链结构
    inner += '<rect x="170" y="40" width="60" height="50" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<rect x="160" y="90" width="80" height="30" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<circle cx="200" cy="75" r="6" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 垂直销轴指示线
    inner += '<line x1="200" y1="69" x2="200" y2="81" stroke="' + COLORS.structural + '" stroke-width="1.2"/>';
    inner += '<circle cx="200" cy="75" r="2" fill="' + COLORS.structural + '"/>';
    // 反力
    inner += forceArrow(200, 50, 250, 50, 'F_x', COLORS.reactionForce, 'arrowBlue');
    inner += forceArrow(200, 50, 200, 25, 'F_y', COLORS.reactionForce, 'arrowBlue');
    inner += '<text x="200" y="145" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">铰链约束（中间铰）</text>';
    return wrapSvg(inner);
  }

  // ==================== 6. 受力图（自由体图） ====================

  function freeBodyBlock(opts) {
    opts = opts || {};
    var inner = '';
    // 物块
    inner += '<rect x="140" y="80" width="80" height="60" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2" rx="3"/>';
    inner += '<text x="180" y="115" text-anchor="middle" font-size="14" fill="' + COLORS.structural + '">G</text>';
    // 重力
    inner += forceArrow(180, 140, 180, 180, 'G', COLORS.forceArrow, 'arrowRed');
    // 支持力
    inner += forceArrow(180, 60, 180, 80, 'F_N', COLORS.reactionForce, 'arrowBlue');
    // 摩擦力（如果有）
    if (opts.showFriction) {
      inner += forceArrow(140, 110, 100, 110, 'F_s', COLORS.accent, 'arrowOrange');
    }
    // 水平推力（如果有）
    if (opts.showPush) {
      inner += forceArrow(220, 110, 260, 110, 'P', COLORS.forceArrow, 'arrowRed');
    }
    return wrapSvg(inner);
  }

  function threeHingedArch(opts) {
    opts = opts || {};
    var inner = '';
    // A支座（固定铰）
    inner += '<polygon points="60,190 100,190 80,205" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="80" cy="192" r="4" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // C铰（中间铰，顶部）
    inner += '<circle cx="200" cy="60" r="5" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // B支座（固定铰）
    inner += '<polygon points="300,190 340,190 320,205" fill="' + COLORS.structural + '"/>';
    inner += '<circle cx="320" cy="192" r="4" fill="none" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // AC拱
    inner += '<path d="M80,192 Q140,30 200,60" fill="none" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    // BC拱
    inner += '<path d="M320,192 Q260,30 200,60" fill="none" stroke="' + COLORS.structural + '" stroke-width="2.5"/>';
    // 标注
    inner += '<text x="60" y="225" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">A</text>';
    inner += '<text x="210" y="50" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">C</text>';
    inner += '<text x="340" y="225" text-anchor="middle" font-size="12" fill="' + COLORS.structural + '">B</text>';
    // 荷载（如果有）
    if (opts.showLoad) {
      inner += forceArrow(150, 100, 150, 140, 'F', COLORS.forceArrow, 'arrowRed');
    }
    inner += '<text x="200" y="240" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">三铰拱结构</text>';
    return wrapSvg(inner);
  }

  function forceDecomposition(opts) {
    opts = opts || {};
    var F = opts.F || 'F', angle = opts.angle || 'α';
    var inner = '';
    // 坐标轴
    inner += '<line x1="100" y1="180" x2="350" y2="180" stroke="' + COLORS.structural + '" stroke-width="1.2"/>';
    inner += '<line x1="120" y1="200" x2="120" y2="40" stroke="' + COLORS.structural + '" stroke-width="1.2"/>';
    inner += '<text x="355" y="183" font-size="11" fill="' + COLORS.structural + '">x</text>';
    inner += '<text x="123" y="35" font-size="11" fill="' + COLORS.structural + '">y</text>';
    // 力F（斜线）
    inner += '<line x1="120" y1="180" x2="280" y2="60" stroke="' + COLORS.forceArrow + '" stroke-width="2.5" marker-end="url(#arrowRed)"/>';
    inner += arrowMarker('arrowRed', COLORS.forceArrow);
    // 水平分量
    inner += '<line x1="120" y1="180" x2="280" y2="180" stroke="' + COLORS.reactionForce + '" stroke-width="1.8" stroke-dasharray="6,3"/>';
    // 垂直分量
    inner += '<line x1="280" y1="180" x2="280" y2="60" stroke="' + COLORS.reactionForce + '" stroke-width="1.8" stroke-dasharray="6,3"/>';
    // 标注
    inner += '<text x="200" y="175" font-size="11" fill="' + COLORS.reactionForce + '">F_x=Fcos' + angle + '</text>';
    inner += '<text x="290" y="125" font-size="11" fill="' + COLORS.reactionForce + '">F_y</text>';
    inner += '<text x="210" y="110" font-size="12" font-weight="bold" fill="' + COLORS.forceArrow + '">' + F + '</text>';
    // 角度弧
    inner += '<path d="M140,180 Q155,170 160,160" fill="none" stroke="' + COLORS.dimension + '" stroke-width="1"/>';
    inner += '<text x="162" y="158" font-size="10" fill="' + COLORS.dimension + '">' + angle + '</text>';
    return wrapSvg(inner);
  }

  // ==================== 7. 特殊图 ====================

  function stressStrainCurve(opts) {
    opts = opts || {};
    var inner = '';
    // 坐标轴
    inner += '<line x1="60" y1="200" x2="350" y2="200" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<line x1="60" y1="200" x2="60" y2="30" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<text x="355" y="205" font-size="11" fill="' + COLORS.structural + '">ε</text>';
    inner += '<text x="45" y="25" font-size="11" fill="' + COLORS.structural + '">σ</text>';
    // σ-ε曲线（低碳钢经典四阶段）
    inner += '<path d="M60,200 L150,190 L155,160 L160,155 L220,150 L300,120 L340,80" fill="none" stroke="' + COLORS.forceArrow + '" stroke-width="2.5"/>';
    // 特征点标注
    inner += '<circle cx="150" cy="190" r="3" fill="' + COLORS.accent + '"/>';
    inner += '<text x="130" y="185" font-size="9" fill="' + COLORS.accent + '">σ_p</text>';
    inner += '<circle cx="155" cy="160" r="3" fill="' + COLORS.accent + '"/>';
    inner += '<text x="140" y="150" font-size="9" fill="' + COLORS.accent + '">σ_e</text>';
    inner += '<circle cx="220" cy="150" r="3" fill="' + COLORS.accent + '"/>';
    inner += '<text x="225" y="148" font-size="9" fill="' + COLORS.accent + '">σ_s</text>';
    inner += '<circle cx="340" cy="80" r="3" fill="' + COLORS.accent + '"/>';
    inner += '<text x="320" y="78" font-size="9" fill="' + COLORS.accent + '">σ_b</text>';
    // 阶段标注
    inner += '<text x="100" y="220" font-size="9" fill="' + COLORS.dimension + '">弹性</text>';
    inner += '<text x="170" y="220" font-size="9" fill="' + COLORS.dimension + '">屈服</text>';
    inner += '<text x="250" y="220" font-size="9" fill="' + COLORS.dimension + '">强化</text>';
    inner += '<text x="310" y="220" font-size="9" fill="' + COLORS.dimension + '">颈缩</text>';
    inner += '<text x="200" y="15" text-anchor="middle" font-size="12" font-weight="bold" fill="' + COLORS.structural + '">低碳钢拉伸σ-ε曲线</text>';
    return wrapSvg(inner);
  }

  function bucklingTotalDiagram(opts) {
    opts = opts || {};
    var inner = '';
    // 坐标轴
    inner += '<line x1="60" y1="30" x2="60" y2="200" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<line x1="60" y1="200" x2="350" y2="200" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    inner += '<text x="40" y="20" font-size="11" fill="' + COLORS.structural + '">σ_cr</text>';
    inner += '<text x="355" y="205" font-size="11" fill="' + COLORS.structural + '">λ</text>';
    // 小柔度区（水平线 σ_s）
    inner += '<line x1="60" y1="170" x2="150" y2="170" stroke="' + COLORS.forceArrow + '" stroke-width="2.5"/>';
    // 中柔度区（斜线 a-bλ）
    inner += '<line x1="150" y1="170" x2="240" y2="100" stroke="' + COLORS.forceArrow + '" stroke-width="2.5"/>';
    // 大柔度区（双曲线 欧拉）
    inner += '<path d="M240,100 Q290,60 340,40" fill="none" stroke="' + COLORS.forceArrow + '" stroke-width="2.5"/>';
    // 分界点
    inner += '<line x1="150" y1="170" x2="150" y2="210" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="4,3"/>';
    inner += '<text x="150" y="222" text-anchor="middle" font-size="9" fill="' + COLORS.dimension + '">λ_s</text>';
    inner += '<line x1="240" y1="100" x2="240" y2="210" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="4,3"/>';
    inner += '<text x="240" y="222" text-anchor="middle" font-size="9" fill="' + COLORS.dimension + '">λ_p</text>';
    // 区域标注
    inner += '<text x="100" y="195" text-anchor="middle" font-size="10" fill="' + COLORS.dimension + '">小柔度</text>';
    inner += '<text x="190" y="155" text-anchor="middle" font-size="10" fill="' + COLORS.dimension + '">中柔度</text>';
    inner += '<text x="290" y="85" text-anchor="middle" font-size="10" fill="' + COLORS.dimension + '">大柔度</text>';
    inner += '<text x="100" y="245" text-anchor="middle" font-size="9" fill="' + COLORS.dimension + '">σ_s（强度破坏）</text>';
    inner += '<text x="200" y="245" text-anchor="middle" font-size="9" fill="' + COLORS.dimension + '">σ_cr=a-bλ</text>';
    inner += '<text x="300" y="245" text-anchor="middle" font-size="9" fill="' + COLORS.dimension + '">σ_cr=π²E/λ²</text>';
    inner += '<text x="200" y="12" text-anchor="middle" font-size="12" font-weight="bold" fill="' + COLORS.structural + '">临界应力总图</text>';
    return wrapSvg(inner);
  }

  function eccentricCompression(opts) {
    opts = opts || {};
    var inner = '';
    // 矩形截面柱
    inner += '<rect x="170" y="40" width="40" height="160" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 偏心压力
    inner += forceArrow(195, 15, 195, 40, 'F', COLORS.forceArrow, 'arrowRed');
    // 偏心距
    inner += '<line x1="190" y1="30" x2="210" y2="30" stroke="' + COLORS.dimension + '" stroke-width="0.8" stroke-dasharray="3,2"/>';
    inner += '<text x="215" y="33" font-size="9" fill="' + COLORS.dimension + '">e</text>';
    // 形心线
    inner += '<line x1="160" y1="120" x2="220" y2="120" stroke="' + COLORS.accent + '" stroke-width="0.8" stroke-dasharray="5,3"/>';
    inner += '<text x="225" y="123" font-size="9" fill="' + COLORS.accent + '">C</text>';
    // 截面核心（菱形示意）
    inner += '<polygon points="190,160 200,150 210,160 200,170" fill="none" stroke="' + COLORS.accent + '" stroke-width="1.2" stroke-dasharray="4,2"/>';
    inner += '<text x="225" y="165" font-size="9" fill="' + COLORS.accent + '">截面核心</text>';
    inner += '<text x="190" y="225" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">偏心受压</text>';
    return wrapSvg(inner);
  }

  function torsionPureShear(opts) {
    opts = opts || {};
    var inner = '';
    // 圆轴侧视图
    inner += '<rect x="100" y="140" width="220" height="30" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2" rx="2"/>';
    // 扭矩标注
    inner += '<path d="M100,125 Q130,105 160,135" fill="none" stroke="' + COLORS.forceArrow + '" stroke-width="2"/>';
    inner += '<text x="165" y="128" font-size="11" fill="' + COLORS.forceArrow + '">T</text>';
    // 截面圆（右侧端面）
    inner += '<ellipse cx="100" cy="155" rx="12" ry="25" fill="' + COLORS.fillBlue + '" stroke="' + COLORS.structural + '" stroke-width="1.5"/>';
    // 切应力分布（小箭头沿径向）
    var cx = 100, cy = 155;
    for (var i = 0; i < 4; i++) {
      var angle = i * Math.PI / 4 + Math.PI / 6;
      var dx = Math.cos(angle) * 20, dy = Math.sin(angle) * 10;
      inner += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + dx) + '" y2="' + (cy + dy) + '" stroke="' + COLORS.forceArrow + '" stroke-width="1.2"/>';
    }
    inner += '<text x="200" y="200" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">τ = Tρ/I_p（沿径向线性分布）</text>';
    return wrapSvg(inner);
  }

  function cantileverEccentric(opts) {
    opts = opts || {};
    var inner = '';
    // 固定端
    inner += '<rect x="80" y="130" width="18" height="70" fill="' + COLORS.dimension + '" opacity="0.5"/>';
    inner += '<line x1="98" y1="130" x2="98" y2="200" stroke="' + COLORS.structural + '" stroke-width="3"/>';
    for (var i = 0; i < 5; i++) {
      inner += '<line x1="82" y1="' + (135 + i * 13) + '" x2="96" y2="' + (130 + i * 13) + '" stroke="' + COLORS.structural + '" stroke-width="0.8"/>';
    }
    // 梁
    inner += '<rect x="98" y="155" width="260" height="16" fill="' + COLORS.fillLight + '" stroke="' + COLORS.structural + '" stroke-width="2"/>';
    // 偏心轴向力（不通过截面形心）
    inner += forceArrow(150, 120, 150, 155, 'P', COLORS.forceArrow, 'arrowRed');
    // 偏心距标注
    inner += '<line x1="150" y1="163" x2="220" y2="163" stroke="' + COLORS.dimension + '" stroke-width="0.8"/>';
    inner += '<text x="185" y="178" text-anchor="middle" font-size="9" fill="' + COLORS.dimension + '">偏心距e</text>';
    inner += '<text x="230" y="200" text-anchor="middle" font-size="11" fill="' + COLORS.dimension + '">悬臂梁偏心加载（轴向压缩+弯曲）</text>';
    return wrapSvg(inner);
  }

  // ==================== 查找API ====================
  function get(id, opts) {
    var map = {
      'buckling-pinned-pinned': bucklingPinnedPinned,
      'buckling-fixed-free': bucklingFixedFree,
      'buckling-fixed-fixed': bucklingFixedFixed,
      'buckling-fixed-pinned': bucklingFixedPinned,
      'buckling-compare': bucklingCompare,
      'support-fixed-hinge': supportFixedHinge,
      'support-roller': supportRoller,
      'support-fixed-end': supportFixedEnd,
      'support-cable': supportCable,
      'section-rectangular': sectionRectangular,
      'section-circular': sectionCircular,
      'section-hollow-circular': sectionHollowCircular,
      'beam-simple-point': beamSimplePoint,
      'beam-simple-uniform': beamSimpleUniform,
      'beam-cantilever': beamCantilever,
      'beam-moment-couple': beamMomentCouple,
      'constraint-cable': constraintCable,
      'constraint-smooth-surface': constraintSmoothSurface,
      'constraint-hinge': constraintHinge,
      'free-body-block': freeBodyBlock,
      'three-hinged-arch': threeHingedArch,
      'force-decomposition': forceDecomposition,
      'stress-strain-curve': stressStrainCurve,
      'buckling-total-diagram': bucklingTotalDiagram,
      'eccentric-compression': eccentricCompression,
      'torsion-pure-shear': torsionPureShear,
      'cantilever-eccentric': cantileverEccentric
    };
    var fn = map[id];
    return fn ? fn(opts || {}) : '';
  }

  // ==================== 导出 ====================
  window.SvgDiagrams = {
    // 压杆失稳
    bucklingPinnedPinned: bucklingPinnedPinned,
    bucklingFixedFree: bucklingFixedFree,
    bucklingFixedFixed: bucklingFixedFixed,
    bucklingFixedPinned: bucklingFixedPinned,
    bucklingCompare: bucklingCompare,
    // 支座
    supportFixedHinge: supportFixedHinge,
    supportRoller: supportRoller,
    supportFixedEnd: supportFixedEnd,
    supportCable: supportCable,
    // 截面
    sectionRectangular: sectionRectangular,
    sectionCircular: sectionCircular,
    sectionHollowCircular: sectionHollowCircular,
    // 梁
    beamSimplePoint: beamSimplePoint,
    beamSimpleUniform: beamSimpleUniform,
    beamCantilever: beamCantilever,
    beamMomentCouple: beamMomentCouple,
    // 约束
    constraintCable: constraintCable,
    constraintSmoothSurface: constraintSmoothSurface,
    constraintHinge: constraintHinge,
    // 受力图
    freeBodyBlock: freeBodyBlock,
    threeHingedArch: threeHingedArch,
    forceDecomposition: forceDecomposition,
    // 特殊
    stressStrainCurve: stressStrainCurve,
    bucklingTotalDiagram: bucklingTotalDiagram,
    eccentricCompression: eccentricCompression,
    torsionPureShear: torsionPureShear,
    cantileverEccentric: cantileverEccentric,
    // 查找
    get: get
  };

})();
