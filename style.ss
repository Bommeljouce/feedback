*{box-sizing:border-box}
:root{color-scheme:dark}
body{margin:0;background:#08090d;color:#f3f5f8;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
.topbar{padding:24px 18px 14px;background:#0b0d12;border-bottom:1px solid #20242d}
.topbar h1{margin:0;font-size:24px;letter-spacing:-.4px}
.topbar p{margin:4px 0 0;color:#858b98;font-size:14px}
.tabs{position:sticky;top:0;z-index:5;display:flex;background:#0b0d12;border-bottom:1px solid #20242d;overflow:auto}
.tab{flex:1;min-width:120px;border:0;background:transparent;padding:15px 10px;font-weight:700;color:#747b88;cursor:pointer;transition:.2s}
.tab.active{color:#fff;border-bottom:2px solid #00f0ff;text-shadow:0 0 12px #00f0ff66}
main{max-width:900px;margin:0 auto;padding:20px 14px 60px}
.panel{display:none}.panel.active{display:block}
.section-head{display:flex;gap:14px;justify-content:space-between;align-items:center;margin-bottom:16px}
.section-head h2{margin:0 0 4px;font-size:20px}.section-head p{margin:0;color:#858b98;font-size:13px}
.stack{display:grid;gap:14px}
.card{position:relative;background:#0e1118;border:1px solid #242a35;border-radius:20px;padding:17px;box-shadow:0 8px 30px #0008}
.card:focus-within{border-color:#333b48}
.card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.card h3{margin:0;font-size:17px;letter-spacing:-.2px}
.meta{font-size:12px;color:#777f8d;margin-top:5px}
.body{white-space:pre-wrap;line-height:1.55;margin:12px 0 0;color:#dfe3e9}
.primary,.secondary,.danger{border-radius:999px;padding:10px 15px;font-weight:750;cursor:pointer;transition:.18s}
.primary{background:#0b0e13;color:#fff;border:1px solid #00f0ff;box-shadow:0 0 8px #00f0ff55, inset 0 0 10px #00f0ff0d}
.primary:hover{box-shadow:0 0 16px #00f0ff88}
.secondary{background:#10141b;color:#dfe3e9;border:1px solid #9b5cff;box-shadow:0 0 7px #9b5cff44}
.secondary:hover{box-shadow:0 0 14px #9b5cff77}
.danger{background:#120b10;color:#fff;border:1px solid #ff3b81;box-shadow:0 0 7px #ff3b8150}
.icon-btn{width:28px;height:28px;padding:0;border:1px solid transparent;border-radius:999px;background:transparent;color:#737b88;font-size:17px;line-height:26px;cursor:pointer}
.icon-btn:hover{color:#fff;border-color:#ff3b81;box-shadow:0 0 9px #ff3b8155}
.mini-actions{display:flex;gap:2px;margin-left:auto}
.vote-row,.comment-actions,.poll-options{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}
.vote,.comment-action,.quote-btn{border:1px solid #303642;background:#11151d;color:#d9dde4;border-radius:999px;padding:7px 11px;font-size:13px;cursor:pointer}
.vote:hover,.comment-action:hover,.quote-btn:hover{border-color:#00f0ff;box-shadow:0 0 8px #00f0ff44}
.vote.active{border-color:#00f0ff;box-shadow:0 0 10px #00f0ff44}
.comments{margin-top:16px;border-top:1px solid #242a33;padding-top:12px}
.comment{margin-top:9px;margin-left:0;padding:12px;background:#0a0d12;border:1px solid #20252e;border-radius:14px}
.comment.reply{margin-left:24px;border-left:2px solid #9b5cff}
.comment-text{white-space:pre-wrap;line-height:1.45;color:#dfe3e9}
.quoted{font-size:12px;color:#858c99;border-left:3px solid #9b5cff;padding-left:9px;margin-bottom:8px}
.comment-form{display:flex;gap:8px;margin-top:10px}
.comment-form input{flex:1}
.empty{padding:38px 15px;text-align:center;color:#777f8d;background:#0e1118;border:1px dashed #303642;border-radius:18px}
dialog{border:1px solid #303642;border-radius:22px;width:min(560px,calc(100% - 24px));padding:0;background:#0e1118;color:#f3f5f8;box-shadow:0 20px 70px #000d}
dialog::backdrop{background:#000b}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:18px;border-bottom:1px solid #242a33}
.modal-head h3{margin:0}.modal-actions{display:flex;justify-content:flex-end;gap:8px;padding:15px 18px;border-top:1px solid #242a33}
.fields{padding:18px}.field{margin-bottom:14px}.field label{display:block;font-weight:700;font-size:13px;margin-bottom:6px}
.field input,.field textarea,.field select{width:100%;font:inherit;color:#f3f5f8;border:1px solid #303642;border-radius:12px;padding:11px;background:#090c11;outline:none}
.field input:focus,.field textarea:focus,.field select:focus{border-color:#00f0ff;box-shadow:0 0 10px #00f0ff33}
.field textarea{min-height:120px;resize:vertical}
.choice-line{display:flex;gap:7px;margin:7px 0}.choice-line input{flex:1}
.poll-option{padding:11px;border:1px solid #2b313c;border-radius:13px;margin:7px 0;background:#0a0d12;cursor:pointer}
.poll-option:hover{border-color:#00f0ff55}
.poll-option input{margin-right:8px}.resultbar{height:6px;background:#1c212b;border-radius:99px;overflow:hidden;margin-top:7px}.resultbar i{display:block;height:100%;background:#00f0ff;box-shadow:0 0 9px #00f0ff}
.toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);background:#11151d;color:#fff;padding:10px 14px;border:1px solid #00f0ff;border-radius:999px;box-shadow:0 0 16px #00f0ff55;opacity:0;pointer-events:none;transition:.2s;z-index:20}
.toast.show{opacity:1;transform:translate(-50%,0)}
@media(max-width:560px){main{padding:15px 10px 45px}.section-head{align-items:flex-start}.section-head p{max-width:230px}.primary{white-space:nowrap}.card{padding:14px}.reply{margin-left:15px!important}.comment-form input{min-width:0}}
