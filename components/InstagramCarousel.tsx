"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function InstagramCarousel({children}: {children: ReactNode}) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const [edges,setEdges] = useState({start:true,end:false});

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    function update() {
      if (!element) return;
      setEdges({start:element.scrollLeft <= 2,end:element.scrollLeft + element.clientWidth >= element.scrollWidth - 2});
    }
    function schedule() {cancelAnimationFrame(frame);frame=requestAnimationFrame(update);}
    update();
    element.addEventListener("scroll",schedule,{passive:true});
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    return () => {element.removeEventListener("scroll",schedule);observer.disconnect();cancelAnimationFrame(frame);};
  },[]);

  function move(direction: number) {
    const element = track.current;
    const card = element?.firstElementChild;
    if (!element || !card) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
  }

  return <div className="ig-carousel" role="region" aria-roledescription="carousel" aria-label="Mylz Instagram posts">
    <div className="ig-showcase-grid ig-carousel-track" ref={track} id={id}>{children}</div>
    <div className="ig-carousel-controls"><button type="button" aria-label="Previous Instagram posts" aria-controls={id} disabled={edges.start} onClick={()=>move(-1)}><ChevronLeft size={20}/></button><button type="button" aria-label="Next Instagram posts" aria-controls={id} disabled={edges.end} onClick={()=>move(1)}><ChevronRight size={20}/></button></div>
  </div>;
}
