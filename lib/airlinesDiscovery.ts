export const DISCOVERY_AREAS = [
  "Commercial / Revenue", "Digital / E-commerce", "Technology / IT",
  "Distribution", "Customer Experience", "Other",
] as const;
export type DiscoveryFields = {name:string;email:string;airline:string;role:string;notes:string};
export type DiscoveryErrors = Partial<Record<keyof DiscoveryFields,string>>;

export function validateDiscoveryRequest(input: unknown): {values:DiscoveryFields;errors:DiscoveryErrors} {
  const body=input&&typeof input==="object"?input as Record<string,unknown>:{};
  const read=(key:string)=>typeof body[key]==="string"?(body[key] as string).trim():"";
  const values={name:read("name"),email:read("email"),airline:read("airline"),role:read("role"),notes:read("notes")};
  const errors:DiscoveryErrors={};
  if(!values.name)errors.name="Enter your full name.";
  else if(values.name.length>120)errors.name="Use 120 characters or fewer.";
  if(!values.email||!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(values.email)||values.email.length>254)errors.email="Enter a valid work email address.";
  if(!values.airline)errors.airline="Enter your airline.";
  else if(values.airline.length>160)errors.airline="Use 160 characters or fewer.";
  if(!DISCOVERY_AREAS.some(area=>area===values.role))errors.role="Select your area.";
  if(values.notes.length>2000)errors.notes="Use 2,000 characters or fewer.";
  return {values,errors};
}
