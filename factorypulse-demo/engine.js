(function(root){
'use strict';
const SPECS=[
 {id:'temperature',label:'Antrieb',sensor:'T-01',unit:'°C',protocol:'CAN / CANopen',baseline:54,scale:2,warn:72,limit:85},
 {id:'vibration',label:'Lagervibration',sensor:'V-02',unit:'mm/s',protocol:'CAN / CANopen',baseline:1.8,scale:.3,warn:4.5},
 {id:'pressure',label:'Sprühdruck',sensor:'P-03',unit:'bar',protocol:'Modbus TCP',baseline:3.2,scale:.18,warn:3.7,low:2.7},
 {id:'fill',label:'Farbfüllstand',sensor:'L-04',unit:'%',protocol:'IoT / REST',baseline:82,scale:10,low:15},
 {id:'current',label:'Motorstrom',sensor:'I-05',unit:'A',protocol:'OPC UA',baseline:8.2,scale:.7,warn:12},
 {id:'flow',label:'Farbdurchfluss',sensor:'F-06',unit:'ml/min',protocol:'Modbus TCP',baseline:250,scale:18,low:200}
];
const SCENARIOS={normal:'Normalbetrieb',wear:'Schleichender Lagertrend',nozzle:'Sprühprozess verändert sich',dropout:'Sensorqualität unklar'};
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
function slope(points,key){const data=points.filter(p=>Number.isFinite(p.values[key]));if(data.length<8)return null;const mx=mean(data.map(p=>p.t)),my=mean(data.map(p=>p.values[key]));const den=data.reduce((s,p)=>s+(p.t-mx)**2,0);return den?data.reduce((s,p)=>s+(p.t-mx)*(p.values[key]-my),0)/den:null;}
function correlation(points,a,b){const data=points.filter(p=>Number.isFinite(p.values[a])&&Number.isFinite(p.values[b]));if(data.length<12)return null;const ma=mean(data.map(p=>p.values[a])),mb=mean(data.map(p=>p.values[b]));const cov=data.reduce((s,p)=>s+(p.values[a]-ma)*(p.values[b]-mb),0);const den=Math.sqrt(data.reduce((s,p)=>s+(p.values[a]-ma)**2,0)*data.reduce((s,p)=>s+(p.values[b]-mb)**2,0));return den>1e-9?cov/den:null;}
class Engine{
 constructor(){this.reset('normal');}
 reset(scenario='normal'){if(!SCENARIOS[scenario])throw Error('Unbekanntes Szenario');this.scenario=scenario;this.t=0;this.history=[];this.received=0;this.valid=0;this.invalid=0;this.bytes=0;this.revision=0;this.halted=false;this.events=[];this.plan=[];this.last=null;this._tick(0);}
 _tick(t){
  const noise=(k,a)=>a*(Math.sin(t*(.31+k*.047)+k)*.7+Math.cos(t*(.13+k*.021)+k*2)*.3);
  const values={temperature:54+noise(1,.65),vibration:1.8+noise(2,.10),pressure:3.2+noise(3,.055),fill:Math.max(3,82-t*.006),current:8.2+noise(4,.19),flow:250+noise(5,3.6)};
  if(this.scenario==='wear'){values.temperature+=t*.13;values.vibration+=t*.023;values.current+=t*.012;}
  if(this.scenario==='nozzle'){values.pressure+=Math.min(1.6,t*.012);values.flow=Math.max(110,values.flow-t*.65);values.current+=Math.min(1,t*.002);}
  if(this.scenario==='dropout'&&t>=12){values.vibration=null;values.temperature+=Math.min(5,(t-12)*.08);}
  const packet={schemaVersion:1,assetId:'R-07',topic:'plant/01/cell/07/telemetry',sequence:t,t,observedAt:new Date(Date.UTC(2026,9,21,6,0,t)).toISOString(),recipe:'DOOR-OCEAN-TEAL',phase:'coating',source:this.scenario,values,quality:Object.fromEntries(SPECS.map(s=>[s.id,Number.isFinite(values[s.id])?'good':'missing']))};
  this.received+=6;this.valid+=Object.values(values).filter(Number.isFinite).length;this.invalid+=Object.values(values).filter(v=>!Number.isFinite(v)).length;this.bytes+=JSON.stringify(packet).length;this.history.push(packet);if(this.history.length>3600)this.history.shift();this.last=packet;
  if(values.temperature>=85)this.halted=true;
 }
 step(){if(this.halted)return false;this.t++;this._tick(this.t);return true;}
 readings(){return SPECS.map(s=>{const v=this.last.values[s.id];let status='ok';if(!Number.isFinite(v))status='missing';else if((s.warn!==undefined&&v>=s.warn)||(s.low!==undefined&&v<s.low))status='warning';return {...s,value:v,status};});}
 analyze(){
  const values=this.last.values;const recent=this.history.slice(-30);const validNow=Object.values(values).filter(Number.isFinite).length;
  const z=Math.max(...['temperature','vibration','pressure','current','flow'].map(id=>{const s=SPECS.find(s=>s.id===id);return Number.isFinite(values[id])?Math.abs(values[id]-s.baseline)/s.scale:0;}));
  const score=Math.round(Math.min(100,z/8*100));
  const tempSlope=slope(recent,'temperature'),vibSlope=slope(recent,'vibration'),pressureSlope=slope(recent,'pressure'),flowSlope=slope(recent,'flow');
  const corr=correlation(recent,'temperature','vibration');const processCorr=correlation(recent,'pressure','flow');
  let kind='normal',title='Stabil im Referenzbereich',description='Die verfügbaren Messwerte passen zur fiktiven Referenz für diesen Lackierprozess. Weiter beobachten.',evidence='Keine auffällige gemeinsame Veränderung erkannt.',action='Weiter beobachten',certainty='Referenzvergleich verfügbar',route='monitor';
  if(this.t<8){kind='learning';title='Beobachtungsfenster aufbauen';description='Für eine Trendaussage werden mindestens acht Messpunkte benötigt. Momentwerte sind bereits sichtbar.';certainty='Trendaussage noch nicht belastbar';}
  if(tempSlope!==null&&vibSlope!==null&&tempSlope>.07&&vibSlope>.012&&z>1.8){kind='wear';title='Antrieb und Lager verändern sich';description='Temperatur und Vibration steigen gemeinsam. Ein mechanisches Problem ist eine mögliche Ursache; Last, Schmierung und Sensorbefestigung müssen geprüft werden.';evidence=`Δ Temperatur +${(tempSlope*60).toFixed(1)} °C/Sim.-min · Δ Vibration +${(vibSlope*60).toFixed(2)} mm/s/Sim.-min.`;action='Lager / Schmierung / Lastprofil prüfen';certainty='Trend belegt · Ursache unbestätigt';route='inspection';}
  if(pressureSlope!==null&&flowSlope!==null&&pressureSlope>.006&&flowSlope<-.3&&z>1.7){kind='nozzle';title='Sprühprozess verliert Durchfluss';description='Der Druck steigt, während der Farbdurchfluss sinkt. Mögliche Ursachen sind Düse, Filter oder veränderte Viskosität. Das ist noch keine bestätigte Diagnose.';evidence=`Δ Druck +${(pressureSlope*60).toFixed(2)} bar/Sim.-min · Δ Durchfluss ${(flowSlope*60).toFixed(0)} ml/min/Sim.-min.`;action='Düse, Filter und Viskosität prüfen';certainty='Gegenläufiger Trend · Ursache unbestätigt';route='inspection';}
  const warnings=this.readings().filter(s=>s.status==='warning');
  if(!['wear','nozzle'].includes(kind)&&warnings.length){kind='threshold';title='Fiktive Prüfgrenze überschritten';description='Mindestens ein Messwert liegt außerhalb der hinterlegten Demo-Prüfgrenze. Auch ein zeitlich stabiler, aber unzulässiger Wert bleibt prüfpflichtig.';evidence=warnings.map(s=>`${s.sensor}: ${s.value.toFixed(2)} ${s.unit}`).join(' · ');action='Messwert und Prüfgrenze fachlich bewerten';certainty='Grenzabweichung belegt · Ursache offen';route='inspection';}
  if(validNow<6){kind='uncertain';title='Datenlücke statt sicherer Diagnose';description='V-02 liefert keine gültige Lagervibration. Ohne diesen Messkanal ist eine Lagerbewertung unvollständig. Fehlende Werte werden nicht als null oder normal interpretiert.';evidence='V-02: missing · Datenqualität eingeschränkt · Trendprognose gesperrt.';action='Sensor, Verkabelung und Mapping prüfen';certainty='Unzureichende Daten · Mensch erforderlich';route='sensor';}
  if(this.halted){kind='limit';title='Demo-Grenze erreicht · Simulation hält';description='Die fiktive Temperaturgrenze von 85 °C ist erreicht. Der Demonstrator pausiert unabhängig von der Anomaliebewertung. Reale Schutzfunktionen liegen ausschließlich in der Anlagensteuerung.';evidence='Temperatur ≥ 85 °C · keine automatische reale Anlagenaktion.';action='Grenzwertüberschreitung fachlich bewerten';certainty='Grenzwertbefund · Ursache offen';route='urgent';}
  let forecast=null;
  if(kind==='wear'&&tempSlope>0&&Number.isFinite(values.temperature)&&values.temperature<72){const seconds=(72-values.temperature)/tempSlope;if(seconds>0&&seconds<3600)forecast={threshold:72,seconds,method:'Lineare Trendfortschreibung bis zur fiktiven Temperatur-Warnschwelle; keine Ausfallzeit.'};}
  if(kind==='nozzle'&&flowSlope<0&&values.flow>200){const seconds=(200-values.flow)/flowSlope;if(seconds>0&&seconds<3600)forecast={threshold:200,seconds,method:'Lineare Trendfortschreibung bis zur fiktiven Durchfluss-Prüfgrenze; keine Ausfallzeit.'};}
  return {kind,title,description,evidence,action,certainty,route,score,validNow,tempSlope,vibSlope,pressureSlope,flowSlope,corr,processCorr,forecast,revision:this.revision,remainingHours:Math.max(0,18-this.t/3600),qualityPercent:this.valid/this.received*100};
 }
 decide(choice,comment,checked){
  if(!checked)throw Error('Fachliche Prüfung muss bestätigt werden.');
  if(typeof comment!=='string'||comment.trim().length<8)throw Error('Bitte eine nachvollziehbare Begründung mit mindestens acht Zeichen eintragen.');
  if(!['approve','inspect','dismiss'].includes(choice))throw Error('Ungültige Entscheidung.');
  const a=this.analyze();if(['normal','learning'].includes(a.kind))throw Error('Es liegt kein freigabepflichtiger Befund vor.');
  if(a.kind==='uncertain'&&choice==='approve')throw Error('Bei fehlenden Daten zuerst eine Sensorprüfung beauftragen.');
  if(a.kind==='limit'&&choice==='dismiss')throw Error('Eine Grenzwertüberschreitung kann hier nicht als unauffällig verworfen werden.');
  const event={at:new Date().toISOString(),simulationSecond:this.t,scenario:this.scenario,choice,comment:comment.trim(),finding:a.title,values:{...this.last.values},humanReview:true};this.events.push(event);
  if(choice==='approve'||choice==='inspect'){const id='WO-'+String(this.plan.length+1).padStart(3,'0');this.plan.push({id,action:choice==='inspect'?'Messung und Befund vor Ort prüfen':a.action,trigger:a.title,priority:a.kind==='limit'?'Sofort bewerten':'Nächstes freigegebenes Wartungsfenster',status:'Menschlich freigegeben · offen',createdAt:event.at});}
  this.revision++;return event;
 }
 export(){return {schemaVersion:1,simulation:true,trainedAI:false,scenario:this.scenario,simulationSecond:this.t,received:this.received,valid:this.valid,invalid:this.invalid,retainedPackets:this.history.length,retentionLimit:3600,specification:'Fiktive Demo-Grenzwerte; keine OEM-Freigabe',analysis:this.analyze(),packets:this.history,decisions:this.events,maintenancePlan:this.plan};}
}
root.FactoryEngine={Engine,SPECS,SCENARIOS,slope,correlation};
})(typeof window!=='undefined'?window:globalThis);
