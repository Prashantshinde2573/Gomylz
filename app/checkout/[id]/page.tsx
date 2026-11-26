import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { CheckoutClient } from '../CheckoutClient';
export const metadata: Metadata = {title:'Review your journey | Mylz',robots:{index:false,follow:false}};
export default async function CheckoutPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 return <><Nav solid/><CheckoutClient id={id}/></>;
}
