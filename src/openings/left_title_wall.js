// src/openings/left_title_wall.js
// Museum-Grade Obsidian Lacquer Title Stele (`x = 0..344`, `y = 0..720`) for Act I (`0.00s .. 3.55s`):
// - Deep obsidian-mulberry lacquer wash + ghost-gold 12-spoke chariot wheel watermark
// - Double antique-gold hairline border with classical indented Song-brocade corner miters
// - 4 high-resolution official `羽轮纹章` (`crest_wheel_feather.png`) corner crests
// - Official cover vector glyph outlines (`data/opening_title_glyphs.json`) for `鹈鹕 / 六千年的车`
// - Genuine hand-chiseled Shuowen Xiaozhuan (`《说文解字》小篆`) cinnabar stone seal (`seal_6000.png`)

import { lerp, smootherstep } from '../fusion/github_core/beat/timeline.js';
import { createVectorCrestCanvas, createVectorSealCanvas } from './vector_emblems.js';

let sealStampImg = null;
let goldCrestImg = null;
let titleGlyphPaths = null;

async function loadTitleGlyphPaths(url) {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data?.glyphs || {};
    if (typeof Path2D === 'undefined') return null;
    const compiled = {};
    for (const [ch, d] of Object.entries(raw)) {
      if (d) compiled[ch] = new Path2D(d);
    }
    return Object.keys(compiled).length >= 7 ? compiled : null;
  } catch {
    return null;
  }
}

export async function preloadLeftTitleWallAssets() {
  if (!sealStampImg) sealStampImg = createVectorSealCanvas(512);
  if (!goldCrestImg) goldCrestImg = createVectorCrestCanvas(256);
  if (!titleGlyphPaths) {
    titleGlyphPaths = await loadTitleGlyphPaths('./data/opening_title_glyphs.json?v=2');
  }
}

function strokeIndentedCornerFrame(ctx, x0, y0, x1, y1, notch) {
  ctx.beginPath();
  // Top edge with corner step-ins
  ctx.moveTo(x0 + notch, y0);
  ctx.lineTo(x1 - notch, y0);
  ctx.lineTo(x1 - notch, y0 + notch);
  ctx.lineTo(x1, y0 + notch);
  // Right edge
  ctx.lineTo(x1, y1 - notch);
  ctx.lineTo(x1 - notch, y1 - notch);
  ctx.lineTo(x1 - notch, y1);
  // Bottom edge
  ctx.lineTo(x0 + notch, y1);
  ctx.lineTo(x0 + notch, y1 - notch);
  ctx.lineTo(x0, y1 - notch);
  // Left edge
  ctx.lineTo(x0, y0 + notch);
  ctx.lineTo(x0 + notch, y0 + notch);
  ctx.closePath();
  ctx.stroke();
}

function drawDiamondNode(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fill();
}

function getBakedLeftObsidianStele(kit, panelW, panelH) {
  return kit.bake2D(
    `intro_left_obsidian_stele_v4_${panelW}x${panelH}`,
    (_g, ctx, rng, w, h) => {
      // 1. Deep museum obsidian-lacquer radial gradient
      const g = ctx.createRadialGradient(w * 0.48, h * 0.47, 18, w * 0.5, h * 0.5, h * 0.78);
      g.addColorStop(0, '#221b14');
      g.addColorStop(0.52, '#15110d');
      g.addColorStop(1, '#0b0907');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // 2. Handmade Xuan-mulberry mineral fibers & micro gold-leaf dust
      for (let i = 0; i < 900; i += 1) {
        const fx = rng() * w;
        const fy = rng() * h;
        ctx.strokeStyle =
          rng() > 0.55
            ? `rgba(244, 214, 156, ${(0.014 + rng() * 0.024).toFixed(3)})`
            : `rgba(0, 0, 0, ${(0.08 + rng() * 0.1).toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + 3 + rng() * 11, fy + (rng() - 0.5) * 1.6);
        ctx.stroke();
      }

      // 3. Ghost-gold 6000-year Chariot-Wheel Rosette watermark + vertical meridian axis
      const cx = w * 0.5;
      const cy = h * 0.485;
      ctx.save();
      ctx.strokeStyle = 'rgba(214, 174, 102, 0.044)';
      ctx.lineWidth = 0.85;
      for (const rad of [126, 118, 88, 28]) {
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let k = 0; k < 12; k += 1) {
        const ang = (k * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * 28, cy + Math.sin(ang) * 28);
        ctx.lineTo(cx + Math.cos(ang) * 118, cy + Math.sin(ang) * 118);
        ctx.stroke();
      }

      // Upper & lower museum meridian hairlines framing the title zone without text clutter
      const axisGradTop = ctx.createLinearGradient(0, 68, 0, 212);
      axisGradTop.addColorStop(0, 'rgba(214, 174, 102, 0.02)');
      axisGradTop.addColorStop(0.5, 'rgba(214, 174, 102, 0.22)');
      axisGradTop.addColorStop(1, 'rgba(214, 174, 102, 0.03)');
      ctx.strokeStyle = axisGradTop;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(cx, 72);
      ctx.lineTo(cx, 208);
      ctx.stroke();

      const axisGradBot = ctx.createLinearGradient(0, 468, 0, 648);
      axisGradBot.addColorStop(0, 'rgba(214, 174, 102, 0.03)');
      axisGradBot.addColorStop(0.5, 'rgba(214, 174, 102, 0.22)');
      axisGradBot.addColorStop(1, 'rgba(214, 174, 102, 0.02)');
      ctx.strokeStyle = axisGradBot;
      ctx.beginPath();
      ctx.moveTo(cx, 472);
      ctx.lineTo(cx, 644);
      ctx.stroke();

      ctx.fillStyle = 'rgba(218, 178, 106, 0.34)';
      drawDiamondNode(ctx, cx, 140, 2.5);
      drawDiamondNode(ctx, cx, 558, 2.5);
      ctx.restore();

      // 4. Double Antique-Gold Lacquer Frame with Song-brocade indented inner corners
      const outPad = 15.5;
      const inPad = 22.5;
      ctx.strokeStyle = 'rgba(212, 173, 103, 0.78)';
      ctx.lineWidth = 1.3;
      ctx.strokeRect(outPad, outPad, w - outPad * 2, h - outPad * 2);

      ctx.strokeStyle = 'rgba(212, 173, 103, 0.46)';
      ctx.lineWidth = 0.85;
      strokeIndentedCornerFrame(ctx, inPad, inPad, w - inPad, h - inPad, 7);
    },
    panelW,
    panelH
  );
}

function drawVectorGlyph(ctx, path2d, tx, ty, scale, fillStyle, specAlpha) {
  // Engraved obsidian relief shadow
  ctx.save();
  ctx.translate(tx + 1.8, ty + 2.5);
  ctx.scale(scale, -scale);
  ctx.fillStyle = 'rgba(5, 3, 2, 0.88)';
  ctx.fill(path2d);
  ctx.restore();

  // Warm ivory-gold face + subtle forge-lit gilt rim
  ctx.save();
  ctx.translate(tx, ty);
  ctx.scale(scale, -scale);
  ctx.fillStyle = fillStyle;
  ctx.fill(path2d);
  ctx.strokeStyle = `rgba(255, 232, 176, ${specAlpha.toFixed(3)})`;
  ctx.lineWidth = 0.55 / scale;
  ctx.stroke(path2d);
  ctx.restore();
}

export function drawLeftEditorialPanel(ctx, kit, panelX, panelW, panelH, doc, realT, anvilShock) {
  if (panelX + panelW <= 0) return;
  const wallBg = getBakedLeftObsidianStele(kit, panelW, panelH);

  ctx.save();
  ctx.translate(panelX, 0);
  ctx.drawImage(wallBg.canvas || wallBg, 0, 0, panelW, panelH);

  // 1. Warm forge hearth rim-glow + drifting micro-embers along the right edge
  const rimAlpha = 0.08 + anvilShock * 0.16;
  const rimG = ctx.createLinearGradient(panelW - 88, 0, panelW, 0);
  rimG.addColorStop(0, 'rgba(245, 178, 72, 0)');
  rimG.addColorStop(1, `rgba(245, 178, 72, ${rimAlpha.toFixed(3)})`);
  ctx.fillStyle = rimG;
  ctx.fillRect(panelW - 88, 0, 88, panelH);

  if (anvilShock > 0.04) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 214, 128, ${(anvilShock * 0.42).toFixed(3)})`;
    for (let i = 0; i < 6; i += 1) {
      const ey = ((140 + i * 83 - realT * (28 + i * 5)) % 560 + 560) % 560 + 80;
      const ex = panelW - 14 - ((i * 19) % 34) - Math.sin(realT * 5 + i) * 5;
      ctx.beginPath();
      ctx.arc(ex, ey, 1.1 + (i % 2) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. 4 High-Res Official `羽轮纹章` Corner Crests strictly inside the inner gold border (`inPad = 22.5`)
  if (goldCrestImg) {
    const cSize = 36;
    const cOff = 30;
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.drawImage(goldCrestImg, cOff, cOff, cSize, cSize);
    ctx.drawImage(goldCrestImg, panelW - cOff - cSize, cOff, cSize, cSize);
    ctx.drawImage(goldCrestImg, cOff, panelH - cOff - cSize, cSize, cSize);
    ctx.drawImage(goldCrestImg, panelW - cOff - cSize, panelH - cOff - cSize, cSize, cSize);
    ctx.restore();
  }

  // 3. Right vertical gilt divider seam + depth cast shadow onto the blacksmith stage
  const castG = ctx.createLinearGradient(panelW, 0, panelW + 26, 0);
  castG.addColorStop(0, 'rgba(5, 4, 3, 0.76)');
  castG.addColorStop(1, 'rgba(5, 4, 3, 0)');
  ctx.fillStyle = castG;
  ctx.fillRect(panelW, 0, 26, panelH);

  ctx.strokeStyle = 'rgba(218, 178, 108, 0.62)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(panelW - 0.5, 0);
  ctx.lineTo(panelW - 0.5, panelH);
  ctx.stroke();

  const line1 = doc?.title?.line1 || '鹈鹕';
  const line2 = doc?.title?.line2 || '六千年的车';

  // 4. Genuine Carved Shuowen Xiaozhuan Stone Seal (`seal_6000.png` — 「六千年」) at upper-right shoulder (`x = 246..306`)
  const sealCx = 276;
  const sealCy = 278;
  const sealSize = 60 * (1 + anvilShock * 0.032);
  const stampEnter = smootherstep(0.03, 0.34, realT);
  if (sealStampImg && stampEnter > 0.01) {
    ctx.save();
    ctx.translate(sealCx, sealCy);
    ctx.rotate(-0.018);
    const sScale = lerp(1.14, 1.0, stampEnter);
    ctx.scale(sScale, sScale);
    ctx.globalAlpha = stampEnter * 0.96;
    ctx.drawImage(sealStampImg, -sealSize * 0.5, -sealSize * 0.5, sealSize, sealSize);
    ctx.restore();
  }

  // 5. Official Cover Vector Outline Typography (`鹈鹕` + `六千年的车` symmetrically spanning `x = 38..306`)
  const titleGrad = ctx.createLinearGradient(0, 252, 0, 420);
  titleGrad.addColorStop(0, '#fdf6e7');
  titleGrad.addColorStop(0.55, '#f3e5c2');
  titleGrad.addColorStop(1, '#dcc08e');
  const specAlpha = 0.24 + anvilShock * 0.22;

  if (titleGlyphPaths) {
    // Row 1: `鹈` (`tx = 37`), `鹕` (`tx = 139`) at `s1 = 0.096` -> `x = 38.4 .. 234.0` (12px gap to `246..306` seal!)
    const s1 = 0.096;
    const chars1 = [...line1];
    if (chars1[0] && titleGlyphPaths[chars1[0]]) {
      drawVectorGlyph(ctx, titleGlyphPaths[chars1[0]], 37, 340, s1, titleGrad, specAlpha);
    }
    if (chars1[1] && titleGlyphPaths[chars1[1]]) {
      drawVectorGlyph(ctx, titleGlyphPaths[chars1[1]], 139, 340, s1, titleGrad, specAlpha);
    }

    // Row 2: `六千年的车` at `s2 = 0.046`, evenly tracked `tx = 37.0 .. 261.2` -> right edge `306.0` flush with seal!
    const s2 = 0.046;
    const chars2 = [...line2];
    const step2 = chars2.length > 1 ? (261.2 - 37.0) / (chars2.length - 1) : 0;
    for (let i = 0; i < chars2.length; i += 1) {
      const p2d = titleGlyphPaths[chars2[i]];
      if (p2d) {
        drawVectorGlyph(ctx, p2d, 37.0 + i * step2, 412, s2, titleGrad, specAlpha);
      }
    }
  } else {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '900 96px "PelicanSerif", "CarbonSerif", serif';
    ctx.fillStyle = 'rgba(5, 3, 2, 0.85)';
    ctx.fillText(line1, 38 + 1.8, 340 + 2.4);
    ctx.fillStyle = titleGrad;
    ctx.fillText(line1, 38, 340);

    const chars2 = [...line2];
    ctx.font = '900 47px "PelicanSerif", "CarbonSerif", serif';
    const lastW = ctx.measureText(chars2[chars2.length - 1]).width;
    const stepX = chars2.length > 1 ? (306 - lastW - 38) / (chars2.length - 1) : 0;
    for (let i = 0; i < chars2.length; i += 1) {
      const gx = 38 + i * stepX;
      ctx.fillStyle = 'rgba(5, 3, 2, 0.82)';
      ctx.fillText(chars2[i], gx + 1.5, 412 + 2.0);
      ctx.fillStyle = titleGrad;
      ctx.fillText(chars2[i], gx, 412);
    }
  }

  // 6. Antique-gold horizontal finial rule + twin micro-diamonds beneath the title block (`y = 442`)
  const ruleY = 442;
  const cx = panelW * 0.5;
  const ruleGrad = ctx.createLinearGradient(38, ruleY, 306, ruleY);
  ruleGrad.addColorStop(0, 'rgba(206, 168, 98, 0.08)');
  ruleGrad.addColorStop(0.5, `rgba(236, 196, 120, ${(0.64 + anvilShock * 0.28).toFixed(2)})`);
  ruleGrad.addColorStop(1, 'rgba(206, 168, 98, 0.08)');
  ctx.strokeStyle = ruleGrad;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(38, ruleY);
  ctx.lineTo(cx - 10, ruleY);
  ctx.moveTo(cx + 10, ruleY);
  ctx.lineTo(306, ruleY);
  ctx.stroke();

  ctx.fillStyle = `rgba(232, 192, 118, ${(0.82 + anvilShock * 0.16).toFixed(2)})`;
  drawDiamondNode(ctx, cx, ruleY, 3.8);

  ctx.restore();
}
