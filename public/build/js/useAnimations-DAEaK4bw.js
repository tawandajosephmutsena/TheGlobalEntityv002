var F=Object.defineProperty;var R=(r,e,t)=>e in r?F(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var c=(r,e,t)=>R(r,typeof e!="symbol"?e+"":e,t);import{ag as compilerRuntimeExports,r as reactExports,bd as Lenis}from"./vendor-EpJYlCmx.js";import{S as ScrollTrigger,g as gsapWithCSS,a as ScrollToPlugin}from"./gsap-A1TKBQza.js";import{a as accessibilityManager}from"./accessibilityManager-B8glcpdm.js";const x=class x{constructor(){c(this,"isMonitoring",!1);c(this,"frameCount",0);c(this,"lastFrameTime",0);c(this,"frameRates",[]);c(this,"animationMetrics",new Map);c(this,"memoryUsage",[]);c(this,"performanceObserver",null);c(this,"rafId",null);this.initializePerformanceObserver()}static getInstance(){return x.instance||(x.instance=new x),x.instance}initializePerformanceObserver(){if(!(typeof window>"u"||!window.PerformanceObserver))try{this.performanceObserver=new PerformanceObserver(e=>{e.getEntries().forEach(i=>{i.entryType==="measure"&&i.name.startsWith("animation-")&&this.recordAnimationMetric(i.name,i.duration)})}),this.performanceObserver.observe({entryTypes:["measure"]})}catch{}}startMonitoring(){this.isMonitoring||(this.isMonitoring=!0,this.lastFrameTime=performance.now(),this.frameCount=0,this.frameRates=[],this.rafId=requestAnimationFrame(this.measureFrameRate.bind(this)),this.startMemoryMonitoring())}stopMonitoring(){this.isMonitoring=!1,this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=null)}measureFrameRate(){if(!this.isMonitoring)return;const e=performance.now(),t=e-this.lastFrameTime;if(this.frameCount++,t>=1e3){const i=Math.round(this.frameCount*1e3/t);this.frameRates.push(i),this.frameRates.length>60&&this.frameRates.shift(),this.frameCount=0,this.lastFrameTime=e}this.rafId=requestAnimationFrame(this.measureFrameRate.bind(this))}startMemoryMonitoring(){if(typeof window>"u"||!performance.memory)return;const e=()=>{if(!this.isMonitoring)return;const t=performance.memory;this.memoryUsage.push({timestamp:Date.now(),usedJSHeapSize:t.usedJSHeapSize,totalJSHeapSize:t.totalJSHeapSize,jsHeapSizeLimit:t.jsHeapSizeLimit}),this.memoryUsage.length>100&&this.memoryUsage.shift(),this.detectMemoryLeaks(),setTimeout(e,5e3)};e()}detectMemoryLeaks(){if(this.memoryUsage.length<10)return;const e=this.memoryUsage.slice(-10);this.calculateMemoryTrend(e)>1024*1024&&this.logMemoryWarning(e)}calculateMemoryTrend(e){if(e.length<2)return 0;const t=e[0].usedJSHeapSize;return e[e.length-1].usedJSHeapSize-t}logMemoryWarning(e){const t=e[e.length-1];Math.round(t.usedJSHeapSize/1024/1024),Math.round(t.totalJSHeapSize/1024/1024)}recordAnimationMetric(e,t,i){this.animationMetrics.has(e)||this.animationMetrics.set(e,[]);const s=this.animationMetrics.get(e);s.push({timestamp:Date.now(),duration:t,metadata:i}),s.length>100&&s.shift()}startAnimationMeasure(e){typeof performance>"u"||performance.mark(`${e}-start`)}endAnimationMeasure(e,t){if(typeof performance>"u")return;const i=`${e}-end`,s=`animation-${e}`;performance.mark(i),performance.measure(s,`${e}-start`,i);const n=performance.getEntriesByName(s);if(n.length>0){const o=n[n.length-1];this.recordAnimationMetric(e,o.duration,t)}performance.clearMarks(`${e}-start`),performance.clearMarks(i),performance.clearMeasures(s)}getFrameRateStats(){if(this.frameRates.length===0)return{current:0,average:0,min:0,max:0,samples:0};const e=this.frameRates[this.frameRates.length-1]||0,t=Math.round(this.frameRates.reduce((n,o)=>n+o,0)/this.frameRates.length),i=Math.min(...this.frameRates),s=Math.max(...this.frameRates);return{current:e,average:t,min:i,max:s,samples:this.frameRates.length}}getAnimationStats(){const e={};return this.animationMetrics.forEach((t,i)=>{if(t.length===0)return;const s=t.map(d=>d.duration),n=s.reduce((d,u)=>d+u,0)/s.length,o=Math.min(...s),l=Math.max(...s),a=t.slice(-10);e[i]={count:t.length,averageDuration:Math.round(n*100)/100,minDuration:Math.round(o*100)/100,maxDuration:Math.round(l*100)/100,recentAverage:a.length>0?Math.round(a.reduce((d,u)=>d+u.duration,0)/a.length*100)/100:0}}),e}getMemoryStats(){if(typeof window>"u"||!performance.memory)return null;const e=performance.memory,t={usedJSHeapSize:e.usedJSHeapSize,totalJSHeapSize:e.totalJSHeapSize,jsHeapSizeLimit:e.jsHeapSizeLimit};let i=0;if(this.memoryUsage.length>=2){const s=this.memoryUsage.slice(-10);i=this.calculateMemoryTrend(s)}return{current:t,trend:i,samples:this.memoryUsage.length,usedMB:Math.round(t.usedJSHeapSize/1024/1024),totalMB:Math.round(t.totalJSHeapSize/1024/1024),limitMB:Math.round(t.jsHeapSizeLimit/1024/1024)}}getPerformanceReport(){return{frameRate:this.getFrameRateStats(),animations:this.getAnimationStats(),memory:this.getMemoryStats(),isMonitoring:this.isMonitoring,timestamp:Date.now()}}isPerformanceAcceptable(){const e=this.getFrameRateStats(),t=this.getMemoryStats();return!(e.average<30||t&&t.trend>5*1024*1024)}getPerformanceRecommendations(){const e=[],t=this.getFrameRateStats(),i=this.getMemoryStats(),s=this.getAnimationStats();return t.average<30&&e.push("Frame rate is below 30 FPS. Consider reducing animation complexity."),t.average<50&&e.push("Frame rate could be improved. Consider optimizing animations."),i&&i.trend>1024*1024&&e.push("Memory usage is increasing. Check for animation cleanup issues."),Object.entries(s).forEach(([n,o])=>{o.averageDuration>100&&e.push(`Animation "${n}" is taking too long (${o.averageDuration}ms). Consider optimization.`)}),e.length===0&&e.push("Performance looks good! No issues detected."),e}exportPerformanceData(){const e={report:this.getPerformanceReport(),frameRateHistory:this.frameRates,memoryHistory:this.memoryUsage,animationMetrics:Object.fromEntries(this.animationMetrics)};return JSON.stringify(e,null,2)}clearData(){this.frameRates=[],this.memoryUsage=[],this.animationMetrics.clear()}cleanup(){this.stopMonitoring(),this.performanceObserver&&(this.performanceObserver.disconnect(),this.performanceObserver=null),this.clearData()}};c(x,"instance");let AnimationPerformanceMonitor=x;const animationPerformanceMonitor=AnimationPerformanceMonitor.getInstance();typeof window<"u"&&window.ENABLE_PERFORMANCE_MONITOR&&animationPerformanceMonitor.startMonitoring();typeof window<"u"&&window.addEventListener("beforeunload",()=>{animationPerformanceMonitor.cleanup()});const L=class L{constructor(){c(this,"isMobile",!1);c(this,"isLowPowered",!1);c(this,"touchSupported",!1);c(this,"devicePixelRatio",1);c(this,"connectionSpeed","unknown");c(this,"batteryLevel",1);c(this,"optimizationLevel","high");this.detectDeviceCapabilities(),this.setupTouchOptimizations(),this.monitorBatteryStatus(),this.monitorNetworkConditions()}static getInstance(){return L.instance||(L.instance=new L),L.instance}detectDeviceCapabilities(){typeof window>"u"||(this.isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.touchSupported="ontouchstart"in window||navigator.maxTouchPoints>0,this.devicePixelRatio=window.devicePixelRatio||1,this.isLowPowered=this.detectLowPoweredDevice(),this.optimizationLevel=this.determineOptimizationLevel())}detectLowPoweredDevice(){if((navigator.hardwareConcurrency||4)<=2)return!0;const t=navigator.deviceMemory;if(t&&t<=2)return!0;const i=navigator.userAgent.toLowerCase();return["android 4","android 5","iphone 5","iphone 6","ipad 2","ipad 3"].some(n=>i.includes(n))}determineOptimizationLevel(){return this.isLowPowered||this.batteryLevel<.2?"low":this.isMobile||this.devicePixelRatio>2?"medium":"high"}setupTouchOptimizations(){this.touchSupported&&(this.addTouchOptimizationStyles(),this.setupTouchEventOptimizations())}addTouchOptimizationStyles(){const e="mobile-animation-optimizations";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
        `,document.head.appendChild(t)}setupTouchEventOptimizations(){this.supportsPassiveEvents()&&(document.addEventListener("touchstart",()=>{},{passive:!0}),document.addEventListener("touchmove",()=>{},{passive:!0}))}supportsPassiveEvents(){let e=!1;try{const t=Object.defineProperty({},"passive",{get:function(){return e=!0,!0}}),i=()=>{};window.addEventListener("testPassive",i,t),window.removeEventListener("testPassive",i,t)}catch{e=!1}return e}monitorBatteryStatus(){typeof navigator>"u"||!navigator.getBattery||navigator.getBattery().then(e=>{this.batteryLevel=e.level;const t=()=>{this.batteryLevel=e.level,this.optimizationLevel=this.determineOptimizationLevel(),this.applyBatteryOptimizations()};e.addEventListener("levelchange",t),e.addEventListener("chargingchange",t)}).catch(()=>{})}applyBatteryOptimizations(){const e=document.body;this.batteryLevel<.2?e.classList.add("battery-saving"):e.classList.remove("battery-saving")}monitorNetworkConditions(){if(typeof navigator>"u"||!navigator.connection)return;const e=navigator.connection;this.connectionSpeed=e.effectiveType||"unknown";const t=()=>{this.connectionSpeed=e.effectiveType||"unknown",this.optimizationLevel=this.determineOptimizationLevel()};e.addEventListener("change",t)}getMobileOptimizedSettings(){switch(this.optimizationLevel){case"low":return{duration:.2,ease:"power1.out",stagger:.02,quality:"low",useHardwareAcceleration:!0,reducedComplexity:!0};case"medium":return{duration:.4,ease:"power2.out",stagger:.05,quality:"medium",useHardwareAcceleration:!0,reducedComplexity:!1};default:return{duration:.6,ease:"power2.out",stagger:.08,quality:"high",useHardwareAcceleration:!1,reducedComplexity:!1}}}optimizeElementForMobile(e){const t=this.getMobileOptimizedSettings();e.classList.add("touch-optimized"),t.useHardwareAcceleration&&e.classList.add("mobile-accelerated"),this.isLowPowered&&e.classList.add("mobile-reduced-motion"),this.isInteractiveElement(e)&&e.classList.add("touch-feedback")}isInteractiveElement(e){const t=["button","a","input","textarea","select"],i=e.onclick!==null,s=e.getAttribute("role")==="button";return t.includes(e.tagName.toLowerCase())||i||s}createTouchOptimizedAnimation(e,t,i={}){const{touchFeedback:s=!1,preventScrolling:n=!1}=i,o=this.getMobileOptimizedSettings();this.optimizeElementForMobile(e);const l={...t,duration:o.duration,ease:o.ease,force3D:o.useHardwareAcceleration};return s&&this.touchSupported&&this.addTouchFeedback(e),n&&this.touchSupported&&this.preventScrollDuringAnimation(e),l}addTouchFeedback(e){let t=!1;const i=n=>{t||(t=!0,e.style.transform="scale(0.95)",e.style.transition="transform 0.1s ease-out")},s=()=>{t&&(t=!1,e.style.transform="",setTimeout(()=>{e.style.transition=""},100))};e.addEventListener("touchstart",i,{passive:!0}),e.addEventListener("touchend",s,{passive:!0}),e.addEventListener("touchcancel",s,{passive:!0})}preventScrollDuringAnimation(e){const t=i=>{i.preventDefault()};e.addEventListener("touchmove",t,{passive:!1})}getDeviceInfo(){return{isMobile:this.isMobile,isLowPowered:this.isLowPowered,touchSupported:this.touchSupported,devicePixelRatio:this.devicePixelRatio,connectionSpeed:this.connectionSpeed,batteryLevel:this.batteryLevel,optimizationLevel:this.optimizationLevel}}shouldUseReducedAnimations(){return this.isLowPowered||this.batteryLevel<.3||this.connectionSpeed==="slow-2g"}optimizeScrollPerformance(){if(!this.isMobile)return;document.body.style.webkitOverflowScrolling="touch";let e=!1;const t=()=>{e||(requestAnimationFrame(()=>{e=!1}),e=!0)};window.addEventListener("scroll",t,{passive:!0})}cleanup(){const e=document.getElementById("mobile-animation-optimizations");e&&e.remove(),document.body.classList.remove("battery-saving")}};c(L,"instance");let MobileAnimationOptimizer=L;const mobileAnimationOptimizer=MobileAnimationOptimizer.getInstance();typeof window<"u"&&mobileAnimationOptimizer.optimizeScrollPerformance();typeof window<"u"&&window.addEventListener("beforeunload",()=>{mobileAnimationOptimizer.cleanup()});const k=class k{constructor(){c(this,"acceleratedElements",new Set);c(this,"compositeLayerElements",new Set);c(this,"willChangeElements",new Map);c(this,"performanceObserver",null);c(this,"layerCount",0);c(this,"maxLayers",50);c(this,"throttledScrollHandler",this.throttle(e=>{this.updateScrollOptimizations(e)},16));this.initializePerformanceMonitoring(),this.setupGlobalOptimizations()}static getInstance(){return k.instance||(k.instance=new k),k.instance}initializePerformanceMonitoring(){if(!(typeof window>"u"||!window.PerformanceObserver))try{this.performanceObserver=new PerformanceObserver(e=>{e.getEntries().forEach(i=>{(i.entryType==="paint"||i.entryType==="layout-shift")&&this.analyzeRenderingPerformance(i)})}),this.performanceObserver.observe({entryTypes:["paint","layout-shift","largest-contentful-paint"]})}catch{}}setupGlobalOptimizations(){this.addGlobalOptimizationStyles()}addGlobalOptimizationStyles(){const e="hardware-acceleration-optimizations";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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
        `,document.head.appendChild(t)}analyzeRenderingPerformance(e){e.entryType==="layout-shift"&&e.value>.1&&this.optimizeLayoutStability()}optimizeElement(e,t={}){const{forceLayer:i=!1,optimizeTransforms:s=!0,optimizeOpacity:n=!0,preventLayoutShift:o=!0,useWillChange:l=!0}=t;if(this.layerCount>=this.maxLayers&&i)return{success:!1,reason:"max_layers_reached"};const a=[];return s&&(e.classList.add("gpu-accelerated"),a.push("gpu-acceleration")),i&&(e.classList.add("composite-layer"),this.compositeLayerElements.add(e),this.layerCount++,a.push("composite-layer")),s&&(e.classList.add("optimized-transform"),a.push("transform-optimization")),n&&(e.classList.add("opacity-optimized"),a.push("opacity-optimization")),o&&(e.classList.add("no-layout-shift"),a.push("layout-stability")),l&&(this.setWillChange(e,["transform","opacity"]),a.push("will-change")),this.acceleratedElements.add(e),{success:!0,optimizations:a,layerPromoted:i}}setWillChange(e,t){const i=this.willChangeElements.get(e)||[],s=[...new Set([...i,...t])];this.willChangeElements.set(e,s),e.style.willChange=s.join(", ")}removeWillChange(e,t){if(!t){e.style.willChange="auto",this.willChangeElements.delete(e);return}const s=(this.willChangeElements.get(e)||[]).filter(n=>!t.includes(n));s.length===0?(e.style.willChange="auto",this.willChangeElements.delete(e)):(this.willChangeElements.set(e,s),e.style.willChange=s.join(", "))}optimizeAnimation(e,t){const{properties:i,duration:s,easing:n,useGPU:o=!0,forceLayer:l=!1}=t;return o&&this.optimizeElement(e,{forceLayer:l,optimizeTransforms:i.includes("transform"),optimizeOpacity:i.includes("opacity")}),e.classList.add("animate-optimized","animating"),this.setWillChange(e,i),{...t,force3D:o,onStart:()=>{e.classList.add("animating"),t.onStart?.()},onComplete:()=>{e.classList.remove("animating"),this.removeWillChange(e,i),t.onComplete?.()}}}optimizeScrollPerformance(e){e.classList.add("smooth-scroll"),this.supportsPassiveEvents()&&e.addEventListener("scroll",()=>{this.throttledScrollHandler(e)},{passive:!0}),e.querySelectorAll("*").forEach(s=>{s instanceof HTMLElement&&s.classList.add("paint-optimized")})}updateScrollOptimizations(e){e.getBoundingClientRect();const t=window.innerHeight;e.querySelectorAll(".gpu-accelerated").forEach(s=>{if(s instanceof HTMLElement){const n=s.getBoundingClientRect();n.bottom>=0&&n.top<=t?this.setWillChange(s,["transform"]):this.removeWillChange(s)}})}supportsPassiveEvents(){let e=!1;try{const t=Object.defineProperty({},"passive",{get:function(){return e=!0,!0}}),i=()=>{};window.addEventListener("testPassive",i,t),window.removeEventListener("testPassive",i,t)}catch{e=!1}return e}throttle(e,t){let i;return function(...s){i||(e.apply(this,s),i=!0,setTimeout(()=>i=!1,t))}}optimizeLayoutStability(){document.querySelectorAll("img, video, iframe").forEach(t=>{t instanceof HTMLElement&&t.classList.add("no-layout-shift")})}getLayerInfo(){return{totalLayers:this.layerCount,maxLayers:this.maxLayers,acceleratedElements:this.acceleratedElements.size,compositeElements:this.compositeLayerElements.size,willChangeElements:this.willChangeElements.size}}isAccelerated(e){return this.acceleratedElements.has(e)}removeAcceleration(e){e.classList.remove("gpu-accelerated","composite-layer","optimized-transform","opacity-optimized","no-layout-shift","animate-optimized"),this.removeWillChange(e),this.acceleratedElements.delete(e),this.compositeLayerElements.has(e)&&(this.compositeLayerElements.delete(e),this.layerCount--)}optimizeForMobile(){document.body.classList.add("mobile-gpu-optimized"),this.maxLayers=25,this.acceleratedElements.forEach(e=>{e.classList.add("mobile-gpu-optimized")})}getOptimizationRecommendations(){const e=[];return this.layerCount>this.maxLayers*.8&&e.push("Consider reducing the number of composite layers to improve memory usage."),this.willChangeElements.size>20&&e.push("Too many elements with will-change property. Consider removing will-change from inactive elements."),this.acceleratedElements.size===0&&e.push("No elements are hardware accelerated. Consider optimizing key interactive elements."),e}cleanup(){this.acceleratedElements.forEach(t=>{this.removeAcceleration(t)}),this.acceleratedElements.clear(),this.compositeLayerElements.clear(),this.willChangeElements.clear(),this.performanceObserver&&(this.performanceObserver.disconnect(),this.performanceObserver=null);const e=document.getElementById("hardware-acceleration-optimizations");e&&e.remove(),this.layerCount=0}};c(k,"instance");let HardwareAccelerationOptimizer=k;const hardwareAccelerationOptimizer=HardwareAccelerationOptimizer.getInstance();typeof window<"u"&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&hardwareAccelerationOptimizer.optimizeForMobile();typeof window<"u"&&window.addEventListener("beforeunload",()=>{hardwareAccelerationOptimizer.cleanup()});const _BrowserCompatibilityManager=class _BrowserCompatibilityManager{constructor(){c(this,"browserInfo");c(this,"supportedFeatures");c(this,"fallbackStyles",null);this.browserInfo=this.detectBrowser(),this.supportedFeatures=this.detectFeatureSupport(),this.setupFallbacks()}static getInstance(){return _BrowserCompatibilityManager.instance||(_BrowserCompatibilityManager.instance=new _BrowserCompatibilityManager),_BrowserCompatibilityManager.instance}detectBrowser(){if(typeof navigator>"u")return{name:"unknown",version:0,isModern:!0,supportsES6:!0};const r=navigator.userAgent;let e="unknown",t=0;if(r.includes("Chrome")){e="chrome";const n=r.match(/Chrome\/(\d+)/);t=n?parseInt(n[1]):0}else if(r.includes("Firefox")){e="firefox";const n=r.match(/Firefox\/(\d+)/);t=n?parseInt(n[1]):0}else if(r.includes("Safari")&&!r.includes("Chrome")){e="safari";const n=r.match(/Version\/(\d+)/);t=n?parseInt(n[1]):0}else if(r.includes("Edge")){e="edge";const n=r.match(/Edge\/(\d+)/);t=n?parseInt(n[1]):0}else if(r.includes("MSIE")||r.includes("Trident")){e="ie";const n=r.match(/(?:MSIE |rv:)(\d+)/);t=n?parseInt(n[1]):0}const i=this.isModernBrowser(e,t),s=this.supportsES6Features();return{name:e,version:t,isModern:i,supportsES6:s}}isModernBrowser(r,e){return e>=({chrome:60,firefox:55,safari:12,edge:79,ie:0}[r]||0)}supportsES6Features(){try{return eval("const test = () => {}; class Test {}"),!0}catch{return!1}}detectFeatureSupport(){if(typeof window>"u")return{transforms3d:!1,transitions:!1,animations:!1,flexbox:!1,grid:!1,willChange:!1,intersectionObserver:!1,requestAnimationFrame:!1,webGL:!1};const e=document.createElement("div").style;return{transforms3d:this.supportsTransforms3D(),transitions:"transition"in e,animations:"animation"in e,flexbox:"flex"in e||"webkitFlex"in e,grid:"grid"in e,willChange:"willChange"in e,intersectionObserver:"IntersectionObserver"in window,requestAnimationFrame:"requestAnimationFrame"in window,webGL:this.supportsWebGL()}}supportsTransforms3D(){const r=document.createElement("div");return r.style.transform="translateZ(0)",r.style.transform!==""}supportsWebGL(){try{const r=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(r.getContext("webgl")||r.getContext("experimental-webgl")))}catch{return!1}}setupFallbacks(){this.addFallbackStyles(),this.setupPolyfills(),this.addBrowserClasses()}addFallbackStyles(){const r="browser-compatibility-fallbacks";if(document.getElementById(r))return;this.fallbackStyles=document.createElement("style"),this.fallbackStyles.id=r;let e=`
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
        `;this.supportedFeatures.transforms3d||(e+=`
                /* 2D transform fallbacks */
                .gpu-accelerated {
                    position: relative;
                }
                
                .parallax-fallback {
                    position: relative;
                    top: 0;
                    transition: top 0.1s linear;
                }
            `),this.supportedFeatures.transitions||(e+=`
                /* No transition support - instant changes */
                .fallback-animation,
                .fallback-fade,
                .fallback-slide,
                .fallback-scale {
                    transition: none !important;
                }
            `),this.supportedFeatures.flexbox||(e+=`
                /* Flexbox fallbacks */
                .flex-fallback {
                    display: block;
                }
                
                .flex-fallback > * {
                    display: inline-block;
                    vertical-align: top;
                }
            `),this.browserInfo.name==="ie"&&(e+=`
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
            `),this.fallbackStyles.textContent=e,document.head.appendChild(this.fallbackStyles)}setupPolyfills(){this.supportedFeatures.requestAnimationFrame||this.polyfillRequestAnimationFrame(),this.supportedFeatures.intersectionObserver||this.polyfillIntersectionObserver()}polyfillRequestAnimationFrame(){let r=0;window.requestAnimationFrame=e=>{const t=new Date().getTime(),i=Math.max(0,16-(t-r)),s=window.setTimeout(()=>{e(t+i)},i);return r=t+i,s},window.cancelAnimationFrame=e=>{clearTimeout(e)}}polyfillIntersectionObserver(){if(typeof window>"u")return;class r{constructor(t){c(this,"callback");c(this,"elements",new Set);c(this,"checkInterval",null);this.callback=t}observe(t){this.elements.add(t),this.checkInterval||this.startChecking()}unobserve(t){this.elements.delete(t),this.elements.size===0&&this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null)}disconnect(){this.elements.clear(),this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null)}startChecking(){this.checkInterval=window.setInterval(()=>{const t=[];this.elements.forEach(i=>{const s=i.getBoundingClientRect(),n=s.top<window.innerHeight&&s.bottom>0;t.push({target:i,isIntersecting:n,intersectionRatio:n?1:0,boundingClientRect:s,intersectionRect:s,rootBounds:null,time:Date.now()})}),t.length>0&&this.callback(t,this)},100)}}window.IntersectionObserver=r}addBrowserClasses(){const r=[`browser-${this.browserInfo.name}`,`browser-version-${this.browserInfo.version}`];this.browserInfo.isModern||r.push("browser-legacy"),this.supportedFeatures.transforms3d||r.push("no-transforms3d"),this.supportedFeatures.transitions||r.push("no-transitions"),this.supportedFeatures.animations||r.push("no-animations"),document.documentElement.classList.add(...r)}createFallbackAnimation(r,e,t={}){const{duration:i=300,delay:s=0,easing:n="ease",useTransitions:o=this.supportedFeatures.transitions}=t,l={element:r,type:e,isActive:!1,start:()=>{l.isActive||(l.isActive=!0,o&&(r.style.transition=`all ${i}ms ${n}`,s>0&&(r.style.transitionDelay=`${s}ms`)),r.classList.add(`fallback-${e}`),requestAnimationFrame(()=>{r.classList.add("active")}),setTimeout(()=>{o&&(r.style.transition="",r.style.transitionDelay=""),l.isActive=!1},i+s))},stop:()=>{r.classList.remove(`fallback-${e}`,"active"),r.style.transition="",r.style.transitionDelay="",l.isActive=!1}};return l}createProgressiveAnimation(r,e,t){this.browserInfo.isModern&&this.supportedFeatures.transforms3d?e():t()}getAnimationConfig(){return this.browserInfo.isModern?this.supportedFeatures.transforms3d?{duration:600,easing:"cubic-bezier(0.4, 0, 0.2, 1)",useTransforms:!0,useOpacity:!0,complexity:"high"}:{duration:300,easing:"ease",useTransforms:!1,useOpacity:!0,complexity:"medium"}:{duration:200,easing:"linear",useTransforms:!1,useOpacity:this.supportedFeatures.transitions,complexity:"low"}}isSupported(r){return this.supportedFeatures[r]}getBrowserInfo(){return{...this.browserInfo}}getSupportedFeatures(){return{...this.supportedFeatures}}applyFallback(r,e){switch(e){case"flexbox":this.supportedFeatures.flexbox||r.classList.add("flex-fallback");break;case"transforms":this.supportedFeatures.transforms3d||r.classList.add("no-transforms3d");break;case"animations":this.supportedFeatures.animations||r.classList.add("no-animations");break}}cleanup(){this.fallbackStyles&&(this.fallbackStyles.remove(),this.fallbackStyles=null);const r=document.documentElement.classList;Array.from(r).forEach(e=>{(e.startsWith("browser-")||e.startsWith("no-"))&&r.remove(e)})}};c(_BrowserCompatibilityManager,"instance");let BrowserCompatibilityManager=_BrowserCompatibilityManager;const browserCompatibilityManager=BrowserCompatibilityManager.getInstance();typeof window<"u"&&(window.__browserCompatibility={info:browserCompatibilityManager.getBrowserInfo(),features:browserCompatibilityManager.getSupportedFeatures()});typeof window<"u"&&window.addEventListener("beforeunload",()=>{browserCompatibilityManager.cleanup()});const C=class C{constructor(){c(this,"activeTimelines",new Set);c(this,"activeScrollTriggers",new Set);c(this,"intersectionObservers",new Set);c(this,"performanceMetrics",new Map);c(this,"isReducedMotion",!1);this.initializeReducedMotionDetection(),this.setupPerformanceMonitoring()}static getInstance(){return C.instance||(C.instance=new C),C.instance}initializeReducedMotionDetection(){if(typeof window>"u")return;this.isReducedMotion=accessibilityManager.prefersReducedMotion(),window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",t=>{this.isReducedMotion=t.matches,this.isReducedMotion&&this.disableAllAnimations()})}setupPerformanceMonitoring(){if(typeof window>"u")return;let e=0,t=performance.now();const i=()=>{e++;const s=performance.now();if(s-t>=1e3){const n=Math.round(e*1e3/(s-t));this.recordMetric("fps",n),e=0,t=s}requestAnimationFrame(i)};requestAnimationFrame(i)}recordMetric(e,t){this.performanceMetrics.has(e)||this.performanceMetrics.set(e,[]);const i=this.performanceMetrics.get(e);i.push(t),i.length>100&&i.shift()}getPerformanceMetrics(){const e={};return this.performanceMetrics.forEach((t,i)=>{if(t.length>0){const s=t.reduce((l,a)=>l+a,0)/t.length,n=Math.min(...t),o=Math.max(...t);e[i]={avg:Math.round(s),min:n,max:o}}}),e}registerTimeline(e){this.activeTimelines.add(e),e.eventCallback("onComplete",()=>{this.activeTimelines.delete(e)})}registerScrollTrigger(e){this.activeScrollTriggers.add(e)}createIntersectionObserver(e,t={}){const i={threshold:.1,rootMargin:"0px 0px -10% 0px",...t},s=new IntersectionObserver(e,i);return this.intersectionObservers.add(s),s}createScrollTrigger(e){if(this.isReducedMotion)return{kill:()=>{},refresh:()=>{}};const t=ScrollTrigger.create({...e,onRefresh:i=>{this.recordMetric("scrolltrigger_refresh",performance.now()),e.onRefresh?.(i)}});return this.registerScrollTrigger(t),t}createOptimizedAnimation(e,t,i={}){if(this.isReducedMotion)return gsapWithCSS.set(e,{opacity:t.opacity??1,x:0,y:0,scale:t.scale??1}),{cleanup:()=>{}};const{trigger:s=e,threshold:n=.1,rootMargin:o="0px 0px -10% 0px",once:l=!0}=i;let a=!1,d=null;const u=`animation-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,m=hardwareAccelerationOptimizer.optimizeElement(e,{optimizeTransforms:!0,optimizeOpacity:!0,useWillChange:!0}),p=this.createIntersectionObserver(f=>{f.forEach(g=>{if(g.isIntersecting&&(!l||!a)){animationPerformanceMonitor.startAnimationMeasure(u);const y=[];(t.x!==void 0||t.y!==void 0)&&y.push("transform"),t.opacity!==void 0&&y.push("opacity"),hardwareAccelerationOptimizer.setWillChange(e,y),d=gsapWithCSS.timeline(),d.to(e,{...t,force3D:!0,onComplete:()=>{animationPerformanceMonitor.endAnimationMeasure(u,{element:e.tagName,className:e.className,animationType:"intersection",hardwareAccelerated:m.success}),hardwareAccelerationOptimizer.removeWillChange(e,y),t.onComplete?.()}}),this.registerTimeline(d),a=!0,l&&p.unobserve(g.target)}})},{threshold:n,rootMargin:o}),h=typeof s=="string"?document.querySelector(s):s;return h&&p.observe(h),{cleanup:()=>{p.disconnect(),this.intersectionObservers.delete(p),d&&(d.kill(),this.activeTimelines.delete(d)),m.success&&hardwareAccelerationOptimizer.removeAcceleration(e)}}}batchDOMOperations(e){requestAnimationFrame(()=>{e.forEach(t=>t())})}disableAllAnimations(){this.activeTimelines.forEach(e=>e.kill()),this.activeTimelines.clear(),this.activeScrollTriggers.forEach(e=>e.kill()),this.activeScrollTriggers.clear(),gsapWithCSS.globalTimeline.timeScale(1e3)}cleanup(){this.activeTimelines.forEach(e=>e.kill()),this.activeTimelines.clear(),this.activeScrollTriggers.forEach(e=>e.kill()),this.activeScrollTriggers.clear(),this.intersectionObservers.forEach(e=>e.disconnect()),this.intersectionObservers.clear(),this.performanceMetrics.clear()}getStats(){return{activeTimelines:this.activeTimelines.size,activeScrollTriggers:this.activeScrollTriggers.size,activeObservers:this.intersectionObservers.size,isReducedMotion:this.isReducedMotion,performance:this.getPerformanceMetrics()}}isLowPoweredDevice(){if(typeof navigator>"u")return!1;const e=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),t=!!(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4),i=navigator,s=!!(i.deviceMemory&&i.deviceMemory<=4);return e||t||s}getOptimizedSettings(){const e=this.isLowPoweredDevice(),t=this.getPerformanceMetrics().fps?.avg||60,i=mobileAnimationOptimizer.getMobileOptimizedSettings(),s=browserCompatibilityManager.getAnimationConfig();return this.isReducedMotion?{duration:0,ease:"none",stagger:0,quality:"low"}:browserCompatibilityManager.getBrowserInfo().isModern?mobileAnimationOptimizer.getDeviceInfo().isMobile?{duration:i.duration,ease:i.ease,stagger:i.stagger,quality:i.quality}:e||t<30?{duration:.3,ease:"power1.out",stagger:.05,quality:"low"}:t<50?{duration:.5,ease:"power2.out",stagger:.08,quality:"medium"}:{duration:.8,ease:"power2.out",stagger:.1,quality:"high"}:{duration:s.duration/1e3,ease:s.easing==="linear"?"none":"power1.out",stagger:.02,quality:"low"}}};c(C,"instance");let AnimationManager=C;const animationManager=AnimationManager.getInstance();typeof window<"u"&&window.addEventListener("beforeunload",()=>{animationManager.cleanup()});typeof window<"u"&&gsapWithCSS.registerPlugin(ScrollTrigger,ScrollToPlugin);const useSmoothScroll=()=>{const r=compilerRuntimeExports.c(6),e=reactExports.useRef(null);let t,i;r[0]===Symbol.for("react.memo_cache_sentinel")?(t=()=>{if(typeof window>"u")return;const a=window.innerWidth<768,d=window.matchMedia("(pointer: coarse)").matches&&!window.matchMedia("(hover: hover)").matches;if(a||d)return;e.current=new Lenis({lerp:.1,smoothWheel:!0,wheelMultiplier:1.1,touchMultiplier:2,infinite:!1,autoResize:!0}),e.current.on("scroll",ScrollTrigger.update);const u=m=>{e.current?.raf(m*1e3)};return gsapWithCSS.ticker.add(u),gsapWithCSS.ticker.lagSmoothing(0),()=>{e.current?.destroy(),gsapWithCSS.ticker.remove(u)}},i=[],r[0]=t,r[1]=i):(t=r[0],i=r[1]),reactExports.useEffect(t,i);let s;r[2]===Symbol.for("react.memo_cache_sentinel")?(s=(a,d)=>{if(e.current)e.current.scrollTo(a,{offset:d?.offset||0,duration:d?.duration||1.2});else if(typeof window<"u"){const u=typeof a=="number"?a:(document.querySelector(a)?.getBoundingClientRect().top||0)+window.scrollY;window.scrollTo({top:u+(d?.offset||0),behavior:"smooth"})}},r[2]=s):s=r[2];let n;r[3]===Symbol.for("react.memo_cache_sentinel")?(n=()=>{e.current?.stop()},r[3]=n):n=r[3];let o;r[4]===Symbol.for("react.memo_cache_sentinel")?(o=()=>{e.current?.start()},r[4]=o):o=r[4];let l;return r[5]===Symbol.for("react.memo_cache_sentinel")?(l={scrollTo:s,stop:n,start:o},r[5]=l):l=r[5],l},useHeroParallax=(r,e,t)=>{const i=compilerRuntimeExports.c(9);let s;i[0]!==t?(s=t===void 0?{}:t,i[0]=t,i[1]=s):s=i[1];const n=s,{mouseParallax:o,scrollParallax:l,intensity:a}=n,d=o===void 0?!0:o,u=l===void 0?!0:l,m=a===void 0?1:a;let p,h;i[2]!==r||i[3]!==e||i[4]!==m||i[5]!==d||i[6]!==u?(p=()=>{if(typeof window>"u"||!r.current)return;const f=r.current,g=e.map(_temp).filter(Boolean);if(g.length===0)return;const y=[];if(d){const z=M=>{if(window.matchMedia("(hover: none)").matches)return;const v=f.getBoundingClientRect(),T=v.left+v.width/2,b=v.top+v.height/2,O=(M.clientX-T)/v.width*m,A=(M.clientY-b)/v.height*m;g.forEach((E,S)=>{const w=(S+1)*.5;gsapWithCSS.to(E,{duration:1.5,x:O*w*20,y:A*w*10,ease:"power2.out"})})};f.addEventListener("mousemove",z),y.push(()=>f.removeEventListener("mousemove",z))}if(u){const z=animationManager.createScrollTrigger({trigger:f,start:"top bottom",end:"bottom top",scrub:!0,onUpdate:M=>{const v=M.progress;g.forEach((T,b)=>{const O=(b+1)*.3*m;gsapWithCSS.set(T,{y:v*O*100,force3D:!0})})}});y.push(()=>z.kill())}return()=>{y.forEach(_temp2)}},h=[r,e,d,u,m],i[2]=r,i[3]=e,i[4]=m,i[5]=d,i[6]=u,i[7]=p,i[8]=h):(p=i[7],h=i[8]),reactExports.useEffect(p,h)},useTextReveal=(r,e)=>{const t=compilerRuntimeExports.c(15);let i;t[0]!==e?(i=e===void 0?{}:e,t[0]=e,t[1]=i):i=t[1];const s=i,{trigger:n,start:o,end:l,stagger:a,splitType:d}=s,u=n===void 0?"top 80%":n,m=o===void 0?"top 80%":o,p=l===void 0?"bottom 20%":l,h=a===void 0?.05:a,f=d===void 0?"words":d;let g;t[2]!==r||t[3]!==p||t[4]!==f||t[5]!==h||t[6]!==m?(g=()=>{if(typeof window>"u"||!r.current)return;const M=r.current.querySelectorAll("[data-text-reveal]"),v=[];return M.forEach(T=>{const b=T,O=b.dataset.textReveal||"fade-up",A=b.textContent||"";let E=[];if(f==="words"){const P=A.split(" ");b.innerHTML=P.map(_temp3).join(" "),E=Array.from(b.querySelectorAll(".word-span"))}else if(f==="chars"){const P=A.split("");b.innerHTML=P.map(_temp4).join(""),E=Array.from(b.querySelectorAll(".char-span"))}const S={},w={duration:.8,ease:"power2.out",stagger:h};e:switch(O){case"fade-up":{S.opacity=0,S.y=30,w.opacity=1,w.y=0;break e}case"fade-in":{S.opacity=0,w.opacity=1;break e}case"slide-left":{S.opacity=0,S.x=-30,w.opacity=1,w.x=0;break e}case"slide-right":{S.opacity=0,S.x=30,w.opacity=1,w.x=0;break e}case"scale-in":S.opacity=0,S.scale=.8,w.opacity=1,w.scale=1,w.ease="back.out(1.7)"}E.length>0?gsapWithCSS.set(E,S):gsapWithCSS.set(b,S);const I=ScrollTrigger.create({trigger:b,start:m,end:p,onEnter:()=>{E.length>0?gsapWithCSS.to(E,w):gsapWithCSS.to(b,w)}});v.push(I)}),()=>{v.forEach(_temp5)}},t[2]=r,t[3]=p,t[4]=f,t[5]=h,t[6]=m,t[7]=g):g=t[7];let y;t[8]!==r||t[9]!==p||t[10]!==f||t[11]!==h||t[12]!==m||t[13]!==u?(y=[r,u,m,p,h,f],t[8]=r,t[9]=p,t[10]=f,t[11]=h,t[12]=m,t[13]=u,t[14]=y):y=t[14],reactExports.useEffect(g,y)},useGSAPInit=()=>{const r=compilerRuntimeExports.c(1);let e;r[0]===Symbol.for("react.memo_cache_sentinel")?(e=[],r[0]=e):e=r[0],reactExports.useEffect(_temp1,e)},useIntersectionAnimation=(r,e,t)=>{const i=compilerRuntimeExports.c(9);let s;i[0]!==t?(s=t===void 0?{}:t,i[0]=t,i[1]=s):s=i[1];const n=s,{threshold:o,rootMargin:l,once:a}=n,d=o===void 0?.1:o,u=l===void 0?"0px 0px -10% 0px":l,m=a===void 0?!0:a;let p,h;i[2]!==e||i[3]!==r||i[4]!==m||i[5]!==u||i[6]!==d?(p=()=>{if(typeof window>"u"||!r.current)return;const f=r.current,{cleanup:g}=animationManager.createOptimizedAnimation(f,e,{threshold:d,rootMargin:u,once:m});return g},h=[r,e,d,u,m],i[2]=e,i[3]=r,i[4]=m,i[5]=u,i[6]=d,i[7]=p,i[8]=h):(p=i[7],h=i[8]),reactExports.useEffect(p,h)},useMagneticEffect=(r,e)=>{const t=compilerRuntimeExports.c(7);let i;t[0]!==e?(i=e===void 0?{}:e,t[0]=e,t[1]=i):i=t[1];const s=i,{strength:n,speed:o}=s,l=n===void 0?.3:n,a=o===void 0?.3:o;let d,u;t[2]!==r||t[3]!==a||t[4]!==l?(d=()=>{if(typeof window>"u"||!r.current)return;const m=r.current,p=f=>{if(window.matchMedia("(hover: none)").matches)return;const g=m.getBoundingClientRect(),y=g.left+g.width/2,z=g.top+g.height/2,M=(f.clientX-y)*l,v=(f.clientY-z)*l;gsapWithCSS.to(m,{x:M,y:v,duration:a,ease:"power2.out"})},h=()=>{gsapWithCSS.to(m,{x:0,y:0,duration:a*2,ease:"elastic.out(1, 0.3)"})};return m.addEventListener("mousemove",p),m.addEventListener("mouseleave",h),()=>{m.removeEventListener("mousemove",p),m.removeEventListener("mouseleave",h)}},u=[r,l,a],t[2]=r,t[3]=a,t[4]=l,t[5]=d,t[6]=u):(d=t[5],u=t[6]),reactExports.useEffect(d,u)};function _temp(r){return r.current}function _temp2(r){return r()}function _temp3(r){return`<span class="inline-block overflow-hidden"><span class="inline-block word-span">${r}</span></span>`}function _temp4(r){return r===" "?" ":`<span class="inline-block char-span">${r}</span>`}function _temp5(r){return r.kill()}function _temp0(){ScrollTrigger.refresh()}function _temp1(){if(typeof window>"u")return;gsapWithCSS.defaults({ease:"power2.out",duration:.6});let r;const e=()=>{clearTimeout(r),r=setTimeout(_temp0,100)};return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e),clearTimeout(r)}}export{useTextReveal as a,useMagneticEffect as b,useSmoothScroll as c,useGSAPInit as d,useIntersectionAnimation as e,useHeroParallax as u};
