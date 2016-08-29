import Serializer from '../Serializer';

function test(){
  class A extends Serializable{
    b:B;
    constructor(public a1:number, public a2: string, public a3:Object, public a4:number[], public a5:boolean, public a6:B[], public a7:any[]){
      super();
    }
    // serialize():string{
    //   return JSON.stringify({a1: this.a1});
    // }
    // deserialize(str:string):void{
    //   this.a1 = JSON.parse(str).a1;
    // }
  }
  Serializer.register('A', A, ['a2']);

  class B extends Serializable{
    b2:B;
    constructor(public b1:A){
      super();
    }
    test(){
      console.log('test passed...');
    }
  }
  Serializer.register('B', B);


  let a = new A(3, 'aa', {t:5, u:{cc:1}}, [1,4], false, [], []);
  let b = new B(a);
  b.b2 = b;
  a.b = b;

  a.a6 = [b,b];
  a.a7 = [1,'a',a];
  a.a3['u']['dd'] = a.a6;
  let ser = new Serializer();
  let strA = ser.serialize(a);
  let strB = ser.serialize(b);
  console.log('---------a----------' + strA);
  console.log('---------b----------' + strB);
  let a1:A = <A>ser.deserialize(strA);
  let b1:B = <B>ser.deserialize(strB);
  console.log(a1 instanceof A);
  console.log(b1 instanceof B);
  // a1.a6[1].test();
  console.log(a1);
  console.log(b1);
  // console.log(a1.a3['u']['dd'] == a1.a6)
  
}
test();
