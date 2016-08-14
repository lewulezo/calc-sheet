import Operator from './Operator';

export class Expression{
  constructor(public left:number|Expression, public right:number|Expression, public operator:Operator){
  }

  public toString():string{
    let self = this; 
    let left = self.left.toString();
    let right = self.right.toString();
    if (self.operator == Operator.MULTIPLE){
      if (self.left instanceof Expression){
        let leftExpr = <Expression>(self.left);
        if (leftExpr.operator == Operator.PLUS || leftExpr.operator == Operator.MINUS)
          left = '(' + left + ')';
        } 
      }
      if (self.right instanceof Expression){
        let rightExpr = <Expression>(self.right);
        if (rightExpr.operator == Operator.PLUS || rightExpr.operator == Operator.MINUS) {
          right = '(' + right + ')';
        }
      }
      return [left, self.operator.symbo, right].join(' ');
    }

    calcResult():number{
      let self = this;
      let leftNumber:number;
      let rightNumber:number;
      let result;
      if (self.left instanceof Expression){
        leftNumber = (<Expression>(self.left)).calcResult();
      } else {
        leftNumber = <number>(self.left);
      }
      if (self.right instanceof Expression){
        rightNumber = (<Expression>(self.right)).calcResult();
      } else {
        rightNumber = <number>(self.right);
      }
      switch (self.operator){
        case Operator.PLUS: result = add(leftNumber, rightNumber); break;
        case Operator.MINUS: result = sub(leftNumber, rightNumber); break;
        case Operator.MULTIPLE: result = multiple(leftNumber, rightNumber); break;
      }
      return result;
    }
}

function multiple(left:number, right:number):number{ 
  let r = rate(left) * rate(right);
  left *= rate(left);
  right *= rate(right);
  let result = Math.round(left * right);
  return result / r;
}

function add(left:number, right:number):number{
  let r = Math.max(rate(left), rate(right));
  let result = Math.round(left * r + right * r);
  result /= r;
  return result;
}

function sub(left:number, right:number){
  let r = Math.max(rate(left), rate(right));
  let result = Math.round(left * r - right * r);
  result /= r;
  return result;
}

function rate(num:number):number{  
  var oStr = num.toString(); 
  var digitalPos = oStr.indexOf('.');
  return digitalPos == -1 ? 1 : Math.pow(10, oStr.length - digitalPos - 1);
}

export default Expression;