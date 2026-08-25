

const tickets=[
 {id:'regular',name:'Regular',price:1000,items:['General Admission','Main Arena','Standard Seating']},
 {id:'vip',name:'VIP',price:2000,items:['VIP Entrance','Premium Seating','Priority Access']},
 {id:'vvip',name:'VVIP',price:5000,items:['VVIP Entrance','Front Row','Meet & Greet','Priority Access']},
 {id:'vip-group',name:'VIP Group',price:9000,items:['5 VIP Tickets','Group Seating','Save KSh 1,000']}
];
const API='https://zxforhokpsiqkceesalk.supabase.co/functions/v1/paystack';
const LOGO='https://zxforhokpsiqkceesalk.supabase.co/storage/v1/object/public/logo/WhatsApp%20Image%202026-08-11%20at%203.57.54%20PM.jpeg';
const socials=[
 ['YouTube','https://youtube.com/@mansangoofficial?si=FvqKErV8sRsFuOgQ'],
 ['Facebook','https://www.facebook.com/ManSangoOfficial'],
 ['Instagram','https://www.instagram.com/man_sango_official?igsi=MXE3bnBraTRhbDgwMA=='],
 ['WhatsApp','https://wa.me/254748840501']
];
let selected = tickets[0],method='mpesa',poll=0;
const app=document.querySelector('#app');

const validGmail=(v)=>/^[^\s@]+@gmail\.com$/i.test(v.trim());
const validPhone=(v)=>/^((0?7\d{8})|(2547\d{8})|(\+2547\d{8}))$/.test(v.replace(/\s/g,''));
const ref=(p)=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

function render(){
 app.innerHTML=`<div class="page">
 <header class="hero">
  <nav><img class="logo" src="${LOGO}" alt="CHING'ENDE"><div class="top-pill">10 OCT 2026 · 6:00 PM · MANSANGO</div></nav>
  <div class="hero-grid"><section>
   <div class="eyebrow">Album Launch</div><h1>CHING'ENDE <span>LIVE</span></h1>
   <div class="count" id="count"></div>
   <div class="meta"><b>10 Oct 2026</b><b>6:00 PM</b><b>Mansango</b></div>
   <div class="quick"><button id="quickTickets">Tickets</button><button id="donateQuick">Donation</button></div>
  </section>
  <section class="social-card"><div class="eyebrow">Mansango Official</div><div class="socials">
   ${socials.map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener" title="${n}" aria-label="${n}" class="${n.toLowerCase()}">${n==='YouTube'?'▶':n==='Facebook'?'f':n==='Instagram'?'◎':'◉'}</a>`).join('')}
  </div></section></div>
 </header>
 <main id="tickets"><h2>Tickets</h2><div class="tickets">
 ${tickets.map(t=>`<article class="ticket"><small>${t.id==='vip-group'?'GROUP':t.name.toUpperCase()}</small><h3>${t.name}</h3><strong>KSh ${t.price.toLocaleString()}</strong><ul>${t.items.map(x=>`<li>${x}</li>`).join('')}</ul><button class="select" data-ticket="${t.id}">Select</button></article>`).join('')}
 </div></main>
 <footer>Mansango Entertainment · 0748 840 501<div>Created by Felix Nyabuto · 0716625790</div></footer>

 <div class="modal hidden" id="checkout"><div class="modal-box"><button class="close" data-close="checkout">Close</button>
 <div class="steps"><i>1</i><i>2</i><i>3</i></div><div class="eyebrow">Secure checkout</div><h2 id="ticketTitle"></h2><form id="ticketForm">
 <div id="s1"><label>Full name<input id="name" placeholder="Enter your full name" required></label><button class="primary" type="button" id="nameNext">Continue</button></div>
 <div id="s2" class="hidden"><label>Gmail<input id="email" type="email" placeholder="you@gmail.com" required></label><button class="primary" type="button" id="emailNext">Continue</button></div>
 <div id="s3" class="hidden"><label>Payment method</label><div class="methods"><button type="button" data-method="mpesa">M-PESA</button><button type="button" data-method="card">Card</button></div>
 <div id="phoneBox"><label>M-PESA number<input id="phone" placeholder="07XXXXXXXX" inputmode="tel"></label></div>
 <label>Quantity<input id="qty" type="number" min="1" max="20" value="1"></label>
 <div class="total">Total <b id="total"></b></div><button class="primary" id="pay" type="submit">Pay with M-PESA</button></div>
 <div id="ticketStatus" class="status hidden"></div></form></div></div>

 <div class="modal hidden" id="donation"><div class="modal-box"><button class="close" data-close="donation">Close</button><div class="eyebrow">Support the launch</div><h2>Make a Donation</h2>
 <form id="donationForm"><label>Amount<input id="dAmount" type="number" min="10" max="300000" placeholder="KSh 10 or more" required></label>
 <label>Gmail<input id="dEmail" type="email" placeholder="you@gmail.com" required></label>
 <label>M-PESA number<input id="dPhone" placeholder="07XXXXXXXX" inputmode="tel" required></label>
 <button class="select" type="submit" id="dPay">Donate</button><div id="dStatus" class="status hidden"></div></form></div></div>

 <div class="modal hidden" id="waiting"><div class="modal-box center"><div class="spinner"></div><h2>Check your phone</h2><p id="waitText">Payment prompt sent. Enter your PIN.</p></div></div>
 <div class="modal hidden" id="success"><div class="modal-box center"><div class="success">✓</div><h2>Donation received</h2><p class="luxury">Goika ebe ebuse</p><button class="primary" data-close="success">Close</button></div></div>
 </div>`;
 bind(); timer();
}

function timer(){const el=document.querySelector('#count');const end=new Date('2026-10-10T18:00:00+03:00').getTime();const tick=()=>{const s=Math.max(0,Math.floor((end-Date.now())/1000));el.textContent=`${Math.floor(s/86400)}d ${String(Math.floor(s%86400/3600)).padStart(2,'0')}h ${String(Math.floor(s%3600/60)).padStart(2,'0')}m ${String(s%60).padStart(2,'0')}s`};tick();setInterval(tick,1000)}

function bind(){
 document.querySelector('#quickTickets')?.addEventListener('click',()=>document.querySelector('#tickets')?.scrollIntoView({behavior:'smooth'}));
 document.querySelector('#donateQuick')?.addEventListener('click',()=>document.querySelector('#donation')?.classList.remove('hidden'));
 document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',()=>document.querySelector('#'+(x).dataset.close)?.classList.add('hidden')));
 document.querySelectorAll('[data-ticket]').forEach(b=>b.addEventListener('click',()=>openTicket(b.dataset.ticket)));
 document.querySelector('#nameNext')?.addEventListener('click',()=>{const v=(document.querySelector('#name')).value.trim();if(v.length<2)return status('ticketStatus','Enter your full name.','error');step(2)});
 document.querySelector('#emailNext')?.addEventListener('click',()=>{const v=(document.querySelector('#email')).value;if(!validGmail(v))return status('ticketStatus','Enter a valid Gmail address.','error');step(3)});
 document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>{method=b.dataset.method;document.querySelectorAll('[data-method]').forEach(x=>x.classList.toggle('active',(x).dataset.method===method));document.querySelector('#phoneBox')?.classList.toggle('hidden',method==='card');(document.querySelector('#pay')).textContent=method==='card'?'Continue to Card Payment':'Pay with M-PESA'}));
 document.querySelector('#qty')?.addEventListener('input',updateTotal);
 document.querySelector('#ticketForm')?.addEventListener('submit',ticketPay);
 document.querySelector('#donationForm')?.addEventListener('submit',donate);
}

function openTicket(id){selected=tickets.find(x=>x.id===id);method='mpesa';(document.querySelector('#checkout')).classList.remove('hidden');(document.querySelector('#ticketTitle')).textContent=`${selected.name} — KSh ${selected.price.toLocaleString()}`;step(1);updateTotal()}
function step(n){['s1','s2','s3'].forEach((x,i)=>document.querySelector('#'+x)?.classList.toggle('hidden',i!==n-1));}
function updateTotal(){const q=Math.max(1,Math.min(20,Number((document.querySelector('#qty'))?.value)||1));(document.querySelector('#total')).textContent=`KSh ${(selected.price*q).toLocaleString()}`}
function status(id,msg,type){const e=document.querySelector('#'+id);e.textContent=msg;e.className=`status ${type}`;e.classList.remove('hidden')}
async function call(body){const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok||!d.success)throw new Error(d.error||d.message||'Payment could not be started.');return d}
function wait(refId,isDonation=false){
 document.querySelector('#waiting')?.classList.remove('hidden');let n=0;clearInterval(poll);
 poll=setInterval(async()=>{n++;try{const r=await fetch(`${API}?reference=${encodeURIComponent(refId)}`);const d=await r.json().catch(()=>({}));const s=String(d.status||d.payment_status||d.data?.status||'').toLowerCase();
 if(['success','successful','completed','paid'].includes(s)){clearInterval(poll);document.querySelector('#waiting')?.classList.add('hidden');if(isDonation)document.querySelector('#success')?.classList.remove('hidden');else status('ticketStatus','Payment successful. Check your Gmail inbox for your ticket.','success');}
 if(['failed','cancelled','canceled'].includes(s)){clearInterval(poll);document.querySelector('#waiting')?.classList.add('hidden');if(isDonation){document.querySelector('#donation')?.classList.remove('hidden');status('dStatus','Donation failed or was cancelled. Please try again.','error')}else status('ticketStatus','Payment unsuccessful. Please try again.','error')}
 if(n>=40){clearInterval(poll);document.querySelector('#waiting')?.classList.add('hidden');if(isDonation){document.querySelector('#donation')?.classList.remove('hidden');status('dStatus','Payment is still pending. Check your M-PESA confirmation.','pending')}else status('ticketStatus','Payment is still pending. Check your payment confirmation.','pending')}}
 catch{if(n>=40){clearInterval(poll);document.querySelector('#waiting')?.classList.add('hidden');status(isDonation?'dStatus':'ticketStatus','We could not confirm the payment yet.','pending')}}},3000);
}
async function ticketPay(e){e.preventDefault();const name=(document.querySelector('#name')).value.trim(),email=(document.querySelector('#email')).value.trim(),phone=(document.querySelector('#phone')).value.trim(),q=Math.max(1,Math.min(20,Number((document.querySelector('#qty')).value)||1)),amount=selected.price*q;
 if(!validGmail(email))return status('ticketStatus','Enter a valid Gmail address.','error');if(method==='mpesa'&&!validPhone(phone))return status('ticketStatus','Enter a valid Kenyan M-PESA number.','error');
 const b=document.querySelector('#pay');b.disabled=true;b.textContent='Processing…';
 try{const d=await call({action:'initiate',payment_method:method,name,email,phone,amount,total_amount:amount,quantity:q,ticket_type:selected.id,account_reference:ref('CHG')});
 if(method==='card'&&d.access_code){const s=document.createElement('script');s.src='https://js.paystack.co/v2/inline.js';s.onload=()=>{const P=(window).PaystackPop;if(!P)throw new Error('Paystack checkout unavailable');const p=new P();p.resumeTransaction(d.access_code);wait(d.reference||d.data?.reference||'');};document.head.appendChild(s)}
 else wait(d.reference||d.data?.reference||'');}catch(err){status('ticketStatus',err instanceof Error?err.message:'Payment could not be started.','error')}finally{b.disabled=false;b.textContent=method==='card'?'Continue to Card Payment':'Pay with M-PESA'}}
async function donate(e){e.preventDefault();const amount=Number((document.querySelector('#dAmount')).value),email=(document.querySelector('#dEmail')).value.trim(),phone=(document.querySelector('#dPhone')).value.trim();if(amount<10||amount>300000)return status('dStatus','Enter an amount between KSh 10 and KSh 300,000.','error');if(!validGmail(email))return status('dStatus','Enter a valid Gmail address.','error');if(!validPhone(phone))return status('dStatus','Enter a valid Kenyan M-PESA number.','error');
 const b=document.querySelector('#dPay');b.disabled=true;b.textContent='Sending…';try{const d=await call({action:'initiate',payment_method:'mpesa',donation:true,is_donation:true,send_email:false,name:'Donation Supporter',email,phone,amount,total_amount:amount,quantity:1,ticket_type:'donation',account_reference:ref('DON')});document.querySelector('#donation')?.classList.add('hidden');wait(d.reference||d.data?.reference||'',true)}catch(err){status('dStatus',err instanceof Error?err.message:'Donation could not be started.','error')}finally{b.disabled=false;b.textContent='Donate'}}
render();