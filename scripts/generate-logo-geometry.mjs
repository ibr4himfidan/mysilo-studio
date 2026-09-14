import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
// Turn the supplied logo's alpha silhouette into native mesh quads, not a raster edit.
const {data,info}=await sharp('public/brand/logo.png').resize({width:480}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const runs=[];
for(let y=0;y<info.height;y++){let start=-1;for(let x=0;x<=info.width;x++){const opaque=x<info.width&&data[(y*info.width+x)*4+3]>150;if(opaque&&start<0)start=x;if(!opaque&&start>=0){runs.push([start/info.width,x/info.width,y/info.height,(y+1)/info.height]);start=-1}}}
await writeFile('lib/logo-mesh.json',JSON.stringify({source:'/brand/logo.png',aspect:info.width/info.height,runs}));
console.log(`Logo: ${runs.length} native vector strips`);
