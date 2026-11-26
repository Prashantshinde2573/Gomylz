import { CITIES, cityForPlace, cityRef } from './airports';
import { addDays, parseDayMonth, toISO } from './dates';
import type { TripQuery } from './demo';
/** Hotel location and dates are independent of the flight itinerary. */
export function stayQuery(base:TripQuery,text=''):TripQuery | null {
 const city=CITIES.find(c=>new RegExp(`\\b${c.city.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i').test(text)||new RegExp(`\\b${c.code}\\b`,'i').test(text));
 const dates=text.match(/\b\d{4}-\d{2}-\d{2}\b/g)?.filter(d=>!isNaN(Date.parse(d)));
 const today=toISO(new Date());
 const natural=/\btomorrow\b/i.test(text)?addDays(today,1):/\btoday\b/i.test(text)?today:parseDayMonth(text,today);
 const date=dates?.[0]??natural??(base.kind === "hotel" ? base.date : undefined);
 const nights=text.match(/\b(\d{1,2})\s*nights?\b/i);
 if(!date)return null;
 const end=dates?.[1]??(nights?addDays(date,Math.min(30,Math.max(1,Number(nights[1])))):base.kind === "hotel" ? base.returnDate : undefined);
 if(!end || end<=date || isNaN(Date.parse(date)) || isNaN(Date.parse(end)) || new Date(date).toISOString().slice(0,10)!==date || new Date(end).toISOString().slice(0,10)!==end)return null;
 return {...base,kind:'hotel',tripType:'one-way',to:city?cityRef(city):base.onward?.to??base.to,date,returnDate:end,onward:undefined};
}
export function namedStayCity(text:string){return CITIES.some(c=>text.toLowerCase().includes(c.city.toLowerCase())||new RegExp(`\\b${c.code}\\b`,'i').test(text));}
export function stayCityName(q:TripQuery){return cityForPlace(q.to.code)?.city??q.to.label;}

/** Collect only the missing hotel dates for a new standalone stay request. */
export function hotelRequest(text:string,today:string):{query?:TripQuery;question?:string} {
 const city=CITIES.find(c=>new RegExp(`\\b${c.city}\\b`,'i').test(text)||new RegExp(`\\b${c.code}\\b`,'i').test(text));
 if(!city)return {question:'Which city would you like to stay in?'};
 const isoDates=text.match(/\b\d{4}-\d{2}-\d{2}\b/g);const named=text.match(/\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/i);
 let date=isoDates?.[0];
 if(/\btomorrow\b/i.test(text))date=addDays(today,1);else if(/\btoday\b/i.test(text))date=today;
 if(!date&&named){const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(named[2].toLowerCase().slice(0,3))+1;date=`${today.slice(0,4)}-${String(month).padStart(2,'0')}-${String(Number(named[1])).padStart(2,'0')}`;if(date<today)date=`${Number(today.slice(0,4))+1}${date.slice(4)}`;}
 const nights=text.match(/\b(\d+)\s*nights?\b/i);const end=isoDates?.[1];
 if(!date)return {question:`What’s your check-in date in ${city.city}${nights?'?':' and how many nights would you like to stay?'}`};
 if(isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date<today)return {question:'Please give a valid check-in date today or later.'};
 if(!nights&&!end)return {question:`How many nights would you like to stay in ${city.city}?`};
 const returnDate=end??addDays(date,Math.min(30,Math.max(1,Number(nights![1]))));if(!Number.isFinite(Date.parse(returnDate)) || new Date(returnDate).toISOString().slice(0,10)!==returnDate || returnDate<=date)return {question:'Please give a valid check-out date after check-in.'};
 const guests=text.match(/\b(\d+)\s*(?:adults?|guests?|people)\b/i);return {query:{kind:'hotel',tripType:'one-way',to:cityRef(city),date,returnDate,adults:Math.min(9,Math.max(1,Number(guests?.[1]??1))),children:0,cabin:'Economy'}};
}
