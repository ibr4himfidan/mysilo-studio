import {getDatabase} from '@/lib/server/sqlite';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(){try{await getDatabase().prepare('SELECT 1').first();return Response.json({status:'ok'},{headers:{'cache-control':'no-store'}})}catch{return Response.json({status:'unavailable'},{status:503,headers:{'cache-control':'no-store'}})}}
