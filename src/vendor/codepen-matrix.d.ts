export const matrixDimensions: { charW: number; charH: number; bufferCW: number; bufferCH: number; bufferW: number; bufferH: number; textureW: number; textureH: number; consolePad: number; consoleW: number; consoleH: number }
export const matrixVertexShader: string
export const matrixFragmentShader: string
export function createMatrixWorld(): { bufferCanvas: HTMLCanvasElement; bufferContext: CanvasRenderingContext2D; updateWorld(delta: number): void; renderWorld(delta: number): void }
