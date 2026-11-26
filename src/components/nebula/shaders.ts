// 云流和尘粒的周期取自 App 的 Particles.metal。
const common = `
precision highp float;
uniform float uTime;
const float tau = 6.2831853;
const vec2 design = vec2(604.8, 430.4);

vec2 current(vec2 uv) {
  vec2 native = (uv - 0.5) * vec2(1.4052, -1.0);
  float loop = tau * uTime / 18.0;
  return vec2(
    sin(7.2*native.y + 2.7*native.x + loop) + 0.46*sin(14.0*native.x - 2.0*loop),
    -cos(6.8*native.x - 3.1*native.y + loop) - 0.38*cos(12.0*native.y - 2.0*loop)
  );
}

`

export const cloudVertex = `#version 300 es
out vec2 vUv;
void main() {
  vec2 xy = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = vec2(xy.x, 1.0 - xy.y);
  gl_Position = vec4(xy * 2.0 - 1.0, 0.0, 1.0);
}
`

export const cloudFragment = `#version 300 es
${common}
uniform sampler2D uImage;
in vec2 vUv;
out vec4 result;
void main() {
  float depth = 1.0 - smoothstep(0.30, 0.57, length(vUv - 0.5));
  vec2 offset = current(vUv) * 8.0 * depth / design;
  result = vec4(texture(uImage, vUv - offset).rgb, 1.0);
}
`

export const dustVertex = `#version 300 es
${common}
layout(location=0) in vec2 position;
uniform float uPixelScale;
uniform sampler2D uImage;
out vec3 vLight;

float random(float n) { return fract(sin(n*12.9898 + 78.233)*43758.5453); }
void main() {
  float id = float(gl_VertexID) + 1.0;
  float seed = random(id);
  float phase = tau * (seed + (1.0 + floor(3.0 * random(id+2.0))) * uTime / 18.0);
  vec2 radial = normalize(position - 0.5 + vec2(0.0001));
  vec2 tangent = vec2(-radial.y, radial.x);
  vec2 drift = tangent*sin(phase) + radial*0.32*cos(phase);
  vec2 uv = position + (current(position)*8.0 + drift*(2.5 + seed*5.0))/design;
  vec3 color = textureLod(uImage, position, 0.0).rgb;
  vLight = (color + vec3(0.08)) * (0.13 + 0.15*seed) * (0.75 + 0.25*sin(phase+0.8));
  gl_PointSize = max(1.0, (0.75 + seed*1.25)*uPixelScale);
  gl_Position = vec4(2.0*uv.x-1.0, 1.0-2.0*uv.y, 0.0, 1.0);
}
`

export const dustFragment = `#version 300 es
precision highp float;
in vec3 vLight;
out vec4 result;
void main() {
  vec2 local = 2.0*gl_PointCoord-1.0;
  float r2 = dot(local,local);
  float glow = exp(-4.0*r2)*(1.0-smoothstep(0.65,1.0,r2));
  result = vec4(vLight*glow,0.0);
}
`
