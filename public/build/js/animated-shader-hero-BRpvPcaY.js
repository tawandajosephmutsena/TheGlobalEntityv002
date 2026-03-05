var _=Object.defineProperty;var A=(s,e,t)=>e in s?_(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var o=(s,e,t)=>A(s,typeof e!="symbol"?e+"":e,t);import{ag as R,j as n,r as w}from"./vendor-DXkFKuua.js";import{c as E}from"./utils-KOkS45Yz.js";import{c as P}from"./app-BxiRWY2C.js";const C=`#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec3 u_color1;
uniform vec3 u_color2;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}

void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		
		// Use dynamic branding colors
		vec3 brandCol = mix(u_color1, u_color2, sin(i + T*0.2)*0.5+0.5);
		col+=.00125/d * (brandCol + 0.5);
		
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col, brandCol * bg * 0.4, d);
	}
	O=vec4(col,1);
}`;class N{constructor(e,t){o(this,"canvas");o(this,"gl");o(this,"program",null);o(this,"vs",null);o(this,"fs",null);o(this,"buffer",null);o(this,"scale");o(this,"shaderSource");o(this,"mouseMove",[0,0]);o(this,"mouseCoords",[0,0]);o(this,"pointerCoords",[0,0]);o(this,"nbrOfPointers",0);o(this,"color1",[.8,.4,.2]);o(this,"color2",[.2,.5,.8]);o(this,"vertexSrc",`#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`);o(this,"vertices",[-1,1,-1,-1,1,1,1,-1]);this.canvas=e,this.scale=t,this.gl=e.getContext("webgl2"),this.gl.viewport(0,0,e.width*t,e.height*t),this.shaderSource=C}updateShader(e){this.reset(),this.shaderSource=e,this.setup(),this.init()}updateColors(e,t){this.color1=e,this.color2=t}updateMove(e){this.mouseMove=e}updateMouse(e){this.mouseCoords=e}updatePointerCoords(e){this.pointerCoords=e}updatePointerCount(e){this.nbrOfPointers=e}updateScale(e){this.scale=e,this.gl.viewport(0,0,this.canvas.width*e,this.canvas.height*e)}compile(e,t){const r=this.gl;r.shaderSource(e,t),r.compileShader(e),r.getShaderParameter(e,r.COMPILE_STATUS)||r.getShaderInfoLog(e)}test(e){let t=null;const r=this.gl,i=r.createShader(r.FRAGMENT_SHADER);return r.shaderSource(i,e),r.compileShader(i),r.getShaderParameter(i,r.COMPILE_STATUS)||(t=r.getShaderInfoLog(i)),r.deleteShader(i),t}reset(){const e=this.gl;this.program&&!e.getProgramParameter(this.program,e.DELETE_STATUS)&&(this.vs&&(e.detachShader(this.program,this.vs),e.deleteShader(this.vs)),this.fs&&(e.detachShader(this.program,this.fs),e.deleteShader(this.fs)),e.deleteProgram(this.program))}setup(){const e=this.gl;this.vs=e.createShader(e.VERTEX_SHADER),this.fs=e.createShader(e.FRAGMENT_SHADER),this.compile(this.vs,this.vertexSrc),this.compile(this.fs,this.shaderSource),this.program=e.createProgram(),e.attachShader(this.program,this.vs),e.attachShader(this.program,this.fs),e.linkProgram(this.program),e.getProgramParameter(this.program,e.LINK_STATUS)}init(){const e=this.gl,t=this.program;this.buffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(this.vertices),e.STATIC_DRAW);const r=e.getAttribLocation(t,"position");e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0),t.resolution=e.getUniformLocation(t,"resolution"),t.time=e.getUniformLocation(t,"time"),t.move=e.getUniformLocation(t,"move"),t.touch=e.getUniformLocation(t,"touch"),t.pointerCount=e.getUniformLocation(t,"pointerCount"),t.pointers=e.getUniformLocation(t,"pointers"),t.u_color1=e.getUniformLocation(t,"u_color1"),t.u_color2=e.getUniformLocation(t,"u_color2")}render(e=0){const t=this.gl,r=this.program;if(!r||t.getProgramParameter(r,t.DELETE_STATUS))return;t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(r),t.bindBuffer(t.ARRAY_BUFFER,this.buffer);const i=r;t.uniform2f(i.resolution,this.canvas.width,this.canvas.height),t.uniform1f(i.time,e*.001),t.uniform2f(i.move,this.mouseMove[0],this.mouseMove[1]),t.uniform2f(i.touch,this.mouseCoords[0],this.mouseCoords[1]),t.uniform1i(i.pointerCount,this.nbrOfPointers),t.uniform2fv(i.pointers,this.pointerCoords),t.uniform3fv(i.u_color1,new Float32Array(this.color1)),t.uniform3fv(i.u_color2,new Float32Array(this.color2)),t.drawArrays(t.TRIANGLE_STRIP,0,4)}}class L{constructor(e,t){o(this,"scale");o(this,"active",!1);o(this,"pointers",new Map);o(this,"lastCoords",[0,0]);o(this,"moves",[0,0]);o(this,"element");this.element=e,this.scale=t;const r=(i,a,u,l)=>[u*a,i.height-l*a];e.addEventListener("pointerdown",i=>{this.active=!0,this.pointers.set(i.pointerId,r(e,this.getScale(),i.clientX,i.clientY))}),e.addEventListener("pointerup",i=>{this.count===1&&(this.lastCoords=this.first),this.pointers.delete(i.pointerId),this.active=this.pointers.size>0}),e.addEventListener("pointerleave",i=>{this.count===1&&(this.lastCoords=this.first),this.pointers.delete(i.pointerId),this.active=this.pointers.size>0}),e.addEventListener("pointermove",i=>{if(!this.active)return;const a=e.getBoundingClientRect(),u=i.clientX-a.left,l=i.clientY-a.top;this.lastCoords=[u*this.scale,e.height-l*this.scale],this.pointers.set(i.pointerId,[u*this.scale,e.height-l*this.scale]),this.moves=[this.moves[0]+i.movementX,this.moves[1]+i.movementY]})}getScale(){return this.scale}updateScale(e){this.scale=e}get count(){return this.pointers.size}get move(){return this.moves}get coords(){return this.pointers.size>0?Array.from(this.pointers.values()).flat():[0,0]}get first(){return this.pointers.values().next().value||this.lastCoords}}const T=()=>{const s=R.c(3),e=w.useRef(null),t=w.useRef(0),r=w.useRef(null),i=w.useRef(null),{appearance:a}=P(),u=j;let l;s[0]===Symbol.for("react.memo_cache_sentinel")?(l=()=>{if(!e.current)return;const m=e.current,f=Math.max(1,.5*window.devicePixelRatio);r.current=new N(m,f),i.current=new L(m,f),r.current.setup(),r.current.init();const v=()=>{if(!r.current)return;const c=getComputedStyle(document.documentElement),d=c.getPropertyValue("--agency-accent").trim()||"#C25E2E",x=c.getPropertyValue("--agency-accent-soft").trim()||"#FF8C00";r.current.updateColors(u(d),u(x))},h=()=>{if(!e.current)return;const c=e.current,d=Math.max(1,.5*window.devicePixelRatio);c.width=window.innerWidth*d,c.height=window.innerHeight*d,r.current&&r.current.updateScale(d)};h(),v(),r.current.test(C)===null&&r.current.updateShader(C);const p=c=>{!r.current||!i.current||(r.current.updateMouse(i.current.first),r.current.updatePointerCount(i.current.count),r.current.updatePointerCoords(i.current.coords),r.current.updateMove(i.current.move),r.current.render(c),t.current=requestAnimationFrame(p))};return p(0),window.addEventListener("resize",h),()=>{window.removeEventListener("resize",h),t.current&&cancelAnimationFrame(t.current),r.current&&r.current.reset()}},s[0]=l):l=s[0];let g;return s[1]!==a?(g=[a],s[1]=a,s[2]=g):g=s[2],w.useEffect(l,g),e},B=s=>{const e=R.c(28),{trustBadge:t,headline:r,subtitle:i,buttons:a,className:u}=s,l=u===void 0?"":u,g=T();let m;e[0]!==l?(m=E("relative w-full h-screen overflow-hidden bg-black font-sans",l),e[0]=l,e[1]=m):m=e[1];let f;e[2]!==g?(f=n.jsx("canvas",{ref:g,className:"absolute inset-0 w-full h-full object-contain bg-black"}),e[2]=g,e[3]=f):f=e[3];let v;e[4]!==t?(v=t&&n.jsx("div",{className:"mb-8 animate-shader-fade-in-down",children:n.jsxs("div",{className:"flex items-center gap-2 px-6 py-3 bg-agency-accent/10 backdrop-blur-md border border-agency-accent/30 rounded-full text-sm",children:[t.icons&&n.jsx("div",{className:"flex gap-1",children:t.icons.map(F)}),n.jsx("span",{className:"text-white/80 font-medium tracking-wide",children:t.text})]})}),e[4]=t,e[5]=v):v=e[5];let h;e[6]!==r.line1?(h=n.jsx("span",{className:"block bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent",children:r.line1}),e[6]=r.line1,e[7]=h):h=e[7];let p;e[8]!==r.line2?(p=n.jsx("span",{className:"block italic text-agency-accent drop-shadow-[0_0_50px_var(--agency-accent)]",children:r.line2}),e[8]=r.line2,e[9]=p):p=e[9];let c;e[10]!==h||e[11]!==p?(c=n.jsx("div",{className:"space-y-4",children:n.jsxs("h1",{className:"text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none animate-shader-fade-in-up shader-delay-200",children:[h,p]})}),e[10]=h,e[11]=p,e[12]=c):c=e[12];let d;e[13]!==i?(d=n.jsx("div",{className:"max-w-2xl mx-auto animate-shader-fade-in-up shader-delay-600",children:n.jsx("p",{className:"text-lg md:text-xl lg:text-2xl text-white/60 font-medium leading-relaxed",children:i})}),e[13]=i,e[14]=d):d=e[14];let x;e[15]!==a?(x=a&&n.jsxs("div",{className:"flex flex-col sm:flex-row gap-6 justify-center mt-12 animate-shader-fade-in-up shader-delay-800",children:[a.primary&&n.jsxs("button",{onClick:a.primary.onClick,className:"group relative px-10 py-5 bg-agency-accent text-white rounded-full font-black text-xs uppercase tracking-widest transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_var(--agency-accent)] overflow-hidden",children:[n.jsx("span",{className:"relative z-10",children:a.primary.text}),n.jsx("div",{className:"absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"})]}),a.secondary&&n.jsx("button",{onClick:a.secondary.onClick,className:"px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-agency-accent/50 text-white rounded-full font-black text-xs uppercase tracking-widest transition-all duration-500 hover:scale-105 backdrop-blur-sm",children:a.secondary.text})]}),e[15]=a,e[16]=x):x=e[16];let b;e[17]!==c||e[18]!==d||e[19]!==x?(b=n.jsxs("div",{className:"text-center space-y-6 max-w-5xl mx-auto px-4",children:[c,d,x]}),e[17]=c,e[18]=d,e[19]=x,e[20]=b):b=e[20];let S;e[21]!==b||e[22]!==v?(S=n.jsxs("div",{className:"absolute inset-0 z-10 flex flex-col items-center justify-center text-white p-6",children:[v,b]}),e[21]=b,e[22]=v,e[23]=S):S=e[23];let y;return e[24]!==S||e[25]!==m||e[26]!==f?(y=n.jsxs("div",{className:m,children:[f,S]}),e[24]=S,e[25]=m,e[26]=f,e[27]=y):y=e[27],y};function j(s){const e=document.createElement("div");e.style.color=s,document.body.appendChild(e);const t=getComputedStyle(e).color;document.body.removeChild(e);const r=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return r?[parseInt(r[1])/255,parseInt(r[2])/255,parseInt(r[3])/255]:[.8,.4,.2]}function F(s,e){return n.jsx("span",{className:"text-agency-accent drop-shadow-sm",children:s},e)}export{B as A};
