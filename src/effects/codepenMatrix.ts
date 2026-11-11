import { createMatrixWorld, matrixDimensions, matrixFragmentShader, matrixVertexShader } from '../vendor/codepen-matrix.js'

export type CodepenMatrixRenderer = {
  frame(delta: number, time: number): void
  resize(width: number, height: number): void
  destroy(): void
}

let fontReady: Promise<void> | undefined

export function loadCodepenMatrixFont(): Promise<void> {
  fontReady ??= (async () => {
    const font = new FontFace('Inconsolata', 'url(/fonts/inconsolata.ttf)', { weight: '400', style: 'normal' })
    await font.load()
    document.fonts.add(font)
  })()
  return fontReady
}

/** The Pen's commands in native WebGL; shaders/trails retain upstream source. */
export function createCodepenMatrix(canvas: HTMLCanvasElement): CodepenMatrixRenderer {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false, preserveDrawingBuffer: true })
  if (!gl) throw new Error('WebGL is unavailable')
  try {
    const world = createMatrixWorld()
    if (!world.bufferContext) throw new Error('Character buffer is unavailable')
    let destroyed = false
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)
      if (!shader) throw new Error('Shader allocation failed')
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader)
        throw new Error('CRT shader compilation failed')
      }
      return shader
    }
    const vertex = compile(gl.VERTEX_SHADER, matrixVertexShader)
    const fragment = compile(gl.FRAGMENT_SHADER, matrixFragmentShader)
    const program = gl.createProgram()
    if (!program) throw new Error('Program allocation failed')
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('CRT shader linking failed')
    gl.useProgram(program)
    const position = gl.createBuffer()
    if (!position) throw new Error('Quad allocation failed')
    gl.bindBuffer(gl.ARRAY_BUFFER, position)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]), gl.STATIC_DRAW)
    const location = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0)
    const texture = gl.createTexture()
    if (!texture) throw new Error('Texture allocation failed')
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, matrixDimensions.textureW, matrixDimensions.textureH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    const timeUniform = gl.getUniformLocation(program, 'time')
    gl.uniform1i(gl.getUniformLocation(program, 'sprite'), 0)
    // Exact normalized Float32 equivalents of upstream hex2vector constants.
    gl.uniform3fv(gl.getUniformLocation(program, 'fgColor'), new Float32Array([1, 238 / 255, 238 / 255]))
    gl.uniform3fv(gl.getUniformLocation(program, 'bgColor'), new Float32Array([0, 42 / 255, 42 / 255]))
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 1)
    gl.clearDepth(1)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    return {
      frame(delta, time) {
        if (destroyed || gl.isContextLost()) return
        world.updateWorld(delta)
        world.renderWorld(delta)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texSubImage2D(gl.TEXTURE_2D, 0, matrixDimensions.consolePad, matrixDimensions.consolePad, gl.RGBA, gl.UNSIGNED_BYTE, world.bufferCanvas)
        gl.uniform1f(timeUniform, time)
        // Preserve the original alpha-.2 accumulation; never clear each frame.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      },
      resize(width, height) {
        if (destroyed) return
        const nextWidth = Math.max(1, Math.floor(width))
        const nextHeight = Math.max(1, Math.floor(height))
        if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
          canvas.width = nextWidth
          canvas.height = nextHeight
          gl.viewport(0, 0, nextWidth, nextHeight)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        }
      },
      destroy() {
        if (destroyed) return
        destroyed = true
        gl.deleteTexture(texture)
        gl.deleteBuffer(position)
        gl.deleteProgram(program)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      },
    }
  } catch (error) {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    throw error
  }
}
