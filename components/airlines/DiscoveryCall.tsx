"use client";

import {useEffect,useRef,useState,type FormEvent} from "react";
import {createPortal} from "react-dom";
import {Check, X} from "lucide-react";
import {FlyIcon} from "@/components/Icons";
import {DISCOVERY_AREAS,validateDiscoveryRequest,type DiscoveryFields,type DiscoveryErrors} from "@/lib/airlinesDiscovery";
import styles from "./DiscoveryCall.module.css";

const EMPTY:DiscoveryFields={name:"",email:"",airline:"",role:"",notes:""};
export function DiscoveryCall(){
  const [mounted,setMounted]=useState(false),[open,setOpen]=useState(false);
  const [values,setValues]=useState<DiscoveryFields>(EMPTY),[errors,setErrors]=useState<DiscoveryErrors>({});
  const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
  const [error,setError]=useState("");
  const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),form=useRef<HTMLFormElement>(null);
  const controller=useRef<AbortController|null>(null),outside=useRef(false),busy=useRef(false);
  useEffect(()=>{setMounted(true);return()=>controller.current?.abort();},[]);
  useEffect(()=>{
    if(!open||!dialog.current)return;
    const element=dialog.current;
    const overflow=document.body.style.overflow,padding=document.body.style.paddingRight;
    const scrollbar=window.innerWidth-document.documentElement.clientWidth;
    if(scrollbar>0)document.body.style.paddingRight=`${parseFloat(getComputedStyle(document.body).paddingRight)+scrollbar}px`;
    document.body.style.overflow="hidden";
    element.showModal();
    const focus=requestAnimationFrame(()=>element.querySelector<HTMLInputElement>('input[name="name"]')?.focus());
    return()=>{cancelAnimationFrame(focus);document.body.style.overflow=overflow;document.body.style.paddingRight=padding;if(element.open)element.close();};
  },[open]);
  function close(){dialog.current?.close();}
  function closed(){controller.current?.abort();busy.current=false;setOpen(false);if(status==="sending")setStatus("idle");trigger.current?.focus();}
  function change(key:keyof DiscoveryFields,value:string){setValues(current=>({...current,[key]:value}));setErrors(current=>({...current,[key]:undefined}));}
  function fieldError(key:keyof DiscoveryFields){return errors[key]?<small className={styles.fieldError} id={`discovery-${key}-error`}>{errors[key]}</small>:null;}
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy.current)return;
    const checked=validateDiscoveryRequest(values);setErrors(checked.errors);setError("");
    const first=Object.keys(checked.errors)[0];
    if(first){(form.current?.elements.namedItem(first) as HTMLElement|null)?.focus();return;}
    busy.current=true;setStatus("sending");
    const request=new AbortController();controller.current=request;
    try{
      const response=await fetch("/api/airlines-discovery",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(checked.values),signal:request.signal});
      const result=await response.json().catch(()=>null);
      if(!response.ok||result?.ok!==true){setErrors(result?.errors??{});throw new Error(result?.error||"We couldn’t confirm your request. Please try again or email us.");}
      setStatus("success");
      requestAnimationFrame(()=>dialog.current?.querySelector<HTMLElement>("[data-success]")?.focus());
    }catch(reason){if(request.signal.aborted)return;setStatus("error");setError(reason instanceof Error?reason.message:"We couldn’t confirm your request. Please email partners@gomylz.com.");}
    finally{if(controller.current===request){busy.current=false;controller.current=null;}}
  }
  function isOutside(event:{clientX:number;clientY:number}){const box=dialog.current!.getBoundingClientRect();return event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom;}
  return <>
    <button ref={trigger} type="button" className="btn-accent" aria-haspopup="dialog" onClick={()=>{setStatus("idle");setErrors({});setError("");setOpen(true);}}>Book a 30-min discovery call</button>
    {mounted&&createPortal(<dialog ref={dialog} className={styles.dialog} aria-modal="true" aria-labelledby="discovery-title" aria-describedby="discovery-description" onClose={closed} onPointerDown={event=>{outside.current=event.target===dialog.current&&isOutside(event);}} onClick={event=>{if(outside.current&&event.target===dialog.current&&isOutside(event))close();outside.current=false;}}>
      <div className={styles.scroll}>
        <button type="button" className={styles.close} aria-label="Close discovery call" onClick={close}><X size={20} strokeWidth={1.8}/></button>
        <header className={styles.header}><span>Discovery call</span><h2 id="discovery-title">Let&apos;s talk about your channel</h2><p id="discovery-description">We&apos;ll walk you through the layer on your own routes and scope a pilot that fits your stack.</p></header>
        {status==="success"?<div className={styles.success} data-success tabIndex={-1} role="status"><span className={styles.successIcon}><Check size={28}/></span><h3>Thanks, {values.name.trim().split(/\s+/)[0]}.</h3><p>Your discovery call request has been received. The Mylz team will follow up at <strong>{values.email}</strong> to arrange a time.</p><button className="btn-outline" type="button" onClick={close}>Done</button></div>:<form ref={form} noValidate onSubmit={submit} aria-busy={status==="sending"}>
          <fieldset className={styles.fields} disabled={status==="sending"}>
            <label htmlFor="discovery-name">Full name<input id="discovery-name" name="name" autoComplete="name" value={values.name} onChange={e=>change("name",e.target.value)} required maxLength={120} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name?"discovery-name-error":undefined}/>{fieldError("name")}</label>
            <label htmlFor="discovery-email">Work email<input id="discovery-email" name="email" type="email" autoComplete="email" value={values.email} onChange={e=>change("email",e.target.value)} required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email?"discovery-email-error":undefined}/>{fieldError("email")}</label>
            <label htmlFor="discovery-airline">Airline<input id="discovery-airline" name="airline" autoComplete="organization" value={values.airline} onChange={e=>change("airline",e.target.value)} required maxLength={160} aria-invalid={Boolean(errors.airline)} aria-describedby={errors.airline?"discovery-airline-error":undefined}/>{fieldError("airline")}</label>
            <label htmlFor="discovery-role">Your area<select id="discovery-role" name="role" value={values.role} onChange={e=>change("role",e.target.value)} required aria-invalid={Boolean(errors.role)} aria-describedby={errors.role?"discovery-role-error":undefined}><option value="" disabled>Select your area</option>{DISCOVERY_AREAS.map(area=><option key={area}>{area}</option>)}</select>{fieldError("role")}</label>
            <label className={styles.notes} htmlFor="discovery-notes">What would you like to explore? <span className={styles.optional}>Optional</span><textarea id="discovery-notes" name="notes" rows={3} maxLength={2000} value={values.notes} onChange={e=>change("notes",e.target.value)} placeholder="Direct share, ancillaries, servicing, a pilot on a few routes..." aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes?"discovery-notes-error":undefined}/>{fieldError("notes")}</label>
          </fieldset>
          {error&&<p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}><button type="submit" className={`btn-accent ${styles.submit}`} disabled={status==="sending"}>{status==="sending"?"Sending…":<>Request a call <FlyIcon/></>}</button><p>Prefer email? <a href="mailto:partners@gomylz.com">partners@gomylz.com</a></p></div>
        </form>}
      </div>
    </dialog>,document.body)}
  </>;
}
