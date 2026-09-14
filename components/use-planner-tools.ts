'use client';
import {useEffect,useRef} from 'react';
import {flushSync} from 'react-dom';
import {DEFAULTS,plan,validateInputs,type Inputs} from '@/lib/planner';
interface Tool{name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown}
interface ModelContext{registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void>}
export function usePlannerTools(inputs:Inputs,apply:(p:Inputs)=>void){
 const current=useRef({inputs,apply});current.current={inputs,apply};
 useEffect(()=>{const context=(document as Document&{modelContext?:ModelContext}).modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();
 const register=(tool:Tool)=>{try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>console.warn('Silo Studio: WebMCP registration unavailable'))}catch{console.warn('Silo Studio: WebMCP registration unavailable')}};
 register({name:'read_silo_project',description:'Read the current locally saved silo project inputs, generated capacity and warnings.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>{const l=plan(current.current.inputs);return{inputs:current.current.inputs,valid:l.valid,capacityTonnes:l.total,siloCount:l.bins.length,errors:l.errors,warnings:l.warnings}}});
 register({name:'generate_silo_layout',description:'Apply project input overrides, generate a conceptual silo layout, update the visible editor and save it on this device. No engineering compliance is certified.',inputSchema:{type:'object',properties:Object.fromEntries(Object.entries(DEFAULTS).map(([k,v])=>[k,{type:typeof v==='number'?'number':typeof v==='boolean'?'boolean':'string'}])),additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:(raw)=>{if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('An object of project input overrides is required');for(const k of Object.keys(raw))if(!(k in DEFAULTS))throw new Error(`Unknown field: ${k}`);const next={...current.current.inputs,...raw} as Inputs,errors=validateInputs(next);if(errors.length)throw new Error(errors.join(' '));const l=plan(next);flushSync(()=>current.current.apply(next));return{valid:l.valid,capacityTonnes:l.total,siloCount:l.bins.length,diameterMeters:l.diameter,errors:l.errors,warnings:l.warnings}}});
 return()=>lifecycle.abort();
 },[]);
}
