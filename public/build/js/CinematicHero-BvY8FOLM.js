import{h as Ie,r as o,j as s}from"./react-core-BXqlJv5t.js";import{c as m}from"./utils-CYHuScTO.js";import{m as le}from"./animations-DANx9D94.js";import"./vendor-DszLFBQi.js";import"./hls-vendor-DMc2ke8S.js";import"./media-vendor-D3lF1L9W.js";import"./radix-vendor-Bi5U96ZT.js";const Me=ye=>{const e=Ie.c(106),{slides:A,autoPlayInterval:ge}=ye;let C;e[0]!==A?(C=A===void 0?[]:A,e[0]=A,e[1]=C):C=e[1];const a=C,V=ge===void 0?7e3:ge,se=o.useRef(null),[t,we]=o.useState(0),[X,je]=o.useState(null),[ne,ve]=o.useState(!1),[c,he]=o.useState(!0),[d,Ne]=o.useState(!1);let G;e[2]===Symbol.for("react.memo_cache_sentinel")?(G={x:0,y:0},e[2]=G):G=e[2];const[H,ke]=o.useState(G),Y=o.useRef(null),ae=a.length||1,r=a[t]||a[0];r?.title;let W;e[3]!==r?.title?(W=r?.title?.split(" ")||[],e[3]=r?.title,e[4]=W):W=e[4];const ie=W;let O,q;e[5]===Symbol.for("react.memo_cache_sentinel")?(O=()=>{const l=new IntersectionObserver(f=>{const[n]=f;Ne(n.isIntersecting)},{threshold:.1});return se.current&&l.observe(se.current),()=>l.disconnect()},q=[],e[5]=O,e[6]=q):(O=e[5],q=e[6]),o.useEffect(O,q);let B;e[7]!==d?(B=l=>{if(!d)return;const{clientX:f,clientY:n}=l,ee=(f/window.innerWidth-.5)*20,te=(n/window.innerHeight-.5)*20;ke({x:ee,y:te})},e[7]=d,e[8]=B):B=e[8];const re=B;let D;e[9]!==t||e[10]!==ne?(D=l=>{ne||l===t||(ve(!0),he(!1),setTimeout(()=>{je(t),we(l),setTimeout(()=>{he(!0),setTimeout(()=>ve(!1),1200)},500)},600))},e[9]=t,e[10]=ne,e[11]=D):D=e[11];const i=D;let F;e[12]!==t||e[13]!==i||e[14]!==ae?(F=()=>{i((t+1)%ae)},e[12]=t,e[13]=i,e[14]=ae,e[15]=F):F=e[15];const J=F;let K,L;if(e[16]!==V||e[17]!==d||e[18]!==J||e[19]!==a.length?(K=()=>{if(!d||a.length<=1){Y.current&&clearInterval(Y.current);return}return Y.current=setInterval(J,V),()=>{Y.current&&clearInterval(Y.current)}},L=[d,J,V,a.length],e[16]=V,e[17]=d,e[18]=J,e[19]=a.length,e[20]=K,e[21]=L):(K=e[20],L=e[21]),o.useEffect(K,L),!a||a.length===0){let l;return e[22]===Symbol.for("react.memo_cache_sentinel")?(l=s.jsx("div",{className:"relative w-full h-screen bg-black"}),e[22]=l):l=e[22],l}let Q;e[23]===Symbol.for("react.memo_cache_sentinel")?(Q=s.jsx("div",{className:"absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay animate-grain"}),e[23]=Q):Q=e[23];const oe=`translate3d(${H.x}px, ${H.y}px, 0)`;let u;e[24]!==oe?(u={transform:oe},e[24]=oe,e[25]=u):u=e[25];let x;if(e[26]!==t||e[27]!==X||e[28]!==a){let l;e[30]!==t||e[31]!==X?(l=(f,n)=>{const ee=n===t,te=n===X;return s.jsxs(le.div,{className:m("absolute inset-0 w-full h-full bg-cover bg-[center_45%]","transition-all duration-[2000ms] ease-[cubic-bezier(0.23,1,0.32,1)]",ee&&"opacity-100 z-20 scale-100",te&&"opacity-0 z-10 scale-105 blur-sm",!ee&&!te&&"opacity-0 z-0 scale-110"),style:{backgroundImage:`url('${f.image}')`},children:[s.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"}),s.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"}),s.jsx("div",{className:"absolute inset-0 bg-black/5 backdrop-contrast-[1.1] backdrop-saturate-[1.1]"})]},n)},e[30]=t,e[31]=X,e[32]=l):l=e[32],x=a.map(l),e[26]=t,e[27]=X,e[28]=a,e[29]=x}else x=e[29];let p;e[33]!==u||e[34]!==x?(p=s.jsx(le.div,{className:"absolute inset-[-5%] w-[110%] h-[110%] transition-transform duration-700 ease-out",style:u,children:x}),e[33]=u,e[34]=x,e[35]=p):p=e[35];const ce=d?"opacity-100 translate-y-0":"opacity-0 translate-y-10";let b;e[36]!==ce?(b=m("relative z-40 h-full w-full max-w-[1920px] mx-auto p-8 md:p-24 pt-64 flex flex-col justify-between pointer-events-none transition-all duration-1000",ce),e[36]=ce,e[37]=b):b=e[37];const fe=`translate3d(${-H.x*.5}px, ${-H.y*.5}px, 0)`;let g;e[38]!==fe?(g={transform:fe},e[38]=fe,e[39]=g):g=e[39];const me=`title-${t}`;let v;if(e[40]!==t||e[41]!==c||e[42]!==ie){let l;e[44]!==t||e[45]!==c?(l=(f,n)=>s.jsx(le.span,{className:m("inline-block",c&&"animate-epic-reveal [text-shadow:0_10_40px_rgba(0,0,0,0.6)]"),initial:{opacity:0},animate:{opacity:c?1:0},transition:{delay:n*.15},children:f},`${t}-${n}`),e[44]=t,e[45]=c,e[46]=l):l=e[46],v=ie.map(l),e[40]=t,e[41]=c,e[42]=ie,e[43]=v}else v=e[43];let h;e[47]!==me||e[48]!==v?(h=s.jsx("div",{className:"overflow-visible",children:s.jsx("h1",{className:"font-display font-black text-4xl md:text-6xl lg:text-8xl text-agency-accent leading-[0.85] tracking-tighter max-w-5xl drop-shadow-2xl flex flex-wrap gap-x-6",children:v},me)}),e[47]=me,e[48]=v,e[49]=h):h=e[49];const de=`tagline-${t}`,ue=c&&"animate-slide-left-reveal [animation-delay:0.6s]";let y;e[50]!==ue?(y=m("mt-4 md:mt-20 border-l-[6px] border-agency-accent pl-8 py-3 shrink-0",ue),e[50]=ue,e[51]=y):y=e[51];let w;e[52]!==r.tagline?(w=s.jsx("div",{className:"font-sans font-bold text-xl md:text-2xl text-white tracking-[0.3em] opacity-90",children:r.tagline}),e[52]=r.tagline,e[53]=w):w=e[53];let j;e[54]!==de||e[55]!==y||e[56]!==w?(j=s.jsx("div",{className:y,children:w},de),e[54]=de,e[55]=y,e[56]=w,e[57]=j):j=e[57];let N;e[58]!==h||e[59]!==j?(N=s.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start w-full gap-8",children:[h,j]}),e[58]=h,e[59]=j,e[60]=N):N=e[60];let k;if(e[61]!==t||e[62]!==i||e[63]!==a){let l;e[65]!==t||e[66]!==i?(l=(f,n)=>s.jsxs("button",{className:"flex items-center gap-6 group cursor-pointer transition-all duration-300",onClick:()=>i(n),"aria-label":`Go to slide ${n+1}`,children:[s.jsx("span",{className:m("font-mono text-sm transition-all duration-700",n===t?"text-agency-accent scale-125 font-bold translate-x-2":"text-white/20 group-hover:text-white/60"),children:String(n+1).padStart(2,"0")}),s.jsx("div",{className:"h-12 w-[4px] bg-white/5 relative overflow-hidden rounded-full",children:s.jsx("div",{className:m("absolute top-0 left-0 w-full bg-agency-accent rounded-full transition-all duration-1000 ease-out",n===t?"h-full shadow-[0_0_20px_rgba(var(--agency-accent-rgb),0.8)]":"h-0")})})]},n),e[65]=t,e[66]=i,e[67]=l):l=e[67],k=a.map(l),e[61]=t,e[62]=i,e[63]=a,e[64]=k}else k=e[64];let I;e[68]!==k?(I=s.jsx("div",{className:"hidden md:flex flex-col gap-6 mb-12 pointer-events-auto",children:k}),e[68]=k,e[69]=I):I=e[69];const xe=`subtitle-${t}`,pe=c&&"animate-slide-up-reveal [animation-delay:0.8s]";let S;e[70]!==pe?(S=m("max-w-2xl text-right",pe),e[70]=pe,e[71]=S):S=e[71];let $;e[72]!==r.subtitle?($=s.jsx("p",{className:"font-sans text-xl md:text-3xl text-white/80 font-light leading-relaxed tracking-tight italic",children:r.subtitle}),e[72]=r.subtitle,e[73]=$):$=e[73];const be=c?"scale-x-100":"scale-x-0";let _;e[74]!==be?(_=m("absolute inset-0 bg-gradient-to-r from-transparent via-agency-accent to-agency-accent transition-transform duration-[1.5s] ease-out-expo origin-right",be),e[74]=be,e[75]=_):_=e[75];let z;e[76]!==_?(z=s.jsx("div",{className:"mt-8 relative h-[3px] w-full bg-white/5 self-end overflow-hidden",children:s.jsx("div",{className:_})}),e[76]=_,e[77]=z):z=e[77];let P;e[78]!==xe||e[79]!==S||e[80]!==$||e[81]!==z?(P=s.jsxs("div",{className:S,children:[$,z]},xe),e[78]=xe,e[79]=S,e[80]=$,e[81]=z,e[82]=P):P=e[82];let R;e[83]!==I||e[84]!==P?(R=s.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-end w-full gap-16",children:[I,P]}),e[83]=I,e[84]=P,e[85]=R):R=e[85];let E;if(e[86]!==t||e[87]!==i||e[88]!==a){let l;e[90]!==t||e[91]!==i?(l=(f,n)=>s.jsx("button",{onClick:()=>i(n),"aria-label":`Go to slide ${n+1}`,className:m("h-[3px] transition-all duration-700",n===t?"bg-agency-accent w-12":"bg-white/20 w-4")},n),e[90]=t,e[91]=i,e[92]=l):l=e[92],E=a.map(l),e[86]=t,e[87]=i,e[88]=a,e[89]=E}else E=e[89];let M;e[93]!==E?(M=s.jsx("div",{className:"flex md:hidden justify-center gap-4 absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto",children:E}),e[93]=E,e[94]=M):M=e[94];let T;e[95]!==b||e[96]!==g||e[97]!==N||e[98]!==R||e[99]!==M?(T=s.jsxs(le.div,{className:b,style:g,children:[N,R,M]}),e[95]=b,e[96]=g,e[97]=N,e[98]=R,e[99]=M,e[100]=T):T=e[100];let U;e[101]===Symbol.for("react.memo_cache_sentinel")?(U=s.jsx("style",{children:`
                @keyframes epic-reveal {
                    0% {
                        opacity: 0;
                        transform: translateY(100px) scale(1.1) rotateX(-20deg);
                        filter: blur(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1) rotateX(0deg);
                        filter: blur(0);
                    }
                }
                
                @keyframes slide-left-reveal {
                    0% { opacity: 0; transform: translateX(50px); filter: blur(10px); }
                    100% { opacity: 1; transform: translateX(0); filter: blur(0); }
                }
                
                @keyframes slide-up-reveal {
                    0% { opacity: 0; transform: translateY(30px); filter: blur(5px); }
                    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
                }

                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-1%, -1%); }
                    30% { transform: translate(1%, 1%); }
                    50% { transform: translate(-1%, 1%); }
                    70% { transform: translate(1%, -1%); }
                }

                .animate-epic-reveal {
                    opacity: 0;
                    animation: epic-reveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .animate-slide-left-reveal {
                    opacity: 0;
                    animation: slide-left-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .animate-slide-up-reveal {
                    opacity: 0;
                    animation: slide-up-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .animate-grain {
                    background-image: url('https://grainy-gradients.vercel.app/noise.svg');
                    animation: grain 0.5s steps(10) infinite;
                }

                .ease-out-expo {
                    transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
                }
            `}),e[101]=U):U=e[101];let Z;return e[102]!==re||e[103]!==p||e[104]!==T?(Z=s.jsxs("section",{ref:se,className:"relative w-full h-screen overflow-hidden bg-black",onMouseMove:re,children:[Q,p,T,U]}),e[102]=re,e[103]=p,e[104]=T,e[105]=Z):Z=e[105],Z};export{Me as CinematicHero,Me as default};
