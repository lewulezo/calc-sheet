import Operator from './Operator';

export class SheetConfiure{
  degree = 2;
  itemCount = 100;
  max = 1000;
  min = 20;
  plusDigitalBit = 2;
  multipleDigitalBit = 1;
  operators = [Operator.PLUS, Operator.MINUS, Operator.MULTIPLE];
  timeLimit = 0;
}

export default SheetConfiure;