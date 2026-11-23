import {NextResponse} from "next/server";
import {validateDiscoveryRequest} from "@/lib/airlinesDiscovery";

// The existing GoMylz discovery form owns delivery; no sample success or local inbox.
const ENDPOINT="https://gomylz.com/api/airlines-discovery";
export async function POST(request:Request) {
  const origin=request.headers.get("origin");
  if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({ok:false,error:"Please submit from the Mylz website."},{status:403});
  const raw=await request.text();
  if(raw.length>12000)return NextResponse.json({ok:false,error:"Your request is too long."},{status:413});
  let input:unknown;
  try{input=JSON.parse(raw);}catch{return NextResponse.json({ok:false,error:"Check your details and try again."},{status:400});}
  const {values,errors}=validateDiscoveryRequest(input);
  if(Object.keys(errors).length)return NextResponse.json({ok:false,error:"Check the highlighted fields.",errors},{status:400});
  try {
    const response=await fetch(ENDPOINT,{
      method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify(values),cache:"no-store",signal:AbortSignal.timeout(15000),redirect:"error",
    });
    const result=await response.json().catch(()=>null);
    const confirmed=result&&(result.ok===true||result.success===true||result.sent===true);
    if(!response.ok||!confirmed||result.ok===false||result.success===false||result.error){
      return NextResponse.json({ok:false,error:"We couldn’t confirm your request. Please try again, or email partners@gomylz.com."},{status:response.status===429?429:502});
    }
    return NextResponse.json({ok:true});
  } catch {
    return NextResponse.json({ok:false,error:"We couldn’t confirm your request. Please try again, or email partners@gomylz.com."},{status:502});
  }
}
