import {writeFile} from 'node:fs/promises';
import {researchSections} from '../lib/research';
import {sources} from '../lib/catalog';
const cited=(p:string)=>p.replace(/\[(\d+)\]/g,(_,id)=>{const s=sources.find(s=>s.id===Number(id));return s?`[${id}](${s.url})`:`[${id}]`});
const report='# Tahıl depolama tesisleri: araştırma ve tasarım esasları\n\n'+researchSections.map(s=>`## ${s.title}\n\n${s.paragraphs.map(cited).join('\n\n')}`).join('\n\n')+'\n\n## Kaynakça\n\nİnceleme tarihi: 14 Eylül 2026.\n\n'+sources.map(s=>`${s.id}. ${s.publisher}. [${s.title}](${s.url}). ${s.date}.`).join('\n\n')+'\n';
await writeFile('docs/ARASTIRMA.md',report);await writeFile('public/research.md',report);console.log(`${researchSections.length} sections, ${sources.length} references, ${report.split(/\s+/).length} words`);
