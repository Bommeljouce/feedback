const SHEET_NAME = "Daten";

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ok:true, message:"Projektboard API läuft"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    const sh = getSheet_();
    let db = loadDb_(sh);
    const type = p.type;

    if (p.action === "load") return out_(db);

    if (p.action === "create") {
      db[type].unshift(p.item);
    } else if (p.action === "update") {
      const i = db[type].findIndex(x => x.id === p.item.id);
      if (i >= 0) db[type][i] = p.item;
    } else if (p.action === "delete") {
      db[type] = db[type].filter(x => x.id !== p.id);
    } else if (p.action === "vote") {
      const x = db[type].find(x => x.id === p.id);
      if (x) {
        x.votes = x.votes || {};
        x.votes[p.vote] = (x.votes[p.vote] || 0) + 1;
      }
    } else if (p.action === "comment") {
      const x = db[type].find(x => x.id === p.id);
      if (x) (x.comments || (x.comments=[])).push(p.comment);
    } else if (p.action === "commentVote") {
      const x = db[type].find(x => x.id === p.parentId);
      const c = findComment_(x && x.comments, p.commentId);
      if (c) {
        c.votes = c.votes || {};
        c.votes[p.vote] = (c.votes[p.vote] || 0) + 1;
      }
    } else if (p.action === "deleteComment") {
      const x = db[type].find(x => x.id === p.parentId);
      if (x) x.comments = removeComment_(x.comments || [], p.commentId);
    } else if (p.action === "pollVote") {
      const x = db[type].find(x => x.id === p.id);
      if (x) {
        x.results = x.results || {};
        (p.choices || []).forEach(i => x.results[i] = (x.results[i] || 0) + 1);
      }
    }

    saveDb_(sh, db);
    return out_(db);
  } catch (err) {
    return out_({error:String(err)});
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange("A1").setValue("JSON");
  }
  return sh;
}
function loadDb_(sh) {
  const v = sh.getRange("A2").getValue();
  if (!v) return {feedback:[], infos:[], polls:[]};
  return JSON.parse(v);
}
function saveDb_(sh, db) {
  sh.getRange("A2").setValue(JSON.stringify(db));
}
function findComment_(cs,id) {
  for (const c of (cs || [])) {
    if (c.id === id) return c;
    const x = findComment_(c.replies,id);
    if (x) return x;
  }
  return null;
}
function removeComment_(cs,id) {
  return (cs || []).filter(c => c.id !== id).map(c => ({...c, replies:removeComment_(c.replies,id)}));
}
function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
