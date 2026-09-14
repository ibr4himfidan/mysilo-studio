import {SITE_EQUIPMENT} from './site-equipment-catalog';
import {t,type Lang,type TextKey} from './i18n';
export type HandlingFamily='belt'|'chain'|'tube'|'screw'|'mobile'|'trolley'|'ship';
export type HandlingSpec={kind:'conveyor'|'shiploader';family:HandlingFamily;label:TextKey;code:string;image:string;source:string;width:number;depth:number;height:number;y:number;rise:number;enclosed:boolean};
const page=(path:string)=>'https://www.mysilo.com/tr/category/'+path;
export const HANDLING_MODELS={
 'belt-k':{kind:'conveyor',family:'belt',label:'beltConveyor',code:'K',image:'belt-k.svg',source:page('98/K-model'),width:18,depth:1.2,height:1,y:19,rise:0,enclosed:true},
 'belt-v':{kind:'conveyor',family:'belt',label:'beltConveyor',code:'V',image:'belt-v.svg',source:page('99/V-model'),width:12,depth:.65,height:.65,y:1,rise:0,enclosed:false},
 'belt-r':{kind:'conveyor',family:'belt',label:'beltConveyor',code:'R',image:'belt-r.svg',source:page('100/R-model'),width:24,depth:1.5,height:1.1,y:19,rise:0,enclosed:true},
 'belt-u':{kind:'conveyor',family:'belt',label:'beltConveyor',code:'U',image:'belt-u.png',source:page('211/U-Model'),width:24,depth:1.8,height:1.2,y:19,rise:0,enclosed:true},
 'chain-f':{kind:'conveyor',family:'chain',label:'chainConveyor',code:'F · H',image:'chain-f.svg',source:page('386/F-Serisi'),width:18,depth:.8,height:.8,y:19,rise:0,enclosed:true},
 'chain-s':{kind:'conveyor',family:'chain',label:'chainConveyor',code:'S · HI',image:'chain-s.svg',source:page('387/S-Serisi'),width:16,depth:.8,height:.8,y:1,rise:5,enclosed:true},
 'chain-c':{kind:'conveyor',family:'chain',label:'chainConveyor',code:'C',image:'chain-c.svg',source:page('388/C-Serisi'),width:12,depth:.6,height:.65,y:.4,rise:0,enclosed:true},
 'tube-d':{kind:'conveyor',family:'tube',label:'tubeConveyor',code:'D',image:'tube-d.png',source:page('366/D-Model'),width:16,depth:.65,height:.8,y:1,rise:0,enclosed:true},
 'tube-l':{kind:'conveyor',family:'tube',label:'tubeConveyor',code:'L',image:'tube-l.png',source:page('368/L-Model'),width:16,depth:.65,height:.8,y:1,rise:5,enclosed:true},
 'screw-u':{kind:'conveyor',family:'screw',label:'screwConveyor',code:'U',image:'screw-u.svg',source:page('103/U-Helezonu'),width:8,depth:.5,height:.6,y:.4,rise:0,enclosed:false},
 'screw-tube':{kind:'conveyor',family:'screw',label:'screwConveyor',code:'T',image:'screw-tube.jpg',source:page('105/tup-helezon'),width:8,depth:.5,height:.6,y:.4,rise:0,enclosed:true},
 'mobile-belt':{kind:'conveyor',family:'mobile',label:'mobileBelt',code:'',image:'mobile-belt.png',source:page('376/Mobil-Bant-Konveyor'),width:20,depth:3,height:1.1,y:0,rise:7,enclosed:false},
 'mobile-telescopic':{kind:'shiploader',family:'mobile',label:'telescopicBelt',code:'',image:'mobile-telescopic.png',source:page('377/Mobil-Teleskopik-Bant-Konveyor'),width:28,depth:5,height:14,y:0,rise:0,enclosed:false},
 'shiploader':{kind:'shiploader',family:'ship',label:'shiploader',code:'MYPORT',image:'shiploader.png',source:page('434/Gemi-Yukleme-'),width:24,depth:5,height:17,y:0,rise:0,enclosed:true},
 'trolley-r':{kind:'conveyor',family:'trolley',label:'trolleyBelt',code:'R',image:'trolley-r.png',source:page('454/R-Model'),width:24,depth:1.8,height:3,y:19,rise:0,enclosed:false},
 'trolley-u':{kind:'conveyor',family:'trolley',label:'trolleyBelt',code:'U',image:'trolley-u.png',source:page('453/U-Model'),width:24,depth:2,height:3,y:19,rise:0,enclosed:false},
} as const satisfies Record<string,HandlingSpec>;
export type HandlingModel=keyof typeof HANDLING_MODELS;
export const handlingIds=Object.keys(HANDLING_MODELS) as HandlingModel[];
export function handlingSpec(i:{kind:string;model?:HandlingModel}){return i.model?HANDLING_MODELS[i.model]:i.kind==='conveyor'?HANDLING_MODELS['belt-k']:i.kind==='shiploader'?HANDLING_MODELS.shiploader:undefined}
export function handlingName(i:{kind:string;model?:HandlingModel},lang:Lang){const m=handlingSpec(i),code=SITE_EQUIPMENT[i.kind as keyof typeof SITE_EQUIPMENT]?.code;return m?`${t(lang,m.label)}${m.code?' · '+m.code:''}`:t(lang,i.kind as TextKey)+(code?' · '+code:'')}
export function validHandling(i:{kind:string;model?:HandlingModel;rise?:number}){return (i.model===undefined||handlingIds.includes(i.model)&&HANDLING_MODELS[i.model].kind===i.kind)&&(i.rise===undefined||i.kind==='conveyor'&&Number.isFinite(i.rise)&&i.rise>=0&&i.rise<=30)}
export function modelDefaults(model:HandlingModel){const m=HANDLING_MODELS[model];return{kind:m.kind,model,width:m.width,depth:m.depth,height:m.height,y:m.y,...(m.kind==='conveyor'?{rise:m.rise}:{})}}
