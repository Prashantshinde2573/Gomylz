import { Copy, Film, ArrowUpRight } from "lucide-react";
import { InstagramCarousel } from "./InstagramCarousel";
import { SOCIAL_POSTS, type SocialPost } from "@/lib/instagram";

export function PostArtwork({post, index = 0}: {post: SocialPost; index?: number}) {
  const item = post.slides[index];
  return <div className={`ig-art ig-art-${post.style}`}>
    <img className="ig-art-photo" src={item.image} alt={item.place} width={1080} height={1350} loading="lazy" />
    {post.style === "scrapbook" && index === 0 && <div className="ig-contact-sheet"><img src={post.slides[1].image} alt="A sunlit resort stay" /><img src={post.slides[2].image} alt="A peaceful coastline" /></div>}
    <span className="ig-art-brand">mylz<span> / field notes</span></span>
    <div className="ig-art-copy">
      <small>{index === 0 ? post.category : item.place}</small>
      <h3>{item.month ? <><span className="ig-month">{item.month}</span>{item.place}</> : index === 0 ? post.title : item.title}</h3>
      <p>{item.text}</p>
      {post.style === "product" && <div className="ig-product-ui"><span>mylzAI <i>Trip planner</i></span><p>{index === 0 ? '“A weekend in Porto for two.”' : index === 1 ? "Boutique stays · Porto · 3 nights" : index === 2 ? "Flights + stays, side by side" : "Your next trip starts here."}</p><b>{["Describe your trip", "Explore stays", "Compare options", "Let’s plan and go"][index]}</b></div>}
    </div>
    <span className="ig-art-foot">@go.mylz <span>{String(index + 1).padStart(2,"0")} / {String(post.slides.length).padStart(2,"0")}</span></span>
  </div>;
}

export function PostType({post}: {post: SocialPost}) {
  return <span className="ig-type" aria-label={post.type === "reel" ? "Reel" : "Carousel"}>{post.type === "reel" ? <Film size={18}/> : <Copy size={18}/>}</span>;
}

export function InstagramShowcase() {
  return <section className="ig-showcase" aria-labelledby="instagram-title">
    <header className="ig-section-head"><div><span className="eyebrow">The Mylz travel journal</span><h2 id="instagram-title">Discover Mylz on Instagram</h2><p>Travel inspiration, hidden gems, beautiful stays and experiences worth sharing.</p></div><a className="ig-follow-link" href="/instagram.html">Follow @go.mylz on Instagram <span aria-hidden="true">→</span></a></header>
    <InstagramCarousel>{SOCIAL_POSTS.map(post => <a className="ig-post-tile" href={`/instagram.html?post=${post.id}`} key={post.id} aria-label={`Open ${post.title} on the Mylz Instagram preview`}><PostArtwork post={post}/><PostType post={post}/><span className="ig-tile-hover">View story <ArrowUpRight size={18}/></span></a>)}</InstagramCarousel>
  </section>;
}
