import{setStyle,$,setStyles,addEvents,removeEvents}from"@zcorky/dom";function getLen(t){return Math.sqrt(t.x*t.x+t.y*t.y)}function dot(t,e){return t.x*e.x+t.y*e.y}function getAngle(t,e){var n=getLen(t)*getLen(e);if(0===n)return 0;var i=dot(t,e)/n;return i>1&&(i=1),Math.acos(i)}function cross(t,e){return t.x*e.y-e.x*t.y}function getRotateAngle(t,e){var n=getAngle(t,e);return cross(t,e)>0&&(n*=-1),180*n/Math.PI}var HandlerAdmin=function(t){this.handlers=[],this.el=t};function wrapFunc(t,e){var n=new HandlerAdmin(t);return n.add(e),n}HandlerAdmin.prototype.add=function(t){this.handlers.push(t)},HandlerAdmin.prototype.del=function(t){t||(this.handlers=[]);for(var e=this.handlers.length;e>=0;e--)this.handlers[e]===t&&this.handlers.splice(e,1)},HandlerAdmin.prototype.dispatch=function(){for(var t=0,e=this.handlers.length;t<e;t++){var n=this.handlers[t];"function"==typeof n&&n.apply(this.el,arguments)}};var AlloyFinger=function(t,e){this.element="string"==typeof t?document.querySelector(t):t,this.start=this.start.bind(this),this.move=this.move.bind(this),this.end=this.end.bind(this),this.cancel=this.cancel.bind(this),this.element.addEventListener("touchstart",this.start,!1),this.element.addEventListener("touchmove",this.move,!1),this.element.addEventListener("touchend",this.end,!1),this.element.addEventListener("touchcancel",this.cancel,!1),this.preV={x:null,y:null},this.pinchStartLen=null,this.zoom=1,this.isDoubleTap=!1;var n=function(){};this.rotate=wrapFunc(this.element,e.rotate||n),this.touchStart=wrapFunc(this.element,e.touchStart||n),this.multipointStart=wrapFunc(this.element,e.multipointStart||n),this.multipointEnd=wrapFunc(this.element,e.multipointEnd||n),this.pinch=wrapFunc(this.element,e.pinch||n),this.swipe=wrapFunc(this.element,e.swipe||n),this.tap=wrapFunc(this.element,e.tap||n),this.doubleTap=wrapFunc(this.element,e.doubleTap||n),this.longTap=wrapFunc(this.element,e.longTap||n),this.singleTap=wrapFunc(this.element,e.singleTap||n),this.pressMove=wrapFunc(this.element,e.pressMove||n),this.twoFingerPressMove=wrapFunc(this.element,e.twoFingerPressMove||n),this.touchMove=wrapFunc(this.element,e.touchMove||n),this.touchEnd=wrapFunc(this.element,e.touchEnd||n),this.touchCancel=wrapFunc(this.element,e.touchCancel||n),this._cancelAllHandler=this.cancelAll.bind(this),window.addEventListener("scroll",this._cancelAllHandler),this.delta=null,this.last=null,this.now=null,this.tapTimeout=null,this.singleTapTimeout=null,this.longTapTimeout=null,this.swipeTimeout=null,this.x1=this.x2=this.y1=this.y2=null,this.preTapPosition={x:null,y:null}};AlloyFinger.prototype={start:function(t){if(t.touches){this.now=Date.now(),this.x1=t.touches[0].pageX,this.y1=t.touches[0].pageY,this.delta=this.now-(this.last||this.now),this.touchStart.dispatch(t,this.element),null!==this.preTapPosition.x&&(this.isDoubleTap=this.delta>0&&this.delta<=250&&Math.abs(this.preTapPosition.x-this.x1)<30&&Math.abs(this.preTapPosition.y-this.y1)<30,this.isDoubleTap&&clearTimeout(this.singleTapTimeout)),this.preTapPosition.x=this.x1,this.preTapPosition.y=this.y1,this.last=this.now;var e=this.preV;if(t.touches.length>1){this._cancelLongTap(),this._cancelSingleTap();var n={x:t.touches[1].pageX-this.x1,y:t.touches[1].pageY-this.y1};e.x=n.x,e.y=n.y,this.pinchStartLen=getLen(e),this.multipointStart.dispatch(t,this.element)}this._preventTap=!1,this.longTapTimeout=setTimeout(function(){this.longTap.dispatch(t,this.element),this._preventTap=!0}.bind(this),750)}},move:function(t){if(t.touches){var e=this.preV,n=t.touches.length,i=t.touches[0].pageX,s=t.touches[0].pageY;if(this.isDoubleTap=!1,n>1){var a=t.touches[1].pageX,o=t.touches[1].pageY,r={x:t.touches[1].pageX-i,y:t.touches[1].pageY-s};null!==e.x&&(this.pinchStartLen>0&&(t.zoom=getLen(r)/this.pinchStartLen,this.pinch.dispatch(t,this.element)),t.angle=getRotateAngle(r,e),this.rotate.dispatch(t,this.element)),e.x=r.x,e.y=r.y,null!==this.x2&&null!==this.sx2?(t.deltaX=(i-this.x2+a-this.sx2)/2,t.deltaY=(s-this.y2+o-this.sy2)/2):(t.deltaX=0,t.deltaY=0),this.twoFingerPressMove.dispatch(t,this.element),this.sx2=a,this.sy2=o}else{if(null!==this.x2){t.deltaX=i-this.x2,t.deltaY=s-this.y2;var l=Math.abs(this.x1-this.x2),h=Math.abs(this.y1-this.y2);(l>10||h>10)&&(this._preventTap=!0)}else t.deltaX=0,t.deltaY=0;this.pressMove.dispatch(t,this.element)}this.touchMove.dispatch(t,this.element),this._cancelLongTap(),this.x2=i,this.y2=s,n>1&&t.preventDefault()}},end:function(t){if(t.changedTouches){this._cancelLongTap();var e=this;t.touches.length<2&&(this.multipointEnd.dispatch(t,this.element),this.sx2=this.sy2=null),this.x2&&Math.abs(this.x1-this.x2)>30||this.y2&&Math.abs(this.y1-this.y2)>30?(t.direction=this._swipeDirection(this.x1,this.x2,this.y1,this.y2),this.swipeTimeout=setTimeout(function(){e.swipe.dispatch(t,e.element)},0)):(this.tapTimeout=setTimeout(function(){e._preventTap||e.tap.dispatch(t,e.element),e.isDoubleTap&&(e.doubleTap.dispatch(t,e.element),e.isDoubleTap=!1)},0),e.isDoubleTap||(e.singleTapTimeout=setTimeout(function(){e.singleTap.dispatch(t,e.element)},250))),this.touchEnd.dispatch(t,this.element),this.preV.x=0,this.preV.y=0,this.zoom=1,this.pinchStartLen=null,this.x1=this.x2=this.y1=this.y2=null}},cancelAll:function(){this._preventTap=!0,clearTimeout(this.singleTapTimeout),clearTimeout(this.tapTimeout),clearTimeout(this.longTapTimeout),clearTimeout(this.swipeTimeout)},cancel:function(t){this.cancelAll(),this.touchCancel.dispatch(t,this.element)},_cancelLongTap:function(){clearTimeout(this.longTapTimeout)},_cancelSingleTap:function(){clearTimeout(this.singleTapTimeout)},_swipeDirection:function(t,e,n,i){return Math.abs(t-e)>=Math.abs(n-i)?t-e>0?"Left":"Right":n-i>0?"Up":"Down"},on:function(t,e){this[t]&&this[t].add(e)},off:function(t,e){this[t]&&this[t].del(e)},destroy:function(){return this.singleTapTimeout&&clearTimeout(this.singleTapTimeout),this.tapTimeout&&clearTimeout(this.tapTimeout),this.longTapTimeout&&clearTimeout(this.longTapTimeout),this.swipeTimeout&&clearTimeout(this.swipeTimeout),this.element.removeEventListener("touchstart",this.start),this.element.removeEventListener("touchmove",this.move),this.element.removeEventListener("touchend",this.end),this.element.removeEventListener("touchcancel",this.cancel),this.rotate.del(),this.touchStart.del(),this.multipointStart.del(),this.multipointEnd.del(),this.pinch.del(),this.swipe.del(),this.tap.del(),this.doubleTap.del(),this.longTap.del(),this.singleTap.del(),this.pressMove.del(),this.twoFingerPressMove.del(),this.touchMove.del(),this.touchEnd.del(),this.touchCancel.del(),this.preV=this.pinchStartLen=this.zoom=this.isDoubleTap=this.delta=this.last=this.now=this.tapTimeout=this.singleTapTimeout=this.longTapTimeout=this.swipeTimeout=this.x1=this.x2=this.y1=this.y2=this.preTapPosition=this.rotate=this.touchStart=this.multipointStart=this.multipointEnd=this.pinch=this.swipe=this.tap=this.doubleTap=this.longTap=this.singleTap=this.pressMove=this.touchMove=this.touchEnd=this.touchCancel=this.twoFingerPressMove=null,window.removeEventListener("scroll",this._cancelAllHandler),null}};var Matrix3D=function(t,e,n,i,s,a,o,r,l,h,c,p,u,d,m,w){this.elements=window.Float32Array?new Float32Array(16):[];var v=this.elements;v[0]=void 0!==t?t:1,v[4]=e||0,v[8]=n||0,v[12]=i||0,v[1]=s||0,v[5]=void 0!==a?a:1,v[9]=o||0,v[13]=r||0,v[2]=l||0,v[6]=h||0,v[10]=void 0!==c?c:1,v[14]=p||0,v[3]=u||0,v[7]=d||0,v[11]=m||0,v[15]=void 0!==w?w:1};function observe(t,e,n){for(var i=0,s=e.length;i<s;i++){watch(t,e[i],n)}}function watch(t,e,n){Object.defineProperty(t,e,{get:function(){return this["__"+e]},set:function(t){t!==this["__"+e]&&(this["__"+e]=t,n())}})}Matrix3D.DEG_TO_RAD=Math.PI/180,Matrix3D.prototype={set:function(t,e,n,i,s,a,o,r,l,h,c,p,u,d,m,w){var v=this.elements;return v[0]=t,v[4]=e,v[8]=n,v[12]=i,v[1]=s,v[5]=a,v[9]=o,v[13]=r,v[2]=l,v[6]=h,v[10]=c,v[14]=p,v[3]=u,v[7]=d,v[11]=m,v[15]=w,this},identity:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this},multiplyMatrices:function(t,e){var n=t.elements,i=this.elements,s=n[0],a=n[4],o=n[8],r=n[12],l=n[1],h=n[5],c=n[9],p=n[13],u=n[2],d=n[6],m=n[10],w=n[14],v=n[3],g=n[7],f=n[11],T=n[15],y=e[0],x=e[1],b=e[2],k=e[3],A=e[4],M=e[5],_=e[6],D=e[7],E=e[8],C=e[9],X=e[10],S=e[11],L=e[12],F=e[13],Y=e[14],P=e[15];return i[0]=s*y+a*A+o*E+r*L,i[4]=s*x+a*M+o*C+r*F,i[8]=s*b+a*_+o*X+r*Y,i[12]=s*k+a*D+o*S+r*P,i[1]=l*y+h*A+c*E+p*L,i[5]=l*x+h*M+c*C+p*F,i[9]=l*b+h*_+c*X+p*Y,i[13]=l*k+h*D+c*S+p*P,i[2]=u*y+d*A+m*E+w*L,i[6]=u*x+d*M+m*C+w*F,i[10]=u*b+d*_+m*X+w*Y,i[14]=u*k+d*D+m*S+w*P,i[3]=v*y+g*A+f*E+T*L,i[7]=v*x+g*M+f*C+T*F,i[11]=v*b+g*_+f*X+T*Y,i[15]=v*k+g*D+f*S+T*P,this},_rounded:function(t,e){return e=Math.pow(10,e||15),Math.round(t*e)/e},appendTransform:function(t,e,n,i,s,a,o,r,l,h,c,p,u,d){var m=o*Matrix3D.DEG_TO_RAD,w=this._rounded(Math.cos(m)),v=this._rounded(Math.sin(m)),g=r*Matrix3D.DEG_TO_RAD,f=this._rounded(Math.cos(g)),T=this._rounded(Math.sin(g)),y=l*Matrix3D.DEG_TO_RAD,x=this._rounded(Math.cos(-1*y)),b=this._rounded(Math.sin(-1*y));return this.multiplyMatrices(this,[1,0,0,t,0,w,v,e,0,-v,w,n,0,0,0,1]),this.multiplyMatrices(this,[f,0,T,0,0,1,0,0,-T,0,f,0,0,0,0,1]),this.multiplyMatrices(this,[x*i,b*s,0,0,-b*i,x*s,0,0,0,0,1*a,0,0,0,0,1]),(h||c)&&this.multiplyMatrices(this,[this._rounded(Math.cos(h*Matrix3D.DEG_TO_RAD)),this._rounded(Math.sin(h*Matrix3D.DEG_TO_RAD)),0,0,-1*this._rounded(Math.sin(c*Matrix3D.DEG_TO_RAD)),this._rounded(Math.cos(c*Matrix3D.DEG_TO_RAD)),0,0,0,0,1,0,0,0,0,1]),(p||u||d)&&(this.elements[12]-=p*this.elements[0]+u*this.elements[4]+d*this.elements[8],this.elements[13]-=p*this.elements[1]+u*this.elements[5]+d*this.elements[9],this.elements[14]-=p*this.elements[2]+u*this.elements[6]+d*this.elements[10]),this}};var Transform=function(t,e){observe(t,["translateX","translateY","translateZ","scaleX","scaleY","scaleZ","rotateX","rotateY","rotateZ","skewX","skewY","originX","originY","originZ"],function(){var n=t.matrix3D.identity().appendTransform(t.translateX,t.translateY,t.translateZ,t.scaleX,t.scaleY,t.scaleZ,t.rotateX,t.rotateY,t.rotateZ,t.skewX,t.skewY,t.originX,t.originY,t.originZ);t.style.transform=t.style.msTransform=t.style.OTransform=t.style.MozTransform=t.style.webkitTransform=(e?"":"perspective("+(void 0===t.perspective?500:t.perspective)+"px) ")+"matrix3d("+Array.prototype.slice.call(n.elements).join(",")+")"}),t.matrix3D=new Matrix3D,e||(observe(t,["perspective"],function(){t.style.transform=t.style.msTransform=t.style.OTransform=t.style.MozTransform=t.style.webkitTransform="perspective("+t.perspective+"px) matrix3d("+Array.prototype.slice.call(t.matrix3D.elements).join(",")+")"}),t.perspective=500),t.scaleX=t.scaleY=t.scaleZ=1,t.translateX=t.translateY=t.translateZ=t.rotateX=t.rotateY=t.rotateZ=t.skewX=t.skewY=t.originX=t.originY=t.originZ=0};!function(){for(var t=0,e=["webkit","moz"],n=0;n<e.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[e[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[n]+"CancelAnimationFrame"]||window[e[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(e){var n=(new Date).getTime(),i=Math.max(0,16-(n-t)),s=window.setTimeout(function(){e(n+i)},i);return t=n+i,s}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}();var To=function t(e,n,i,s,a,o,r){var l=e[n],h=i-l,c=new Date,p=this,u=a||function(t){return t};this.tickID=null;!function t(){var a=new Date-c;if(a>=s)return e[n]=i,r&&r(i),o&&o(i),cancelAnimationFrame(p.tickID),void(p.toTick=null);e[n]=h*u(a/s)+l,p.tickID=requestAnimationFrame(t),r&&r(e[n])}(),t.List.push(this)};function maxImage(t){return t.width>=t.height?{auto:"height",max:"width"}:{auto:"width",max:"height"}}function ease(t){return Math.sqrt(1-Math.pow(t-1,2))}function createBodyScrollable(){var t=document.body.style.overflow;return{enable:function(){setStyle(document.body,"overflow",t)},disable:function(){setStyle(document.body,"overflow","hidden")}}}To.List=[],To.stopAll=function(){for(var t=0,e=To.List.length;t<e;t++)cancelAnimationFrame(To.List[t].tickID);To.List.length=0},To.stop=function(t){cancelAnimationFrame(t.tickID)},To.reset=function(t,e,n){t[e]=n};var innerHTML='\n<style>\n.zcorky-loading-container {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate3d(-50%, -50%, 0);\n  z-index: -10;\n}\n.zcorky-wrapper {\n  width: 50px;\n  height: 50px;\n}\n\n.rotate {\n  animation: zcorky-rotate 1s linear infinite;\n}\n\n@keyframes zcorky-rotate {\n  to {\n    transform: rotate(1turn);\n  }\n}\n</style>\n<svg class="zcorky-wrapper" viewBox="-25 -25 50 50">\n  <circle cx="0" cy="0" r="20" stroke="#f0f0f0" fill="none" stroke-width="3px" style="opacity: 0.4"></circle>\n  <circle cx="0" cy="0" r="20" stroke="#f0f0f0" fill="none" stroke-width="3px" stroke-dasharray="20 150" class="rotate"></circle>\n</svg>\n',createLoading=function(){var t=document.createElement("div");return t.innerHTML=innerHTML,t.classList.add("zcorky-loading-container"),t},_createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var MAX_SCALE=5,MIN_SCALE=.1,Previewer=function(){function t(){var e=this;_classCallCheck(this,t),this.previewing=!1,this.lastPreviewedAt=null,this.stepCurrent=1,this.allSteps=1,this.getElement=function(t){return $(t)},this.getContainer=function(){var t="data-preview-container",n=$('div[data-preview-container="true"]');if(n)return{$box:e.$container,$image:e.$imageContainer,$mask:e.$maskContainer,$loading:e.$loading};(n=e.$container=document.createElement("div")).className="previewer",n.setAttribute(t,"true"),setStyles(n,{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:1e8,backgroundColor:"#000",overflow:"hidden",animation:"easeshow .25s",display:"flex",justifyContent:"center",alignItems:"center"});var i=document.createElement("style");i.innerHTML="\n      @keyframes easeshow {\n        0% {\n          opacity: 0;\n        }\n\n        100% {\n          opacity: 1;\n        }\n      }\n      @keyframes easehide {\n        0% {\n          opacity: 1;\n        }\n\n        100% {\n          opacity: 0;\n        }\n      }\n\n      div["+t+'="true"] img {\n        position: relative;\n      }\n\n      div['+t+'="true"] img:after {\n        content: "...";\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate3d(-50%, -50%, 0);\n      }\n\n      .pswp * {\n        box-sizing: border-box;\n      }\n\n      .pswp-toolbar-content {\n        display: flex;\n        align-items: center;\n        background: #252525;\n        border-radius: 4px;\n        padding: 6px;\n      }\n\n      .pswp .lake-pswp-tool-bar .btn {\n        color: #D9D9D9;\n        display: inline-block;\n        width: 32px;\n        height: 32px;\n        padding: 6px;\n        margin: 0 6px;\n        border: 1px solid #383838;\n        border-radius: 2px;\n        cursor: pointer;\n\n        display: flex;\n        align-items: center;\n      }\n\n      .pswp .lake-pswp-tool-bar .lake-pswp-arrow-left,.lake-pswp-arrow-right {\n        padding: 8px;\n      }\n\n      .pswp .lake-pswp-tool-bar .pswp-toolbar-content .lake-pswp-counter {\n        user-select: none;\n        display: inline-block;\n        font-size: 16px;\n        vertical-align: top;\n        line-height: 34px;\n        color: #DEDEDE;\n        margin: 0 2px;\n      }\n\n      .pswp .lake-pswp-tool-bar .separation {\n        width: 1px;\n        margin: 0px 10px;\n        display: inline-block;\n        height: 20px;\n        border: 0.5px solid #383838;\n      }\n\n      .pswp .lake-pswp-tool-bar .btn.disable {\n        background: none;\n      }\n\n      .icon {\n        width: 1em;\n        height: 1em;\n        vertical-align: -0.15em;\n        fill: currentColor;\n        overflow: hidden;\n      }\n    ',n.prepend(i);var s=document.createElement("div");s.className="previewer-image-container-wrapper";var a=e.$imageContainer=document.createElement("img");a.className="previewer-image-container",a.setAttribute("rate",window.innerHeight/window.innerWidth),setStyles(a,{width:"100%",border:"none"}),e.createAlloyFinger(a),s.appendChild(a),n.appendChild(s),addEvents(a,["click","touchstart"],function(){/mobile/i.test(window.navigator.userAgent)||e.togglePreview()});var o=e.$maskContainer=document.createElement("div");o.setAttribute("data-mask","true"),setStyles(o,{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:"-10","-webkit-tap-highlight-color":"rgba(0, 0, 0, 0)"}),n.prepend(o);var r=e.$loading=createLoading();n.appendChild(r);var l=e.createToolBox();return n.appendChild(l),e.useIconFontCN("//at.alicdn.com/t/font_1508774_ljmn8zvl2p.js"),addEvents(o,["click","tap"],e.togglePreview),document.body.appendChild(n),addEvents($(".toolbox .lake-pswp-arrow-left"),["click","tap"],e.previewPrevious),addEvents($(".toolbox .lake-pswp-arrow-right"),["click","tap"],e.previewNext),addEvents($(".lake-pswp-zoom-in"),["click","tap"],e.zoomIn),addEvents($(".lake-pswp-zoom-out"),["click","tap"],e.zoomOut),addEvents($(".lake-pswp-rotate-left"),["click","tap"],e.rotateLeft),addEvents($(".lake-pswp-rotate-right"),["click","tap"],e.rotateRight),addEvents($(".lake-pswp-origin-size"),["click","tap"],e.reset),{$box:n,$image:a,$mask:o,$loading:r}},this.getAllPreviewNodes=function(){return Array.prototype.slice.call(document.querySelectorAll('[data-preview="true"]'))},this.setSteps=function(t){var n=e.getAllPreviewNodes(),i=n.indexOf(t);e.stepCurrent=i+1,e.allSteps=n.length},this.createIcon=function(t){return'\n      <svg class="icon" aria-hidden="true">\n        <use xlink:href="#previewer-'+t+'"></use>\n      </svg>\n    '},this.createToolBox=function(){var t=document.createElement("div")||document.querySelector(".toolbox.pswp");return t.className="toolbox pswp",t.style="position: fixed; bottom:0;left:50%;transform:translateX(-50%);padding:12px;",t.innerHTML='\n      <div class="lake-pswp-tool-bar">\n        <div class="pswp-toolbar-content">\n          <span class="lake-pswp-arrow-left btn default">\n            '+e.createIcon("go-left")+'\n          </span>\n          <span class="lake-pswp-counter">'+e.stepCurrent+" / "+e.allSteps+'</span>\n          <span class="lake-pswp-arrow-right btn default">\n            '+e.createIcon("go-right")+'\n          </span>\n          <span class="separation"></span>\n          <span class="lake-pswp-zoom-in btn default">\n            '+e.createIcon("zoom-in")+'\n          </span>\n          <span class="lake-pswp-zoom-out btn default">\n            '+e.createIcon("zoom-out")+'\n          </span>\n          <span class="lake-pswp-origin-size btn activated">\n            '+e.createIcon("1v1")+'\n          </span>\n          <span class="lake-pswp-rotate-left btn default">\n            '+e.createIcon("rotate-left")+'\n          </span>\n          <span class="lake-pswp-rotate-right btn default">\n            '+e.createIcon("rotate-right")+'\n          </span>\n          \x3c!-- <span class="lake-pswp-best-size btn disable">\n          '+e.createIcon("fullscreen")+"\n        </span> --\x3e\n        </div>\n      </div>\n    ",t},this.updateToolBox=function(){var t=$(".toolbox .lake-pswp-counter");t&&(t.textContent=e.stepCurrent+" / "+e.allSteps)},this.createAlloyFinger=function(t){Transform(t);var n=1;return new AlloyFinger(t,{singleTap:function(){e.togglePreview()},doubleTap:function(){var n=1;n="width"===maxImage(t).auto?window.innerWidth/t.width:window.innerHeight/t.height,e.zoom(n)},multipointStart:function(){To.stopAll(),n=t.scaleX},multipointEnd:function(){To.stopAll(),t.scaleX<1&&(new To(t,"scaleX",1,500,ease),new To(t,"scaleY",1,500,ease)),t.scaleX>5&&(new To(t,"scaleX",5,500,ease),new To(t,"scaleY",5,500,ease));var e=t.rotateZ%360;e<0&&(e=360+e),t.rotateZ=e,e>0&&e<45?new To(t,"rotateZ",0,500,ease):e>=315?new To(t,"rotateZ",360,500,ease):e>=45&&e<135?new To(t,"rotateZ",90,500,ease):e>=135&&e<225?new To(t,"rotateZ",180,500,ease):e>=225&&e<315&&new To(t,"rotateZ",270,500,ease)},pinch:function(e){t.scaleX=t.scaleY=n*e.zoom},rotate:function(e){t.rotateZ+=e.angle},pressMove:function(n){e.checkBoundary(n.deltaX,n.deltaY)&&(t.translateX+=n.deltaX,t.translateY+=n.deltaY),n.preventDefault()}})},this.loadImage=function(t,e){var n=new Image;n.src=t,n.onload=function(){e(t)}},this.togglePreview=function(t){if(e.lastPreviewedAt&&Date.now()-e.lastPreviewedAt<300)return e.lastPreviewedAt=Date.now(),!1;e.lastPreviewedAt=Date.now(),!e.previewing&&t?e.preview(t):e.unpreview()},this.preview=function(t){if(!t)return alert("preview with no options, it needs { styles, source }");var n=t||{},i=n.styles,s=n.source;e.previewing=!0;var a=e.getContainer(),o=a.$box,r=a.$image,l=a.$loading;e.bodyScroll.disable(),setStyles(o,{display:"flex"}),r.setAttribute("src",""),setStyles(l,{display:"block"}),e.loadImage(s,function(t){r.setAttribute("src",t),setStyles(r,i),setStyles(l,{display:"none"})})},this.unpreview=function(){e.previewing=!1;var t=e.getContainer().$box;e.bodyScroll.enable(),e.reset(),setStyles(t,{"animation-name":"easehide"});addEvents(t,["animationend"],function e(){"easehide"===t.style["animation-name"]&&setStyles(t,{display:"none","animation-name":"easeshow"}),removeEvents(t,["animationend",e])})},this.previewNext=function(){var t;e.stepCurrent+=1,e.stepCurrent>e.allSteps&&(e.stepCurrent=1);var n=e.stepCurrent-1,i=e.getAllPreviewNodes()[n];e.updateToolBox();var s=maxImage(i),a=s.max,o=s.auto,r=i.src||i.getAttribute("data-src"),l=i.getAttribute("data-hd");e.reset(),e.preview({styles:(t={},_defineProperty(t,a,"100%"),_defineProperty(t,o,"auto"),t),source:l||r})},this.previewPrevious=function(){var t;e.stepCurrent-=1,e.stepCurrent<=0&&(e.stepCurrent=e.allSteps);var n=e.stepCurrent-1,i=e.getAllPreviewNodes()[n];e.updateToolBox();var s=maxImage(i),a=s.max,o=s.auto,r=i.src||i.getAttribute("data-src"),l=i.getAttribute("data-hd");e.reset(),e.preview({styles:(t={},_defineProperty(t,a,"100%"),_defineProperty(t,o,"auto"),t),source:l||r})},this.zoomIn=function(){var t=e.getContainer().$image;e.zoom(2*t.scaleX)},this.zoomOut=function(){var t=e.getContainer().$image;e.zoom(.5*t.scaleX)},this.rotateLeft=function(){var t=e.getContainer().$image.rotateZ,n=90*Math.ceil(t/90)-90;e.rotate(n)},this.rotateRight=function(){var t=e.getContainer().$image.rotateZ,n=90*Math.ceil(t/90)+90;e.rotate(n)},this.zoom=function(t){var n=e.getContainer().$image;To.stopAll(),n.scaleX>MAX_SCALE||n.scaleX<MIN_SCALE?(new To(n,"scaleX",1,500,ease),new To(n,"scaleY",1,500,ease),new To(n,"translateX",0,500,ease),new To(n,"translateY",0,500,ease)):(new To(n,"scaleX",t,500,ease),new To(n,"scaleY",t,500,ease),new To(n,"translateX",0,500,ease),new To(n,"translateY",0,500,ease))},this.rotate=function(t){var n=e.getContainer().$image;To.stopAll(),new To(n,"rotateZ",t,500,ease)},this.checkBoundary=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=e.getContainer().$image,s=i.scaleX,a=i.translateX,o=i.translateY,r=i.originX,l=i.originY,h=i.width,c=i.height,p=i.getAttribute("rate");if((1!==s||s!==p)&&(a+t<=(s-1)*(h/2+r)+r&&a+t>=-(s-1)*(h/2-r)+r&&o+n<=(s-1)*(c/2+l)+l&&o+n>=-(s-1)*(c/2-l)+l))return!0;return!1},this.reset=function(){var t=e.getContainer().$image;To.stopAll(),1!==t.scaleX||1!==t.scaleY||0!==t.translateX||0!==t.translateY?(new To(t,"scaleX",1,500,ease),new To(t,"scaleY",1,500,ease),new To(t,"translateX",0,500,ease),new To(t,"translateY",0,500,ease),new To(t,"rotateX",0,500,ease),new To(t,"rotateY",0,500,ease)):setTimeout(function(){To.reset(t,"scaleX",1),To.reset(t,"scaleY",1),To.reset(t,"translateX",0),To.reset(t,"translateY",0),To.reset(t,"rotateX",0),To.reset(t,"rotateY",0)},250)},this.render=function(){e.bodyScroll=createBodyScrollable();addEvents(window,["tap","click"],function(t){var n,i=t.target;if(!i.hasAttribute("data-preview"))return!1;var s=i.src||i.getAttribute("data-src");if(!s)return!1;e.setSteps(i),e.updateToolBox();var a=maxImage(i),o=a.max,r=a.auto,l=i.getAttribute("data-hd");e.togglePreview({styles:(n={},_defineProperty(n,o,"100%"),_defineProperty(n,r,"auto"),n),source:l||s})})},this.render()}return _createClass(t,[{key:"useIconFontCN",value:function(t){var e=document.createElement("script");e.src=t,document.head.appendChild(e)}}]),t}();new Previewer;