// 云流和尘粒的周期取自 App 的 Particles.metal；扫描波沿用 ScanParticles.swift 的设计坐标。
const common = `
precision highp float;
uniform float uTime;
uniform float uScan;
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

float scanFront(float angle, float phase) {
  float sweep = clamp((phase - 0.045) / 0.89, 0.0, 1.0);
  float r = 12.0 + 205.0*(1.0 - pow(1.0 - sweep, 1.18));
  return r + min(1.0, r/65.0)*(10.0*sin(3.0*angle + 0.4) + 7.0*cos(5.0*angle - 0.8));
}

float scanStrength(float phase) {
  return smoothstep(0.045, 0.19, phase) * (1.0 - smoothstep(0.76, 0.97, phase));
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
  vec2 offset = current(vUv) * 4.7 * depth / design;
  vec3 color = texture(uImage, vUv - offset).rgb;
  if (uScan >= 0.0) {
    float phase = fract(uScan / 3.2);
    vec2 delta = (vUv - vec2(0.523, 0.474)) * design;
    delta.y /= 0.87;
    float radius = length(delta);
    float wave = radius - scanFront(atan(delta.y, delta.x), phase);
    float glow = exp(-pow(wave / 11.0, 2.0))*scanStrength(phase);
    float flash = exp(-pow((phase - 0.085) / 0.064, 2.0)) * exp(-radius*radius/750.0);
    color += (0.24*glow*color + 0.45*flash) * vec3(0.80,0.89,1.0);
  }
  result = vec4(color, 1.0);
}
`

export const dustVertex = `#version 300 es
${common}
layout(location=0) in vec2 position;
uniform float uPixelScale;
uniform int uFilaments;
uniform sampler2D uImage;
out vec3 vLight;

float random(float n) { return fract(sin(n*12.9898 + 78.233)*43758.5453); }
void main() {
  float id = float(gl_VertexID) + 1.0;
  float seed = random(id);
  vec2 uv = position;
  if (gl_VertexID < uFilaments) {
    float phase = tau * (seed + (1.0 + floor(3.0 * random(id+2.0))) * uTime / 18.0);
    vec2 radial = normalize(uv - 0.5 + vec2(0.0001));
    vec2 tangent = vec2(-radial.y, radial.x);
    vec2 drift = tangent*sin(phase) + radial*0.32*cos(phase);
    uv += (current(uv)*5.7 + drift*(2.5 + seed*5.0))/design;
    vec3 color = textureLod(uImage, position, 0.0).rgb;
    vLight = (color + vec3(0.08)) * (0.13 + 0.15*seed) * (0.75 + 0.25*sin(phase+0.8));
    gl_PointSize = max(1.0, (0.75 + seed*1.25)*uPixelScale);
  } else {
    float angle = tau * random(id + 1.0);
    float drift = sin(uScan*0.65 + tau*seed);
    float r = 28.0 + 160.0*sqrt(random(id+2.0)) + 13.0*sin(3.0*angle+0.7) + 8.0*cos(5.0*angle) + 2.8*drift;
    angle += 0.024*drift;
    uv = vec2(0.523,0.474) + r*vec2(cos(angle),0.87*sin(angle))/design;
    float phase = fract(uScan/3.2);
    float wave = r - scanFront(angle,phase);
    float lit = scanStrength(phase)*exp(-pow(wave/(wave<0.0?49.0:10.0),2.0));
    vec3 tint = (r<70.0 || seed<0.11) ? vec3(0.82,0.90,1.0) : vec3(1.0,0.64,0.77);
    vLight = tint*(0.26+0.66*seed)*(0.10+0.9*lit);
    gl_PointSize = max(1.0, (1.1+2.4*seed)*uPixelScale);
  }
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
