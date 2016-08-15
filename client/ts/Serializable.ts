
abstract class Serializable {
  static fieldsSerializableDefinitions = {}; 
  
  static set unserializableFields(fields:string[]){
    if (!fields){return;}
    fields.forEach(field=>Serializable.fieldsSerializableDefinitions[field] = false);
  }

  static set serializableFields(fields:string[]){
    if (!fields){return;}
    fields.forEach(field=>Serializable.fieldsSerializableDefinitions[field] = true);
  }

  serialize():string{
    let serialPool = new Map<Serializable, string>();
    let objMap = new Map<string, Object>();
    buildSerialObjectPool(this, serialPool, objMap);
    let outputObj = {};
    objMap.forEach((obj:Object, id:string)=>{
      outputObj[id] = obj;
    });
    return JSON.stringify(outputObj);
  }


  deserialize(str:string){
    
  }

}

function buildSerialObjectPool(object:Serializable, idMap = new Map<Serializable, string>(), objMap = new Map<string, Object>()):string{
  let objId = genId(objMap);
  idMap.set(object, objId);
  let serialObj = {};
  Object.keys(object).forEach(field=>{
    if (!isFieldSerializable(object, field)){
      return;
    }
    let value = object[field];
    if (value instanceof Serializable){
      if (idMap.has(value)){
        serialObj[field] = {refId: idMap.get(value)};
      } else {
        serialObj[field] = {refId: buildSerialObjectPool(<Serializable>value, idMap, objMap)};
      }
    } else {
      serialObj[field] = value;
    }
  })
  objMap.set(objId, serialObj);
  return objId;
}


function isFieldSerializable(object:Serializable, field:string):boolean{
  let value = object[field];
  if (value === null || value === undefined){
    return false;
  }
  if (Serializable.fieldsSerializableDefinitions[field] === false){
    return false;
  }
  if (typeof value === 'function' ){
    return false;
  }
  if (typeof value === 'object' && !(value instanceof Serializable)){
    return false;
  }
  return true;
}

// function uuid() {
//     var s = [];
//     var hexDigits = "0123456789abcdef";
//     for (var i = 0; i < 36; i++) {
//         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//     }
//     s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
//     s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
//     s[8] = s[13] = s[18] = s[23] = "-";
 
//     var uuid = s.join("");
//     return uuid;
// }
function uuid():string{
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 5; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  var uuid = s.join("");
  return uuid;
}

function genId(map:Map<string, Object>) {
  let id:string;
  while(!id || map.has(id)){
    id = uuid();
  }
  return id;
}


function test(){
  class A extends Serializable{
    b:B;
    constructor(public a1:number, public a2: string, public a3:Object, public a4:number[], public a5:boolean){
      super();
    }
  }

  class B extends Serializable{
    b2:B;
    constructor(public b1:A){
      super();
    }
  }
  let a = new A(3, 'aa', {t:5}, [1,4], false);
  let b = new B(a);
  b.b2 = b;
  a.b = b;
  console.log(a.serialize());
}
test();