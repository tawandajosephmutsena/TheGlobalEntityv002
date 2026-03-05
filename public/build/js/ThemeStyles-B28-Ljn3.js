import{G as st,ag as Q,ah as X,r as J,j as y,ar as at}from"./vendor-DXkFKuua.js";import{c as q}from"./utils-KOkS45Yz.js";const ct=st.forwardRef((t,r)=>{const o=Q.c(12),{className:s,logoClassName:f}=t,{props:d}=X(),n=d.site||{name:"Ottomate",logo:""},[k,e]=J.useState(!1),[g,b]=J.useState(n.logo);n.logo!==g&&(b(n.logo),e(!1));let a;o[0]!==s?(a=q("flex items-center justify-start shrink-0 !bg-transparent !bg-none overflow-visible border-none shadow-none h-auto w-auto max-w-[300px]",s),o[0]=s,o[1]=a):a=o[1];const u=n.logo&&!k?y.jsx("img",{src:n.logo,alt:n.name,className:q("h-auto w-auto max-h-[50px] object-contain block",n.logo.endsWith(".svg")&&"min-w-[120px]",f),loading:"eager",decoding:"async","data-critical":"true",onError:()=>e(!0)}):null;let c;o[2]!==k||o[3]!==f||o[4]!==n.logo||o[5]!==n.name?(c=!n.logo||n.logo===""||k?y.jsx("div",{className:q("flex aspect-square h-full items-center justify-center rounded-lg bg-agency-accent text-agency-primary shadow-sm shrink-0",f),children:y.jsx("span",{className:"text-xs font-black italic leading-none",children:n.name?.charAt(0)||"A"})}):null,o[2]=k,o[3]=f,o[4]=n.logo,o[5]=n.name,o[6]=c):c=o[6];let i;return o[7]!==r||o[8]!==a||o[9]!==u||o[10]!==c?(i=y.jsxs("div",{ref:r,className:a,children:[u,c]}),o[7]=r,o[8]=a,o[9]=u,o[10]=c,o[11]=i):i=o[11],i});ct.displayName="AppLogo";function mt(){const t=Q.c(42),r=X().props,{themePresets:o,settings:s,theme:f}=r;let d;t[0]!==s?(d=w=>{if(!s)return null;const h=Object.values(s).flat().find(j=>j.key===w);return h?Array.isArray(h.value)?h.value[0]||null:h.value:null},t[0]=s,t[1]=d):d=t[1];const n=d,k=f?.preset||n("theme_preset")||o?.default||"ottostart_default",e=o?.themes[k];if(!e)return null;let g,b,a,u,c,i,F,v,$,m,A,R,S,N,G,L,P,C;if(t[2]!==n||t[3]!==e.dark||t[4]!==e.fonts.mono||t[5]!==e.fonts.sans||t[6]!==e.fonts.serif||t[7]!==e.light||t[8]!==e.radius||t[9]!==r.nonce){const w=n("brand_primary"),T=n("brand_accent"),h=n("brand_background"),j=n("brand_foreground"),U=n("brand_border"),W=n("brand_ring"),Y=n("border_radius"),Z=n("font_weight");let B;t[28]!==n?(B=n("font_weight_heading"),t[28]=n,t[29]=B):B=t[29];const tt=B,z=n("font_display"),M=n("font_body"),I=(()=>{const p=new Set;z&&p.add(z),M&&p.add(M),e.fonts.sans&&p.add(e.fonts.sans),e.fonts.serif&&p.add(e.fonts.serif),e.fonts.mono&&p.add(e.fonts.mono);const V=["serif","sans-serif","monospace","system-ui","Georgia","Arial","Times New Roman"],H=Array.from(p).filter(l=>!V.includes(l));return H.length===0?null:`https://fonts.bunny.net/css?family=${H.map(ft).join("|")}&display=swap`})(),et=lt,D=(p,V,H)=>{const K=H,l=et(p,V);return w&&w.trim()&&(l.primary=w),T&&T.trim()&&(l.accent=T),h&&h.trim()&&(l.background=h),j&&j.trim()&&(l.foreground=j),U&&U.trim()&&(l.border=U),W&&W.trim()&&(l.ring=W),Object.entries(l).filter(it).map(ot=>{const[nt,rt]=ot;return`${K}--${nt}: ${rt};`}).join(`
`)};g=at,t[30]!==I?(m=I&&y.jsx("link",{rel:"stylesheet",href:I}),t[30]=I,t[31]=m):m=t[31],v="theme-variables",$=r.nonce,b=D(e.light,!1,"                        "),A=Y||e.radius||"0.5rem",R=M||e.fonts.sans||"Inter",S=z||e.fonts.sans||"Inter",N=e.fonts.serif||"Georgia",G=e.fonts.mono||"monospace",L=Z||"400",P=tt||"700",C=e.light.primary||"oklch(0.55 0.13 43)",a=e.light.secondary||"oklch(0.69 0.16 290)",u=e.light.accent||"oklch(0.88 0.03 93)",c=e.light.muted||"oklch(0.88 0.04 298)",i=e.light.ring||"oklch(0.56 0.13 42)",F=D(e.dark,!0,"                        "),t[2]=n,t[3]=e.dark,t[4]=e.fonts.mono,t[5]=e.fonts.sans,t[6]=e.fonts.serif,t[7]=e.light,t[8]=e.radius,t[9]=r.nonce,t[10]=g,t[11]=b,t[12]=a,t[13]=u,t[14]=c,t[15]=i,t[16]=F,t[17]=v,t[18]=$,t[19]=m,t[20]=A,t[21]=R,t[22]=S,t[23]=N,t[24]=G,t[25]=L,t[26]=P,t[27]=C}else g=t[10],b=t[11],a=t[12],u=t[13],c=t[14],i=t[15],F=t[16],v=t[17],$=t[18],m=t[19],A=t[20],R=t[21],S=t[22],N=t[23],G=t[24],L=t[25],P=t[26],C=t[27];const O=`
                    :root {
                        ${b}
                        --radius: ${A};
                        --font-sans: "${R}", ui-sans-serif, system-ui, sans-serif;
                        --font-display: "${S}", ui-sans-serif, system-ui, sans-serif;
                        --font-serif: "${N}", ui-serif, Georgia, serif;
                        --font-mono: "${G}", ui-monospace, SFMono-Regular, monospace;
                        --font-weight-base: ${L};
                        --font-weight-heading: ${P};
                        
                        /* Chart colors - derived from theme */
                        --chart-1: ${C};
                        --chart-2: ${a};
                        --chart-3: ${u};
                        --chart-4: ${c};
                        --chart-5: ${i};
                        
                        /* Agency color mappings - light mode */
                        --agency-primary: var(--foreground);
                        --agency-secondary: var(--background);
                        --agency-accent: var(--primary);
                        --agency-accent-soft: var(--secondary);
                        --agency-neutral: var(--muted);
                        --agency-dark: oklch(0.15 0 0);
                        
                        /* Primary RGB for effects (approximate) */
                        --primary-rgb: 194, 94, 46;
                    }
                    
                    .dark {
                        ${F}
                        
                        /* Chart colors - dark mode variants */
                        --chart-1: ${e.dark.primary||"oklch(0.55 0.13 43)"};
                        --chart-2: ${e.dark.secondary||"oklch(0.69 0.16 290)"};
                        --chart-3: ${e.dark.accent||"oklch(0.21 0.01 95)"};
                        --chart-4: ${e.dark.muted||"oklch(0.31 0.05 289)"};
                        --chart-5: ${e.dark.ring||"oklch(0.56 0.13 42)"};
                        
                        /* Agency color mappings - dark mode */
                        --agency-primary: var(--foreground);
                        --agency-secondary: var(--background);
                        --agency-accent: var(--primary);
                        --agency-accent-soft: var(--secondary);
                        --agency-neutral: var(--muted);
                        --agency-dark: oklch(0.10 0 0);
                        
                        /* Primary RGB for effects - dark mode */
                        --primary-rgb: 217, 116, 65;
                    }

                    /* Global Font Applications */
                    body {
                        font-family: var(--font-sans);
                        font-weight: var(--font-weight-base);
                    }

                    h1, h2, h3, h4, h5, h6, .font-display {
                        font-family: var(--font-display);
                        font-weight: var(--font-weight-heading);
                    }
                `;let x;t[32]!==O?(x={__html:O},t[32]=O,t[33]=x):x=t[33];let _;t[34]!==v||t[35]!==$||t[36]!==x?(_=y.jsx("style",{id:v,nonce:$,dangerouslySetInnerHTML:x}),t[34]=v,t[35]=$,t[36]=x,t[37]=_):_=t[37];let E;return t[38]!==g||t[39]!==m||t[40]!==_?(E=y.jsxs(g,{children:[m,_]}),t[38]=g,t[39]=m,t[40]=_,t[41]=E):E=t[41],E}function it(t){const[,r]=t;return r!==void 0}function lt(t,r){const o=t.background||(r?"oklch(0.15 0 0)":"oklch(0.98 0 0)"),s=t.foreground||(r?"oklch(0.95 0 0)":"oklch(0.25 0 0)"),f={card:o,"card-foreground":s,popover:o,"popover-foreground":s,"secondary-foreground":"oklch(0.25 0 0)","muted-foreground":"oklch(0.45 0 0)","accent-foreground":"oklch(0.25 0 0)","destructive-foreground":"oklch(1 0 0)",input:t.border},d={card:o,"card-foreground":s,popover:o,"popover-foreground":s,"secondary-foreground":"oklch(0.95 0 0)","muted-foreground":"oklch(0.70 0 0)","accent-foreground":"oklch(0.95 0 0)","destructive-foreground":"oklch(1 0 0)",input:t.border};return{...r?d:f,...t}}function ft(t){return`${t.toLowerCase().replace(/\s+/g,"-")}:400,500,600,700`}export{ct as A,mt as T};
