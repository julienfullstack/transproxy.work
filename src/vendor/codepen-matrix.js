/*
 * Falling-code source from Nick Matantsev's WebGL CRT Neon Matrix Effect.
 * https://codepen.io/unframework/pen/pqorjJ
 * Public CodePen source under MIT; see /licenses/codepen-matrix.txt.
 * Original falling-code logic retained; blue/pink colors and a flat shader.
 * Adapter changes: factory scope; no demo banner icons/full-screen flashes;
 * direct WebGL replaces ReGL runtime code generation for strict CSP;
 * TV distortion, scanlines, glitch and phosphor effects are removed.
 */
const charW = 6;
const charH = 10;
const bufferCW = 80;
const bufferCH = 24;
const bufferW = bufferCW * charW;
const bufferH = bufferCH * charH;
const textureW = 512;
const textureH = 256;

const consolePad = 8; // in texels
const consoleW = bufferW + consolePad * 2;
const consoleH = bufferH + consolePad * 2;


export const matrixDimensions = { charW, charH, bufferCW, bufferCH, bufferW, bufferH, textureW, textureH, consolePad, consoleW, consoleH };

export function createMatrixWorld() {
const bufferCanvas = document.createElement('canvas');
bufferCanvas.width = bufferW;
bufferCanvas.height = bufferH;
// document.body.appendChild(bufferCanvas);

const bufferContext = bufferCanvas.getContext('2d');

bufferContext.fillStyle = '#000';
bufferContext.fillRect(0, 0, bufferW, bufferH);

function charRange(start, end) {
  return Array.apply(null, new Array(end - start)).map((_, index) => {
    return String.fromCharCode(start + index);
  });
}

const characterSet = ([]
  .concat(charRange(0x30, 0x3a)) // ASCII digits
  .concat(charRange(0x40, 0x5b)) // ASCII uppercase and @
  .concat(charRange(0x30a0, 0x30ff)) // kanji
);

// pseudo-random
// credit: https://gist.github.com/blixt/f17b47c62508be59987b
const SEED_OFFSET = new Date().getTime();

function randomize(seed) {
    const intSeed = seed % 2147483647;
    const safeSeed = intSeed > 0 ? intSeed : intSeed + 2147483646;
    return safeSeed * 16807 % 2147483647;
}

function getRandomizedFraction(seed) {
    return (seed - 1) / 2147483646;
}

// main character trail state
function createTrail() {
  const cx = Math.floor(Math.random() * bufferCW);
  const cy = 0;
  const cvy = 5 + Math.random() * 15;

  return [ cx, cy, cvy ];
}

const trails = Array.apply(null, new Array(30)).map((_, index) => {
  return createTrail();
});

function updateWorld(delta) {
  trails.forEach((trail, index) => {
    trail[1] += trail[2] * delta;

    if (trail[1] > bufferCH) {
      trails[index] = createTrail();
    }
  });
}

// "warm up" the state by simulating the world for a bit
Array.apply(null, new Array(100)).forEach(() => {
  updateWorld(0.1);
});

let fadeCountdown = 0;

function renderWorld(delta) {
  // fade screen every few frames
  // (not every frame, for long trails without rounding artifacts)
  fadeCountdown -= delta;

  if (fadeCountdown < 0) {
    bufferContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    bufferContext.fillRect(0, 0, bufferW, bufferH);

    fadeCountdown += 0.2;
  }

  // redraw
  bufferContext.textAlign = 'center';
  bufferContext.font = '12px "Inconsolata"';

  trails.forEach((trail, index) => {
    const k = index / trails.length;
    const charY = Math.floor(trail[1]);

    // randomize based on character position
    const charSeed = index + (trail[0] + charY * bufferCW) * 50;
    const outSeed = randomize(charSeed * 1500 + SEED_OFFSET);

    const char = characterSet[Math.floor(getRandomizedFraction(outSeed) * characterSet.length)];

    bufferContext.fillStyle = `rgb(${91 + (245 - 91) * k}, ${206 + (169 - 206) * k}, ${250 + (184 - 250) * k})`;
    bufferContext.fillText(
      char,
      (trail[0] + 0.5) * charW, // center inside character box
      charY * charH + charH,
      charW // restrict width, but allow a tiny bit of spillover
    );
  });
}

return { bufferCanvas, bufferContext, updateWorld, renderWorld };
}

export const matrixVertexShader = `
        precision mediump float;

        attribute vec3 position;

        varying vec2 uvPosition;

        void main() {
            uvPosition = position.xy * vec2(0.5, -0.5) + vec2(0.5);

            gl_Position = vec4(
                vec2(-1.0, 1.0) + (position.xy - vec2(-1.0, 1.0)) * 1.0,
                0.0,
                1.0
            );
        }
    `;

export const matrixFragmentShader = `
        precision mediump float;

        varying vec2 uvPosition;
        uniform sampler2D sprite;
        uniform vec3 bgColor;

        #define textureW ${textureW + '.0'}
        #define textureH ${textureH + '.0'}
        #define bufferW ${bufferW + '.0'}
        #define bufferH ${bufferH + '.0'}
        #define consolePad ${consolePad + '.0'}

        void main() {
            vec2 sourceUV = (vec2(consolePad) + uvPosition * vec2(bufferW, bufferH))
                / vec2(textureW, textureH);
            vec4 sourcePixel = texture2D(sprite, sourceUV);
            gl_FragColor = vec4(bgColor + sourcePixel.rgb * sourcePixel.a * 0.5, 1.0);
        }
    `;
