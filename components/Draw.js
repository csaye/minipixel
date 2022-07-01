import styles from '../styles/components/Draw.module.css';

import { useEffect, useRef, useState } from 'react';
import { panelPixels } from '../util/dimensions';

let canvas, ctx;

const panelTiles = 4;
const tilePixels = panelPixels / panelTiles;
const tileCount = panelTiles * panelTiles;

const gridPixels = 2; // grid pixels

export default function Draw() {
  const canvasRef = useRef();

  const [tiles, setTiles] = useState(Array(tileCount).fill(false));

  function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  function draw() {
    // draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, panelPixels, panelPixels);
    // draw tiles
    for (let x = 0; x < panelTiles; x++) {
      for (let y = 0; y < panelTiles; y++) {
        const tileIndex = y * panelTiles + x;
        ctx.fillStyle = tiles[tileIndex] ? '#000' : '#fff';
        ctx.fillRect(
          x * tilePixels, y * tilePixels,
          tilePixels, tilePixels
        );
      }
    }
    // draw grid lines
    ctx.fillStyle = '#ddd';
    for (let x = 1; x < panelTiles; x++) {
      ctx.fillRect(
        x * tilePixels - gridPixels / 2, 0,
        gridPixels, panelPixels
      );
    }
    for (let y = 1; y < panelTiles; y++) {
      ctx.fillRect(
        0, y * tilePixels - gridPixels / 2,
        panelPixels, gridPixels
      );
    }
  }

  function mouseDown(e) {
    // get mouse x and y
    let mouseX = e.clientX - canvas.offsetLeft + window.scrollX;
    let mouseY = e.clientY - canvas.offsetTop + window.scrollY;
    // clamp mouse x and y
    mouseX = clamp(mouseX, 0, panelPixels - 1);
    mouseY = clamp(mouseY, 0, panelPixels - 1);
    // get tile x and y
    const tileX = Math.floor(mouseX / tilePixels);
    const tileY = Math.floor(mouseY / tilePixels);
    // toggle tile
    const tileIndex = tileY * panelTiles + tileX;
    const newTiles = tiles.slice();
    newTiles[tileIndex] = !newTiles[tileIndex];
    setTiles(newTiles);
  }

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
    draw();
  }, []);

  useEffect(() => {
    draw();
  }, [tiles]);

  return (
    <div
      className={styles.container}
      style={{ width: panelPixels, height: panelPixels }}
    >
      {
        currTile !== -1 &&
        <button
          className={styles.back}
          onClick={() => setCurrTile(-1)}
        >
          ⬅
        </button>
      }
      <canvas
        ref={canvasRef}
        onMouseDown={mouseDown}
        width={panelPixels}
        height={panelPixels}
      />
    </div>
  );
}
