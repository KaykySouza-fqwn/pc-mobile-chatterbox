import React, {useEffect, useMemo} from 'react';
import {CanvasTexture, SRGBColorSpace} from 'three';

const ink = '#211d2b';

function drawCharacter(coat, hat, skin, stride, raised) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 7;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = ink;

  function shape(path, color) {
    const outline = new Path2D(path);
    ctx.fillStyle = color;
    ctx.fill(outline);
    ctx.stroke(outline);
  }

  function oval(x, y, rx, ry, color, stroke = true) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    if (stroke) ctx.stroke();
  }

  for (const [hip, step] of [[136, -stride], [174, stride]]) {
    const foot = hip + step;
    shape(`M ${hip - 12} 342 L ${hip + 15} 342 L ${foot + 15} 432 L ${foot - 15} 432 Z`, '#4a4259');
    shape(`M ${foot - 16} 425 Q ${foot + 30} 420 ${foot + 32} 452 L ${foot - 18} 452 Z`, '#372c3d');
  }

  shape('M121 204 Q157 188 191 207 L210 351 Q163 372 107 347 Z', coat);
  shape('M127 214 Q107 217 96 246 L79 302 Q88 326 108 314 L135 250 Z', coat);
  oval(93, 317, 15, 16, skin);

  if (raised) {
    shape('M183 216 Q204 211 212 238 L228 259 L258 226 Q278 230 276 250 L234 291 Q216 306 201 284 L181 253 Z', coat);
    oval(269, 233, 15, 16, skin);
  } else {
    shape('M186 215 Q207 214 217 244 L229 305 Q218 326 198 312 L179 254 Z', coat);
    oval(215, 320, 15, 16, skin);
  }

  shape('M118 202 Q156 217 190 198 L197 219 Q154 239 113 220 Z', hat);
  oval(104, 150, 18, 24, skin);
  oval(159, 142, 61, 68, skin);
  shape('M104 133 Q85 92 115 68 Q146 39 191 63 Q223 79 226 113 Q177 97 104 133 Z', hat);
  shape('M103 126 Q167 97 222 110 Q257 120 235 134 Q178 125 108 146 Z', hat);
  oval(163, 150, 4.5, 7, ink, false);
  oval(198, 146, 4.5, 7, ink, false);
  oval(148, 169, 11, 5, '#bc6554', false);
  shape(raised ? 'M177 177 Q188 170 192 179 Q184 195 177 177 Z' : 'M174 179 Q186 188 194 175', '#7d4243');
  oval(163, 257, 5, 5, '#f0c67f', false);
  oval(165, 287, 5, 5, '#f0c67f', false);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function Billboard({x, time, walking, wonder, coat, hat, skin, mirror = false}) {
  const textures = useMemo(() => [
    drawCharacter(coat, hat, skin, 0, false),
    drawCharacter(coat, hat, skin, 18, false),
    drawCharacter(coat, hat, skin, -18, false),
    drawCharacter(coat, hat, skin, 0, true),
  ], [coat, hat, skin]);
  useEffect(() => () => textures.forEach((texture) => texture.dispose()), [textures]);

  const step = Math.sin(time * Math.PI * 3.1);
  const pose = walking ? (step > 0.4 ? 1 : step < -0.4 ? 2 : 0) : wonder > 0.22 ? 3 : 0;
  const bob = walking ? Math.abs(step) * 0.08 : Math.sin(time * 3) * 0.015;
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.54, 1]}>
        <circleGeometry args={[0.41, 24]} />
        <meshBasicMaterial color="#122034" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.98 + bob, 0]} scale={[mirror ? -1 : 1, 1, 1]}
        rotation={[0, 0, walking ? step * 0.035 : 0]}>
        <planeGeometry args={[1.48, 2.22]} />
        <meshBasicMaterial map={textures[pose]} alphaTest={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}
