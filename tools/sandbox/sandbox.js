/* ================= SANDBOX: local pretend database + test tools + Robo =================
   This copy of Squish Trade Club never talks to Firebase. Everything is kept
   in this browser only (and saved to localStorage so a refresh keeps it).
   It exposes the same window.Squish API the game uses. */
(function(){
  "use strict";
  const KEY = "squish_sandbox_v1";
  const ME = "tester", ROBO = "robo";
  const ITEM_INFO = __ITEM_INFO__;           // id -> {r: rarity, n: name, c: category}
  const VALUE = {common:1, uncommon:2, rare:4, epic:7, legendary:10, scam:0};
  const val = id => VALUE[(ITEM_INFO[id]||{}).r] || 0;
  const offerVal = items => (items||[]).reduce((s,id)=>s+val(id),0);
  const clone = o => o===undefined ? undefined : JSON.parse(JSON.stringify(o));

  function freshStore(){
    const mine = {}, robos = {};
    Object.keys(ITEM_INFO).forEach(id=>{ const scam = ITEM_INFO[id].r==="scam"; mine[id] = scam ? 1 : 3; robos[id] = scam ? 2 : 5; });
    return {
      ["players/"+ME]: {name:"Tester", avatar:"🦊", coins:99999, inventory:mine, createdAt:Date.now(), packsOpened:1, lastPackScam:false},
      ["players/"+ROBO]: {name:"Robo", avatar:"🤖", coins:0, inventory:robos, createdAt:Date.now(), backpack:{color:"galaxy", keychain:"golden_spinner"}},
    };
  }
  let store;
  try{ store = JSON.parse(localStorage.getItem(KEY)) || freshStore(); }catch(e){ store = freshStore(); }
  let saveTimer = null;
  function persist(){ clearTimeout(saveTimer); saveTimer = setTimeout(()=>{ try{ localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){} }, 150); }

  const listeners = {};
  function notify(path){
    persist();
    (listeners[path]||[]).slice().forEach(fn=>setTimeout(()=>fn(),0));
    if(path.startsWith("trades/puzzle-")) setTimeout(()=>robo.onPuzzle(path), 0);
    else if(path.startsWith("trades/race-")) setTimeout(()=>robo.onRace(path), 0);
    else if(path.startsWith("trades/")) setTimeout(()=>robo.onTrade(path), 0);
  }
  const snap = path => ({ exists: store[path]!==undefined, data: ()=>clone(store[path]), id: path.split("/").pop() });
  function flatten(patch){ const out={}; for(const k in patch){ const v=patch[k]; if(v && typeof v==="object" && !Array.isArray(v)){ for(const sub in v) out[k+"."+sub]=v[sub]; } else out[k]=v; } return out; }
  function applyPatch(path, patch){
    const doc = store[path];
    if(!doc) throw new Error("No document at "+path);
    const flat = flatten(patch);
    for(const k in flat){ const parts=k.split("."); let t=doc; for(let i=0;i<parts.length-1;i++){ if(typeof t[parts[i]]!=="object"||t[parts[i]]===null) t[parts[i]]={}; t=t[parts[i]]; } t[parts[parts.length-1]] = clone(flat[k]); }
  }
  const db = {
    authReady: Promise.resolve(ME),
    doc(path){
      return {
        get(){ return Promise.resolve(snap(path)); },
        set(data){ store[path] = clone(data); notify(path); return Promise.resolve(); },
        update(patch){ try{ applyPatch(path, patch); }catch(e){ return Promise.reject(e); } notify(path); return Promise.resolve(); },
        onSnapshot(cb){
          const fn = ()=>cb(snap(path));
          (listeners[path] = listeners[path]||[]).push(fn);
          setTimeout(fn, 0);
          return ()=>{ listeners[path] = (listeners[path]||[]).filter(f=>f!==fn); };
        }
      };
    },
    runTransaction(fn){
      const touched = new Set();
      return Promise.resolve(fn({
        get(path){ return Promise.resolve(snap(path)); },
        set(path, data){ store[path] = clone(data); touched.add(path); },
        update(path, patch){ applyPatch(path, patch); touched.add(path); }
      })).then(r=>{ touched.forEach(notify); return r; });
    }
  };
  window.Squish = db;

  // ---- test controls used by the panel ----
  let forceRolls = 0;
  const realRandom = Math.random;
  Math.random = function(){ if(forceRolls>0){ forceRolls--; return 0.01; } return realRandom(); };
  const tools = {
    addCoins(n){ const p = store["players/"+ME]; db.doc("players/"+ME).update({coins:(p.coins||0)+n}); },
    unlockAll(){ const inv = {}; Object.keys(ITEM_INFO).forEach(id=>{ inv[id] = ITEM_INFO[id].r==="scam" ? 1 : 3; }); db.doc("players/"+ME).update({inventory:inv}); },
    emptyBackpack(){ db.doc("players/"+ME).update({inventory:{}}); },
    forceScam(){ db.doc("players/"+ME).update({packsOpened:Math.max(1, store["players/"+ME].packsOpened||1), lastPackScam:false}); forceRolls = 2; },
    resetLearning(){ const p = store["players/"+ME]; delete p.skills; notify("players/"+ME); },
    resetBackpack(){ const p = store["players/"+ME]; delete p.backpack; notify("players/"+ME); },
    resetAll(){ try{ localStorage.removeItem(KEY); localStorage.removeItem("squishtrade_code"); }catch(e){} location.reload(); },
  };

  // =================== Robo, the practice trade buddy ===================
  // Robo plays by the same rules a kid would: antes or counters with
  // something close in value, answers "Add More" by adding an item, asks
  // for more when your side is too low, and accepts fair deals.
  const memory = {};   // per trade: asks, timers
  const puzMem = {};   // per puzzle table: timers
  const PUZ_TOTAL = {easy:6, medium:12, hard:20};
  const STICKER_IDS = __STICKER_IDS__;
  const roboSide = {playerId:ROBO, name:"Robo", avatar:"🤖", items:[], accepted:null, bpColor:"galaxy", keychain:"golden_spinner"};
  const dealKey = t => JSON.stringify([(t.sideA&&t.sideA.items)||[], (t.sideB&&t.sideB.items)||[]]);
  const roboStock = (t, side)=>{ const inv = Object.assign({}, store["players/"+ROBO].inventory||{}); (t[side].items||[]).forEach(id=>inv[id]--); return inv; };
  function pickToward(target, stock, already){
    // Greedy: biggest items first that keep us at or under ~110% of target.
    const ids = Object.keys(stock).filter(id=>stock[id]>0 && val(id)>0).sort((a,b)=>val(b)-val(a) || realRandom()-.5);
    const picks = []; let sum = already||0;
    for(const id of ids){ let n = stock[id]; while(n>0 && picks.length<5 && sum+val(id) <= target*1.1){ picks.push(id); sum+=val(id); n--; } }
    if(!picks.length){ const small = ids.slice().reverse()[0]; if(small) picks.push(small); }
    return picks;
  }
  const robo = {
    say(text){ panelLog("🤖 "+text); },
    onTrade(path){
      const t = store[path]; if(!t || t.kind==="puzzle" || t.status!=="open") return;
      const side = t.sideA && t.sideA.playerId===ROBO ? "sideA" : t.sideB && t.sideB.playerId===ROBO ? "sideB" : null;
      if(!side || !t.sideB) return;
      const m = memory[path] = memory[path] || {asks:0, timer:null};
      clearTimeout(m.timer);
      m.timer = setTimeout(()=>robo.act(path, side), 1300 + realRandom()*900);
    },
    act(path, side){
      const t = store[path]; if(!t || t.status!=="open") return;
      const other = side==="sideA" ? "sideB" : "sideA";
      const mine = t[side].items||[], theirs = t[other].items||[];
      const m = memory[path];
      const ref = db.doc(path);
      // Ante (Robo hosting)
      if(side==="sideA" && !mine.length){
        const stock = roboStock(t, side);
        const ids = Object.keys(stock).filter(id=>stock[id]>0 && ["uncommon","rare","epic"].includes(ITEM_INFO[id].r));
        const id = ids[Math.floor(realRandom()*ids.length)];
        robo.say("puts down "+ITEM_INFO[id].n+" as the ante (⭐"+val(id)+").");
        return ref.update({sideA:{items:[id]}});
      }
      if(!theirs.length) return; // waiting on the other kid
      // Counter-offer
      if(!mine.length){
        const target = offerVal(theirs);
        const lowball = realRandom() < 0.4;
        const picks = pickToward(lowball ? Math.max(1, Math.floor(target*0.55)) : target, roboStock(t, side));
        robo.say((lowball ? "tries a cheeky low counter: " : "counters with: ")+picks.map(id=>ITEM_INFO[id].n).join(" + ")+" (⭐"+offerVal(picks)+").");
        return ref.update({[side]:{items:picks}});
      }
      // Asked to add more
      if(t.addMoreTo===side){
        const stock = roboStock(t, side);
        const add = Object.keys(stock).filter(id=>stock[id]>0 && val(id)>0).sort((a,b)=>val(a)-val(b))[0];
        if(!add || mine.length>=6){ robo.say("can't add any more, so Robo declines."); return ref.update({status:"declined", declinedBy:"Robo"}); }
        robo.say("adds "+ITEM_INFO[add].n+" (⭐"+val(add)+").");
        return ref.update({[side]:{items:mine.concat([add])}, addMoreTo:null, addMoreValue:null});
      }
      // Evaluate
      const myVal = offerVal(mine), theirVal = offerVal(theirs);
      const key = dealKey(t);
      if(t[side].accepted===key) return; // already accepted this exact deal
      if(theirVal >= myVal*0.8){
        robo.say("thinks ⭐"+theirVal+" for ⭐"+myVal+" is fair and presses ✓ Accept.");
        return ref.update({[side]:{accepted:key}});
      }
      if(t.addMoreTo===other) return; // already asked, waiting
      if(m.asks >= 2 && theirVal < myVal*0.5){ robo.say("says that's way too low and declines ❌."); return ref.update({status:"declined", declinedBy:"Robo"}); }
      m.asks++;
      robo.say("says ⭐"+theirVal+" isn't enough for ⭐"+myVal+" and presses ＋ Add More.");
      return ref.update({addMoreTo:other, addMoreValue:theirVal});
    },
    // ---- puzzles: Robo is a slow, steady puzzle partner ----
    onPuzzle(path){
      const t = store[path]; if(!t || t.kind!=="puzzle") return;
      const key = t.sideA && t.sideA.playerId===ROBO ? "A" : t.sideB && t.sideB.playerId===ROBO ? "B" : null;
      if(!key) return;
      const m = puzMem[path] = puzMem[path] || {timer:null, started:false};
      if(t.status==="lobby" && key==="A" && t.sideB && !m.started){
        m.started = true;
        setTimeout(()=>{ const c = store[path]; if(c && c.status==="lobby") db.doc(path).update({status:"playing", startedAt:Date.now()}); }, 1800);
      }
      if(t.status==="playing" && !m.timer){
        const total = PUZ_TOTAL[t.size] || 12, pace = {easy:3600, medium:3000, hard:2600}[t.size] || 3000;
        m.timer = setInterval(()=>{
          const c = store[path];
          if(!c || c.status!=="playing"){ clearInterval(m.timer); m.timer = null; return; }
          if(c.mode==="coop"){
            const mine = []; for(let i=0;i<total;i++){ if(i%2===(key==="A"?0:1) && !(c.placed||{})[i]) mine.push(i); }
            if(mine.length){ const i = mine[Math.floor(realRandom()*mine.length)]; db.doc(path).update({["placed."+i]: key}); robo.say("placed puzzle piece "+(i+1)+"."); }
            else if(Object.keys(c.placed||{}).length>=total) db.doc(path).update({status:"done", doneAt:Date.now()});
          } else {
            const me = key, n = ((c.progress||{})[me]||0)+1;
            if(n>=total){ db.doc(path).update({["progress."+me]: total, status:"done", winner:me, doneAt:Date.now()}); robo.say("finished the race first!"); clearInterval(m.timer); m.timer = null; }
            else db.doc(path).update({["progress."+me]: n});
          }
        }, pace);
      }
      if(t.status!=="playing" && m.timer){ clearInterval(m.timer); m.timer = null; }
    },
    // ---- racing: Robo joins the table; the game drives Robo's kart itself once no position updates arrive ----
    onRace(path){
      const t = store[path]; if(!t || t.kind!=="race" || t.status!=="lobby") return;
      if(t.sideA && t.sideA.playerId===ROBO && t.sideB && !robo.raceStarted[path]){
        robo.raceStarted[path] = true;
        setTimeout(()=>{ const c = store[path]; if(c && c.status==="lobby") db.doc(path).update({status:"playing", startedAt:Date.now()}); }, 1800);
      }
    },
    raceStarted:{},
    inviteRace(){
      const entry = Object.entries(store).find(([p,t])=>p.startsWith("trades/race-") && t.kind==="race" && t.status==="lobby" && t.sideA && t.sideA.playerId===ME && !t.sideB);
      if(!entry){ panelLog("Create a race table first (Games → Squishy Racers → Create), then invite Robo."); return false; }
      db.doc(entry[0]).update({sideB:{playerId:ROBO, name:"Robo", avatar:"🤖", item:"golden_spinner"}});
      panelLog("🤖 Robo joined race table "+entry[1].code+". Tap Start the race! (Robo's kart is driven by the computer.)");
      return true;
    },
    hostRace(){
      let code; do{ code = String(Math.floor(1000+realRandom()*9000)); }while(store["trades/race-"+code] && ["lobby","playing"].includes(store["trades/race-"+code].status));
      db.doc("trades/race-"+code).set({kind:"race", code, status:"lobby", trackId:"wave", seed:Math.floor(realRandom()*1e9),
        sideA:{playerId:ROBO, name:"Robo", avatar:"🤖", item:"golden_spinner"}, sideB:null, createdAt:Date.now()});
      panelLog("🤖 Robo opened race table "+code+". Games → Squishy Racers → Join a race table, then type "+code+". Robo starts the race.");
      const input = document.getElementById("rcJoinInput"); if(input) input.value = code;
      return code;
    },
    invitePuzzle(){
      const entry = Object.entries(store).find(([p,t])=>p.startsWith("trades/puzzle-") && t.status==="lobby" && t.sideA && t.sideA.playerId===ME && !t.sideB);
      if(!entry){ panelLog("Create a puzzle table first (Games → Puzzles → Create), then invite Robo."); return false; }
      db.doc(entry[0]).update({sideB:{playerId:ROBO, name:"Robo", avatar:"🤖"}});
      panelLog("🤖 Robo joined puzzle table "+entry[1].code+". Tap Start the puzzle!");
      return true;
    },
    hostPuzzle(mode){
      let code; do{ code = String(Math.floor(1000+realRandom()*9000)); }while(store["trades/puzzle-"+code] && ["lobby","playing"].includes(store["trades/puzzle-"+code].status));
      db.doc("trades/puzzle-"+code).set({kind:"puzzle", code, status:"lobby", mode, size:"medium", seed:Math.floor(realRandom()*1e9),
        sideA:{playerId:ROBO, name:"Robo", avatar:"🤖"}, sideB:null, placed:{}, progress:{A:0,B:0}, winner:null, createdAt:Date.now()});
      panelLog("🤖 Robo opened a "+(mode==="coop"?"build-together":"race")+" puzzle table "+code+". Games → Puzzles → Join, then type "+code+".");
      const input = document.getElementById("pzJoinInput"); if(input) input.value = code;
      return code;
    },
    joinMyTable(){
      const entry = Object.entries(store).find(([p,t])=>p.startsWith("trades/") && t.status==="open" && t.sideA && t.sideA.playerId===ME && !t.sideB);
      if(!entry){ panelLog("Create a table on the Trade tab first, then invite Robo."); return; }
      db.doc(entry[0]).update({sideB: clone(roboSide)});
      panelLog("🤖 Robo joined table "+entry[1].code+". Put down your ante!");
    },
    hostTable(){
      let code; do{ code = String(Math.floor(1000+realRandom()*9000)); }while(store["trades/"+code] && store["trades/"+code].status==="open");
      db.doc("trades/"+code).set({code, status:"open", sideA: clone(roboSide), sideB:null, addMoreTo:null, addMoreValue:null, createdAt:Date.now()});
      panelLog("🤖 Robo opened table "+code+". Go to Trade → Join a table and type "+code+".");
      const input = document.getElementById("joinCodeInput"); if(input) input.value = code;
      return code;
    }
  };

  // =================== the 🧪 test panel ===================
  let logLines = [];
  function panelLog(line){ logLines.unshift(line); logLines = logLines.slice(0,6); const l = document.getElementById("sbLog"); if(l) l.innerHTML = logLines.map(x=>"<li>"+x.replace(/</g,"&lt;")+"</li>").join(""); }
  function buildPanel(){
    const fab = document.createElement("button");
    fab.className = "sb-fab"; fab.type = "button"; fab.textContent = "🧪 Test tools"; fab.setAttribute("aria-expanded","false");
    const panel = document.createElement("div");
    panel.className = "sb-panel"; panel.hidden = true;
    panel.innerHTML = '<div class="sb-title">Sandbox test tools<span>Only this browser. The kids\' real game is untouched.</span></div>'
      + '<div class="sb-group"><b>🤖 Practice trade with Robo</b>'
      + '<button type="button" data-a="join">Invite Robo to my table</button>'
      + '<button type="button" data-a="host">Robo hosts a table (Robo antes)</button>'
      + '<small>To go first: Trade tab → Create Trading Table → Invite Robo. To let Robo go first: tap Robo hosts, then join with the code.</small></div>'
      + '<div class="sb-group"><b>🧩 Puzzles with Robo</b>'
      + '<button type="button" data-a="pzinvite">Invite Robo to my puzzle table</button>'
      + '<button type="button" data-a="pzcoop">Robo hosts: build together</button>'
      + '<button type="button" data-a="pzrace">Robo hosts: race</button>'
      + '<button type="button" data-a="stickers">Give me every sticker</button>'
      + '<button type="button" data-a="nostickers">Clear my stickers</button>'
      + '<small>Create a puzzle table under Games → Puzzles, then invite Robo. Or let Robo host and join with the code.</small></div>'
      + '<div class="sb-group"><b>🏎 Racing with Robo</b>'
      + '<button type="button" data-a="rcinvite">Invite Robo to my race table</button>'
      + '<button type="button" data-a="rchost">Robo hosts a race table</button>'
      + '<small>Create a race table under Games → Squishy Racers, then invite Robo. Robo\'s kart is driven by the computer, so this checks the table, lobby and start flow.</small></div>'
      + '<div class="sb-group"><b>🪙 Coins & toys</b>'
      + '<button type="button" data-a="coins">+1,000 coins</button>'
      + '<button type="button" data-a="unlock">Refill every toy (×3)</button>'
      + '<button type="button" data-a="empty">Empty my backpack</button></div>'
      + '<div class="sb-group"><b>🎁 Packs</b><button type="button" data-a="scam">Make my next pack a scam 💩</button></div>'
      + '<div class="sb-group"><b>🔄 Replay first-time screens</b>'
      + '<button type="button" data-a="learn">Reset math & spelling levels</button>'
      + '<button type="button" data-a="bp">Reset backpack color & keychain</button>'
      + '<button type="button" data-a="reset" class="danger">Reset the whole sandbox</button></div>'
      + '<ul class="sb-log" id="sbLog"></ul>';
    panel.addEventListener("click", (e)=>{
      const a = e.target.closest("button[data-a]"); if(!a) return;
      const closePanel = ()=>{ panel.hidden = true; fab.setAttribute("aria-expanded","false"); };
      ({ join:()=>{ robo.joinMyTable(); closePanel(); }, host:()=>{ robo.hostTable(); closePanel(); },
         pzinvite:()=>{ if(robo.invitePuzzle()) closePanel(); }, pzcoop:()=>{ robo.hostPuzzle("coop"); closePanel(); }, pzrace:()=>{ robo.hostPuzzle("race"); closePanel(); },
         rcinvite:()=>{ if(robo.inviteRace()) closePanel(); }, rchost:()=>{ robo.hostRace(); closePanel(); },
         stickers:()=>{ const o = {}; STICKER_IDS.forEach(id=>o[id]=1); store["players/"+ME].stickers = o; notify("players/"+ME); panelLog("Every puzzle sticker added."); },
         nostickers:()=>{ store["players/"+ME].stickers = {}; notify("players/"+ME); panelLog("Stickers cleared."); },
         coins:()=>{ tools.addCoins(1000); panelLog("Added 1,000 coins."); },
         unlock:()=>{ tools.unlockAll(); panelLog("Every toy refilled to ×3 (scams ×1)."); },
         empty:()=>{ tools.emptyBackpack(); panelLog("Backpack emptied."); },
         scam:()=>{ tools.forceScam(); panelLog("Your next pack will be a scam. Go to Packs!"); },
         learn:()=>{ tools.resetLearning(); panelLog("Pop-It Math and Word Builder will ask for a starting level again."); },
         bp:()=>{ tools.resetBackpack(); panelLog("Backpack reset: tap it to pick a color again."); },
         reset:()=>{ if(a.dataset.sure){ tools.resetAll(); } else { a.dataset.sure="1"; a.textContent="Tap again to reset everything"; } },
      })[a.dataset.a]();
    });
    fab.addEventListener("click", ()=>{ panel.hidden = !panel.hidden; fab.setAttribute("aria-expanded", String(!panel.hidden)); });
    document.body.appendChild(fab); document.body.appendChild(panel);
    panelLog("Sandbox ready: 99,999 coins and every toy unlocked.");
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", buildPanel); else buildPanel();
  // Open trades left over from a previous visit would otherwise sit forever.
  Object.keys(store).forEach(p=>{ if(p.startsWith("trades/") && store[p].status==="open" && (store[p].sideA||{}).playerId===ROBO && !store[p].sideB) delete store[p]; });
})();
