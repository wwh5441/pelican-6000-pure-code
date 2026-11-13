// src/openings/era_slats.js
// Bakes genuine pure-background slices of the 12 signature art eras from `renderScenePanel`
// and renders the vertical Accordion-Drawer Showcase (`3.67s .. 11.45s`) with a single
// continuous live-pedaling Pelican on a Bicycle transforming art style across every vertical slat!

import { SCENES } from '../fusion/github_core/beat/timeline.js';
import { computePelicanRig, drawRig2D } from '../fusion/github_core/rig/pelican.js';

const ERA_PELICAN_STYLES = {
  ochre: {
    featherFill: '#e5be8a',
    featherShade: '#b87b46',
    wingTipDark: '#592918',
    beakFill: '#c95c28',
    pouchFill: '#9e3e1c',
    legFill: '#7d341a',
    frameStroke: '#662b19',
    metalStroke: '#592918',
    tireStroke: '#3d1c12',
    inkOutline: '#2e140d',
    lineScale: 1.25,
  },
  egypt: {
    featherFill: '#f2e2be',
    featherShade: '#d4b47c',
    wingTipDark: '#1b4f5c',
    beakFill: '#d4922a',
    pouchFill: '#b84828',
    legFill: '#b85c2e',
    frameStroke: '#1e6472',
    metalStroke: '#c69332',
    tireStroke: '#181410',
    inkOutline: '#14100d',
    lineScale: 1.1,
  },
  han: {
    featherFill: '#e8e2d5',
    featherShade: '#cfc7b6',
    wingTipDark: '#1c1a18',
    beakFill: '#dfd7c6',
    pouchFill: '#b83c2c',
    legFill: '#dfd7c6',
    frameStroke: '#ece6da',
    metalStroke: '#cfc7b6',
    tireStroke: '#ece6da',
    inkOutline: '#121110',
    lineScale: 1.18,
  },
  nosferatu: {
    silhouetteColor: '#171411',
    lineScale: 1.18,
  },
  song: {
    featherFill: '#ece3cf',
    featherShade: '#bfb299',
    wingTipDark: '#2a2621',
    beakFill: '#9e7c56',
    pouchFill: '#876546',
    legFill: '#5c4b3b',
    frameStroke: '#38322b',
    metalStroke: '#4a433b',
    tireStroke: '#221e1a',
    inkOutline: '#171411',
    lineScale: 0.92,
  },
  ukiyoe: {
    featherFill: '#f7f1e1',
    featherShade: '#cad7de',
    wingTipDark: '#1a3c5e',
    beakFill: '#e08b36',
    pouchFill: '#c84b2c',
    legFill: '#c85a32',
    frameStroke: '#1d4872',
    metalStroke: '#2d4b63',
    tireStroke: '#182430',
    inkOutline: '#141920',
    lineScale: 1.18,
  },
  vangogh: {
    featherFill: '#f6f4e6',
    featherShade: '#9cc2e6',
    wingTipDark: '#1c3b72',
    beakFill: '#f5be36',
    pouchFill: '#e67e28',
    legFill: '#e07a24',
    frameStroke: '#26529c',
    metalStroke: '#3d6cb5',
    tireStroke: '#17294d',
    inkOutline: '#101d38',
    lineScale: 1.32,
    impasto: true,
  },
  munch: {
    featherFill: '#f2dfb3',
    featherShade: '#d99852',
    wingTipDark: '#4a201e',
    beakFill: '#e86828',
    pouchFill: '#c43822',
    legFill: '#b83e22',
    frameStroke: '#8f2c24',
    metalStroke: '#592924',
    tireStroke: '#2b1616',
    inkOutline: '#211010',
    lineScale: 1.24,
  },
  bauhaus: {
    featherFill: '#f7f4eb',
    featherShade: '#e3ded0',
    wingTipDark: '#181818',
    beakFill: '#f0b818',
    pouchFill: '#d93224',
    legFill: '#1f4fa3',
    frameStroke: '#d93224',
    metalStroke: '#1f4fa3',
    tireStroke: '#161616',
    inkOutline: '#121212',
    lineScale: 1.15,
  },
  vector: {
    wireframeColor: '#66ffa8',
    lineScale: 1.15,
    glow: '#2aff84',
  },
  pixel: {
    featherFill: '#ffffff',
    featherShade: '#b8d8ff',
    wingTipDark: '#182868',
    beakFill: '#fcb42c',
    pouchFill: '#e85020',
    legFill: '#e85020',
    frameStroke: '#fc3838',
    metalStroke: '#d8e4ff',
    tireStroke: '#101424',
    inkOutline: '#0c1020',
    lineScale: 1.35,
  },
  vaporwave: {
    wireframeColor: '#ff5ef2',
    lineScale: 1.18,
    glow: '#00f0ff',
  },
  svg: {
    wireframeColor: '#ffd478',
    lineScale: 0.95,
  },
};

export function ensureIntroEraBackdrops(kit, renderSceneFn, eraDrawers) {
  if (!kit.introEraBgCache) {
    kit.introEraBgCache = new Map();
  }
  const tempSlot = kit.getSlot(3);
  for (const d of eraDrawers) {
    if (kit.introEraBgCache.has(d.sceneId)) continue;
    const scene = SCENES.find((s) => s.id === d.sceneId) || SCENES[0];
    const freezeLocalT = d.sceneId === 's02_egypt' ? 2.6 : 3.1;
    const freezeGlobalT = scene.t0 + freezeLocalT;

    tempSlot.usedFb = false;
    tempSlot.g2d.clear();

    // Place pelican far off-screen (`-2600`) so we capture the pure era artwork background
    renderSceneFn(kit, tempSlot, scene, {
      t: freezeGlobalT,
      localT: freezeLocalT,
      rawLocalT: freezeLocalT,
      pelicanLocalX: -2600,
      pedalAngle: 0.8,
      speedScale: 0.25,
      isOutroThumbnail: true,
    });

    const thumb = kit.p.createGraphics(960, 720);
    thumb.pixelDensity(1);
    if (tempSlot.usedFb && tempSlot.fb) {
      thumb.image(tempSlot.fb, 0, 0, 960, 720);
    }
    thumb.drawingContext.drawImage(tempSlot.g2d.canvas, 0, 0, 960, 720);
    kit.introEraBgCache.set(d.sceneId, thumb.canvas);
  }
}

function drawSvgMarkupOverlay(ctx, x, w, h, realT) {
  const lines = [
    "'quill'",
    "'pouch'",
    "'gloss'",
    "'bill'",
    "'rider'",
    "'nail'",
    'id="eye"',
    'id="beak"',
    'id="wing"',
    'id="glow"',
    '',
    'Gradient',
    'Gradient',
    'Gradient',
    'id="rim"',
    'id="hub"',
  ];
  ctx.save();
  ctx.fillStyle = 'rgba(14, 12, 18, 0.76)';
  ctx.fillRect(x, 0, w, h);
  ctx.font = '700 21px "CarbonMono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const scrollY = (realT * 12) % 36;
  for (let i = 0; i < lines.length; i += 1) {
    const txt = lines[i];
    if (!txt) continue;
    ctx.fillStyle = txt.startsWith("'")
      ? '#f5d67b'
      : txt.startsWith('id=')
        ? '#9be8ff'
        : '#d896ff';
    ctx.fillText(txt, x + 6, 18 + i * 40 - scrollY * 0.25);
  }
  ctx.restore();
}

export function renderEraAccordionStage(
  ctx,
  kit,
  realT,
  stageX0,
  stageW,
  stageH,
  slats,
  handoffU = 0,
  enterU = 1
) {
  // Full-Screen (`960x720`) live-pedaling Pelican spanning across all 12 vertical era slats!
  // During `enterU` (`0 -> 1` across `3.55s .. 4.35s`), the Pelican rides grandly in from the right
  // behind the sweeping `/` diagonal curtain to occupy full center stage (`x = 480, scale = 1.72`),
  // then smoothly glides into Scene 01's road position (`x = 190, scale = 0.72`) as `handoffU -> 1`!
  const enterEase = 1 - Math.pow(1 - clamp01(enterU), 2.5);
  const rideOffsetX = (1 - enterEase) * stageW * 0.38;
  const pelX = (stageX0 + stageW * 0.50 + rideOffsetX) * (1 - handoffU) + 190 * handoffU;
  const pelY = (stageH * 0.865) * (1 - handoffU) + 516 * handoffU;
  const pelScale = (1.52 + 0.20 * enterEase) * (1 - handoffU) + 0.72 * handoffU;
  const pedalAngle = realT * 4.6;

  const rig = computePelicanRig({
    x: pelX,
    y: pelY,
    pedalAngle,
    wheelAngle: realT * 5.2,
    scale: pelScale,
    speedScale: 0.85,
    time: realT,
  });

  for (let i = 0; i < slats.length; i += 1) {
    const s = slats[i];
    if (s.w <= 0.5) continue;

    ctx.save();
    ctx.beginPath();
    ctx.rect(s.x, 0, s.w, stageH);
    ctx.clip();

    // 1. Draw genuine 960x720 era artwork slice (`crop top 93% so internal panel labels stay hidden`)
    const bgCnv = kit.introEraBgCache?.get(s.sceneId);
    if (bgCnv) {
      const normCenter = (s.x + s.w * 0.5 - stageX0) / Math.max(1, stageW);
      const drawW = Math.max(s.w, 960 * (0.76 + handoffU * 0.24));
      const drawX = s.x + s.w * 0.5 - drawW * clamp01(0.18 + normCenter * 0.64);
      const finalX = handoffU > 0.01 && i === 0 ? 0 : drawX;
      const finalW = handoffU > 0.01 && i === 0 ? Math.max(drawW, 960) : drawW;
      ctx.drawImage(bgCnv, 0, 0, 960, 668, finalX, 0, finalW, stageH);
    }

    // Special right-most SVG source-code slat (`#20 2026`, direct homage to reference image!)
    if (s.style === 'svg') {
      drawSvgMarkupOverlay(ctx, s.x, s.w, stageH, realT);
    }

    // 2. Render continuous Pelican + Bicycle clipped inside THIS drawer's era style!
    // (No expensive software shadowBlur — crisp dual-pass neon stroke keeps 60fps locked!)
    const pStyle = ERA_PELICAN_STYLES[s.style] || ERA_PELICAN_STYLES.ukiyoe;
    ctx.save();
    drawRig2D(ctx, rig, pStyle);
    if (pStyle.glow) {
      drawRig2D(ctx, rig, { wireframeColor: '#e6fff0', lineScale: 0.52 });
    }
    if (pStyle.impasto && rig.bodyCenter) {
      ctx.strokeStyle = '#fff9d6';
      ctx.lineWidth = 3.2;
      for (let k = -2; k <= 2; k += 1) {
        ctx.beginPath();
        ctx.moveTo(rig.bodyCenter.x - 24, rig.bodyCenter.y + k * 7);
        ctx.lineTo(rig.bodyCenter.x - 6, rig.bodyCenter.y + k * 7 - 3);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Subtle gallery spotlight lift on the currently expanded accordion drawer
    if (s.focus > 0.2 && handoffU < 0.5) {
      ctx.fillStyle = `rgba(255, 244, 214, ${(s.focus * 0.075).toFixed(3)})`;
      ctx.fillRect(s.x, 0, s.w, stageH);
    }

    ctx.restore();
  }
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
