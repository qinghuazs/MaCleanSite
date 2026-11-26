import seeds from '../../assets/nebula-seeds.json'
import { cloudFragment, cloudVertex, dustFragment, dustVertex } from './shaders'

type Renderer = {
  draw: (time: number) => void
  dispose: () => void
}

export function createNebulaRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement): Renderer | null {
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' })
  if (!gl) return null

  const resources: (() => void)[] = []
  const dispose = () => resources.splice(0).reverse().forEach((release) => release())

  function program(vertex: string, fragment: string) {
    const ctx = gl!
    const result = ctx.createProgram()
    if (!result) throw new Error('Could not allocate a WebGL program')
    resources.push(() => ctx.deleteProgram(result))

    for (const [type, source] of [[ctx.VERTEX_SHADER, vertex], [ctx.FRAGMENT_SHADER, fragment]] as const) {
      const shader = ctx.createShader(type)
      if (!shader) throw new Error('Could not allocate a WebGL shader')
      resources.push(() => ctx.deleteShader(shader))
      ctx.shaderSource(shader, source)
      ctx.compileShader(shader)
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) throw new Error('Could not compile the nebula shader')
      ctx.attachShader(result, shader)
    }
    ctx.linkProgram(result)
    if (!ctx.getProgramParameter(result, ctx.LINK_STATUS)) throw new Error('Could not link the nebula shader')

    return {
      program: result,
      time: ctx.getUniformLocation(result, 'uTime'),
    }
  }

  try {
    const cloud = program(cloudVertex, cloudFragment)
    const dust = program(dustVertex, dustFragment)
    const scale = gl.getUniformLocation(dust.program, 'uPixelScale')
    const texture = gl.createTexture()
    const dustVao = gl.createVertexArray()
    const buffer = gl.createBuffer()
    if (texture) resources.push(() => gl.deleteTexture(texture))
    if (dustVao) resources.push(() => gl.deleteVertexArray(dustVao))
    if (buffer) resources.push(() => gl.deleteBuffer(buffer))
    if (!texture || !dustVao || !buffer) throw new Error('Could not allocate nebula textures and buffers')

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    // 低 16 位是 x，高 16 位是 y。
    const positions = new Float32Array(seeds.length * 2)
    seeds.forEach((seed, index) => {
      positions[index * 2] = (seed & 0xffff) / 0xffff
      positions[index * 2 + 1] = (seed >>> 16) / 0xffff
    })
    gl.bindVertexArray(dustVao)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.blendFunc(gl.ONE, gl.ONE)
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Could not initialize the nebula')

    return {
      draw(time) {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.bindVertexArray(null)
        gl.disable(gl.BLEND)
        gl.useProgram(cloud.program)
        gl.uniform1f(cloud.time, time)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        gl.bindVertexArray(dustVao)
        gl.enable(gl.BLEND)
        gl.useProgram(dust.program)
        gl.uniform1f(dust.time, time)
        gl.uniform1f(scale, canvas.width / 604.8)
        gl.drawArrays(gl.POINTS, 0, seeds.length)
      },
      dispose,
    }
  } catch {
    dispose()
    return null
  }
}
