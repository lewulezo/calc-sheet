!function(exports){
  function Expression(left, right, operator){
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  Expression.prototype.toString = function(){
    var left = this.left.toString();
    var right = this.right.toString();
    if (this.operator == 'x'){
      if (this.left instanceof Expression && (this.left.operator == '+' || this.left.operator == '-')){
        left = '(' + left + ')';
      }
    }
    if (this.right instanceof Expression && (this.right.operator == '+' || this.right.operator == '-')) {
      right = '(' + right + ')';
    }
    return [left, this.operator, right].join(' ');
  }

  Expression.prototype.calcResult = function(){
    var left = this.left;
    var right = this.right;
    var result;
    if (this.left instanceof Expression){
      left = this.left.calcResult();
    }
    if (this.right instanceof Expression){
      right = this.right.calcResult();
    }
    switch (this.operator){
      case '+': result = add(left, right); break;
      case '-': result = sub(left, right); break;
      case 'x': result = multiple(left, right); break;
    }
    return result;
  }
  
  function multiple(left, right){ 
    var rate = left.rate() * right.rate();
    left *= left.rate();
    right *= right.rate();
    var result = Math.round(left * right);
    return result / rate;
  }

  function add(left, right){
    var rate = Math.max(left.rate(), right.rate());
    var result = Math.round(left * rate + right * rate);
    result /= rate;
    return result;
  }

  function sub(left, right){
    var rate = Math.max(left.rate(), right.rate());
    var result = Math.round(left * rate - right * rate);
    result /= rate;
    return result;
  }
  
  exports.Expression = Expression;
}(window);