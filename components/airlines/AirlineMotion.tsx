"use client";
import {useEffect} from "react";

export function AirlineMotion() {
  useEffect(()=>{
    const root=document.getElementById("airline-main");
    const aircraft=root?.querySelector<HTMLElement>("[data-aircraft]");
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(!root)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.setAttribute("data-air-visible","true");observer.unobserve(entry.target);}}),{threshold:.08});
    root.querySelectorAll<HTMLElement>("[data-air-reveal]").forEach(el=>{if(!media.matches){el.setAttribute("data-air-ready","true");observer.observe(el);}});
    let frame=0;
    function update(){frame=0;if(aircraft&&!media.matches){const y=Math.min(window.scrollY,650);const mobile=window.matchMedia("(max-width: 580px)").matches;aircraft.style.setProperty("--air-shift",`${y*(mobile ? .02 : .045)}px`);root?.style.setProperty("--sky-shift",`${-y*.018}px`);}}
    function schedule(){if(!frame)frame=requestAnimationFrame(update);}
    function preference(){if(media.matches){root?.querySelectorAll("[data-air-reveal]").forEach(el=>el.setAttribute("data-air-visible","true"));aircraft?.style.setProperty("--air-shift","0px");root?.style.setProperty("--sky-shift","0px");}else schedule();}
    window.addEventListener("scroll",schedule,{passive:true});media.addEventListener("change",preference);schedule();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);media.removeEventListener("change",preference);};
  },[]);
  return null;
}
