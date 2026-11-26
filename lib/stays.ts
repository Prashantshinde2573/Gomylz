import type {Stay,TripQuery} from './demo';
import {cityForPlace} from './airports';
import {addDays} from './dates';
export type StayFilters={stars?:number;breakfast?:boolean;freeCancellation?:boolean;maxTotal?:number};
export type RoomRate={id:string;name:string;breakfast:boolean;refundable:boolean;pricePerNightGBP:number;cancelUntil?:string;cancellationFeeGBP:number};
export type HotelRoom={id:string;name:string;available:number;photos:string[];rates:RoomRate[]};
const photo=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;
const hotelPhotos=['photo-1566073771259-6a8506099945','photo-1542314831-068cd1dbfeeb','photo-1568084680786-a84f91d1153c','photo-1551882547-ff40c63fe5fa','photo-1571896349842-33c89424de2d','photo-1518837695005-2083093ee35b'].map(photo);
const roomPhotos=['photo-1611892440504-42a792e24d32','photo-1590490360182-c33d57733427','photo-1566665797739-1674de7a421a','photo-1631049307264-da0ec9d70304','photo-1582719478250-c89cae4dc85b'].map(photo);
export function hotelInfo(stay:Stay,query:TripQuery){
 const n=Number(stay.id.replace(/\D/g,''))||0;const city=cityForPlace(query.to.code);const stars=stay.type==='Hostel'||stay.type==='Guesthouse'?3:stay.name.includes('Rooftop')?5:4;
 const freeCancellation=n%3!==0;const breakfast=n%2===0;
 return {stars,breakfast,freeCancellation,address:`${stay.area}, ${city?.city??query.to.label}`,photos:[...hotelPhotos.slice(n%3),...hotelPhotos.slice(0,n%3)],description:`A ${stay.type.toLowerCase()} in ${stay.area}, a neighbourhood base for exploring ${city?.city??query.to.label}. This sample property offers comfortable rooms and convenient access to the city. Compare room types, breakfast options and cancellation terms before choosing your stay. Photos and locations are illustrative; amenities and rates below are demo data.`,amenities:['Wi-Fi',...(n%2===0?['Parking','Accessible rooms']:['Fitness centre','Pet friendly']),'Lift','Luggage storage'],lat:(city?.lat??0)+[.013,-.011,.019,-.02,.006,-.003][n%6],lon:(city?.lon??0)+[-.026,.021,.027,-.009,.003,-.031][n%6],cityTaxGBP:3*query.adults*stay.nights};
}
export function hotelRooms(stay:Stay,query:TripQuery):HotelRoom[]{
 const info=hotelInfo(stay,query);return ['Classic Room','Superior Room','Single Room','Studio'].map((name,i)=>{
  const base=Math.round(stay.pricePerNightGBP*(1+i*.12));const available=[4,2,1,3][i];
  const mk=(breakfast:boolean):RoomRate=>({id:`${stay.id}-room${i}-${breakfast?'breakfast':'only'}`,name:breakfast?'Bed and breakfast':'Room only',breakfast,refundable:info.freeCancellation||breakfast,pricePerNightGBP:base+(breakfast?18:0),cancelUntil:info.freeCancellation||breakfast?query.date:undefined,cancellationFeeGBP:(base+(breakfast?18:0))*stay.nights});
  return {id:`${stay.id}-room${i}`,name,available,photos:[...roomPhotos.slice(i),...roomPhotos.slice(0,i)],rates:[mk(false),mk(true)]};
 });
}
export function bookStay(stay:Stay,query:TripQuery,room:HotelRoom,rate:RoomRate):Stay{return {...stay,pricePerNightGBP:rate.pricePerNightGBP,perks:`${room.name} · ${rate.name}`,booking:{roomName:room.name,rateName:rate.name,rateId:rate.id,refundable:rate.refundable,cancelUntil:rate.cancelUntil,cancellationFeeGBP:rate.cancellationFeeGBP,cityTaxGBP:hotelInfo(stay,query).cityTaxGBP}};}
export function filterStays(stays:Stay[],query:TripQuery,filters:StayFilters){return stays.filter(s=>{const info=hotelInfo(s,query);return (!filters.stars||info.stars===filters.stars)&&(!filters.breakfast||info.breakfast)&&(!filters.freeCancellation||info.freeCancellation)&&(!filters.maxTotal||s.pricePerNightGBP*s.nights<=filters.maxTotal);});}
export function parseStayFilters(text:string,current:StayFilters,rate:number):StayFilters|null {
 if(/clear (?:all |hotel |stay )?filters|show all(?: hotels| stays)?/i.test(text))return {};
 const next={...current};let handled=false;
 const star=text.match(/\b([345])\s*[- ]?stars?\b/i);if(star){next.stars=Number(star[1]);handled=true;}
 if(/breakfast/i.test(text)){next.breakfast=!/without|no breakfast|any breakfast/i.test(text);handled=true;}
 if(/free cancellation|refundable/i.test(text)){next.freeCancellation=!/non.refundable|no free cancellation/i.test(text);handled=true;}
 const budget=text.match(/(?:under|budget(?: of)?|less than|max(?:imum)?)\s*[₹€£$]?\s*([\d,]+)/i);if(budget){next.maxTotal=Number(budget[1].replaceAll(',',''))/Math.max(.001,rate);handled=true;}
 return handled?next:null;
}
