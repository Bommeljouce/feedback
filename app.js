/*
  Frontend for GitHub Pages.
  Set API_URL to the deployed Google Apps Script Web App URL for shared data.
  If API_URL is empty, the app uses localStorage (same-device demo mode).
*/
const API_URL = "https://script.google.com/macros/s/AKfycbyo-Lg5bRG_bkaGpbrHTO4cMqM5HAjmlMt4pWpizNN7AYm2IY9xpkIUcEX93mjcGjuM/exec"; // <-- hier die Apps-Script-Web-App-URL eintragen

const state={feedback:[],infos:[],polls:[],votes:{},loading:false};
let edit={type:null,id:null};
let pendingDelete=null;

const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const uid=()=>Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
const now=()=>new Date().toLocaleString("de-DE",{dateStyle:"short",timeStyle:"short"});
const toast=(m)=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)};

async function api(action,payload={}){
  if(!API_URL){return localApi(action,payload)}
  const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...payload})});
  if(!r.ok) throw new Error("Serverfehler");
  return r.json();
}
function localApi(action,p){
  const db=JSON.parse(localStorage.getItem("projektboard")||'{"feedback":[],"infos":[],"polls":[]}');
  if(action==="load")return Promise.resolve(db);
  const arr=db[p.type];
  if(action==="create"){arr.unshift(p.item)}
  if(action==="update"){const i=arr.findIndex(x=>x.id===p.item.id);if(i>=0)arr[i]=p.item}
  if(action==="delete"){db[p.type]=arr.filter(x=>x.id!==p.id)}
  if(action==="vote"){const item=arr.find(x=>x.id===p.id);if(item){item.votes??={yes:0,no:0};item.votes[p.vote]=(item.votes[p.vote]||0)+1}}
  if(action==="comment"){const item=arr.find(x=>x.id===p.id);if(item){item.comments??=[];item.comments.push(p.comment)}}
  if(action==="commentVote"){const item=arr.find(x=>x.id===p.parentId);const c=item?.comments?.find(x=>x.id===p.commentId);if(c){c.votes??={like:0,dislike:0};c.votes[p.vote]=(c.votes[p.vote]||0)+1}}
  if(action==="pollVote"){const item=arr.find(x=>x.id===p.id);if(item){item.results??={};p.choices.forEach(i=>item.results[i]=(item.results[i]||0)+1)}}
  localStorage.setItem("projektboard",JSON.stringify(db));return Promise.resolve(db)
}
async function refresh(){
  try{const d=await api("load");state.feedback=d.feedback||[];state.infos=d.infos||[];state.polls=d.polls||[];render()}
  catch(e){toast("Daten konnten nicht geladen werden")}
}
function render(){renderFeedback();renderInfos();renderPolls()}
function actions(type,id,editable){
  return editable?`<div class="mini-actions"><button class="icon-btn" title="Bearbeiten" onclick="openEdit('${type}','${id}')">✎</button><button class="icon-btn" title="Löschen" onclick="askDelete('${type}','${id}')">⌫</button></div>`:`<div class="mini-actions"><button class="icon-btn" title="Löschen" onclick="askDelete('${type}','${id}')">⌫</button></div>`
}
function renderFeedback(){
  const list=$("#feedbackList");$("#feedbackEmpty").style.display=state.feedback.length?"none":"block";
  list.innerHTML=state.feedback.map(f=>{f.comments=nestComments(f.comments||[]);return `
  <article class="card"><div class="card-head"><div><h3>${esc(f.title)}</h3><div class="meta">anonym · ${esc(f.created)}</div></div>${actions("feedback",f.id,false)}</div>
  <div class="body">${esc(f.text)}</div>
  <div class="vote-row"><button class="vote" onclick="voteFeedback('${f.id}','yes')">Stimme zu <b>${f.votes?.yes||0}</b></button><button class="vote" onclick="voteFeedback('${f.id}','no')">Stimme nicht zu <b>${f.votes?.no||0}</b></button></div>
  <div class="comments"><strong>Kommentare (${f.comments?.length||0})</strong>${renderComments(f,f.comments||[])}
  <form class="comment-form" onsubmit="addComment(event,'${f.id}',null)"><input required maxlength="500" name="text" placeholder="Kommentar schreiben …"><button class="secondary">Senden</button></form></div></article>`}).join("")
}
function renderComments(f,cs){
  return cs.map(c=>`<div class="comment ${c.parentId?"reply":""}">
  ${c.quote?`<div class="quoted">Zitat: ${esc(c.quote)}</div>`:""}<div class="comment-text">${esc(c.text)}</div>
  <div class="meta">anonym · ${esc(c.created)}</div>
  <div class="comment-actions"><button class="comment-action" onclick="commentVote('${f.id}','${c.id}','like')">♥ ${c.votes?.like||0}</button><button class="comment-action" onclick="commentVote('${f.id}','${c.id}','dislike')">▼ ${c.votes?.dislike||0}</button><button class="quote-btn" onclick="quoteComment('${f.id}','${c.id}')">Zitat</button><button class="icon-btn" title="Löschen" onclick="askDeleteComment('${f.id}','${c.id}')">⌫</button></div>
  <form class="comment-form" onsubmit="addComment(event,'${f.id}','${c.id}')"><input required maxlength="500" name="text" placeholder="Antwort …"><button class="secondary">Antwort</button></form>
  ${c.replies?renderComments(f,c.replies):""}</div>`).join("")
}
function renderInfos(){
  const list=$("#infoList");$("#infoEmpty").style.display=state.infos.length?"none":"block";
  list.innerHTML=state.infos.map(i=>`<article class="card"><div class="card-head"><div><h3>${esc(i.title)}</h3><div class="meta">${i.name?esc(i.name):"ohne Namen"} · ${esc(i.created)}</div></div>${actions("infos",i.id,true)}</div><div class="body">${esc(i.text)}</div></article>`}).join("")
}
function renderPolls(){
  const list=$("#pollList");$("#pollEmpty").style.display=state.polls.length?"none":"block";
  list.innerHTML=state.polls.map(p=>{
    const total=Object.values(p.results||{}).reduce((a,b)=>a+b,0);
    return `<article class="card"><div class="card-head"><div><h3>${esc(p.question)}</h3><div class="meta">${esc(p.name)} · ${esc(p.created)} · ${p.mode==="multi"?"Mehrfachauswahl":"Einzelauswahl"}</div></div>${actions("polls",p.id,true)}</div>
    <form onsubmit="votePoll(event,'${p.id}')"><div class="poll-options">${p.options.map((o,i)=>`<label class="poll-option"><input type="${p.mode==="multi"?"checkbox":"radio"}" name="p-${p.id}" value="${i}" ${p.mode==="multi"?"":"required"}>${esc(o)} <span>(${p.results?.[i]||0})</span><div class="resultbar"><i style="width:${total?((p.results?.[i]||0)/total*100):0}%"></i></div></label>`).join("")}</div><button class="primary">Abstimmen</button></form></article>`
  }).join("")
}
function fields(type,item={}){
  if(type==="feedback")return `<div class="fields"><div class="field"><label>Titel</label><input name="title" required maxlength="120" value="${esc(item.title)}"></div><div class="field"><label>Feedback</label><textarea name="text" required maxlength="3000">${esc(item.text)}</textarea></div></div>`;
  if(type==="infos")return `<div class="fields"><div class="field"><label>Titel</label><input name="title" required maxlength="120" value="${esc(item.title)}"></div><div class="field"><label>Erstellername (optional)</label><input name="name" maxlength="80" value="${esc(item.name)}"></div><div class="field"><label>Text</label><textarea name="text" required maxlength="5000">${esc(item.text)}</textarea></div></div>`;
  return `<div class="fields"><div class="field"><label>Frage</label><input name="question" required maxlength="300" value="${esc(item.question)}"></div><div class="field"><label>Erstellername (erforderlich)</label><input name="name" required maxlength="80" value="${esc(item.name)}"></div><div class="field"><label>Auswahl</label><select name="mode"><option value="single" ${item.mode!=="multi"?"selected":""}>Single Choice</option><option value="multi" ${item.mode==="multi"?"selected":""}>Multiple Choice</option></select></div><div class="field"><label>Antwortmöglichkeiten</label><div id="choices">${(item.options||["",""]).map(o=>`<div class="choice-line"><input name="option" required maxlength="150" value="${esc(o)}"><button type="button" class="icon-btn" onclick="this.parentElement.remove()">×</button></div>`).join("")}</div><button type="button" class="secondary" onclick="addChoice()">+ Antwort</button></div></div>`
}
function openEditor(type,item=null){
  edit={type,id:item?.id||null};$("#editorTitle").textContent=item?"Bearbeiten":(type==="feedback"?"Feedback erstellen":type==="infos"?"Info erstellen":"Abstimmung erstellen");$("#editorFields").innerHTML=fields(type,item||{});$("#editor").showModal()
}
function addChoice(){const d=document.createElement("div");d.className="choice-line";d.innerHTML='<input name="option" required maxlength="150"><button type="button" class="icon-btn" onclick="this.parentElement.remove()">×</button>';$("#choices").appendChild(d)}
async function save(e){e.preventDefault();const fd=new FormData($("#editorForm"));const t=edit.type;let item;
  if(t==="feedback")item={id:edit.id||uid(),title:fd.get("title").trim(),text:fd.get("text").trim(),created:edit.id?(state.feedback.find(x=>x.id===edit.id)?.created||now()):now(),votes:edit.id?(state.feedback.find(x=>x.id===edit.id)?.votes||{}):{},comments:edit.id?(state.feedback.find(x=>x.id===edit.id)?.comments||[]):[]};
  if(t==="infos")item={id:edit.id||uid(),title:fd.get("title").trim(),name:fd.get("name").trim(),text:fd.get("text").trim(),created:edit.id?(state.infos.find(x=>x.id===edit.id)?.created||now()):now()};
  if(t==="polls"){const opts=[...$("#choices").querySelectorAll("input[name=option]")].map(x=>x.value.trim()).filter(Boolean);if(opts.length<2){toast("Mindestens 2 Antworten");return}item={id:edit.id||uid(),question:fd.get("question").trim(),name:fd.get("name").trim(),mode:fd.get("mode"),options:opts,created:edit.id?(state.polls.find(x=>x.id===edit.id)?.created||now()):now(),results:edit.id?(state.polls.find(x=>x.id===edit.id)?.results||{}):{}}}
  try{await api(edit.id?"update":"create",{type:t,item});$("#editor").close();await refresh();toast("Gespeichert")}catch(_){toast("Speichern fehlgeschlagen")}
}
async function voteFeedback(id,vote){try{await api("vote",{type:"feedback",id,vote});await refresh()}catch(_){toast("Fehler")}}
async function addComment(e,id,parentId){e.preventDefault();const input=e.target.elements.text;const text=input.value.trim();if(!text)return;const f=state.feedback.find(x=>x.id===id);const quote=parentId?findComment(f.comments,parentId)?.text:null;try{await api("comment",{type:"feedback",id,comment:{id:uid(),text,created:now(),parentId,quote,votes:{like:0,dislike:0}}});e.target.reset();await refresh()}catch(_){toast("Fehler")}}
function findComment(cs,id){for(const c of cs){if(c.id===id)return c;const x=findComment(c.replies||[],id);if(x)return x}return null}
function nestComments(list){const roots=[];const map={};list.forEach(c=>{c.replies=[];map[c.id]=c});list.forEach(c=>c.parentId&&map[c.parentId]?map[c.parentId].replies.push(c):roots.push(c));return roots}
function quoteComment(id,cid){const f=state.feedback.find(x=>x.id===id),c=findComment(f.comments||[],cid);const form=document.querySelector(`form[onsubmit="addComment(event,'${id}',null)"]`);if(form){form.elements.text.value="Zitat: „"+c.text+"“\n\n";form.elements.text.focus();form.elements.text.scrollIntoView({behavior:"smooth",block:"center"})}}
async function commentVote(parentId,commentId,vote){try{await api("commentVote",{type:"feedback",parentId,commentId,vote});await refresh()}catch(_){toast("Fehler")}}
async function votePoll(e,id){e.preventDefault();const p=state.polls.find(x=>x.id===id),choices=[...e.target.querySelectorAll("input:checked")].map(x=>Number(x.value));if(!choices.length)return;try{await api("pollVote",{type:"polls",id,choices});await refresh()}catch(_){toast("Fehler")}}
function openEdit(type,id){const arr=state[type],item=arr.find(x=>x.id===id);if(item)openEditor(type,item)}
function askDelete(type,id){pendingDelete={type,id};$("#confirmTitle").textContent="Wirklich löschen?";$("#confirmText").textContent="Der Eintrag wird dauerhaft gelöscht und kann nicht wiederhergestellt werden.";$("#confirmDialog").showModal()}
async function confirmDelete(){if(!pendingDelete)return;try{await api("delete",pendingDelete);$("#confirmDialog").close();pendingDelete=null;await refresh();toast("Gelöscht")}catch(_){toast("Löschen fehlgeschlagen")}}
function askDeleteComment(parentId,commentId){pendingDelete={type:"comment",parentId,commentId};$("#confirmTitle").textContent="Kommentar löschen?";$("#confirmText").textContent="Der Kommentar wird dauerhaft gelöscht.";$("#confirmDialog").showModal()}
async function doDelete(){if(pendingDelete?.type==="comment"){try{await api("deleteComment",{type:"feedback",parentId:pendingDelete.parentId,commentId:pendingDelete.commentId});$("#confirmDialog").close();pendingDelete=null;await refresh();toast("Gelöscht")}catch(_){toast("Löschen fehlgeschlagen")}}else await confirmDelete()}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active")});
$("#newFeedback").onclick=()=>openEditor("feedback");$("#newInfo").onclick=()=>openEditor("infos");$("#newPoll").onclick=()=>openEditor("polls");$("#editorForm").addEventListener("submit",save);$("#confirmDelete").onclick=doDelete;
refresh();
