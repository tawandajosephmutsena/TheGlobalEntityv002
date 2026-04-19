var X=Object.defineProperty;var Q=(n,e,t)=>e in n?X(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var l=(n,e,t)=>Q(n,typeof e!="symbol"?e+"":e,t);import{h as C,r as E}from"./react-core-BXqlJv5t.js";import{S as q,g as w,a as ee}from"./gsap-D0OrNSjK.js";import{aZ as te}from"./vendor-B5RUxGrb.js";import{a as b}from"./accessibilityManager-B8glcpdm.js";const O=class O{constructor(){l(this,"isMonitoring",!1);l(this,"frameCount",0);l(this,"lastFrameTime",0);l(this,"frameRates",[]);l(this,"animationMetrics",new Map);l(this,"memoryUsage",[]);l(this,"performanceObserver",null);l(this,"rafId",null);this.initializePerformanceObserver()}static getInstance(){return O.instance||(O.instance=new O),O.instance}initializePerformanceObserver(){if(!(typeof window>"u"||!window.PerformanceObserver))try{this.performanceObserver=new PerformanceObserver(e=>{e.getEntries().forEach(i=>{i.entryType==="measure"&&i.name.startsWith("animation-")&&this.recordAnimationMetric(i.name,i.duration)})}),this.performanceObserver.observe({entryTypes:["measure"]})}catch{}}startMonitoring(){this.isMonitoring||(this.isMonitoring=!0,this.lastFrameTime=performance.now(),this.frameCount=0,this.frameRates=[],this.rafId=requestAnimationFrame(this.measureFrameRate.bind(this)),this.startMemoryMonitoring())}stopMonitoring(){this.isMonitoring=!1,this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=null)}measureFrameRate(){if(!this.isMonitoring)return;const e=performance.now(),t=e-this.lastFrameTime;if(this.frameCount++,t>=1e3){const i=Math.round(this.frameCount*1e3/t);this.frameRates.push(i),this.frameRates.length>60&&this.frameRates.shift(),this.frameCount=0,this.lastFrameTime=e}this.rafId=requestAnimationFrame(this.measureFrameRate.bind(this))}startMemoryMonitoring(){if(typeof window>"u"||!performance.memory)return;const e=()=>{if(!this.isMonitoring)return;const t=performance.memory;this.memoryUsage.push({timestamp:Date.now(),usedJSHeapSize:t.usedJSHeapSize,totalJSHeapSize:t.totalJSHeapSize,jsHeapSizeLimit:t.jsHeapSizeLimit}),this.memoryUsage.length>100&&this.memoryUsage.shift(),this.detectMemoryLeaks(),setTimeout(e,5e3)};e()}detectMemoryLeaks(){if(this.memoryUsage.length<10)return;const e=this.memoryUsage.slice(-10);this.calculateMemoryTrend(e)>1024*1024&&this.logMemoryWarning(e)}calculateMemoryTrend(e){if(e.length<2)return 0;const t=e[0].usedJSHeapSize;return e[e.length-1].usedJSHeapSize-t}logMemoryWarning(e){const t=e[e.length-1];Math.round(t.usedJSHeapSize/1024/1024),Math.round(t.totalJSHeapSize/1024/1024)}recordAnimationMetric(e,t,i){this.animationMetrics.has(e)||this.animationMetrics.set(e,[]);const s=this.animationMetrics.get(e);s.push({timestamp:Date.now(),duration:t,metadata:i}),s.length>100&&s.shift()}startAnimationMeasure(e){typeof performance>"u"||performance.mark(`${e}-start`)}endAnimationMeasure(e,t){if(typeof performance>"u")return;const i=`${e}-end`,s=`animation-${e}`;performance.mark(i),performance.measure(s,`${e}-start`,i);const o=performance.getEntriesByName(s);if(o.length>0){const r=o[o.length-1];this.recordAnimationMetric(e,r.duration,t)}performance.clearMarks(`${e}-start`),performance.clearMarks(i),performance.clearMeasures(s)}getFrameRateStats(){if(this.frameRates.length===0)return{current:0,average:0,min:0,max:0,samples:0};const e=this.frameRates[this.frameRates.length-1]||0,t=Math.round(this.frameRates.reduce((o,r)=>o+r,0)/this.frameRates.length),i=Math.min(...this.frameRates),s=Math.max(...this.frameRates);return{current:e,average:t,min:i,max:s,samples:this.frameRates.length}}getAnimationStats(){const e={};return this.animationMetrics.forEach((t,i)=>{if(t.length===0)return;const s=t.map(c=>c.duration),o=s.reduce((c,u)=>c+u,0)/s.length,r=Math.min(...s),d=Math.max(...s),a=t.slice(-10);e[i]={count:t.length,averageDuration:Math.round(o*100)/100,minDuration:Math.round(r*100)/100,maxDuration:Math.round(d*100)/100,recentAverage:a.length>0?Math.round(a.reduce((c,u)=>c+u.duration,0)/a.length*100)/100:0}}),e}getMemoryStats(){if(typeof window>"u"||!performance.memory)return null;const e=performance.memory,t={usedJSHeapSize:e.usedJSHeapSize,totalJSHeapSize:e.totalJSHeapSize,jsHeapSizeLimit:e.jsHeapSizeLimit};let i=0;if(this.memoryUsage.length>=2){const s=this.memoryUsage.slice(-10);i=this.calculateMemoryTrend(s)}return{current:t,trend:i,samples:this.memoryUsage.length,usedMB:Math.round(t.usedJSHeapSize/1024/1024),totalMB:Math.round(t.totalJSHeapSize/1024/1024),limitMB:Math.round(t.jsHeapSizeLimit/1024/1024)}}getPerformanceReport(){return{frameRate:this.getFrameRateStats(),animations:this.getAnimationStats(),memory:this.getMemoryStats(),isMonitoring:this.isMonitoring,timestamp:Date.now()}}isPerformanceAcceptable(){const e=this.getFrameRateStats(),t=this.getMemoryStats();return!(e.average<30||t&&t.trend>5*1024*1024)}getPerformanceRecommendations(){const e=[],t=this.getFrameRateStats(),i=this.getMemoryStats(),s=this.getAnimationStats();return t.average<30&&e.push("Frame rate is below 30 FPS. Consider reducing animation complexity."),t.average<50&&e.push("Frame rate could be improved. Consider optimizing animations."),i&&i.trend>1024*1024&&e.push("Memory usage is increasing. Check for animation cleanup issues."),Object.entries(s).forEach(([o,r])=>{r.averageDuration>100&&e.push(`Animation "${o}" is taking too long (${r.averageDuration}ms). Consider optimization.`)}),e.length===0&&e.push("Performance looks good! No issues detected."),e}exportPerformanceData(){const e={report:this.getPerformanceReport(),frameRateHistory:this.frameRates,memoryHistory:this.memoryUsage,animationMetrics:Object.fromEntries(this.animationMetrics)};return JSON.stringify(e,null,2)}clearData(){this.frameRates=[],this.memoryUsage=[],this.animationMetrics.clear()}cleanup(){this.stopMonitoring(),this.performanceObserver&&(this.performanceObserver.disconnect(),this.performanceObserver=null),this.clearData()}};l(O,"instance");let j=O;const W=j.getInstance();typeof window<"u"&&window.ENABLE_PERFORMANCE_MONITOR&&W.startMonitoring();typeof window<"u"&&window.addEventListener("beforeunload",()=>{W.cleanup()});const A=class A{constructor(){l(this,"isMobile",!1);l(this,"isLowPowered",!1);l(this,"touchSupported",!1);l(this,"devicePixelRatio",1);l(this,"connectionSpeed","unknown");l(this,"batteryLevel",1);l(this,"optimizationLevel","high");this.detectDeviceCapabilities(),this.setupTouchOptimizations(),this.monitorBatteryStatus(),this.monitorNetworkConditions()}static getInstance(){return A.instance||(A.instance=new A),A.instance}detectDeviceCapabilities(){typeof window>"u"||(this.isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.touchSupported="ontouchstart"in window||navigator.maxTouchPoints>0,this.devicePixelRatio=window.devicePixelRatio||1,this.isLowPowered=this.detectLowPoweredDevice(),this.optimizationLevel=this.determineOptimizationLevel())}detectLowPoweredDevice(){if((navigator.hardwareConcurrency||4)<=2)return!0;const t=navigator.deviceMemory;if(t&&t<=2)return!0;const i=navigator.userAgent.toLowerCase();return["android 4","android 5","iphone 5","iphone 6","ipad 2","ipad 3"].some(o=>i.includes(o))}determineOptimizationLevel(){return this.isLowPowered||this.batteryLevel<.2?"low":this.isMobile||this.devicePixelRatio>2?"medium":"high"}setupTouchOptimizations(){this.touchSupported&&(this.addTouchOptimizationStyles(),this.setupTouchEventOptimizations())}addTouchOptimizationStyles(){const e="mobile-animation-optimizations";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
            /* Touch optimization styles */
            .touch-optimized {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
                touch-action: manipulation;
            }
            
            /* Hardware acceleration for mobile */
            .mobile-accelerated {
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                will-change: transform;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            
            /* Reduce motion on low-powered devices */
            @media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
                .mobile-reduced-motion {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.3s !important;
                }
            }
            
            /* Battery saving mode */
            .battery-saving * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
                animation-iteration-count: 1 !important;
            }
            
            /* Touch feedback */
            .touch-feedback {
                transition: transform 0.1s ease-out;
            }
            
            .touch-feedback:active {
                transform: scale(0.95);
            }
            
            /* Smooth scrolling optimization for mobile */
            @media (max-width: 768px) {
                * {
                    -webkit-overflow-scrolling: touch;
                }
            }
        `,document.head.appendChild(t)}setupTouchEventOptimizations(){this.supportsPassiveEvents()&&(document.addEventListener("touchstart",()=>{},{passive:!0}),document.addEventListener("touchmove",()=>{},{passive:!0}))}supportsPassiveEvents(){let e=!1;try{const t=Object.defineProperty({},"passive",{get:function(){return e=!0,!0}}),i=()=>{};window.addEventListener("testPassive",i,t),window.removeEventListener("testPassive",i,t)}catch{e=!1}return e}monitorBatteryStatus(){typeof navigator>"u"||!navigator.getBattery||navigator.getBattery().then(e=>{this.batteryLevel=e.level;const t=()=>{this.batteryLevel=e.level,this.optimizationLevel=this.determineOptimizationLevel(),this.applyBatteryOptimizations()};e.addEventListener("levelchange",t),e.addEventListener("chargingchange",t)}).catch(()=>{})}applyBatteryOptimizations(){const e=document.body;this.batteryLevel<.2?e.classList.add("battery-saving"):e.classList.remove("battery-saving")}monitorNetworkConditions(){if(typeof navigator>"u"||!navigator.connection)return;const e=navigator.connection;this.connectionSpeed=e.effectiveType||"unknown";const t=()=>{this.connectionSpeed=e.effectiveType||"unknown",this.optimizationLevel=this.determineOptimizationLevel()};e.addEventListener("change",t)}getMobileOptimizedSettings(){switch(this.optimizationLevel){case"low":return{duration:.5,ease:"power1.out",stagger:.02,quality:"low",useHardwareAcceleration:!0,reducedComplexity:!0};case"medium":return{duration:.6,ease:"power2.out",stagger:.05,quality:"medium",useHardwareAcceleration:!0,reducedComplexity:!1};default:return{duration:.6,ease:"power2.out",stagger:.08,quality:"high",useHardwareAcceleration:!1,reducedComplexity:!1}}}optimizeElementForMobile(e){const t=this.getMobileOptimizedSettings();e.classList.add("touch-optimized"),t.useHardwareAcceleration&&e.classList.add("mobile-accelerated"),this.isLowPowered&&e.classList.add("mobile-reduced-motion"),this.isInteractiveElement(e)&&e.classList.add("touch-feedback")}isInteractiveElement(e){const t=["button","a","input","textarea","select"],i=e.onclick!==null,s=e.getAttribute("role")==="button";return t.includes(e.tagName.toLowerCase())||i||s}createTouchOptimizedAnimation(e,t,i={}){const{touchFeedback:s=!1,preventScrolling:o=!1}=i,r=this.getMobileOptimizedSettings();this.optimizeElementForMobile(e);const d={...t,duration:r.duration,ease:r.ease,force3D:r.useHardwareAcceleration};return s&&this.touchSupported&&this.addTouchFeedback(e),o&&this.touchSupported&&this.preventScrollDuringAnimation(e),d}addTouchFeedback(e){let t=!1;const i=o=>{t||(t=!0,e.style.transform="scale(0.95)",e.style.transition="transform 0.1s ease-out")},s=()=>{t&&(t=!1,e.style.transform="",setTimeout(()=>{e.style.transition=""},100))};e.addEventListener("touchstart",i,{passive:!0}),e.addEventListener("touchend",s,{passive:!0}),e.addEventListener("touchcancel",s,{passive:!0})}preventScrollDuringAnimation(e){const t=i=>{i.preventDefault()};e.addEventListener("touchmove",t,{passive:!1})}getDeviceInfo(){return{isMobile:this.isMobile,isLowPowered:this.isLowPowered,touchSupported:this.touchSupported,devicePixelRatio:this.devicePixelRatio,connectionSpeed:this.connectionSpeed,batteryLevel:this.batteryLevel,optimizationLevel:this.optimizationLevel}}shouldUseReducedAnimations(){return this.isLowPowered||this.batteryLevel<.3||this.connectionSpeed==="slow-2g"}optimizeScrollPerformance(){if(!this.isMobile)return;document.body.style.webkitOverflowScrolling="touch";let e=!1;const t=()=>{e||(requestAnimationFrame(()=>{e=!1}),e=!0)};window.addEventListener("scroll",t,{passive:!0})}cleanup(){const e=document.getElementById("mobile-animation-optimizations");e&&e.remove(),document.body.classList.remove("battery-saving")}};l(A,"instance");let G=A;const N=G.getInstance();typeof window<"u"&&N.optimizeScrollPerformance();typeof window<"u"&&window.addEventListener("beforeunload",()=>{N.cleanup()});const F=class F{constructor(){l(this,"acceleratedElements",new Set);l(this,"compositeLayerElements",new Set);l(this,"willChangeElements",new Map);l(this,"performanceObserver",null);l(this,"layerCount",0);l(this,"maxLayers",50);l(this,"throttledScrollHandler",this.throttle(e=>{this.updateScrollOptimizations(e)},16));this.initializePerformanceMonitoring(),this.setupGlobalOptimizations()}static getInstance(){return F.instance||(F.instance=new F),F.instance}initializePerformanceMonitoring(){if(!(typeof window>"u"||!window.PerformanceObserver))try{this.performanceObserver=new PerformanceObserver(e=>{e.getEntries().forEach(i=>{(i.entryType==="paint"||i.entryType==="layout-shift")&&this.analyzeRenderingPerformance(i)})}),this.performanceObserver.observe({entryTypes:["paint","layout-shift","largest-contentful-paint"]})}catch{}}setupGlobalOptimizations(){this.addGlobalOptimizationStyles()}addGlobalOptimizationStyles(){const e="hardware-acceleration-optimizations";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
            /* Hardware acceleration base classes */
            .gpu-accelerated {
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                perspective: 1000px;
                -webkit-perspective: 1000px;
            }
            
            .composite-layer {
                will-change: transform;
                transform: translateZ(0);
                isolation: isolate;
            }
            
            .optimized-transform {
                transform: translate3d(0, 0, 0);
                -webkit-transform: translate3d(0, 0, 0);
            }
            
            /* Smooth scrolling optimization */
            .smooth-scroll {
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }
            
            /* Animation optimization classes */
            .animate-optimized {
                will-change: transform, opacity;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            .animate-optimized.animating {
                will-change: transform, opacity;
            }
            
            .animate-optimized:not(.animating) {
                will-change: auto;
            }
            
            /* Prevent layout thrashing */
            .no-layout-shift {
                contain: layout style paint;
            }
            
            /* GPU layer promotion for specific elements */
            .force-layer {
                transform: translateZ(0);
                will-change: transform;
                isolation: isolate;
            }
            
            /* Optimized opacity changes */
            .opacity-optimized {
                will-change: opacity;
                backface-visibility: hidden;
            }
            
            /* 3D context optimization */
            .preserve-3d {
                transform-style: preserve-3d;
                -webkit-transform-style: preserve-3d;
            }
            
            /* Subpixel rendering optimization */
            .subpixel-optimized {
                -webkit-font-smoothing: subpixel-antialiased;
                -moz-osx-font-smoothing: auto;
                text-rendering: optimizeSpeed;
            }
            
            /* Reduce paint complexity */
            .paint-optimized {
                contain: paint;
                will-change: contents;
            }
            
            /* Mobile-specific optimizations */
            @media (max-width: 768px) {
                .mobile-gpu-optimized {
                    transform: translate3d(0, 0, 0);
                    -webkit-transform: translate3d(0, 0, 0);
                    will-change: transform;
                }
            }
            
            /* Reduced motion fallbacks */
            @media (prefers-reduced-motion: reduce) {
                .animate-optimized {
                    will-change: auto;
                    transform: none;
                }
            }
        `,document.head.appendChild(t)}analyzeRenderingPerformance(e){e.entryType==="layout-shift"&&e.value>.1&&this.optimizeLayoutStability()}optimizeElement(e,t={}){const{forceLayer:i=!1,optimizeTransforms:s=!0,optimizeOpacity:o=!0,preventLayoutShift:r=!0,useWillChange:d=!0}=t;if(this.layerCount>=this.maxLayers&&i)return{success:!1,reason:"max_layers_reached"};const a=[];return s&&(e.classList.add("gpu-accelerated"),a.push("gpu-acceleration")),i&&(e.classList.add("composite-layer"),this.compositeLayerElements.add(e),this.layerCount++,a.push("composite-layer")),s&&(e.classList.add("optimized-transform"),a.push("transform-optimization")),o&&(e.classList.add("opacity-optimized"),a.push("opacity-optimization")),r&&(e.classList.add("no-layout-shift"),a.push("layout-stability")),d&&(this.setWillChange(e,["transform","opacity"]),a.push("will-change")),this.acceleratedElements.add(e),{success:!0,optimizations:a,layerPromoted:i}}setWillChange(e,t){const i=this.willChangeElements.get(e)||[],s=[...new Set([...i,...t])];this.willChangeElements.set(e,s),e.style.willChange=s.join(", ")}removeWillChange(e,t){if(!t){e.style.willChange="auto",this.willChangeElements.delete(e);return}const s=(this.willChangeElements.get(e)||[]).filter(o=>!t.includes(o));s.length===0?(e.style.willChange="auto",this.willChangeElements.delete(e)):(this.willChangeElements.set(e,s),e.style.willChange=s.join(", "))}optimizeAnimation(e,t){const{properties:i,duration:s,easing:o,useGPU:r=!0,forceLayer:d=!1}=t;return r&&this.optimizeElement(e,{forceLayer:d,optimizeTransforms:i.includes("transform"),optimizeOpacity:i.includes("opacity")}),e.classList.add("animate-optimized","animating"),this.setWillChange(e,i),{...t,force3D:r,onStart:()=>{e.classList.add("animating"),t.onStart?.()},onComplete:()=>{e.classList.remove("animating"),this.removeWillChange(e,i),t.onComplete?.()}}}optimizeScrollPerformance(e){e.classList.add("smooth-scroll"),this.supportsPassiveEvents()&&e.addEventListener("scroll",()=>{this.throttledScrollHandler(e)},{passive:!0}),e.querySelectorAll("*").forEach(s=>{s instanceof HTMLElement&&s.classList.add("paint-optimized")})}updateScrollOptimizations(e){e.getBoundingClientRect();const t=window.innerHeight;e.querySelectorAll(".gpu-accelerated").forEach(s=>{if(s instanceof HTMLElement){const o=s.getBoundingClientRect();o.bottom>=0&&o.top<=t?this.setWillChange(s,["transform"]):this.removeWillChange(s)}})}supportsPassiveEvents(){let e=!1;try{const t=Object.defineProperty({},"passive",{get:function(){return e=!0,!0}}),i=()=>{};window.addEventListener("testPassive",i,t),window.removeEventListener("testPassive",i,t)}catch{e=!1}return e}throttle(e,t){let i;return function(...s){i||(e.apply(this,s),i=!0,setTimeout(()=>i=!1,t))}}optimizeLayoutStability(){document.querySelectorAll("img, video, iframe").forEach(t=>{t instanceof HTMLElement&&t.classList.add("no-layout-shift")})}getLayerInfo(){return{totalLayers:this.layerCount,maxLayers:this.maxLayers,acceleratedElements:this.acceleratedElements.size,compositeElements:this.compositeLayerElements.size,willChangeElements:this.willChangeElements.size}}isAccelerated(e){return this.acceleratedElements.has(e)}removeAcceleration(e){e.classList.remove("gpu-accelerated","composite-layer","optimized-transform","opacity-optimized","no-layout-shift","animate-optimized"),this.removeWillChange(e),this.acceleratedElements.delete(e),this.compositeLayerElements.has(e)&&(this.compositeLayerElements.delete(e),this.layerCount--)}optimizeForMobile(){document.body.classList.add("mobile-gpu-optimized"),this.maxLayers=25,this.acceleratedElements.forEach(e=>{e.classList.add("mobile-gpu-optimized")})}getOptimizationRecommendations(){const e=[];return this.layerCount>this.maxLayers*.8&&e.push("Consider reducing the number of composite layers to improve memory usage."),this.willChangeElements.size>20&&e.push("Too many elements with will-change property. Consider removing will-change from inactive elements."),this.acceleratedElements.size===0&&e.push("No elements are hardware accelerated. Consider optimizing key interactive elements."),e}cleanup(){this.acceleratedElements.forEach(t=>{this.removeAcceleration(t)}),this.acceleratedElements.clear(),this.compositeLayerElements.clear(),this.willChangeElements.clear(),this.performanceObserver&&(this.performanceObserver.disconnect(),this.performanceObserver=null);const e=document.getElementById("hardware-acceleration-optimizations");e&&e.remove(),this.layerCount=0}};l(F,"instance");let Z=F;const B=Z.getInstance();typeof window<"u"&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&B.optimizeForMobile();typeof window<"u"&&window.addEventListener("beforeunload",()=>{B.cleanup()});const I=class I{constructor(){l(this,"browserInfo");l(this,"supportedFeatures");l(this,"fallbackStyles",null);this.browserInfo=this.detectBrowser(),this.supportedFeatures=this.detectFeatureSupport(),this.setupFallbacks()}static getInstance(){return I.instance||(I.instance=new I),I.instance}detectBrowser(){if(typeof navigator>"u")return{name:"unknown",version:0,isModern:!0,supportsES6:!0};const e=navigator.userAgent;let t="unknown",i=0;if(e.includes("Chrome")){t="chrome";const r=e.match(/Chrome\/(\d+)/);i=r?parseInt(r[1]):0}else if(e.includes("Firefox")){t="firefox";const r=e.match(/Firefox\/(\d+)/);i=r?parseInt(r[1]):0}else if(e.includes("Safari")&&!e.includes("Chrome")){t="safari";const r=e.match(/Version\/(\d+)/);i=r?parseInt(r[1]):0}else if(e.includes("Edge")){t="edge";const r=e.match(/Edge\/(\d+)/);i=r?parseInt(r[1]):0}else if(e.includes("MSIE")||e.includes("Trident")){t="ie";const r=e.match(/(?:MSIE |rv:)(\d+)/);i=r?parseInt(r[1]):0}const s=this.isModernBrowser(t,i),o=this.supportsES6Features();return{name:t,version:i,isModern:s,supportsES6:o}}isModernBrowser(e,t){return t>=({chrome:60,firefox:55,safari:12,edge:79,ie:0}[e]||0)}supportsES6Features(){return typeof Symbol<"u"&&typeof Promise<"u"&&typeof Map<"u"&&typeof Set<"u"&&"assign"in Object&&"from"in Array}detectFeatureSupport(){if(typeof window>"u")return{transforms3d:!1,transitions:!1,animations:!1,flexbox:!1,grid:!1,willChange:!1,intersectionObserver:!1,requestAnimationFrame:!1,webGL:!1};const t=document.createElement("div").style;return{transforms3d:this.supportsTransforms3D(),transitions:"transition"in t,animations:"animation"in t,flexbox:"flex"in t||"webkitFlex"in t,grid:"grid"in t,willChange:"willChange"in t,intersectionObserver:"IntersectionObserver"in window,requestAnimationFrame:"requestAnimationFrame"in window,webGL:this.supportsWebGL()}}supportsTransforms3D(){const e=document.createElement("div");return e.style.transform="translateZ(0)",e.style.transform!==""}supportsWebGL(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}setupFallbacks(){this.addFallbackStyles(),this.setupPolyfills(),this.addBrowserClasses()}addFallbackStyles(){const e="browser-compatibility-fallbacks";if(document.getElementById(e))return;this.fallbackStyles=document.createElement("style"),this.fallbackStyles.id=e;let t=`
            /* Base fallback styles */
            .fallback-animation {
                transition: all 0.3s ease;
            }
            
            .fallback-fade {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .fallback-fade.active {
                opacity: 1;
            }
            
            .fallback-slide {
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            
            .fallback-slide.active {
                transform: translateY(0);
            }
            
            .fallback-scale {
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .fallback-scale.active {
                transform: scale(1);
            }
        `;this.supportedFeatures.transforms3d||(t+=`
                /* 2D transform fallbacks */
                .gpu-accelerated {
                    position: relative;
                }
                
                .parallax-fallback {
                    position: relative;
                    top: 0;
                    transition: top 0.1s linear;
                }
            `),this.supportedFeatures.transitions||(t+=`
                /* No transition support - instant changes */
                .fallback-animation,
                .fallback-fade,
                .fallback-slide,
                .fallback-scale {
                    transition: none !important;
                }
            `),this.supportedFeatures.flexbox||(t+=`
                /* Flexbox fallbacks */
                .flex-fallback {
                    display: block;
                }
                
                .flex-fallback > * {
                    display: inline-block;
                    vertical-align: top;
                }
            `),this.browserInfo.name==="ie"&&(t+=`
                /* Internet Explorer specific fixes */
                .ie-fix {
                    zoom: 1;
                }
                
                .ie-opacity {
                    filter: alpha(opacity=100);
                }
                
                .ie-opacity.fade-out {
                    filter: alpha(opacity=0);
                }
            `),this.fallbackStyles.textContent=t,document.head.appendChild(this.fallbackStyles)}setupPolyfills(){this.supportedFeatures.requestAnimationFrame||this.polyfillRequestAnimationFrame(),this.supportedFeatures.intersectionObserver||this.polyfillIntersectionObserver()}polyfillRequestAnimationFrame(){let e=0;window.requestAnimationFrame=t=>{const i=new Date().getTime(),s=Math.max(0,16-(i-e)),o=window.setTimeout(()=>{t(i+s)},s);return e=i+s,o},window.cancelAnimationFrame=t=>{clearTimeout(t)}}polyfillIntersectionObserver(){if(typeof window>"u")return;class e{constructor(i){l(this,"callback");l(this,"elements",new Set);l(this,"checkInterval",null);this.callback=i}observe(i){this.elements.add(i),this.checkInterval||this.startChecking()}unobserve(i){this.elements.delete(i),this.elements.size===0&&this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null)}disconnect(){this.elements.clear(),this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null)}startChecking(){this.checkInterval=window.setInterval(()=>{const i=[];this.elements.forEach(s=>{const o=s.getBoundingClientRect(),r=o.top<window.innerHeight&&o.bottom>0;i.push({target:s,isIntersecting:r,intersectionRatio:r?1:0,boundingClientRect:o,intersectionRect:o,rootBounds:null,time:Date.now()})}),i.length>0&&this.callback(i,this)},100)}}window.IntersectionObserver=e}addBrowserClasses(){const e=[`browser-${this.browserInfo.name}`,`browser-version-${this.browserInfo.version}`];this.browserInfo.isModern||e.push("browser-legacy"),this.supportedFeatures.transforms3d||e.push("no-transforms3d"),this.supportedFeatures.transitions||e.push("no-transitions"),this.supportedFeatures.animations||e.push("no-animations"),document.documentElement.classList.add(...e)}createFallbackAnimation(e,t,i={}){const{duration:s=300,delay:o=0,easing:r="ease",useTransitions:d=this.supportedFeatures.transitions}=i,a={element:e,type:t,isActive:!1,start:()=>{a.isActive||(a.isActive=!0,d&&(e.style.transition=`all ${s}ms ${r}`,o>0&&(e.style.transitionDelay=`${o}ms`)),e.classList.add(`fallback-${t}`),requestAnimationFrame(()=>{e.classList.add("active")}),setTimeout(()=>{d&&(e.style.transition="",e.style.transitionDelay=""),a.isActive=!1},s+o))},stop:()=>{e.classList.remove(`fallback-${t}`,"active"),e.style.transition="",e.style.transitionDelay="",a.isActive=!1}};return a}createProgressiveAnimation(e,t,i){this.browserInfo.isModern&&this.supportedFeatures.transforms3d?t():i()}getAnimationConfig(){return this.browserInfo.isModern?this.supportedFeatures.transforms3d?{duration:600,easing:"cubic-bezier(0.4, 0, 0.2, 1)",useTransforms:!0,useOpacity:!0,complexity:"high"}:{duration:300,easing:"ease",useTransforms:!1,useOpacity:!0,complexity:"medium"}:{duration:200,easing:"linear",useTransforms:!1,useOpacity:this.supportedFeatures.transitions,complexity:"low"}}isSupported(e){return this.supportedFeatures[e]}getBrowserInfo(){return{...this.browserInfo}}getSupportedFeatures(){return{...this.supportedFeatures}}applyFallback(e,t){switch(t){case"flexbox":this.supportedFeatures.flexbox||e.classList.add("flex-fallback");break;case"transforms":this.supportedFeatures.transforms3d||e.classList.add("no-transforms3d");break;case"animations":this.supportedFeatures.animations||e.classList.add("no-animations");break}}cleanup(){this.fallbackStyles&&(this.fallbackStyles.remove(),this.fallbackStyles=null);const e=document.documentElement.classList;Array.from(e).forEach(t=>{(t.startsWith("browser-")||t.startsWith("no-"))&&e.remove(t)})}};l(I,"instance");let Y=I;const H=Y.getInstance();typeof window<"u"&&(window.__browserCompatibility={info:H.getBrowserInfo(),features:H.getSupportedFeatures()});typeof window<"u"&&window.addEventListener("beforeunload",()=>{H.cleanup()});const R=class R{constructor(){l(this,"activeTimelines",new Set);l(this,"activeScrollTriggers",new Set);l(this,"intersectionObservers",new Set);l(this,"performanceMetrics",new Map);l(this,"isReducedMotion",!1);this.initializeReducedMotionDetection(),this.setupPerformanceMonitoring()}static getInstance(){return R.instance||(R.instance=new R),R.instance}initializeReducedMotionDetection(){if(typeof window>"u")return;this.isReducedMotion=b.prefersReducedMotion(),window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",t=>{this.isReducedMotion=t.matches,this.isReducedMotion&&this.disableAllAnimations()})}setupPerformanceMonitoring(){if(typeof window>"u")return;let e=0,t=performance.now();const i=()=>{e++;const s=performance.now();if(s-t>=1e3){const o=Math.round(e*1e3/(s-t));this.recordMetric("fps",o),e=0,t=s}requestAnimationFrame(i)};requestAnimationFrame(i)}recordMetric(e,t){this.performanceMetrics.has(e)||this.performanceMetrics.set(e,[]);const i=this.performanceMetrics.get(e);i.push(t),i.length>100&&i.shift()}getPerformanceMetrics(){const e={};return this.performanceMetrics.forEach((t,i)=>{if(t.length>0){const s=t.reduce((d,a)=>d+a,0)/t.length,o=Math.min(...t),r=Math.max(...t);e[i]={avg:Math.round(s),min:o,max:r}}}),e}registerTimeline(e){this.activeTimelines.add(e),e.eventCallback("onComplete",()=>{this.activeTimelines.delete(e)})}registerScrollTrigger(e){this.activeScrollTriggers.add(e)}createIntersectionObserver(e,t={}){const i={threshold:.1,rootMargin:"0px 0px -10% 0px",...t},s=new IntersectionObserver(e,i);return this.intersectionObservers.add(s),s}createScrollTrigger(e){if(this.isReducedMotion)return{kill:()=>{},refresh:()=>{}};const t=q.create({...e,onRefresh:i=>{this.recordMetric("scrolltrigger_refresh",performance.now()),e.onRefresh?.(i)}});return this.registerScrollTrigger(t),t}createOptimizedAnimation(e,t,i={}){if(this.isReducedMotion)return w.set(e,{opacity:t.opacity??1,x:0,y:0,scale:t.scale??1}),{cleanup:()=>{}};const{trigger:s=e,threshold:o=.1,rootMargin:r="0px 0px -10% 0px",once:d=!0}=i;let a=!1,c=null;const u=`animation-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,h=B.optimizeElement(e,{optimizeTransforms:!0,optimizeOpacity:!0,useWillChange:!0}),f=this.createIntersectionObserver(p=>{p.forEach(g=>{if(g.isIntersecting&&(!d||!a)){W.startAnimationMeasure(u);const y=[];(t.x!==void 0||t.y!==void 0)&&y.push("transform"),t.opacity!==void 0&&y.push("opacity"),B.setWillChange(e,y),c=w.timeline(),c.to(e,{...t,force3D:!0,onComplete:()=>{W.endAnimationMeasure(u,{element:e.tagName,className:e.className,animationType:"intersection",hardwareAccelerated:h.success}),B.removeWillChange(e,y),t.onComplete?.()}}),this.registerTimeline(c),a=!0,d&&f.unobserve(g.target)}})},{threshold:o,rootMargin:r}),m=typeof s=="string"?document.querySelector(s):s;return m&&f.observe(m),{cleanup:()=>{f.disconnect(),this.intersectionObservers.delete(f),c&&(c.kill(),this.activeTimelines.delete(c)),h.success&&B.removeAcceleration(e)}}}batchDOMOperations(e){requestAnimationFrame(()=>{e.forEach(t=>t())})}disableAllAnimations(){this.activeTimelines.forEach(e=>e.kill()),this.activeTimelines.clear(),this.activeScrollTriggers.forEach(e=>e.kill()),this.activeScrollTriggers.clear(),w.globalTimeline.timeScale(1e3)}cleanup(){this.activeTimelines.forEach(e=>e.kill()),this.activeTimelines.clear(),this.activeScrollTriggers.forEach(e=>e.kill()),this.activeScrollTriggers.clear(),this.intersectionObservers.forEach(e=>e.disconnect()),this.intersectionObservers.clear(),this.performanceMetrics.clear()}getStats(){return{activeTimelines:this.activeTimelines.size,activeScrollTriggers:this.activeScrollTriggers.size,activeObservers:this.intersectionObservers.size,isReducedMotion:this.isReducedMotion,performance:this.getPerformanceMetrics()}}isLowPoweredDevice(){if(typeof navigator>"u")return!1;const e=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),t=!!(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4),i=navigator,s=!!(i.deviceMemory&&i.deviceMemory<=4);return e||t||s}getOptimizedSettings(){const e=this.isLowPoweredDevice(),t=this.getPerformanceMetrics().fps?.avg||60,i=N.getMobileOptimizedSettings(),s=H.getAnimationConfig();return this.isReducedMotion?{duration:0,ease:"none",stagger:0,quality:"low"}:H.getBrowserInfo().isModern?N.getDeviceInfo().isMobile?{duration:i.duration,ease:i.ease,stagger:i.stagger,quality:i.quality}:e||t<30?{duration:.6,ease:"power1.out",stagger:.05,quality:"low"}:t<50?{duration:.7,ease:"power2.out",stagger:.08,quality:"medium"}:{duration:.8,ease:"power2.out",stagger:.1,quality:"high"}:{duration:s.duration/1e3,ease:s.easing==="linear"?"none":"power1.out",stagger:.02,quality:"low"}}};l(R,"instance");let _=R;const K=_.getInstance();typeof window<"u"&&window.addEventListener("beforeunload",()=>{K.cleanup()});typeof window<"u"&&w.registerPlugin(q,ee);const he=()=>{const n=C.c(6),e=E.useRef(null);let t,i;n[0]===Symbol.for("react.memo_cache_sentinel")?(t=()=>{if(typeof window>"u")return;const a=window.innerWidth<768,c=window.matchMedia("(pointer: coarse)").matches&&!window.matchMedia("(hover: hover)").matches;if(a||c)return;e.current=new te({lerp:.1,smoothWheel:!0,wheelMultiplier:1.1,touchMultiplier:2,infinite:!1,autoResize:!0}),e.current.on("scroll",q.update);const u=h=>{e.current?.raf(h*1e3)};return w.ticker.add(u),w.ticker.lagSmoothing(0),()=>{e.current?.destroy(),w.ticker.remove(u)}},i=[],n[0]=t,n[1]=i):(t=n[0],i=n[1]),E.useEffect(t,i);let s;n[2]===Symbol.for("react.memo_cache_sentinel")?(s=(a,c)=>{if(e.current)e.current.scrollTo(a,{offset:c?.offset||0,duration:c?.duration||1.2});else if(typeof window<"u"){const u=typeof a=="number"?a:(document.querySelector(a)?.getBoundingClientRect().top||0)+window.scrollY;window.scrollTo({top:u+(c?.offset||0),behavior:"smooth"})}},n[2]=s):s=n[2];let o;n[3]===Symbol.for("react.memo_cache_sentinel")?(o=()=>{e.current?.stop()},n[3]=o):o=n[3];let r;n[4]===Symbol.for("react.memo_cache_sentinel")?(r=()=>{e.current?.start()},n[4]=r):r=n[4];let d;return n[5]===Symbol.for("react.memo_cache_sentinel")?(d={scrollTo:s,stop:o,start:r},n[5]=d):d=n[5],d},pe=(n,e,t)=>{const i=C.c(9);let s;i[0]!==t?(s=t===void 0?{}:t,i[0]=t,i[1]=s):s=i[1];const o=s,{mouseParallax:r,scrollParallax:d,intensity:a}=o,c=r===void 0?!0:r,u=d===void 0?!0:d,h=a===void 0?1:a;let f,m;i[2]!==n||i[3]!==e||i[4]!==h||i[5]!==c||i[6]!==u?(f=()=>{if(typeof window>"u"||!n.current)return;const p=n.current,g=e.map(ie).filter(Boolean);if(g.length===0)return;const y=[];if(c){const v=S=>{if(window.matchMedia("(hover: none)").matches)return;const z=p.getBoundingClientRect(),P=z.left+z.width/2,T=z.top+z.height/2,D=(S.clientX-P)/z.width*h,L=(S.clientY-T)/z.height*h;g.forEach((J,$)=>{const x=($+1)*.5;w.to(J,{duration:1.5,x:D*x*20,y:L*x*10,ease:"power2.out"})})};p.addEventListener("mousemove",v),y.push(()=>p.removeEventListener("mousemove",v))}if(u){const v=K.createScrollTrigger({trigger:p,start:"top bottom",end:"bottom top",scrub:!0,onUpdate:S=>{const z=S.progress;g.forEach((P,T)=>{const D=(T+1)*.3*h;w.set(P,{y:z*D*100,force3D:!0})})}});y.push(()=>v.kill())}return()=>{y.forEach(se)}},m=[n,e,c,u,h],i[2]=n,i[3]=e,i[4]=h,i[5]=c,i[6]=u,i[7]=f,i[8]=m):(f=i[7],m=i[8]),E.useEffect(f,m)},ge=(n,e)=>{const t=C.c(17);let i;t[0]!==e?(i=e===void 0?{}:e,t[0]=e,t[1]=i):i=t[1];const s=i,{trigger:o,start:r,end:d,stagger:a,splitType:c,enabled:u}=s,h=o===void 0?"top 80%":o,f=r===void 0?"top 80%":r,m=d===void 0?"bottom 20%":d,p=a===void 0?.05:a,g=c===void 0?"words":c,y=u===void 0?!0:u;let v;t[2]!==n||t[3]!==y||t[4]!==m||t[5]!==g||t[6]!==p||t[7]!==f?(v=()=>{if(!y||typeof window>"u"||!n.current)return;const P=n.current.querySelectorAll("[data-text-reveal]"),T=[];return P.forEach(D=>{const L=D,J=L.dataset.textReveal||"fade-up",$=L.textContent||"";let x=[];if(g==="words"){const U=$.split(" ");L.innerHTML=U.map(ne).join(" "),x=Array.from(L.querySelectorAll(".word-span"))}else if(g==="chars"){const U=$.split("");L.innerHTML=U.map(re).join(""),x=Array.from(L.querySelectorAll(".char-span"))}const k={},M={duration:.8,ease:"power2.out",stagger:p};e:switch(J){case"fade-up":{k.opacity=0,k.y=30,M.opacity=1,M.y=0;break e}case"fade-in":{k.opacity=0,M.opacity=1;break e}case"slide-left":{k.opacity=0,k.x=-30,M.opacity=1,M.x=0;break e}case"slide-right":{k.opacity=0,k.x=30,M.opacity=1,M.x=0;break e}case"scale-in":k.opacity=0,k.scale=.8,M.opacity=1,M.scale=1,M.ease="back.out(1.7)"}x.length>0?w.set(x,k):w.set(L,k);const V=q.create({trigger:L,start:f,end:m,onEnter:()=>{x.length>0?w.to(x,M):w.to(L,M)}});T.push(V)}),()=>{T.forEach(oe)}},t[2]=n,t[3]=y,t[4]=m,t[5]=g,t[6]=p,t[7]=f,t[8]=v):v=t[8];let S;t[9]!==n||t[10]!==y||t[11]!==m||t[12]!==g||t[13]!==p||t[14]!==f||t[15]!==h?(S=[n,h,f,m,p,g,y],t[9]=n,t[10]=y,t[11]=m,t[12]=g,t[13]=p,t[14]=f,t[15]=h,t[16]=S):S=t[16],E.useEffect(v,S)},ye=()=>{const n=C.c(1);let e;n[0]===Symbol.for("react.memo_cache_sentinel")?(e=[],n[0]=e):e=n[0],E.useEffect(ce,e)},ve=(n,e,t)=>{const i=C.c(9);let s;i[0]!==t?(s=t===void 0?{}:t,i[0]=t,i[1]=s):s=i[1];const o=s,{threshold:r,rootMargin:d,once:a}=o,c=r===void 0?.1:r,u=d===void 0?"0px 0px -10% 0px":d,h=a===void 0?!0:a;let f,m;i[2]!==e||i[3]!==n||i[4]!==h||i[5]!==u||i[6]!==c?(f=()=>{if(typeof window>"u"||!n.current)return;const p=n.current,{cleanup:g}=K.createOptimizedAnimation(p,e,{threshold:c,rootMargin:u,once:h});return g},m=[n,e,c,u,h],i[2]=e,i[3]=n,i[4]=h,i[5]=u,i[6]=c,i[7]=f,i[8]=m):(f=i[7],m=i[8]),E.useEffect(f,m)},we=(n,e)=>{const t=C.c(8);let i;t[0]!==e?(i=e===void 0?{}:e,t[0]=e,t[1]=i):i=t[1];const s=i,{strength:o,speed:r,isTouch:d}=s,a=o===void 0?.3:o,c=r===void 0?.3:r,u=d===void 0?!1:d;let h,f;t[2]!==n||t[3]!==u||t[4]!==c||t[5]!==a?(h=()=>{if(typeof window>"u"||!n.current||u)return;const m=n.current,p=y=>{const v=m.getBoundingClientRect(),S=v.left+v.width/2,z=v.top+v.height/2,P=(y.clientX-S)*a,T=(y.clientY-z)*a;w.to(m,{x:P,y:T,duration:c,ease:"power2.out"})},g=()=>{w.to(m,{x:0,y:0,duration:c*2,ease:"elastic.out(1, 0.3)"})};return m.addEventListener("mousemove",p),m.addEventListener("mouseleave",g),()=>{m.removeEventListener("mousemove",p),m.removeEventListener("mouseleave",g)}},f=[n,a,c,u],t[2]=n,t[3]=u,t[4]=c,t[5]=a,t[6]=h,t[7]=f):(h=t[6],f=t[7]),E.useEffect(h,f)};function ie(n){return n.current}function se(n){return n()}function ne(n){return`<span class="inline-block overflow-hidden"><span class="inline-block word-span">${n}</span></span>`}function re(n){return n===" "?" ":`<span class="inline-block char-span">${n}</span>`}function oe(n){return n.kill()}function ae(){q.refresh()}function ce(){if(typeof window>"u")return;w.defaults({ease:"power2.out",duration:.6});let n;const e=()=>{clearTimeout(n),n=setTimeout(ae,100)};return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e),clearTimeout(n)}}const be=()=>{const n=C.c(11),[e,t]=E.useState(!1),[i,s]=E.useState(!1);let o,r;n[0]===Symbol.for("react.memo_cache_sentinel")?(o=()=>{t(b.prefersReducedMotion());const p=window.matchMedia("(prefers-reduced-motion: reduce)"),g=()=>t(p.matches);p.addEventListener("change",g);const y=S=>{S.key==="Tab"&&s(!0)},v=()=>{s(!1)};return document.addEventListener("keydown",y),document.addEventListener("mousedown",v),()=>{p.removeEventListener("change",g),document.removeEventListener("keydown",y),document.removeEventListener("mousedown",v)}},r=[],n[0]=o,n[1]=r):(o=n[0],r=n[1]),E.useEffect(o,r);let d,a,c,u,h,f;n[2]===Symbol.for("react.memo_cache_sentinel")?(d=b.announceToScreenReader.bind(b),a=b.makeKeyboardAccessible.bind(b),c=b.removeKeyboardAccessibility.bind(b),u=b.setupFocusTrap.bind(b),h=b.createLiveRegion.bind(b),f=b.enhanceFormAccessibility.bind(b),n[2]=d,n[3]=a,n[4]=c,n[5]=u,n[6]=h,n[7]=f):(d=n[2],a=n[3],c=n[4],u=n[5],h=n[6],f=n[7]);let m;return n[8]!==i||n[9]!==e?(m={prefersReducedMotion:e,isKeyboardNavigation:i,announceToScreenReader:d,makeKeyboardAccessible:a,removeKeyboardAccessibility:c,setupFocusTrap:u,createLiveRegion:h,enhanceFormAccessibility:f},n[8]=i,n[9]=e,n[10]=m):m=n[10],m},Se=()=>{const n=C.c(2),[e,t]=E.useState(!1);let i,s;return n[0]===Symbol.for("react.memo_cache_sentinel")?(i=()=>{const o=window.matchMedia("(prefers-reduced-motion: reduce)");t(o.matches);const r=()=>t(o.matches);return o.addEventListener("change",r),()=>o.removeEventListener("change",r)},s=[],n[0]=i,n[1]=s):(i=n[0],s=n[1]),E.useEffect(i,s),e};export{we as a,he as b,ye as c,be as d,ge as e,ve as f,pe as g,Se as u};
