'use client';
import {SITE_EQUIPMENT} from '@/lib/site-equipment-catalog';
import {useState} from 'react';
import {ArrowLeft,ArrowUpRight,Download,Box} from 'lucide-react';
import {assets,sources} from '@/lib/catalog';
import {handlingIds,HANDLING_MODELS,handlingName,type HandlingModel} from '@/lib/handling-catalog';
import AssetViewer from '@/components/asset-viewer';
export default function Catalog(){
 const [selected,setSelected]=useState('handling:belt-k');
 const handling=selected.startsWith('handling:')?selected.slice(9) as HandlingModel:null;
 const site=selected.startsWith('site:')?selected.slice(5) as keyof typeof SITE_EQUIPMENT:null;
 const title=site?handlingName({kind:site},'tr'):handling?handlingName({kind:HANDLING_MODELS[handling].kind,model:handling},'tr'):assets.find(a=>a.id===selected)?.title;
 const preview=(id:string)=>{setSelected(id);window.scrollTo({top:0,behavior:'smooth'})};
 return <main className="document-page">
  <header className="document-nav"><a href="/" className="brand"><img src="/brand/logo.png" alt="Mysilo" style={{width:150,height:'auto'}}/></a><a className="button secondary" href="/"><ArrowLeft size={16}/>Tasarım alanı</a></header>
  <div className="catalog-layout">
   <div className="catalog-heading"><div><span className="eyebrow">EKİPMAN KÜTÜPHANESİ</span><h1>Mysilo taşıma ve depolama.</h1><p>Üretici görselleri ve ölçüleri değiştirilebilen 3B ön yerleşim modelleri.</p></div><a href="/mysilo/handling/sources.json" download className="button secondary"><Download size={16}/>Görsel kaynakları</a></div>
   <div className="asset-preview"><span className="asset-preview-label">{title} · sürükleyerek incele</span><AssetViewer id={selected}/></div>
   <h2 className="catalog-section-title">Taşıma ve gemi yükleme</h2>
   <div className="catalog-grid">{handlingIds.map(model=>{const spec=HANDLING_MODELS[model],id='handling:'+model;return <section className="asset-card" key={model}>
    <img className="manufacturer-image" src={'/mysilo/handling/'+spec.image} alt={handlingName({kind:spec.kind,model},'tr')} loading="lazy"/>
    <h2>{handlingName({kind:spec.kind,model},'tr')}</h2>
    <div className="asset-actions"><button className={'button '+(selected===id?'primary':'secondary')} onClick={()=>preview(id)}><Box size={15}/>3B incele</button></div>
    <a href={spec.source} target="_blank" rel="noreferrer">Mysilo ürün sayfası <ArrowUpRight size={13}/></a>
   </section>})}</div>
   <h2 className="catalog-section-title">Temizleme, kurutma ve saha ekipmanları</h2>
   <div className="catalog-grid">{(Object.keys(SITE_EQUIPMENT) as (keyof typeof SITE_EQUIPMENT)[]).map(kind=>{const spec=SITE_EQUIPMENT[kind],id='site:'+kind;return <section className="asset-card" key={kind}><img className="manufacturer-image" src={'/mysilo/'+spec.image} alt={handlingName({kind},'tr')} loading="lazy"/><h2>{handlingName({kind},'tr')}</h2><div className="asset-actions"><button className={'button '+(selected===id?'primary':'secondary')} onClick={()=>preview(id)}><Box size={15}/>3B incele</button></div><a href={spec.source} target="_blank" rel="noreferrer">Mysilo ürün sayfası <ArrowUpRight size={13}/></a></section>})}</div>
   <h2 className="catalog-section-title">Depolama ve diğer ekipmanlar</h2>
   <div className="catalog-grid">{assets.filter(a=>!Object.hasOwn(SITE_EQUIPMENT,a.id)).map(a=><section className="asset-card" key={a.id}>
    <span className="asset-category">{a.category}</span><h2>{a.title}</h2><div className="asset-english">{a.english}</div><p>{a.description}</p><div className="asset-dimensions">{a.dimensions}</div>
    <div className="asset-actions"><button className={'button '+(a.id===selected?'primary':'secondary')} onClick={()=>preview(a.id)}><Box size={15}/>3B incele</button><a className="button secondary" href={'/assets/models/'+a.id+'.glb'} download><Download size={15}/>GLB</a></div>
    <a href={sources.find(s=>s.id===a.source)!.url} target="_blank" rel="noreferrer">Üretici teknik referansı <ArrowUpRight size={13}/></a>
   </section>)}</div>
   <p className="catalog-model-note">3B modeller üretici CAD dosyaları değildir. Kesin ölçü, kapasite ve yük doğrulaması seçilen modelin teknik dosyasıyla yapılır. <a href="/research#mysilo-konveyorler">Araştırma ve model karşılıkları ↗</a></p>
  </div>
 </main>
}
