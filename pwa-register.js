(() => {
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;const b=document.getElementById('installPwaBtn');if(b)b.style.display='inline-flex'});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;const b=document.getElementById('installPwaBtn');if(b)b.style.display='none'});
document.addEventListener('click',async e=>{if(e.target?.id!=='installPwaBtn')return;if(!deferredPrompt){alert('من قائمة Chrome اختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.');return}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;e.target.style.display='none'});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).catch(console.error));
})();