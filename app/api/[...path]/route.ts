import {getDatabase} from '@/lib/server/sqlite';
import {handleApi} from '@/lib/server/handler';
import {publicRequest} from '@/lib/server/public-request';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const handle=(request:Request)=>handleApi(getDatabase(),publicRequest(request));
export {handle as GET,handle as POST,handle as PUT,handle as DELETE};
