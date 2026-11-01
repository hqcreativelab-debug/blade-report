// Dependency-free syntax, render and workflow smoke tests for the public demo.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const store = new Map();
const elements = new Map();
const events = {};
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    id, innerHTML:"", textContent:"", value:"",
    classList:{ add(){}, remove(){}, toggle(){} },
    replaceChildren(){ this.innerHTML=""; }
  });
  return elements.get(id);
}
const document = {
  addEventListener:(event, handler)=>{ events[event]=handler; },
  getElementById:element,
  querySelector:()=>null,
  createElement:()=>({ click(){}, set href(x){}, set download(x){} })
};
class DummyFormData {
  constructor(form) { this.values=form.data; }
  get(key) { return this.values[key] ?? null; }
}
const ctx = vm.createContext({
  window:{ addEventListener(){}, scrollTo(){} },
  document,
  localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
  location:{hash:"#dashboard"},
  FormData:DummyFormData,
  console,
  confirm:()=>true,
  setTimeout:()=>{}
});
for (const f of ["app.js","features.js"]) {
  const code=fs.readFileSync(f,"utf8");
  new vm.Script(code,{filename:f}).runInContext(ctx);
}
const b=ctx.window.BR;
assert.equal(b.state().schema,2);
assert.ok(b.state().repairs.length>0);
assert.equal(Object.keys(b.views).length,17);
for(const [name,view] of Object.entries(b.views)){
  const html=view();
  assert.ok(typeof html==="string"&&html.length>500, name+" did not render");
}
events.DOMContentLoaded();
assert.match(element("app").innerHTML,/Operations overview/);
const oldTasks=b.state().tasks.length,oldRequests=b.state().requests.length;
function submit(name,data){
  const form={dataset:{form:name},data};
  events.submit({target:{closest:()=>form},preventDefault(){}});
}
submit("request",{type:"Material",item:"Demo glass fabric",qty:"4",unit:"m²",site:"Hajsberget",notes:"For demo repair"});
assert.equal(b.state().requests.length,oldRequests+1,"request created");
assert.equal(b.state().tasks.length,oldTasks+1,"request generated task");
const id=b.state().repairs[0].id,stages=b.state().repairs[0].stages.length;
submit("stage",{repairId:id,name:"Lamination",hours:"3.5",glass:"5",plies:"4",core:"0.4",resin:"2",qc:"Pending",notes:"Local example"});
assert.equal(b.state().repairs[0].stages.length,stages+1);
assert.equal(b.state().repairs[0].stages.at(-1).plies,4);
const n=b.state().downtime.length;
submit("downtime",{site:"Hajsberget",repair:id,reason:"Equipment failure",people:"2",note:"Test"});
assert.equal(b.state().downtime.length,n+1);
b.act("finish-down",b.state().downtime[0].id);
assert.ok(b.state().downtime[0].end);
const vehTasks=b.state().tasks.length;
submit("vehicle-issue",{vehicle:"VEH-014",severity:"Potentially unsafe",description:"Tyre damage"});
assert.equal(b.state().tasks.length,vehTasks+1);
assert.equal(b.state().fleet[0].status,"Potentially unsafe");
assert.ok(store.size,"demo state persisted");
console.log("PASS: 17 modules render; request->task; stage plies; downtime; fleet issue->task; local persistence");
