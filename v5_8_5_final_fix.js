(function(){
'use strict';
function fixNav(){
 const g=(typeof navGroups!=='undefined')&&navGroups.find(x=>x.id==='production');
 if(!g)return;
 g.items.forEach(x=>{if(x[0]==='production_orders')x[2]='production_orders.view';if(x[0]==='preparation')x[2]='preparation.view';});
}
function profileFor(p){
 if(!p)return null;if(typeof ensureChickenTransformModule==='function')ensureChickenTransformModule();
 db.process_profiles=Array.isArray(db.process_profiles)?db.process_profiles:[];
 let r=db.process_profiles.find(x=>String(x.productId)===String(p.id));
 if(!r){r={id:'PROC-'+Date.now(),productId:p.id,centerId:'chicken',name:p.name+' — تحويل وإنتاج الدجاج',mode:'three_stage'};db.process_profiles.push(r)}
 Object.assign(r,{centerId:'chicken',mode:'three_stage',rawLabel:'وزن الكمية قبل الطهي',cookedLabel:'وزن الكمية بعد الطهي',netLabel:'وزن Poulet Haché النهائي'});
 Object.assign(p,{isComposed:true,purchaseLinked:false,salesLinked:true,productionOrderLinked:true,productionPath:'chicken',productionCenter:'chicken'});return r;
}
function syncComposition(){
 const s=document.getElementById('pdProductionPathInline'),h=document.getElementById('pdProductionMethodInline'),tab=document.getElementById('pdTabComposition');if(!s||!h||!tab)return;
 const ch=s.value==='chicken';
 h.innerHTML=ch?'<b>طريقة العمل: تحويل وإنتاج الدجاج</b><br><br>بعد الحفظ يظهر المنتج تلقائياً في قسم تحويل وإنتاج الدجاج، وتدخل هناك:<br>1) وزن الكمية قبل الطهي.<br>2) وزن الكمية بعد الطهي.<br>3) وزن Poulet Haché النهائي.<br><br><b>الحساب الآلي:</b><br>هدر الطهي = قبل الطهي − بعد الطهي<br>هدر الفرم والتنقية = بعد الطهي − الوزن النهائي<br>إجمالي الهدر = قبل الطهي − الوزن النهائي<br>المردودية = (الوزن النهائي ÷ الوزن قبل الطهي) × 100<br><br><button type="button" class="btn btn-primary" onclick="openCurrentProductChickenProcess()">فتح عملية إنتاج الدجاج</button>':'<b>طريقة العمل: قسم التحضير</b><br><br>يعتمد النظام على المكونات المكتوبة ويحسب المطلوب والمتوفر والنقص تلقائياً.';
 const rows=document.getElementById('pdCompositionRows');if(rows)rows.style.display=ch?'none':'';
 const table=tab.querySelector('.table-wrap');if(table)table.style.display=ch?'none':'';
 const add=tab.querySelector('button[onclick="addProductCompositionRow()"]');if(add)add.style.display=ch?'none':'';
 const del=tab.querySelector('button[onclick="clearProductComposition()"]');if(del)del.style.display=ch?'none':'';
 const saveBtn=tab.querySelector('button[onclick="saveProductComposition()"]');if(saveBtn)saveBtn.textContent=ch?'حفظ مسار إنتاج الدجاج':'حفظ المكونات';
}
window.renderInlineProductionMethod=syncComposition;
const oldRenderComp=window.renderProductComposition;if(oldRenderComp)window.renderProductComposition=function(p){const r=oldRenderComp(p);setTimeout(syncComposition,0);return r};
const oldSaveComp=window.saveProductComposition;
window.saveProductComposition=function(){
 const s=document.getElementById('pdProductionPathInline');if(!s||s.value!=='chicken')return oldSaveComp();
 if(typeof requirePerm==='function'&&!requirePerm('products.edit'))return;if(currentProductIndex===null||!db.products[currentProductIndex])return alert('تعذر تحديد المنتج الحالي');
 const p=db.products[currentProductIndex],yieldQty=Math.max(.001,Number(document.getElementById('pdCompositionYield')?.value||1)),unit=document.getElementById('pdCompositionUnit')?.value||p.unit||'كغ';
 db.product_compositions=Array.isArray(db.product_compositions)?db.product_compositions:[];const prev=db.product_compositions.find(x=>String(x.productId)===String(p.id));
 db.product_compositions=db.product_compositions.filter(x=>String(x.productId)!==String(p.id));db.product_compositions.push({id:prev?.id||'COMP-'+Date.now(),productId:p.id,productName:p.name,yieldQty,unit,productionPath:'chicken',items:prev?.items||[],updatedAt:new Date().toISOString(),updatedBy:current?.name||'النظام'});
 profileFor(p);if(typeof log==='function')log('حفظ مسار إنتاج الدجاج',p.name);save();renderProducts();renderProductComposition(p);if(typeof renderProcessSelectors==='function')renderProcessSelectors();alert('تم حفظ مسار إنتاج الدجاج وسيظهر المنتج في قسم تحويل وإنتاج الدجاج.');
};
window.openCurrentProductChickenProcess=function(){
 if(typeof can==='function'&&!can('chicken_transform.view'))return alert('ليست لديك صلاحية مشاهدة قسم تحويل وإنتاج الدجاج');if(currentProductIndex===null)return;
 const p=db.products[currentProductIndex];profileFor(p);save();document.getElementById('productDetailModal')?.classList.remove('open');fixNav();activeNavGroup='production';buildNavigation();const g=availableNavGroups().find(x=>x.id==='production'),b=[...document.querySelectorAll('#menu button')].find(x=>x.textContent.includes('تحويل وإنتاج الدجاج'));if(g&&b)showPage('chicken_transform',b,g);
 setTimeout(()=>{renderProcessSelectors();const pi=db.process_profiles.findIndex(x=>String(x.productId)===String(p.id)),ps=document.getElementById('ctProcessProfile'),inp=document.getElementById('ctInputProduct'),out=document.getElementById('ctOutputProduct');if(ps&&pi>=0)ps.value=String(pi);if(inp&&[...inp.options].some(o=>String(o.value)===String(p.id)))inp.value=String(p.id);const h=(db.products||[]).find(x=>/hach|مفروم/i.test(String(x.name||'')));if(out&&h&&[...out.options].some(o=>String(o.value)===String(h.id)))out.value=String(h.id);loadProcessProfile()},80);
};
const oldRPS=window.renderProcessSelectors;
window.renderProcessSelectors=function(){
 (db.products||[]).filter(p=>p.productionPath==='chicken').forEach(profileFor);if(typeof ensureChickenTransformModule==='function')ensureChickenTransformModule();
 const ps=document.getElementById('ctProcessProfile'),inp=document.getElementById('ctInputProduct'),out=document.getElementById('ctOutputProduct');if(!ps||!inp||!out)return oldRPS?.();
 const pv=ps.value,iv=inp.value,ov=out.value,profiles=(db.process_profiles||[]).map((x,i)=>({x,i})).filter(z=>(z.x.centerId||'chicken')==='chicken'),inputs=(db.products||[]).filter(p=>p.active!==false&&(p.productionPath==='chicken'||p.productionCenter==='chicken')),outputs=(db.products||[]).filter(p=>p.active!==false&&(p.productionPath==='chicken'||p.productionCenter==='chicken'||/hach|مفروم/i.test(String(p.name||''))));
 ps.innerHTML=profiles.map(z=>`<option value="${z.i}">${z.x.name}</option>`).join('');inp.innerHTML=inputs.length?inputs.map(p=>`<option value="${p.id}">${p.name} — ${p.unit}</option>`).join(''):'<option value="">لا توجد منتجات مرتبطة</option>';out.innerHTML=outputs.length?outputs.map(p=>`<option value="${p.id}">${p.name} — ${p.unit}</option>`).join(''):'<option value="">لا يوجد منتج ناتج</option>';
 if([...ps.options].some(o=>o.value===pv))ps.value=pv;if([...inp.options].some(o=>o.value===iv))inp.value=iv;if([...out.options].some(o=>o.value===ov))out.value=ov;const pr=db.process_profiles?.[Number(ps.value)];if(pr?.productId&&[...inp.options].some(o=>String(o.value)===String(pr.productId)))inp.value=String(pr.productId);const h=outputs.find(p=>/hach|مفروم/i.test(String(p.name||'')));if(h&&!ov)out.value=String(h.id);loadProcessProfile();
};
const oldLoad=window.loadProcessProfile;window.loadProcessProfile=function(){const ps=document.getElementById('ctProcessProfile'),inp=document.getElementById('ctInputProduct'),pr=db.process_profiles?.[Number(ps?.value)];if(pr?.productId&&inp&&[...inp.options].some(o=>String(o.value)===String(pr.productId)))inp.value=String(pr.productId);return oldLoad?.()};
fixNav();if(typeof current!=='undefined'&&current&&typeof buildNavigation==='function')buildNavigation();document.title='Machawi Dajaj ERP Cloud V5.8.5 Final Stable';
})();
