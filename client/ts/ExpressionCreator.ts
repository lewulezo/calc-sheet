import Expression from './Expression';
import Operator from './Operator';
import SheetConfigure from './SheetConfigure';

export class ExpressionCreator{
  private _config:SheetConfigure; 

  constructor(config:SheetConfigure){
    this._config = config;
  }

  get config():SheetConfigure{
    return this._config;
  }

  
  public createSimpleExpression():Expression{
    let config = this.config;
    let max = config.max;
    let min = config.min;
    let multipleDigitalBit = config.multipleDigitalBit;
    let plusDigitalBit = config.plusDigitalBit;

    let operator = randomOperator(config.operators);
    let left, right;
    switch (operator){
    case Operator.MULTIPLE: 
      left = randomNumber(max, min, multipleDigitalBit);
      right = randomNumber(max, min, multipleDigitalBit);
      break;
    case Operator.MINUS:
      left = randomNumber(max, min, plusDigitalBit);
      right = randomNumber(max, min, plusDigitalBit);
      if (left < right) {
        let t = left;
        left = right;
        right = t;
      }
      break;
    case Operator.PLUS:
      left = randomNumber(max, min, plusDigitalBit);
      right = randomNumber(max, min, plusDigitalBit);
      break;
    }
    return new Expression(left, right, operator);
  }

  public createComplexExpression(degree=0):Expression{
    let config = this.config;
    let max = config.max;
    let min = config.min;
    let multipleDigitalBit = config.multipleDigitalBit;
    let plusDigitalBit = config.plusDigitalBit;
    if (degree == 0){
      return this.createSimpleExpression();
    }

    let left:number|Expression = this.createComplexExpression(degree - 1);
    let operator = randomOperator(config.operators);
    let right:number|Expression;
    switch (operator){
    case Operator.MULTIPLE: 
      right = randomNumber(max, min, multipleDigitalBit);
      break;
    case Operator.MINUS:
      right = randomNumber(max, min, plusDigitalBit);
      if ((<Expression>left).result < right) {
        let t = left;
        left = right;
        right = t;
      }
      break;
    case Operator.PLUS:
      right = randomNumber(max, min, plusDigitalBit);
      break;
    }
    return new Expression(left, right, operator);
  }
}


function randomNumber(max:number, min:number, digitalBit:number):number{
  let number = min + Math.random() * (max - min);
  number = Math.floor(number * Math.pow(10, digitalBit)) / Math.pow(10, digitalBit);
  return number;
}

function randomOperator(operators:Operator[]):Operator{
  let roll = Math.floor(Math.random() * operators.length);
  return operators[roll];
}



export default ExpressionCreator;