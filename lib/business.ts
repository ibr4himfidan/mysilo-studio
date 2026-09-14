import {countries,continents} from 'countries-list';
import type {Project,Setup,Customer} from './editor';
import type {DesignBasis} from './site-context';
export type User={id:string;name:string;email:string;role:'admin'|'sales';active:number};
export type Territory={key:string;continent:string;country:string|null;userId:string};
export type Location={countryCode:string;regionId:string;city:string;address:string};
export type RegionData={standard:string;source:string;snowZone:string;seismicZone:string;snowLoad:number|null;seismicPga:number|null;windSpeed:number|null;soilBearing:number|null;corrosion:DesignBasis['corrosion'];approved:boolean;notes:string};
export type Region={id:string;country:string;name:string;data:RegionData;revision:number;updatedAt:string;updatedBy:string};
export type LoadSnapshot={regionId:string;revision:number;name:string;source:string;snowZone:string;seismicZone:string;approved:boolean;capturedAt:string};
export type ProjectRecord={project:Project;revision:number;ownerId:string;salesRepId:string|null;archived:number};
export type Draft={setup:Setup;step:number;location:Location;id:string};
export type Quote={id:string;number:string;projectId:string;ownerId:string;currency:string;status:string;createdAt:string;snapshot:{project:Project;customer:Customer;pricingStatus:string;total:null;projectRevision:number}};
export type Workspace={user:User;projects:ProjectRecord[];draft:Draft|null;drafts:Draft[];knownProjectIds:string[];territories:Territory[];regions:Region[];representatives:Pick<User,'id'|'name'>[]};
export const CONTINENTS=Object.entries(continents).map(([code,name])=>({code,name}));
export const COUNTRIES=Object.entries(countries).map(([code,c])=>({code,name:c.name,continent:c.continent}));
export function countryName(code:string,lang='tr'){try{return new Intl.DisplayNames([lang],{type:'region'}).of(code)||code}catch{return code}}
export const continentNames:Record<string,string>={AF:'Afrika',AN:'Antarktika',AS:'Asya',EU:'Avrupa',NA:'Kuzey Amerika',OC:'Okyanusya',SA:'Güney Amerika'};
export function representativeFor(country:string,territories:Territory[]){const c=COUNTRIES.find(c=>c.code===country);return territories.find(t=>t.country===country)?.userId||territories.find(t=>!t.country&&t.continent===c?.continent)?.userId||null}
export const emptyLocation:Location={countryCode:'',regionId:'',city:'',address:''};
export const emptyRegion:RegionData={standard:'',source:'',snowZone:'',seismicZone:'',snowLoad:null,seismicPga:null,windSpeed:null,soilBearing:null,corrosion:'unknown',approved:false,notes:''};
