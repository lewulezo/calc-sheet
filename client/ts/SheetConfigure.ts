import Operator from './Operator';
import { Serializer, Serializable } from './utils';

@Serializable('SheetConfigure')
export class SheetConfigure{
  degree = 2;
  itemCount = 10;
  max = 100;
  min = 20;
  plusDigitalBit = 2;
  multipleDigitalBit = 1;
  operators = [Operator.PLUS, Operator.MINUS, Operator.MULTIPLE];
  timeLimit = 0;

  toJSON():string{
    let serializeObj = {
      degree: this.degree,
      itemCount: this.itemCount,
      max: this.max,
      min: this.min,
      plusDigitalBit: this.plusDigitalBit,
      multipleDigitalBit: this.multipleDigitalBit,
      operators: this.operators.map(oper=>oper.toString()),
      timeLimit: this.timeLimit
    };
    return JSON.stringify(serializeObj);
  }
}
export default SheetConfigure;