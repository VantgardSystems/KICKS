"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Metal líquido en grises: ruido deformado + reflejo especular. Sin color.
const FRAG = `
precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);
 uv+=m*.06;
 float s=t*.05;
 vec2 q=vec2(fbm(uv*1.4+s),fbm(uv*1.4-s+4.2));
 vec2 w=vec2(fbm(uv*1.6+q*2.2+vec2(1.7,9.2)+s*.8),fbm(uv*1.6+q*2.2+vec2(8.3,2.8)-s*.6));
 float f=fbm(uv*1.2+w*2.4);
 float e=.003;
 float fx=fbm(uv*1.2+w*2.4+vec2(e,0.))-f, fy=fbm(uv*1.2+w*2.4+vec2(0.,e))-f;
 vec3 nrm=normalize(vec3(-fx/e*.06,-fy/e*.06,1.));
 vec3 l=normalize(vec3(-.4,.6,.7));
 float dif=clamp(dot(nrm,l),0.,1.);
 float spec=pow(clamp(dot(reflect(-l,nrm),vec3(0,0,1)),0.,1.),28.);
 float band=.5+.5*sin(f*9.+w.x*4.);
 float g=.08+.34*dif*band+.9*spec;
 float vig=smoothstep(1.25,.25,length(uv*vec2(.85,1.)));
 g*=vig;
 gl_FragColor=vec4(vec3(g)*vec3(.95,.97,1.),1.);
}`;

/** Fondo WebGL "liquid chrome" en grises. Se pausa fuera de pantalla y respeta reduced-motion. */
export function LiquidChrome({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Resolución reducida: se ve igual de suave y cuida los 60 fps en celular.
    const scale = window.innerWidth < 768 ? 0.35 : 0.5;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uR, w, h);
    };
    resize();

    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = 0.5 - e.clientY / window.innerHeight;
    };

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const draw = (now: number) => {
      gl.uniform1f(uT, reduce ? 12 : (now - start) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`h-full w-full ${className}`} />;
}
