import {router,json,error} from '@appdeploy/sdk';

const PAYSTACK='https://zxforhokpsiqkceesalk.supabase.co/functions/v1/paystack';
const prices={regular:1000,vip:2000,vvip:5000,'vip-group':9000} as const;

const normalize=(v:string)=>{
 const p=v.replace(/\D/g,'');
 if(/^254[17]\d{8}$/.test(p)) return p;
 if(/^0[17]\d{8}$/.test(p)) return '254'+p.slice(1);
 return '';
};

async function forward(body:any, method='POST'){
 const url=method==='GET'?PAYSTACK+'?reference='+encodeURIComponent(String(body.reference||'')):PAYSTACK;
 const r=await fetch(url,{method,headers:{'Content-Type':'application/json'},...(method==='POST'?{body:JSON.stringify(body)}:{})});
 const data=await r.json().catch(()=>({error:'Invalid payment service response'}));
 if(!r.ok) return error(data.error||data.message||`Payment service returned ${r.status}`,r.status);
 return json(data,r.status||200);
}

async function payment(body:any){
 const b=body||{};
 const name=String(b.name||b.full_name||'').trim();
 const email=String(b.email||b.customer_email||'').trim();
 const phone=normalize(String(b.phone||b.phone_number||''));
 const ticket=String(b.ticket_type||'').toLowerCase();
 const qty=Number(b.quantity||1);
 const isDonation=Boolean(b.donation||b.is_donation);
 if(!name||!email||!phone) return error('Name, email and valid Kenyan phone number are required.',400);
 if(!isDonation && !(ticket in prices)) return error('A valid ticket type is required.',400);
 if(!Number.isInteger(qty)||qty<1||qty>20) return error('Invalid quantity.',400);
 const amount=isDonation?Number(b.amount):prices[ticket as keyof typeof prices]*qty;
 if(!Number.isFinite(amount)||amount<10||amount>300000) return error('Invalid amount.',400);
 const reference=String(b.account_reference||b.external_reference||`CHG-${Date.now()}-${Math.random().toString(36).slice(2,8)}`);
 return forward({action:'initiate',payment_method:b.payment_method||'mpesa',name,email,phone,amount,
   total_amount:amount,quantity:qty,ticket_type:isDonation?'donation':ticket,
   donation:isDonation,is_donation:isDonation,send_email:isDonation?false:true,
   account_reference:reference,external_reference:reference});
}

export const handler=router({
 'GET /api/_healthcheck':[async()=>json({success:true})],
 'POST /api/payment':[async({body})=>payment(body)],
 'POST /api':[async({body})=>payment(body)],
 'GET /api/status':[async({query})=>query.reference?forward({reference:query.reference},'GET'):error('reference required',400)],
 'POST /api/webhook':[async({body})=>json({success:true,received:true,callback:body||{}})]
});