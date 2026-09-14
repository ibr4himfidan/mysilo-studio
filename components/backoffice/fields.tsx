import type {ReactNode} from 'react';
export function OfficeField({label,children}:{label:string;children:ReactNode}){return <label className="m-field"><span>{label}</span>{children}</label>}
export function PanelTitle({eyebrow,title,children}:{eyebrow:string;title:string;children?:ReactNode}){return <div className="office-panel-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{children}</div>}
export function Empty({children}:{children:ReactNode}){return <div className="office-empty">{children}</div>}
export const dateLabel=(value:string)=>new Date(value).toLocaleString('tr-TR',{dateStyle:'medium',timeStyle:'short'});
