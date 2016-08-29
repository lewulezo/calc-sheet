import Serializer from './Serializer';

export class Operator{
  private _symbo:string;
  constructor(symbo:string){
    this._symbo = symbo;
  }

  get symbo():string{
    return this._symbo;
  }

  toString():string{
    return this.symbo;
  }

  static PLUS = new Operator('+');
  static MINUS = new Operator('-');
  static MULTIPLE = new Operator('x');
  static ALL = [Operator.PLUS, Operator.MINUS, Operator.MULTIPLE];
}

Serializer.register('Operator', Operator);
export default Operator;