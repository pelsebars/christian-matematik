import { renderPointOverview } from './point-overview.js';
import { formatRewardPoints } from './reward-points.js';
import { user, preview, rewardPoints, activeSkin, applyShopState, flush } from './account/store.js';
import { shopCatalog } from './shop-catalog.js';
import { escapeHTML as esc } from './tasks/math.js';

const root = document.querySelector('#shopView');
const coin = '<svg class="coin-icon" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="8" ry="3.5"/><path d="M4 6v6c0 5 16 5 16 0V6M4 12v6c0 5 16 5 16 0"/></svg>';
const cart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h3l2.5 12h11L21 6H6M8 20h.01M18 20h.01"/></svg>';
document.querySelector('[data-view="shop"] .nav-symbol').innerHTML = cart;
let state = { purchases: [], catalog: shopCatalog, earnedPoints:0, spentPoints:0 };
let filter = 'all', loaded = false, busy = false, message = '', loadVersion = 0;
const toolbar = document.createElement('div'); toolbar.className = 'workspace-status';
document.querySelector('#mainContent').prepend(toolbar);
const dialog = document.createElement('dialog'); dialog.className = 'shop-dialog'; dialog.setAttribute('aria-labelledby','shopDialogTitle'); document.body.append(dialog);
let intent = null, opener = null;
const skinName = id => shopCatalog.find(item => item.id === id)?.name || 'Original';
const owned = id => id === 'default' || state.purchases.some(p => p.kind === 'skin' && p.item_id === id);
const price = n => `<span class="shop-price">${coin}${formatRewardPoints(n)} point</span>`;
function voucherWord(item, capitalized = false) {
  const word = item?.voucherLabel || state.catalog.find(product => product.id === item?.item_id)?.voucherLabel || 'voucher';
  return capitalized ? word[0].toUpperCase() + word.slice(1) : word;
}
function miniature(skin, large = false) {
  return `<div class="skin-mini skin-mini--${skin}${large ? ' skin-mini--large' : ''}" aria-hidden="true"><div class="mini-nav"><b>△ &nbsp; MATEMATIK</b>${['⌂ Start','ƒ(x) Ligninger','x² Andengrad','∫ Integralregning','↗ Vektorfunktioner'].map((label,i)=>`<span class="${i===2?'mini-selected':''}">${label}</span>`).join('')}<small>ÉT TRIN AD GANGEN</small></div><div class="mini-main"><small>LIGNINGER / TRÆNING</small><strong>Løs ligningen</strong><p>Fokus. Forståelse. Fremskridt.</p><div class="mini-task"><small>OPGAVE 04</small><div class="mini-math">3<i>x</i> + 7 = 22</div><span class="mini-input">5 <b>✓</b></span><span class="mini-feedback">✓ &nbsp; Korrekt! +1 point</span><span class="mini-button">Næste opgave &nbsp; →</span></div><div class="mini-progress"><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>`;
}
function renderToolbar() {
  toolbar.hidden = !root.hidden;
  toolbar.innerHTML = `<span class="workspace-skin"><span class="skin-dot"></span>${activeSkin === 'default' ? 'Dit arbejdsrum' : `${skinName(activeSkin)} · aktivt`}</span><a href="#shop" class="workspace-points" aria-label="Åbn butikken, ${formatRewardPoints(rewardPoints)} butikspoint">${coin}<strong>${formatRewardPoints(rewardPoints)}</strong> butikspoint</a>`;
}
function skinCard(item) {
  const mine = owned(item.id), active = activeSkin === item.id, missing = Math.max(0,item.price-rewardPoints);
  return `<article class="shop-skin-card"><button class="skin-preview-button" type="button" data-preview-skin="${item.id}" aria-label="Forhåndsvis ${item.name}">${miniature(item.id)}<span class="preview-tag">Se skin ↗</span></button><div class="shop-card-copy"><h3>${item.name}</h3><p>${item.description}</p><div class="shop-card-footer">${mine ? '<span class="owned-badge">✓ Ejet</span>' : price(item.price)}<button type="button" class="${mine?'shop-secondary':'shop-primary'}" ${active||busy||(!mine&&missing)?'disabled':''} ${mine?`data-activate="${item.id}"`:`data-buy="${item.id}"`}>${active?'Aktivt':mine?'Aktivér':missing?`Mangler ${formatRewardPoints(missing)} point`:'Køb skin'}</button></div></div></article>`;
}
function rewardCard(item) {
  const missing = Math.max(0,item.price-rewardPoints);
  return `<article class="shop-reward-card"><img src="${esc(item.image)}" alt="${esc(item.imageAlt)}" width="1200" height="800" loading="lazy"><div class="reward-copy"><span class="shop-eyebrow">${esc(item.rewardLabel || 'FYSISK BELØNNING')}</span><h3>${item.name}</h3><p>${item.description}</p>${price(item.price)}<div class="reward-progress"><progress value="${Math.min(item.price,rewardPoints)}" max="${item.price}" aria-label="Opsparing til ${esc(item.name)}"></progress><span>${formatRewardPoints(Math.min(rewardPoints,item.price))} / ${formatRewardPoints(item.price)} point</span><button class="shop-primary" type="button" data-buy="${item.id}" ${missing||busy?'disabled':''}>${missing?`Spar ${formatRewardPoints(missing)} point mere`:`Køb ${esc(voucherWord(item))}`}</button></div><small>Personlig belønning. Aftal indløsningen med Jacob.</small></div></article>`;
}
function renderPurchases() {
  const skins = state.catalog.filter(item=>item.kind==='skin'&&owned(item.id));
  const vouchers = state.purchases.filter(p=>p.kind==='reward');
  return `<div class="shop-section-heading"><h2>Dine skins</h2><span>Behold dem. Skift frit.</span></div><div class="shop-original"><div><strong>Original</strong><p>Det lyse, blå arbejdsrum. Altid dit.</p></div><button class="shop-secondary" data-activate="default" type="button" ${activeSkin==='default'||busy?'disabled':''}>${activeSkin==='default'?'Aktivt':'Aktivér'}</button></div>${skins.length?`<div class="shop-skin-grid">${skins.map(skinCard).join('')}</div>`:'<p class="shop-empty">Dine købte skins dukker op her. Du kan se dem alle under Skins.</p>'}<div class="shop-section-heading"><h2>Dine vouchers</h2></div>${vouchers.length?`<div class="voucher-list">${vouchers.map(p=>`<article class="shop-voucher ${p.redeemed_at?'is-used':''}"><div><span class="shop-eyebrow">${p.redeemed_at?`BRUGT ${esc(voucherWord(p).toUpperCase())}`:'KLAR TIL EN PAUSE'}</span><h3>${esc(p.name)}</h3><p>Købt ${esc(new Date(p.purchased_at).toLocaleDateString('da-DK'))} · ${formatRewardPoints(p.price)} point</p><small>${esc(voucherWord(p,true))} ${esc(p.id.slice(0,8).toUpperCase())}</small></div><button class="shop-secondary" data-redeem="${esc(p.id)}" type="button" ${p.redeemed_at||busy?'disabled':''}>${p.redeemed_at?'✓ Brugt':`Brug ${esc(voucherWord(p))}`}</button></article>`).join('')}</div>`:'<p class="shop-empty">Her finder du dine belønninger, når du har købt en voucher.</p>'}`;
}
function render() {
  renderToolbar();
  if (root.hidden) return;
  root.innerHTML = `<header class="shop-heading"><div><p class="shop-eyebrow">DINE POINT. DIT VALG.</p><h1>Butikken</h1><p>Gør appen til din egen — eller spar op til noget større.</p></div><div class="shop-balance">${coin}<span><strong>${formatRewardPoints(rewardPoints)}</strong> butikspoint</span></div></header><div class="shop-filters" role="group" aria-label="Vis varer">${[['all','Alle'],['skins','Skins'],['rewards','Belønninger'],['mine','Mine køb'],['overview','Pointoverblik']].map(([id,label])=>`<button type="button" data-filter="${id}" aria-pressed="${filter===id}">${label}</button>`).join('')}</div><p class="shop-message" role="status">${esc(message || (preview?'Log ind for at optjene point og købe. Du kan se udvalget her.':!loaded?'Henter din butik…':''))}</p>${loaded||preview?`${['all','skins'].includes(filter)?`<div class="shop-section-heading"><h2>Skins til din app</h2><span>Køb én gang. Brug så tit du vil.</span></div><div class="shop-skin-grid">${state.catalog.filter(i=>i.kind==='skin').map(skinCard).join('')}</div>`:''}${['all','rewards'].includes(filter)?`<div class="shop-section-heading"><h2>Noget at spare op til</h2></div>${state.catalog.filter(i=>i.kind==='reward').map(rewardCard).join('')}`:''}${filter==='mine'?renderPurchases():''}${filter==='overview'?renderPointOverview(state):''}<footer class="shop-footer"><span>Dine løste opgaver bliver stående, når du bruger point.</span><span>${formatRewardPoints(state.earnedPoints)} optjent · ${formatRewardPoints(state.spentPoints)} brugt</span></footer>`:''}`;
}
async function api(options) {
  const response = await fetch('/api/shop',{cache:'no-store',...options});
  const data = await response.json();
  if (!response.ok) throw Error(data.message || 'Butikken kunne ikke nås. Prøv igen.');
  return data;
}
function accept(data) { state = data; loaded = true; applyShopState(data); }
async function load() {
  if (preview) { loaded=true;render();return; }
  const version = ++loadVersion;
  try { if (!await flush()) throw Error('Dine seneste svar kunne ikke gemmes. Prøv igen for at opdatere overblikket.'); const data=await api();if(version===loadVersion){accept(data);render();} }
  catch(error){if(version===loadVersion){message=error.message;render();}}
}
function closeDialog() {
  dialog.close(); intent=null;
  const target = opener && root.querySelector(opener); target?.focus();
}
function purchaseId(itemId) {
  // Keep an ambiguous purchase retry id across reloads, scoped to this account.
  const key=`math-shop-intent:${user.id}:${itemId}`;
  let id; try {id=sessionStorage.getItem(key);}catch{}
  id ||= crypto.randomUUID();
  try {sessionStorage.setItem(key,id);}catch{}
  return id;
}
function openProduct(itemId, buying=false) {
  const item=state.catalog.find(i=>i.id===itemId);if(!item)return;
  opener = buying?`[data-buy="${itemId}"]`:`[data-preview-skin="${itemId}"]`;
  intent={item,buying,requestId:null};
  showProduct();dialog.showModal();
}
function showProduct(error='') {
  const {item,buying}=intent, mine=owned(item.id), missing=Math.max(0,item.price-rewardPoints);
  dialog.innerHTML=`<button class="dialog-close" data-close type="button" aria-label="Luk">×</button><p class="shop-eyebrow">${buying?'DIT NÆSTE KØB':'FORHÅNDSVISNING'}</p><h2 id="shopDialogTitle">${item.name}</h2>${item.kind==='skin'?miniature(item.id,true):`<img class="dialog-reward-image" src="${esc(item.image)}" alt="${esc(item.imageAlt)}">`}<p>${item.description}</p>${buying?`<p class="purchase-summary"><strong>${formatRewardPoints(item.price)} point</strong> trækkes fra din saldo. Du har <strong>${formatRewardPoints(rewardPoints-item.price)} point</strong> tilbage bagefter.</p>${item.kind==='reward'?`<p class="voucher-explanation">${esc(item.voucherExplanation)}</p>`:''}`:''}<p class="dialog-message" role="status">${esc(error)}</p><div class="dialog-actions"><button class="shop-secondary" data-close type="button">${buying?'Annuller':'Luk'}</button>${buying?`<button class="shop-primary" data-confirm-buy type="button" ${busy?'disabled':''}>${busy?'Køber…':`Køb for ${formatRewardPoints(item.price)} point`}</button>`:mine?`<button class="shop-primary" data-dialog-activate="${item.id}" ${activeSkin===item.id?'disabled':''}>${activeSkin===item.id?'Aktivt':'Aktivér skin'}</button>`:`<button class="shop-primary" data-start-buy type="button" ${missing||preview?'disabled':''}>${missing?`Mangler ${formatRewardPoints(missing)} point`:`Køb for ${formatRewardPoints(item.price)} point`}</button>`}</div>`;
}
async function activate(skinId) {
  if(busy||preview)return;busy=true;message='';render();++loadVersion;
  try {if(!await flush())throw Error('Gem dine fremskridt, før du skifter skin.');accept(await api({method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'activate',skinId})}));message=`${skinName(skinId)} er nu aktivt.`;if(dialog.open)closeDialog();}
  catch(error){message=error.message;if(dialog.open)dialog.querySelector('.dialog-message').textContent=error.message;}
  finally{busy=false;render();}
}
root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.filter){filter=b.dataset.filter;message='';render();root.querySelector(`[data-filter="${filter}"]`)?.focus();}
  if(b.dataset.previewSkin)openProduct(b.dataset.previewSkin);
  if(b.dataset.buy&&!preview)openProduct(b.dataset.buy,true);
  if(b.dataset.activate)activate(b.dataset.activate);
  if(b.dataset.redeem){const purchase=state.purchases.find(p=>p.id===b.dataset.redeem);opener=`[data-redeem="${b.dataset.redeem}"]`;intent={redeem:b.dataset.redeem};dialog.innerHTML=`<button class="dialog-close" data-close aria-label="Luk">×</button><p class="shop-eyebrow">DIN BELØNNING</p><h2 id="shopDialogTitle">Klar til din belønning?</h2><p>Aftal belønningen med Jacob. Markér ${esc(voucherWord(purchase))}en som brugt, når du har fået din belønning.</p><p>Den bliver i din købshistorik. Der trækkes ikke flere point.</p><p class="dialog-message" role="status"></p><div class="dialog-actions"><button class="shop-secondary" data-close>Vent lidt endnu</button><button class="shop-primary" data-confirm-redeem>Markér som brugt</button></div>`;dialog.showModal();}
});
dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();else {event.preventDefault();closeDialog();}});
dialog.addEventListener('click',async event=>{
 const b=event.target.closest('button');if(!b||busy)return;
 if(b.hasAttribute('data-close'))return closeDialog();
 if(b.hasAttribute('data-start-buy')){intent.buying=true;showProduct();return;}
 if(b.dataset.dialogActivate)return activate(b.dataset.dialogActivate);
 if(!b.hasAttribute('data-confirm-buy')&&!b.hasAttribute('data-confirm-redeem'))return;
 busy=true;b.disabled=true;++loadVersion;
 try {
   if(!await flush())throw Error('Dine seneste svar kunne ikke gemmes. Prøv igen, når forbindelsen er tilbage.');
   const buying=b.hasAttribute('data-confirm-buy');
   if(buying)intent.requestId ||= purchaseId(intent.item.id);
   const data=await api({method:buying?'POST':'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(buying?{itemId:intent.item.id,requestId:intent.requestId}:{action:'redeem',purchaseId:intent.redeem})});
   if(buying){try{sessionStorage.removeItem(`math-shop-intent:${user.id}:${intent.item.id}`);}catch{} message=intent.item.kind==='skin'?`${intent.item.name} er dit! Aktivér det under Mine køb.`:'Din voucher er klar under Mine køb.';}else message='Voucheren er markeret som brugt.';
   filter='mine';accept(data);closeDialog();
 }catch(error){dialog.querySelector('.dialog-message').textContent=error.message;b.disabled=false;}
 finally {busy=false;render();if(!dialog.open)root.querySelector('[data-filter=mine]')?.focus();}
});
window.addEventListener('account-progress',render);
window.addEventListener('mathviewchange',event=>{renderToolbar();if(event.detail.view==='shop'){render();load();}});
window.addEventListener('focus',()=>{if(!root.hidden&&!busy)load();});
renderToolbar();if(!root.hidden){render();load();}

window.addEventListener('vector-progress',render);
