"use client";

import {useEffect} from "react";

/** Small, bounded image movement; the text column never participates in motion. */
export function EditorialImageMotion() {
  useEffect(()=>{
    const frame=document.querySelector<HTMLElement>("[data-editorial-image]");
    if(!frame)return;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf=0,current=0,target=0,active=true;
    function animate(){
      raf=0;
      current+=(target-current)*.12;
      if(Math.abs(target-current)<.02)current=target;
      frame!.style.setProperty("--editorial-shift",`${current.toFixed(2)}px`);
      if(current!==target)raf=requestAnimationFrame(animate);
    }
    function update(){
      if(media.matches){cancelAnimationFrame(raf);raf=0;current=target=0;frame!.style.setProperty("--editorial-shift","0px");return;}
      if(!active)return;
      const rect=frame!.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(window.innerHeight-rect.top)/(window.innerHeight+rect.height)));
      target=(progress-.5)*24;
      if(!raf)raf=requestAnimationFrame(animate);
    }
    const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;if(active)update();},{rootMargin:"40px"});
    observer.observe(frame);
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    media.addEventListener("change",update);
    update();
    return()=>{observer.disconnect();cancelAnimationFrame(raf);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);media.removeEventListener("change",update);frame.style.removeProperty("--editorial-shift");};
  },[]);
  return null;
}
