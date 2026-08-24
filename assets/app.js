(function(){
'use strict';
const API='https://zxforhokpsiqkceesalk.supabase.co/functions/v1/paystack';
const LOGO='https://zxforhokpsiqkceesalk.supabase.co/storage/v1/object/public/logo/WhatsApp%20Image%202026-08-11%20at%203.57.54%20PM.jpeg';
const eventTime=new Date('2026-10-10T18:00:00+03:00').getTime();
const tickets=[
{id:'regular',name:'Regular',price:1000,icon:'TICKET',includes:['General Admission','Main Arena','Standard Seating']},
{id:'vip',name:'VIP',price:2000,icon:'VIP',includes:['VIP Entrance','Premium Seating','Priority Access']},
{id:'vvip',name:'VVIP',price:5000,icon:'VVIP',includes:['VVIP Entrance','Front Row','Meet & Greet','Priority Access']},
{id:'vip-group',name:'VIP Group',price:9000,icon:'GROUP',includes:['5 VIP Tickets','Group Seating','Save KSh 1,000']}
];
let selected=tickets[0],method='mpesa',reference='',pollTimer=null,step=1;

const icons={
youtube:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.3 3.7-6.3 3.7Z"/></svg>',
facebook:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a23 23 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z"/></svg>',
instagram:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
whatsapp:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0 12 12 0 0 0 1.7 17.9L0 24l6.3-1.6A12 12 0 0 0 24 12a11.9 11.9 0 0 0-3.5-8.5Zm-8.4 18a9.5 9.5 0 0 1-4.8-1.3l-.3-.2-3.7.9 1-3.6-.2-.3a9.5 9.5 0 1 1 8 4.5Zm5.2-7.1c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.9-1.7.1-.2.1-.4 0-.6-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8 0 1.6 1.2 3.2 1.4 3.4.2.2 2.4 3.7 5.9 5.2 2.2 1 2.2.7 2.6.7.4 0 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>'
};

function ref(prefix){return prefix+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)}
function qty(){return Math.max(1,Math.min(20,Number(document.getElementById('qty')?.value)||1))}
function total(){return selected.price*qty()}
function phoneOK(v){return /^((0?7\d{8})|(2547\d{8})|(\+2547\d{8}))$/.test(v.replace(/\s/g,''))}
function emailOK(v){return /^[^\s@]+@gmail\.com$/i.test(v.trim())}
function render(){
 document.getElementById('app').innerHTML=`
 <header class="hero"><nav class="nav"><img class="logo" src="${LOGO}" alt="CHING'ENDE"><div class="pill">10 OCT 2026 · 6:00 PM · MANSANGO</div></nav>
 <div class="hero-grid"><div><div class="eyebrow">Album Launch</div><h1 class="title">CHING'ENDE <span>LIVE</span></h1><div class="countdown" id="timer"></div><div class="meta"><div>10 Oct 2026</div><div>6:00 PM</div><div>Mansango</div></div><div class="quick-actions"><button class="cta" id="jump">Tickets</button><button class="cta donation-quick" id="donateOpen">Donation</button></div></div>
 <div class="card social-card"><div class="eyebrow">Mansango Official</div><div class="social-links">
 <a class="social-link youtube" href="https://youtube.com/@mansangoofficial?si=FvqKErV8sRsFuOgQ" target="_blank">${icons.youtube}</a>
 <a class="social-link facebook" href="https://www.facebook.com/ManSangoOfficial" target="_blank">${icons.facebook}</a>
 <a class="social-link instagram" href="https://www.instagram.com/man_sango_official?igsi=MXE3bnBraTRhbDgwMA==" target="_blank">${icons.instagram}</a>
 <a class="social-link whatsapp" href="https://wa.me/254748840501" target="_blank">${icons.whatsapp}</a></div></div></div></header>
 <main class="section" id="tickets"><h2>Tickets</h2><div class="tickets">${tickets.map(t=>`<article class="card ticket"><div class="ticket-icon">${t.icon}</div><div class="ticket-name">${t.name}</div><div class="price">KSh ${t.price.toLocaleString()}</div><ul>${t.includes.map(x=>`<li>${x}</li>`).join('')}</ul><button class="select-btn" data-ticket="${t.id}">Select</button></article>`).join('')}</div></main>
 <footer class="footer">Mansango Entertainment · 0748 840 501<div class="creator">Created by Felix Nyabuto · 0716625790</div></footer>
 <div class="modal hidden" id="checkout"><div class="card checkout-modal"><button class="modal-close" id="closeCheckout">Close</button><div class="stepper"><span class="step active" id="s1">1</span><i></i><span class="step" id="s2">2</span><i></i><span class="step" id="s3">3</span></div><div class="eyebrow">Secure checkout</div><h2 id="ctitle"></h2><div class="price" id="cprice"></div>
 <form class="form" id="order"><div id="p1"><label>Full name</label><input id="name" autocomplete="name" required><button class="cta next" type="button" id="next1">Continue</button></div>
 <div id="p2" class="hidden"><label>Gmail</label><input id="email" type="email" autocomplete="email" required><button class="cta next" type="button" id="next2">Continue</button></div>
 <div id="p3" class="hidden"><label>Payment method</label><div class="payment-methods"><button type="button" class="method-btn active" data-method="mpesa">M-PESA</button><button type="button" class="method-btn" data-method="card">Card</button></div><div id="phoneWrap"><label>M-PESA number</label><input id="phone" inputmode="tel" placeholder="07XXXXXXXX"></div><label>Quantity</label><input id="qty" type="number" min="1" max="20" value="1"><div class="modal-total"><span>Total</span><strong id="liveTotal"></strong></div><button class="cta pay" id="pay" type="submit">Pay with M-PESA</button><div id="status" class="status hidden"></div></div></form></div></div>
 <div class="modal hidden" id="waiting"><div class="card waiting-card"><div class="spinner"></div><h2>Payment processing</h2><p id="waitText">Check your phone and complete the M-PESA prompt.</p><small>Waiting for confirmation…</small></div></div>
 <div class="modal hidden" id="donation"><div class="card checkout-modal"><button class="modal-close" id="closeDonation">Close</button><div class="eyebrow">Support the launch</div><h2 class="luxury">Make a Donation</h2><p>Enter your amount, Gmail and M-PESA number.</p><form class="form" id="donationForm"><label>Amount</label><input id="dAmount" type="number" min="10" max="300000" required><label>Gmail</label><input id="dEmail" type="email" required><label>M-PESA number</label><input id="dPhone" inputmode="tel" placeholder="07XXXXXXXX" required><button class="select-btn" type="submit" id="dPay">Donate</button><div id="dStatus" class="status hidden"></div></form></div></div>
 <div class="modal hidden" id="donationSuccess"><div class="card donation-success"><div class="success-mark">✓</div><h2 class="luxury">Donation received</h2><p>Goika ebe ebuse</p><button class="cta" id="closeSuccess">Close</button></div></div>`;
 bind(); updateTimer(); setInterval(updateTimer,1000); selectTicket('regular');
}
function updateTimer(){const e=document.getElementById('timer');if(!e)return;let s=Math.max(0,Math.floor((eventTime-Date.now())/1000));e.textContent=Math.floor(s/86400)+'d '+String(Math.floor(s%86400/3600)).padStart(2,'0')+'h '+String(Math.floor(s%3600/60)).padStart(2,'0')+'m '+String(s%60).padStart(2,'0')+'s'}
function selectTicket(id){selected=tickets.find(t=>t.id===id)||tickets[0];document.getElementById('ctitle').textContent=selected.icon+' '+selected.name;document.getElementById('cprice').textContent='KSh '+selected.price.toLocaleString();document.getElementById('liveTotal').textContent='KSh '+total().toLocaleString()}
function bind(){
 document.querySelectorAll('[data-ticket]').forEach(b=>b.onclick=()=>{selectTicket(b.dataset.ticket);openCheckout()});
 document.getElementById('jump').onclick=()=>document.getElementById('tickets').scrollIntoView({behavior:'smooth'});
 document.getElementById('closeCheckout').onclick=()=>document.getElementById('checkout').classList.add('hidden');
 document.getElementById('next1').onclick=()=>{if(document.getElementById('name').value.trim().length<2)return status('Enter your full name.','error');setStep(2)};
 document.getElementById('next2').onclick=()=>{if(!emailOK(document.getElementById('email').value))return status('Enter a valid Gmail address.','error');setStep(3)};
 document.getElementById('qty').oninput=()=>document.getElementById('liveTotal').textContent='KSh '+total().toLocaleString();
 document.querySelectorAll('[data-method]').forEach(b=>b.onclick=()=>setMethod(b.dataset.method));
 document.getElementById('order').onsubmit=payOrder;
 document.getElementById('donateOpen').onclick=()=>document.getElementById('donation').classList.remove('hidden');
 document.getElementById('closeDonation').onclick=()=>document.getElementById('donation').classList.add('hidden');
 document.getElementById('closeSuccess').onclick=()=>document.getElementById('donationSuccess').classList.add('hidden');
 document.getElementById('donationForm').onsubmit=donate;
}
function openCheckout(){setStep(1);setMethod('mpesa');document.getElementById('checkout').classList.remove('hidden')}
function setStep(n){step=n;[1,2,3].forEach(i=>{document.getElementById('p'+i).classList.toggle('hidden',i!==n);document.getElementById('s'+i).classList.toggle('active',i<=n)})}
function setMethod(m){method=m;document.querySelectorAll('[data-method]').forEach(b=>b.classList.toggle('active',b.dataset.method===m));document.getElementById('phoneWrap').classList.toggle('hidden',m!=='mpesa');document.getElementById('pay').textContent=m==='card'?'Continue to Card Payment':'Pay with M-PESA'}
function status(msg,type){const e=document.getElementById('status');e.className='status '+type;e.textContent=msg;e.classList.remove('hidden')}
function wait(show){document.getElementById('waiting').classList.toggle('hidden',!show)}
async function call(body){
 const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await r.json().catch(()=>({}));
 if(!r.ok||!data.success)throw new Error(data.error||data.message||'Payment could not be started.');
 return data;
}
async function payOrder(e){
 e.preventDefault();
 const name=document.getElementById('name').value.trim(),email=document.getElementById('email').value.trim(),phone=document.getElementById('phone').value.trim();
 if(name.length<2)return status('Enter your full name.','error');if(!emailOK(email))return status('Enter a valid Gmail address.','error');
 if(method==='mpesa'&&!phoneOK(phone))return status('Enter a valid Kenyan M-PESA number.','error');
 const btn=document.getElementById('pay');btn.disabled=true;btn.textContent='Processing…';reference=ref('CHG');
 try{
  const data=await call({action:'initiate',payment_method:method,name,full_name:name,email,phone,phone_number:phone,amount:total(),total_amount:total(),ticket_type:selected.id,ticket_name:selected.name,quantity:qty(),account_reference:reference});
  reference=data.reference||data.data?.reference||reference;
  if(method==='card'){
    if(!data.access_code&&!data.data?.access_code)throw new Error('Card payment could not be initialized.');
    // The Edge Function should return an access_code. Load Paystack only for card payments.
    const s=document.createElement('script');s.src='https://js.paystack.co/v2/inline.js';s.onload=()=>{try{const p=new PaystackPop();p.resumeTransaction(data.access_code||data.data.access_code);wait(true);poll(reference)}catch(err){wait(false);status(err.message||'Card checkout could not open.','error');btn.disabled=false;btn.textContent='Continue to Card Payment'}};s.onerror=()=>{status('Could not load secure card checkout.','error');btn.disabled=false;btn.textContent='Continue to Card Payment'};document.head.appendChild(s);
  }else{document.getElementById('checkout').classList.add('hidden');wait(true);document.getElementById('waitText').textContent=data.message||'M-PESA prompt sent. Enter your PIN on your phone.';poll(reference)}
 }catch(err){status(err.message||'Payment failed.','error');btn.disabled=false;btn.textContent=method==='card'?'Continue to Card Payment':'Pay with M-PESA'}
}
async function poll(refid){
 clearInterval(pollTimer);let n=0;
 pollTimer=setInterval(async()=>{
  n++;try{
   const r=await fetch(API+'?reference='+encodeURIComponent(refid));const d=await r.json().catch(()=>({}));const s=String(d.status||d.payment_status||d.data?.status||'').toLowerCase();
   if(['success','successful','completed','paid'].includes(s)){clearInterval(pollTimer);wait(false);document.getElementById('checkout').classList.remove('hidden');setStep(3);status('Payment successful. Your ticket/order is confirmed.','success');resetPay()}
   else if(['failed','cancelled','canceled'].includes(s)){clearInterval(pollTimer);wait(false);document.getElementById('checkout').classList.remove('hidden');setStep(3);status('Payment unsuccessful. Please try again or use the available manual payment option.','error');resetPay()}
   else if(n>=40){clearInterval(pollTimer);wait(false);document.getElementById('checkout').classList.remove('hidden');setStep(3);status('Payment is still pending. Check your payment confirmation before retrying.','pending');resetPay()}
  }catch(_){if(n>=40){clearInterval(pollTimer);wait(false);status('We could not confirm the payment yet.','pending');resetPay()}}},3000)
}
function resetPay(){const b=document.getElementById('pay');b.disabled=false;b.textContent=method==='card'?'Continue to Card Payment':'Pay with M-PESA'}
async function donate(e){
 e.preventDefault();const amount=Number(document.getElementById('dAmount').value),email=document.getElementById('dEmail').value.trim(),phone=document.getElementById('dPhone').value.trim(),st=document.getElementById('dStatus'),btn=document.getElementById('dPay');
 const show=(m,t)=>{st.textContent=m;st.className='status '+t;st.classList.remove('hidden')};
 if(amount<10||amount>300000)return show('Enter an amount between KSh 10 and KSh 300,000.','error');
 if(!emailOK(email))return show('Enter a valid Gmail address.','error');if(!phoneOK(phone))return show('Enter a valid Kenyan M-PESA number.','error');
 btn.disabled=true;btn.textContent='Sending prompt…';const refid=ref('DON');
 try{const d=await call({action:'initiate',payment_method:'mpesa',donation:true,is_donation:true,send_email:false,email,customer_email:email,phone,phone_number:phone,name:'Donation Supporter',full_name:'Donation Supporter',amount,total_amount:amount,ticket_type:'donation',quantity:1,account_reference:refid});document.getElementById('donation').classList.add('hidden');wait(true);document.getElementById('waitText').textContent=d.message||'Donation prompt sent. Enter your PIN.';reference=d.reference||d.data?.reference||refid;pollDonation(reference)}catch(err){show(err.message||'Donation could not be started.','error');btn.disabled=false;btn.textContent='Donate'}
}
function pollDonation(refid){clearInterval(pollTimer);let n=0;pollTimer=setInterval(async()=>{n++;try{const r=await fetch(API+'?reference='+encodeURIComponent(refid)),d=await r.json().catch(()=>({})),s=String(d.status||d.payment_status||d.data?.status||'').toLowerCase();if(['success','successful','completed','paid'].includes(s)){clearInterval(pollTimer);wait(false);document.getElementById('donationSuccess').classList.remove('hidden')}else if(['failed','cancelled','canceled'].includes(s)||n>=40){clearInterval(pollTimer);wait(false);document.getElementById('donation').classList.remove('hidden');document.getElementById('dStatus').textContent=['failed','cancelled','canceled'].includes(s)?'Donation unsuccessful. Please try again.':'Donation confirmation is still pending.';document.getElementById('dStatus').className='status '+(['failed','cancelled','canceled'].includes(s)?'error':'pending');document.getElementById('dStatus').classList.remove('hidden');document.getElementById('dPay').disabled=false;document.getElementById('dPay').textContent='Donate'}}catch(_){if(n>=40){clearInterval(pollTimer);wait(false);document.getElementById('donation').classList.remove('hidden')}}},3000)}
render();
})();