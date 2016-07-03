!function(exports){
  var submitted = false;
  var degree = 2;
  var itemCount = 100;
  var max = 1000;
  var min = 20;
  var plusDigitalBit = 2;
  var multipleDigitalBit = 1;
  var operators = ['+', '-', 'x'];
  var startTime;
  var passTimeInterval;
  var timerOutID;
  var timeLimit;

  var expressions = [];
  
  function start(){	
    if (expressions.length){
      if (!confirm('上次结果将被清空，确认吗？')){
        return;
      }
    }
    degree = $('#complex').val();
    itemCount = $('#itemCount').val();
    plusDigitalBit = $('#addBit').val();
    multipleDigitalBit = $('#mulBit').val();
    max = $('#maxNum').val();
    min = $('#minNum').val();
    operators = $('#multipleFlag').prop('checked') ?	['+', '-', 'x'] : ['+', '-'];
    timeLimit = $('#timeLimit').val();
    reset();

    for (var i = 0; i < itemCount; i++){
      expressions.push(createComplexExpression(degree));
    }
    var items = $('#items');
    var trTemplate = $('tr.template');

    for (i = 0; i < itemCount; i++){
      var tr = trTemplate.clone();
      tr.prop('class', '');
      var idTd = $('.itemId', tr);
      var expressionTd = $('.expression', tr);
      var resultTd = $('.result', tr);
      idTd.html('[' + (i + 1) + ']');
      expressionTd.html(expressions[i].toString());
      resultTd.html(expressions[i].calcResult());
      items.append(tr);
    }
    startTime = Date.now();
    $('#startTime').html('开始时间: ' + new Date(startTime).toLocaleTimeString());
    startTimeCount();
    if (timeLimit > 0){
      $('#endTime').html('答题限制时间: ' + getPassTimeString(timeLimit * itemCount * 60));
      startTimer();
    }
  }

  function reset(){
    expressions.splice(0, expressions.length);
    $('#startTime').html('');
    $('#passTime').html('');
    $('#endTime').html('');
    $('#items').html('');
    $('#score').html('');
    $('#toggleResult').prop('disabled', true);
    submitted = false;
    clearTimeout(timerOutID);
    hideResult();
  }
  
  function startTimeCount(){
    passTimeInterval = setInterval(function(){
      var passTime = (Date.now() - startTime) / 1000;
      $('#passTime').html('已用: ' + getPassTimeString(passTime));
    }, 1000);
  }
  
  function startTimer(){
    timerOutID = setTimeout(function(){
      validate();
      alert('时间到！答题结束！');
    }, timeLimit * itemCount * 60000);
  }
  
  function stopTimeCount(){
    clearInterval(passTimeInterval);
    $('#passTime').html('');
  }
  
  function getPassTimeString(time){
    return Math.floor(time/60) + '分' + Math.floor(time % 60) + '秒';
  }
  

  function randomNumber(max, min, digitalBit){
    var number = min + Math.random() * (max - min);
    number = Math.floor(number * Math.pow(10, digitalBit)) / Math.pow(10, digitalBit);
    return number;
  }

  function randomOperator(){

    var roll = Math.floor(Math.random() * operators.length);
    return operators[roll];
  }

  function createSimpleExpression(){
    var operator = randomOperator();
    var left, right;
    switch (operator){
    case 'x': 
      left = randomNumber(max, min, multipleDigitalBit);
      right = randomNumber(max, min, multipleDigitalBit);
      break;
    case '-':
      left = randomNumber(max, min, plusDigitalBit);
      right = randomNumber(max, min, plusDigitalBit);
      if (left < right) {
        var t = left;
        left = right;
        right = t;
      }
      break;
    case '+':
      left = randomNumber(max, min, plusDigitalBit);
      right = randomNumber(max, min, plusDigitalBit);
      break;
    }
    return new Expression(left, right, operator);
  }

  function createComplexExpression(degree){
    degree = degree || 0;
    if (degree == 0){
      return createSimpleExpression();
    }
    var left = createComplexExpression(degree - 1);
    var operator = randomOperator();
    var right;
    switch (operator){
    case 'x': 
      right = randomNumber(max, min, multipleDigitalBit);
      break;
    case '-':
      right = randomNumber(max, min, plusDigitalBit);
      if (left.calcResult() < right) {
        var t = left;
        left = right;
        right = t;
      }
      break;
    case '+':
      right = randomNumber(max, min, plusDigitalBit);
      break;
    }
    return new Expression(left, right, operator);
  }
  
  function showResult(){
    $('.result').each(function(i, result){
      $(result).css('visibility', 'visible');
    });
    $('#toggleResult').html('隐藏答案');
  }

  function hideResult(){
    $('.result').each(function(i, result){
      $(result).css('visibility', 'hidden');
    });
    $('#toggleResult').html('显示答案');
  }
  
  function toggleResult(){
    $('#toggleResult').html() == '显示答案' ? showResult() : hideResult();
  }

  function validate(){
    if (!expressions.length) {
      alert('请先出题！');
      return;
    }
    stopTimeCount();
    clearTimeout(timerOutID);
    var correctCount = 0;
    var items = $('#items tr');
    for (var i = 0; i < itemCount; i++){
      var expression = expressions[i];
      var itemsTr = items[i];
      var answer = $('.answer input', itemsTr).val();
      var correctTd = $('.correct', itemsTr);
      if (answer == expression.calcResult()){
        expression.correct = true;
        correctCount++;
        correctTd.html('正确').css('color', 'inherit');
      } else {
        expression.correct = false;
        correctTd.html('错误').css('color', 'red');
      }
    }
    $('#toggleResult').prop('disabled', false);
    var score = Math.floor(correctCount * 100 / itemCount);
    $('#score').html('你得了' + score + '分');
    var timeCost = Math.floor((Date.now() - startTime) / 1000);
    $('#time').html('总共用时' + getPassTimeString(timeCost));
    if (!submitted){
      postResult({
        score: score,
        startTime: startTime,
        endTime: Date.now(),
        timeCost: timeCost,
        degree: $('#complex').val(),
        itemCount: $('#itemCount').val(),
        plusDigitalBit: $('#addBit').val(),
        multipleDigitalBit: $('#mulBit').val(),
        max: $('#maxNum').val(),
        min: $('#minNum').val(),
        multipleFlag: $('#multipleFlag').prop('checked')
      });
      submitted = true;
    }
  }


  function postResult(sheetData){
    $.post('/', JSON.stringify(sheetData), function(res){
      console.log(res);
    });
  }

  Number.prototype.rate=function(){  
    var oStr = this.toString(); 
    var digitalPos = oStr.indexOf('.');
    return digitalPos == -1 ? 1 : Math.pow(10, parseInt(oStr.length - digitalPos - 1));
  }

 
  exports.start = start;
  exports.validate = validate;
  exports.toggleResult = toggleResult;
}(window);