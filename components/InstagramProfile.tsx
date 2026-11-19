"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bookmark, Check, ChevronLeft, ChevronRight, Grid3X3, Heart, Camera, MessageCircle, Pause, Play, Send, X } from "lucide-react";
import { SOCIAL_POSTS, type SocialPost } from "@/lib/instagram";
import { PostArtwork, PostType } from "./InstagramPosts";

export function InstagramProfile() {
  const [selected,setSelected] = useState<SocialPost | null>(null);
  const [slide,setSlide] = useState(0);
  const [playing,setPlaying] = useState(false);
  const [following,setFollowing] = useState(false);
  const [likes,setLikes] = useState<string[]>([]);
  const [saved,setSaved] = useState<string[]>([]);
  const [shared,setShared] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    function sync() {
      const id = new URL(window.location.href).searchParams.get("post");
      setSelected(SOCIAL_POSTS.find(p => p.id === id) ?? null); setSlide(0); setPlaying(false);
    }
    sync(); window.addEventListener("popstate",sync);
    return () => window.removeEventListener("popstate",sync);
  },[]);
  useEffect(() => {
    const node = dialog.current;
    if (selected && node && !node.open) node.showModal();
    if (!selected && node?.open) node.close();
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {document.body.style.overflow = previous;};
  },[selected]);
  useEffect(() => {
    if (!playing || !selected) return;
    const timer = window.setInterval(() => {if (!document.hidden) setSlide(i => (i+1)%selected.slides.length);}, selected.style === "tips" ? 3200 : 4500);
    return () => window.clearInterval(timer);
  },[playing,selected]);
  function open(post: SocialPost) {
    setSelected(post); setSlide(0); setPlaying(false); setShared(false);
    const url = new URL(window.location.href); url.searchParams.set("post",post.id); window.history.pushState({},"",url);
  }
  function close() {
    setSelected(null); setPlaying(false);
    const url = new URL(window.location.href); url.searchParams.delete("post"); window.history.replaceState({},"",url);
  }
  function move(direction: number) {if(selected) setSlide(i => (i+direction+selected.slides.length)%selected.slides.length);}
  function toggle(list: string[],set: (v:string[])=>void) {if(selected) set(list.includes(selected.id) ? list.filter(id => id !== selected.id) : [...list,selected.id]);}
  async function share() {
    try {await navigator.clipboard.writeText(window.location.href);setShared(true);} catch {setShared(false);}
  }
  return <main className="ig-profile">
    <nav className="ig-topbar" aria-label="Instagram preview navigation"><Link href="/" className="ig-back"><ArrowLeft size={18}/> Back to Mylz</Link><span><Camera size={22}/> Instagram</span><small>Profile preview</small></nav>
    <div className="ig-profile-inner">
      <header className="ig-profile-header"><div className="ig-avatar"><img src="/images/mylz-wordmark.svg" alt="Mylz" width={103} height={36}/></div><div className="ig-profile-info"><div className="ig-username"><h1>@go.mylz</h1><button type="button" className="ig-follow-button" aria-pressed={following} onClick={()=>setFollowing(v=>!v)}>{following ? <><Check size={16}/> Following</> : "Follow"}</button></div><div className="ig-counts"><span><b>7</b> posts</span><span><b>{following ? "12,481" : "12,480"}</b> followers</span><span><b>286</b> following</span></div><strong>Mylz · Travel, thoughtfully.</strong><p>Hidden gems. Beautiful stays. Stories worth going for.<br/>A little inspiration for your next “let’s go.”</p><Link href="/">gomylz.com <span aria-hidden="true">↗</span></Link><small className="ig-preview-label">Concept profile · Sample community numbers</small></div></header>
      <div className="ig-profile-tabs"><span><Grid3X3 size={16}/> POSTS</span><p>Seven stories. A world of possibilities.</p></div>
      <div className="ig-profile-grid">{SOCIAL_POSTS.map(post => <button type="button" className="ig-post-tile" key={post.id} onClick={()=>open(post)} aria-label={`Open ${post.title}`}><PostArtwork post={post}/><PostType post={post}/><span className="ig-tile-hover"><Heart size={18}/> {post.likes.toLocaleString("en-US")} <MessageCircle size={18}/> {post.comments}</span></button>)}</div>
      <footer className="ig-profile-footer"><Link href="/">Back to the Mylz website</Link><span>Travel photography via Unsplash · An independent profile concept</span></footer>
    </div>
    <dialog ref={dialog} className="ig-dialog" aria-labelledby="ig-post-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(e.key==="ArrowRight"){e.preventDefault();move(1);}if(e.key==="ArrowLeft"){e.preventDefault();move(-1);}}}>
      {selected && <div className="ig-post-detail"><button type="button" className="ig-close" aria-label="Close post" onClick={close}><X size={22}/></button><div className="ig-post-media" onTouchStart={e=>{startX.current=e.touches[0].clientX;}} onTouchEnd={e=>{if(startX.current!==null){const delta=e.changedTouches[0].clientX-startX.current;if(Math.abs(delta)>45)move(delta<0?1:-1);startX.current=null;}}}>
        <div className="ig-slide-frame" key={`${selected.id}-${slide}`}><PostArtwork post={selected} index={slide}/></div>
        <span className="ig-slide-count">{slide+1} / {selected.slides.length}</span>
        <button type="button" className="ig-slide-arrow ig-slide-prev" onClick={()=>move(-1)} aria-label="Previous slide"><ChevronLeft size={20}/></button><button type="button" className="ig-slide-arrow ig-slide-next" onClick={()=>move(1)} aria-label="Next slide"><ChevronRight size={20}/></button>
        {selected.type === "reel" && <button type="button" className="ig-reel-control" aria-label={playing ? "Pause reel" : "Play reel"} onClick={()=>setPlaying(v=>!v)}>{playing ? <Pause size={17}/> : <Play size={17}/>} {playing ? "Pause" : "Play reel"}</button>}
        <div className="ig-slide-dots">{selected.slides.map((item,i)=><button type="button" key={item.title} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}: ${item.place}`} aria-current={slide===i ? "true" : undefined}/>)}</div>
      </div><div className="ig-post-sidebar"><div className="ig-post-author"><img src="/images/mylz-wordmark.svg" alt="mylz" width={64} height={23}/><span><strong>go.mylz</strong><small>Original travel journal</small></span></div><div className="ig-caption"><span className="eyebrow">{selected.category}</span><h2 id="ig-post-title">{selected.title}</h2><p>{selected.caption}</p><p className="ig-photo-credit">Photography: Unsplash <a href={`https://unsplash.com`} target="_blank" rel="noreferrer">Explore the photographers ↗</a></p></div><div className="ig-engagement"><div><button type="button" aria-label="Like post" aria-pressed={likes.includes(selected.id)} onClick={()=>toggle(likes,setLikes)}><Heart fill={likes.includes(selected.id)?"currentColor":"none"}/></button><button type="button" aria-label="Copy post link" onClick={share}><Send/></button><button type="button" className="ig-save" aria-label="Save post" aria-pressed={saved.includes(selected.id)} onClick={()=>toggle(saved,setSaved)}><Bookmark fill={saved.includes(selected.id)?"currentColor":"none"}/></button></div><strong>{(selected.likes+(likes.includes(selected.id)?1:0)).toLocaleString("en-US")} likes</strong><span>{selected.comments} comments · {selected.date}</span><small role="status">{shared?"Post link copied":saved.includes(selected.id)?"Saved to your collection in this preview":"Sample engagement · Profile concept"}</small></div></div></div>}
    </dialog>
  </main>;
}
