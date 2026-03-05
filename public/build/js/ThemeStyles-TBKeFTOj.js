import{R as at,ag as X,ah as Y,r as Q,j as y,aq as ct}from"./vendor-EpJYlCmx.js";import{c as D}from"./utils-CAYuSiDT.js";const it=at.forwardRef((t,n)=>{const o=X.c(12),{className:s,logoClassName:f}=t,{props:d}=Y(),r=d.site||{name:"Ottomate",logo:""},[k,e]=Q.useState(!1),[g,b]=Q.useState(r.logo);r.logo!==g&&(b(r.logo),e(!1));let a;o[0]!==s?(a=D("flex items-center justify-start shrink-0 !bg-transparent !bg-none overflow-visible border-none shadow-none h-auto w-auto max-w-[300px]",s),o[0]=s,o[1]=a):a=o[1];const u=r.logo&&!k?y.jsx("img",{src:r.logo,alt:r.name,className:D("h-auto w-auto max-h-[50px] object-contain block",r.logo.endsWith(".svg")&&"min-w-[120px]",f),loading:"eager",decoding:"async","data-critical":"true",onError:()=>e(!0)}):null;let c;o[2]!==k||o[3]!==f||o[4]!==r.logo||o[5]!==r.name?(c=!r.logo||r.logo===""||k?y.jsx("div",{className:D("flex aspect-square h-full items-center justify-center rounded-lg bg-agency-accent text-agency-primary shadow-sm shrink-0",f),children:y.jsx("span",{className:"text-xs font-black italic leading-none",children:r.name?.charAt(0)||"A"})}):null,o[2]=k,o[3]=f,o[4]=r.logo,o[5]=r.name,o[6]=c):c=o[6];let i;return o[7]!==n||o[8]!==a||o[9]!==u||o[10]!==c?(i=y.jsxs("div",{ref:n,className:a,children:[u,c]}),o[7]=n,o[8]=a,o[9]=u,o[10]=c,o[11]=i):i=o[11],i});it.displayName="AppLogo";function ht(){const t=X.c(43),n=Y().props,{themePresets:o,settings:s,theme:f}=n;let d;t[0]!==s?(d=w=>{if(!s)return null;const h=Object.values(s).flat().find(j=>j.key===w);return h?Array.isArray(h.value)?h.value[0]||null:h.value:null},t[0]=s,t[1]=d):d=t[1];const r=d,k=f?.preset||r("theme_preset")||o?.default||"ottostart_default",e=o?.themes[k];if(!e)return null;let g,b,a,u,c,i,F,A,v,$,m,R,S,N,L,P,C,E,G;if(t[2]!==r||t[3]!==e.dark||t[4]!==e.fonts.mono||t[5]!==e.fonts.sans||t[6]!==e.fonts.serif||t[7]!==e.light||t[8]!==e.radius||t[9]!==n.nonce){const w=r("brand_primary"),B=r("brand_accent"),h=r("brand_background"),j=r("brand_foreground"),q=r("brand_border"),z=r("brand_ring"),Z=r("border_radius"),tt=r("font_weight");let I;t[29]!==r?(I=r("font_weight_heading"),t[29]=r,t[30]=I):I=t[30];const et=I,H=r("font_display"),M=r("font_body"),O=(()=>{const p=new Set;H&&p.add(H),M&&p.add(M),e.fonts.sans&&p.add(e.fonts.sans),e.fonts.serif&&p.add(e.fonts.serif),e.fonts.mono&&p.add(e.fonts.mono);const V=["serif","sans-serif","monospace","system-ui","Georgia","Arial","Times New Roman"],U=Array.from(p).filter(l=>!V.includes(l));return U.length===0?null:`https://fonts.bunny.net/css?family=${U.map(dt).join("|")}&display=swap`})(),ot=ft,K=(p,V,U)=>{const J=U,l=ot(p,V);return w&&w.trim()&&(l.primary=w),B&&B.trim()&&(l.accent=B),h&&h.trim()&&(l.background=h),j&&j.trim()&&(l.foreground=j),q&&q.trim()&&(l.border=q),z&&z.trim()&&(l.ring=z),Object.entries(l).filter(lt).map(rt=>{const[nt,st]=rt;return`${J}--${nt}: ${st};`}).join(`
`)};g=ct,t[31]!==O?(m=O&&y.jsx("link",{rel:"stylesheet",href:O}),t[31]=O,t[32]=m):m=t[32],v="theme-variables",$=n.nonce,b=K(e.light,!1,"                        "),R=Z||e.radius||"0.5rem",S=M||e.fonts.sans||"Inter",N=H||e.fonts.sans||"Inter",L=H||e.fonts.sans||"Inter",P=e.fonts.serif||"Georgia",C=e.fonts.mono||"monospace",E=tt||"400",G=et||"700",a=e.light.primary||"oklch(0.55 0.13 43)",u=e.light.secondary||"oklch(0.69 0.16 290)",c=e.light.accent||"oklch(0.88 0.03 93)",i=e.light.muted||"oklch(0.88 0.04 298)",F=e.light.ring||"oklch(0.56 0.13 42)",A=K(e.dark,!0,"                        "),t[2]=r,t[3]=e.dark,t[4]=e.fonts.mono,t[5]=e.fonts.sans,t[6]=e.fonts.serif,t[7]=e.light,t[8]=e.radius,t[9]=n.nonce,t[10]=g,t[11]=b,t[12]=a,t[13]=u,t[14]=c,t[15]=i,t[16]=F,t[17]=A,t[18]=v,t[19]=$,t[20]=m,t[21]=R,t[22]=S,t[23]=N,t[24]=L,t[25]=P,t[26]=C,t[27]=E,t[28]=G}else g=t[10],b=t[11],a=t[12],u=t[13],c=t[14],i=t[15],F=t[16],A=t[17],v=t[18],$=t[19],m=t[20],R=t[21],S=t[22],N=t[23],L=t[24],P=t[25],C=t[26],E=t[27],G=t[28];const W=`
                    :root {
                        ${b}
                        --radius: ${R};
                        --font-sans: "${S}", ui-sans-serif, system-ui, sans-serif;
                        --font-display: "${N}", ui-sans-serif, system-ui, sans-serif;
                        --font-heading: "${L}", ui-sans-serif, system-ui, sans-serif;
                        --font-serif: "${P}", ui-serif, Georgia, serif;
                        --font-mono: "${C}", ui-monospace, SFMono-Regular, monospace;
                        --font-weight-base: ${E};
                        --font-weight-heading: ${G};
                        
                        /* Chart colors - derived from theme */
                        --chart-1: ${a};
                        --chart-2: ${u};
                        --chart-3: ${c};
                        --chart-4: ${i};
                        --chart-5: ${F};
                        
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
                        ${A}
                        
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
                `;let x;t[33]!==W?(x={__html:W},t[33]=W,t[34]=x):x=t[34];let _;t[35]!==v||t[36]!==$||t[37]!==x?(_=y.jsx("style",{id:v,nonce:$,dangerouslySetInnerHTML:x}),t[35]=v,t[36]=$,t[37]=x,t[38]=_):_=t[38];let T;return t[39]!==g||t[40]!==m||t[41]!==_?(T=y.jsxs(g,{children:[m,_]}),t[39]=g,t[40]=m,t[41]=_,t[42]=T):T=t[42],T}function lt(t){const[,n]=t;return n!==void 0}function ft(t,n){const o=t.background||(n?"oklch(0.15 0 0)":"oklch(0.98 0 0)"),s=t.foreground||(n?"oklch(0.95 0 0)":"oklch(0.25 0 0)"),f={card:o,"card-foreground":s,popover:o,"popover-foreground":s,"primary-foreground":"oklch(0.98 0 0)","secondary-foreground":"oklch(0.25 0 0)","muted-foreground":"oklch(0.45 0 0)","accent-foreground":"oklch(0.25 0 0)","destructive-foreground":"oklch(1 0 0)",input:t.border},d={card:o,"card-foreground":s,popover:o,"popover-foreground":s,"primary-foreground":"oklch(0.98 0 0)","secondary-foreground":"oklch(0.95 0 0)","muted-foreground":"oklch(0.70 0 0)","accent-foreground":"oklch(0.95 0 0)","destructive-foreground":"oklch(1 0 0)",input:t.border};return{...n?d:f,...t}}function dt(t){return`${t.trim().toLowerCase().replace(/\s+/g,"-")}:400,500,600,700`}export{it as A,ht as T};
