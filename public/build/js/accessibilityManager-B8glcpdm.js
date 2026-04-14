var y=Object.defineProperty;var b=(d,e,t)=>e in d?y(d,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[e]=t;var c=(d,e,t)=>b(d,typeof e!="symbol"?e+"":e,t);const r=class r{constructor(){c(this,"reducedMotionQuery",null);c(this,"focusableElements",new Set);c(this,"keyboardNavigationEnabled",!0);c(this,"screenReaderAnnouncements",null);this.initializeReducedMotion(),this.initializeKeyboardNavigation(),this.initializeScreenReaderSupport()}static getInstance(){return r.instance||(r.instance=new r),r.instance}initializeReducedMotion(){typeof window>"u"||(this.reducedMotionQuery=window.matchMedia("(prefers-reduced-motion: reduce)"),this.applyReducedMotionStyles(),this.reducedMotionQuery.addEventListener("change",()=>{this.applyReducedMotionStyles()}))}applyReducedMotionStyles(){if(!this.reducedMotionQuery)return;const e="accessibility-reduced-motion",t=document.getElementById(e);if(this.reducedMotionQuery.matches){if(!t){const o=document.createElement("style");o.id=e,o.textContent=`
                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                            scroll-behavior: auto !important;
                        }
                        
                        .gsap-animation {
                            transform: none !important;
                            opacity: 1 !important;
                        }
                        
                        .parallax-element {
                            transform: none !important;
                        }
                        
                        .animated-element {
                            animation: none !important;
                            transition: none !important;
                        }
                    }
                `,document.head.appendChild(o)}}else t&&t.remove()}initializeKeyboardNavigation(){typeof window>"u"||(document.addEventListener("keydown",e=>{e.key==="Tab"&&document.body.classList.add("keyboard-navigation")}),document.addEventListener("mousedown",()=>{document.body.classList.remove("keyboard-navigation")}),this.addKeyboardNavigationStyles())}addKeyboardNavigationStyles(){const e="accessibility-keyboard-navigation";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
            /* Hide focus outline by default */
            * {
                outline: none;
            }
            
            /* Show focus outline when using keyboard */
            .keyboard-navigation *:focus {
                outline: 2px solid #007acc;
                outline-offset: 2px;
            }
            
            /* Enhanced focus styles for interactive elements */
            .keyboard-navigation button:focus,
            .keyboard-navigation a:focus,
            .keyboard-navigation input:focus,
            .keyboard-navigation textarea:focus,
            .keyboard-navigation select:focus {
                outline: 2px solid #007acc;
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(0, 122, 204, 0.2);
            }
            
            /* Skip link styles */
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 10000;
                border-radius: 4px;
            }
            
            .skip-link:focus {
                top: 6px;
            }
            
            /* Ensure interactive elements are keyboard accessible */
            .keyboard-accessible {
                cursor: pointer;
            }
            
            .keyboard-accessible:focus {
                outline: 2px solid #007acc;
                outline-offset: 2px;
            }
        `,document.head.appendChild(t)}initializeScreenReaderSupport(){typeof window>"u"||(this.screenReaderAnnouncements=document.createElement("div"),this.screenReaderAnnouncements.setAttribute("aria-live","polite"),this.screenReaderAnnouncements.setAttribute("aria-atomic","true"),this.screenReaderAnnouncements.className="sr-only",this.screenReaderAnnouncements.style.cssText=`
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `,document.body.appendChild(this.screenReaderAnnouncements))}addSkipLink(){const e=document.createElement("a");e.href="#main-content",e.className="skip-link",e.textContent="Skip to main content",e.addEventListener("click",t=>{t.preventDefault();const o=document.getElementById("main-content")||document.querySelector("main");o&&(o.focus(),o.scrollIntoView({behavior:"smooth"}))}),document.body.insertBefore(e,document.body.firstChild)}prefersReducedMotion(){return this.reducedMotionQuery?.matches||!1}makeKeyboardAccessible(e,t={}){const{role:o="button",tabIndex:n=0,ariaLabel:s,onClick:i,onKeyDown:a}=t;e.setAttribute("role",o),e.setAttribute("tabindex",n.toString()),s&&e.setAttribute("aria-label",s),e.classList.add("keyboard-accessible");const l=u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),i?i():e.click()),a&&a(u)};e.addEventListener("keydown",l),this.focusableElements.add(e);const p=()=>{e.removeEventListener("keydown",l),this.focusableElements.delete(e)};e.__accessibilityCleanup=p}removeKeyboardAccessibility(e){const t=e.__accessibilityCleanup;t&&(t(),delete e.__accessibilityCleanup)}announceToScreenReader(e,t="polite"){this.screenReaderAnnouncements&&(this.screenReaderAnnouncements.setAttribute("aria-live",t),this.screenReaderAnnouncements.textContent=e,setTimeout(()=>{this.screenReaderAnnouncements&&(this.screenReaderAnnouncements.textContent="")},1e3))}setupFocusTrap(e){const t=["button","[href]","input","select","textarea",'[tabindex]:not([tabindex="-1"])'].join(", "),o=e.querySelectorAll(t),n=o[0],s=o[o.length-1],i=a=>{if(a.key==="Tab"&&(a.shiftKey?document.activeElement===n&&(a.preventDefault(),s.focus()):document.activeElement===s&&(a.preventDefault(),n.focus())),a.key==="Escape"){const l=e.querySelector("[data-close]");l&&l.click()}};return e.addEventListener("keydown",i),n&&n.focus(),()=>{e.removeEventListener("keydown",i)}}createLiveRegion(e,t={}){const{level:o="polite",atomic:n=!0,relevant:s="additions text"}=t,i=document.createElement("div");return i.setAttribute("aria-live",o),i.setAttribute("aria-atomic",n.toString()),i.setAttribute("aria-relevant",s),i.className="sr-only",i.style.cssText=`
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `,e.appendChild(i),i}enhanceFormAccessibility(e){e.querySelectorAll("input, textarea, select").forEach(o=>{const n=o;if(!e.querySelector(`label[for="${n.id}"]`)&&n.id){const a=document.createElement("label");a.setAttribute("for",n.id),a.textContent=n.placeholder||n.name||"Input field",a.className="sr-only",n.parentNode?.insertBefore(a,n)}const i=document.createElement("div");i.id=`${n.id}-error`,i.className="sr-only",i.setAttribute("role","alert"),n.parentNode?.appendChild(i),n.setAttribute("aria-describedby",i.id),n.addEventListener("blur",()=>{n.checkValidity()?(i.textContent="",i.classList.add("sr-only"),n.removeAttribute("aria-invalid")):(i.textContent=n.validationMessage,i.classList.remove("sr-only"),n.setAttribute("aria-invalid","true"))})})}getStats(){return{reducedMotionEnabled:this.prefersReducedMotion(),keyboardNavigationEnabled:this.keyboardNavigationEnabled,focusableElementsCount:this.focusableElements.size,hasScreenReaderSupport:!!this.screenReaderAnnouncements}}cleanup(){this.reducedMotionQuery&&this.reducedMotionQuery.removeEventListener("change",this.applyReducedMotionStyles),this.focusableElements.forEach(t=>{this.removeKeyboardAccessibility(t)}),this.focusableElements.clear(),this.screenReaderAnnouncements&&(this.screenReaderAnnouncements.remove(),this.screenReaderAnnouncements=null),["accessibility-reduced-motion","accessibility-keyboard-navigation"].forEach(t=>{const o=document.getElementById(t);o&&o.remove()})}};c(r,"instance");let m=r;const f=m.getInstance();typeof window<"u"&&window.addEventListener("beforeunload",()=>{f.cleanup()});export{f as a};
