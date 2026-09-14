'use client';
import {useEffect,useState} from 'react';
import {LoaderCircle} from 'lucide-react';
import {api,RequestError} from '@/lib/api-client';
import type {Workspace} from '@/lib/business';
import EditorWorkspace from '@/components/editor-workspace';
export default function WorkspaceGate(){const [data,setData]=useState<Workspace|null>(null),[error,setError]=useState('');useEffect(()=>{api<Workspace>('workspace').then(setData).catch(e=>{if(e instanceof RequestError&&e.status===401)window.location.replace('/login');else setError(e.message)})},[]);return data?<EditorWorkspace workspace={data}/>:<main className="mysilo-app gate-state">{error?<><p role="alert">{error}</p><button className="m-button primary" onClick={()=>window.location.reload()}>Tekrar dene</button></>:<><LoaderCircle className="spin"/><span>Çalışma alanı açılıyor…</span></>}</main>}
