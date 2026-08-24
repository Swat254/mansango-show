import {db,ws,json,error} from '@appdeploy/sdk';
const TABLE='entity_subscriptions';
type Sub={id:string,entity_type:string,entity_id:string,connection_id:string,created_at:number};
async function list():Promise<Sub[]>{return (await db.list(TABLE,{limit:1000})).items as Sub[]}
export async function removeSubscriptionsByConnection(id:string){
 const ids=(await list()).filter(x=>x.connection_id===id).map(x=>x.id);
 if(ids.length) await db.delete(TABLE,ids);
}
export async function addSubscription(type:string,id:string,connection:string){
 await db.add(TABLE,[{entity_type:type,entity_id:id,connection_id:connection,created_at:Date.now()}]);
}
export const realtimeSubscriptionRoutes={
 'POST /api/subscriptions':[async({body})=>{
  const b=body||{}; if(!b.entity_type||!b.entity_id||!b.connection_id)return error('entity_type, entity_id, connection_id are required');
  await addSubscription(b.entity_type,b.entity_id,b.connection_id); return json({ok:true});
 }]
};