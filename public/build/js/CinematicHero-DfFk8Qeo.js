import{h as Ie,r as o,j as n}from"./react-core-BXqlJv5t.js";import{c as m}from"./utils-DvuR5xpm.js";import{m as le}from"./animations-DANx9D94.js";import"./vendor-CMfvz2kR.js";import"./hls-vendor-DMc2ke8S.js";import"./media-vendor-1iIBctTt.js";import"./radix-vendor-DU76_okx.js";const Me=ye=>{const e=Ie.c(105),{slides:A,autoPlayInterval:ge}=ye;let C;e[0]!==A?(C=A===void 0?[]:A,e[0]=A,e[1]=C):C=e[1];const a=C,V=ge===void 0?7e3:ge,ne=o.useRef(null),[t,we]=o.useState(0),[X,je]=o.useState(null),[se,ve]=o.useState(!1),[c,he]=o.useState(!0),[d,Ne]=o.useState(!1);let G;e[2]===Symbol.for("react.memo_cache_sentinel")?(G={x:0,y:0},e[2]=G):G=e[2];const[H,ke]=o.useState(G),Y=o.useRef(null),ae=a.length||1,r=a[t]||a[0];r?.title;let W;e[3]!==r?.title?(W=r?.title?.split(" ")||[],e[3]=r?.title,e[4]=W):W=e[4];const ie=W;let O,q;e[5]===Symbol.for("react.memo_cache_sentinel")?(O=()=>{const l=new IntersectionObserver(f=>{const[s]=f;Ne(s.isIntersecting)},{threshold:.1});return ne.current&&l.observe(ne.current),()=>l.disconnect()},q=[],e[5]=O,e[6]=q):(O=e[5],q=e[6]),o.useEffect(O,q);let B;e[7]!==d?(B=l=>{if(!d)return;const{clientX:f,clientY:s}=l,ee=(f/window.innerWidth-.5)*20,te=(s/window.innerHeight-.5)*20;ke({x:ee,y:te})},e[7]=d,e[8]=B):B=e[8];const re=B;let D;e[9]!==t||e[10]!==se?(D=l=>{se||l===t||(ve(!0),he(!1),setTimeout(()=>{je(t),we(l),setTimeout(()=>{he(!0),setTimeout(()=>ve(!1),1200)},500)},600))},e[9]=t,e[10]=se,e[11]=D):D=e[11];const i=D;let F;e[12]!==t||e[13]!==i||e[14]!==ae?(F=()=>{i((t+1)%ae)},e[12]=t,e[13]=i,e[14]=ae,e[15]=F):F=e[15];const J=F;let K,L;if(e[16]!==V||e[17]!==d||e[18]!==J||e[19]!==a.length?(K=()=>{if(!d||a.length<=1){Y.current&&clearInterval(Y.current);return}return Y.current=setInterval(J,V),()=>{Y.current&&clearInterval(Y.current)}},L=[d,J,V,a.length],e[16]=V,e[17]=d,e[18]=J,e[19]=a.length,e[20]=K,e[21]=L):(K=e[20],L=e[21]),o.useEffect(K,L),!a||a.length===0)return null;let Q;e[22]===Symbol.for("react.memo_cache_sentinel")?(Q=n.jsx("div",{className:"absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay animate-grain"}),e[22]=Q):Q=e[22];const oe=`translate3d(${H.x}px, ${H.y}px, 0)`;let u;e[23]!==oe?(u={transform:oe},e[23]=oe,e[24]=u):u=e[24];let x;if(e[25]!==t||e[26]!==X||e[27]!==a){let l;e[29]!==t||e[30]!==X?(l=(f,s)=>{const ee=s===t,te=s===X;return n.jsxs(le.div,{className:m("absolute inset-0 w-full h-full bg-cover bg-[center_45%]","transition-all duration-[2000ms] ease-[cubic-bezier(0.23,1,0.32,1)]",ee&&"opacity-100 z-20 scale-100",te&&"opacity-0 z-10 scale-105 blur-sm",!ee&&!te&&"opacity-0 z-0 scale-110"),style:{backgroundImage:`url('${f.image}')`},children:[n.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"}),n.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"}),n.jsx("div",{className:"absolute inset-0 bg-black/5 backdrop-contrast-[1.1] backdrop-saturate-[1.1]"})]},s)},e[29]=t,e[30]=X,e[31]=l):l=e[31],x=a.map(l),e[25]=t,e[26]=X,e[27]=a,e[28]=x}else x=e[28];let p;e[32]!==u||e[33]!==x?(p=n.jsx(le.div,{className:"absolute inset-[-5%] w-[110%] h-[110%] transition-transform duration-700 ease-out",style:u,children:x}),e[32]=u,e[33]=x,e[34]=p):p=e[34];const ce=d?"opacity-100 translate-y-0":"opacity-0 translate-y-10";let b;e[35]!==ce?(b=m("relative z-40 h-full w-full max-w-[1920px] mx-auto p-8 md:p-24 pt-64 flex flex-col justify-between pointer-events-none transition-all duration-1000",ce),e[35]=ce,e[36]=b):b=e[36];const fe=`translate3d(${-H.x*.5}px, ${-H.y*.5}px, 0)`;let g;e[37]!==fe?(g={transform:fe},e[37]=fe,e[38]=g):g=e[38];const me=`title-${t}`;let v;if(e[39]!==t||e[40]!==c||e[41]!==ie){let l;e[43]!==t||e[44]!==c?(l=(f,s)=>n.jsx(le.span,{className:m("inline-block",c&&"animate-epic-reveal [text-shadow:0_10_40px_rgba(0,0,0,0.6)]"),initial:{opacity:0},animate:{opacity:c?1:0},transition:{delay:s*.15},children:f},`${t}-${s}`),e[43]=t,e[44]=c,e[45]=l):l=e[45],v=ie.map(l),e[39]=t,e[40]=c,e[41]=ie,e[42]=v}else v=e[42];let h;e[46]!==me||e[47]!==v?(h=n.jsx("div",{className:"overflow-visible",children:n.jsx("h1",{className:"font-display font-black text-4xl md:text-6xl lg:text-8xl text-agency-accent leading-[0.85] tracking-tighter max-w-5xl drop-shadow-2xl flex flex-wrap gap-x-6",children:v},me)}),e[46]=me,e[47]=v,e[48]=h):h=e[48];const de=`tagline-${t}`,ue=c&&"animate-slide-left-reveal [animation-delay:0.6s]";let y;e[49]!==ue?(y=m("mt-4 md:mt-20 border-l-[6px] border-agency-accent pl-8 py-3 shrink-0",ue),e[49]=ue,e[50]=y):y=e[50];let w;e[51]!==r.tagline?(w=n.jsx("div",{className:"font-sans font-bold text-xl md:text-2xl text-white tracking-[0.3em] opacity-90",children:r.tagline}),e[51]=r.tagline,e[52]=w):w=e[52];let j;e[53]!==de||e[54]!==y||e[55]!==w?(j=n.jsx("div",{className:y,children:w},de),e[53]=de,e[54]=y,e[55]=w,e[56]=j):j=e[56];let N;e[57]!==h||e[58]!==j?(N=n.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start w-full gap-8",children:[h,j]}),e[57]=h,e[58]=j,e[59]=N):N=e[59];let k;if(e[60]!==t||e[61]!==i||e[62]!==a){let l;e[64]!==t||e[65]!==i?(l=(f,s)=>n.jsxs("button",{className:"flex items-center gap-6 group cursor-pointer transition-all duration-300",onClick:()=>i(s),"aria-label":`Go to slide ${s+1}`,children:[n.jsx("span",{className:m("font-mono text-sm transition-all duration-700",s===t?"text-agency-accent scale-125 font-bold translate-x-2":"text-white/20 group-hover:text-white/60"),children:String(s+1).padStart(2,"0")}),n.jsx("div",{className:"h-12 w-[4px] bg-white/5 relative overflow-hidden rounded-full",children:n.jsx("div",{className:m("absolute top-0 left-0 w-full bg-agency-accent rounded-full transition-all duration-1000 ease-out",s===t?"h-full shadow-[0_0_20px_rgba(var(--agency-accent-rgb),0.8)]":"h-0")})})]},s),e[64]=t,e[65]=i,e[66]=l):l=e[66],k=a.map(l),e[60]=t,e[61]=i,e[62]=a,e[63]=k}else k=e[63];let I;e[67]!==k?(I=n.jsx("div",{className:"hidden md:flex flex-col gap-6 mb-12 pointer-events-auto",children:k}),e[67]=k,e[68]=I):I=e[68];const xe=`subtitle-${t}`,pe=c&&"animate-slide-up-reveal [animation-delay:0.8s]";let S;e[69]!==pe?(S=m("max-w-2xl text-right",pe),e[69]=pe,e[70]=S):S=e[70];let $;e[71]!==r.subtitle?($=n.jsx("p",{className:"font-sans text-xl md:text-3xl text-white/80 font-light leading-relaxed tracking-tight italic",children:r.subtitle}),e[71]=r.subtitle,e[72]=$):$=e[72];const be=c?"scale-x-100":"scale-x-0";let z;e[73]!==be?(z=m("absolute inset-0 bg-gradient-to-r from-transparent via-agency-accent to-agency-accent transition-transform duration-[1.5s] ease-out-expo origin-right",be),e[73]=be,e[74]=z):z=e[74];let _;e[75]!==z?(_=n.jsx("div",{className:"mt-8 relative h-[3px] w-full bg-white/5 self-end overflow-hidden",children:n.jsx("div",{className:z})}),e[75]=z,e[76]=_):_=e[76];let P;e[77]!==xe||e[78]!==S||e[79]!==$||e[80]!==_?(P=n.jsxs("div",{className:S,children:[$,_]},xe),e[77]=xe,e[78]=S,e[79]=$,e[80]=_,e[81]=P):P=e[81];let R;e[82]!==I||e[83]!==P?(R=n.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-end w-full gap-16",children:[I,P]}),e[82]=I,e[83]=P,e[84]=R):R=e[84];let E;if(e[85]!==t||e[86]!==i||e[87]!==a){let l;e[89]!==t||e[90]!==i?(l=(f,s)=>n.jsx("button",{onClick:()=>i(s),"aria-label":`Go to slide ${s+1}`,className:m("h-[3px] transition-all duration-700",s===t?"bg-agency-accent w-12":"bg-white/20 w-4")},s),e[89]=t,e[90]=i,e[91]=l):l=e[91],E=a.map(l),e[85]=t,e[86]=i,e[87]=a,e[88]=E}else E=e[88];let M;e[92]!==E?(M=n.jsx("div",{className:"flex md:hidden justify-center gap-4 absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto",children:E}),e[92]=E,e[93]=M):M=e[93];let T;e[94]!==b||e[95]!==g||e[96]!==N||e[97]!==R||e[98]!==M?(T=n.jsxs(le.div,{className:b,style:g,children:[N,R,M]}),e[94]=b,e[95]=g,e[96]=N,e[97]=R,e[98]=M,e[99]=T):T=e[99];let U;e[100]===Symbol.for("react.memo_cache_sentinel")?(U=n.jsx("style",{children:`
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
            `}),e[100]=U):U=e[100];let Z;return e[101]!==re||e[102]!==p||e[103]!==T?(Z=n.jsxs("section",{ref:ne,className:"relative w-full h-screen overflow-hidden bg-black",onMouseMove:re,children:[Q,p,T,U]}),e[101]=re,e[102]=p,e[103]=T,e[104]=Z):Z=e[104],Z};export{Me as CinematicHero,Me as default};
