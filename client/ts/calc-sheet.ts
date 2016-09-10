import * as $ from 'jquery';
import SheetConfigure from './SheetConfigure';
import Sheet from './Sheet';
import Operator from './Operator';
import {EVENT_START, EVENT_SUBMITTED, EVENT_TIMEOUT, EVENT_TIMEPASS} from './Sheet';


let sheet: Sheet;

function start(){	
  if (sheet){
    if (!confirm('上次结果将被清空，确认吗？')){
      return;
    } else {
      sheet.finalize();
    }
  }
  let config = new SheetConfigure();
  config.degree = $('#complex').val();
  config.itemCount = $('#itemCount').val();
  config.plusDigitalBit = $('#addBit').val();
  config.multipleDigitalBit = $('#mulBit').val();
  config.max = $('#maxNum').val();
  config.min = $('#minNum').val();
  config.operators = [Operator.PLUS, Operator.MINUS];
  if ($('#multipleFlag').prop('checked')){
    config.operators.push(Operator.MULTIPLE);
  }
  config.timeLimit = $('#timeLimit').val();
  sheet = new Sheet(config);
  sheet.on(EVENT_START, ()=>{
    resetForm();
    renderExpressions();
    renderTime();
  });
  sheet.on(EVENT_TIMEOUT, ()=>{
    alert('时间到！答题结束！');
    postResult();
  });
  sheet.on(EVENT_TIMEPASS, (event, passTime:number)=>{
    $('#passTime').html('已用: ' + passTime);
  });
  sheet.on(EVENT_SUBMITTED, ()=>{
    showValidationResult();
  });
  sheet.start();
}

function resetForm(){
  $('#startTime').html('');
  $('#passTime').html('');
  $('#endTime').html('');
  $('#items').html('');
  $('#score').html('');
  $('#toggleResult').prop('disabled', true);
  hideResult();
}

function renderExpressions(){
  let config = sheet.config;
  let expressions = sheet.expressions;

  let items = $('#items');
  let trTemplate = $('tr.template');

  for (let i = 0; i < config.itemCount; i++){
    let tr = trTemplate.clone();
    tr.prop('class', '');
    let idTd = $('.itemId', tr);
    let expressionTd = $('.expression', tr);
    let resultTd = $('.result', tr);
    idTd.html('[' + (i + 1) + ']');
    expressionTd.html(expressions[i].toString());
    resultTd.html(String(expressions[i].result));
    items.append(tr);
  }
}

function renderTime(){
  let config = sheet.config;
  $('#startTime').html('开始时间: ' + sheet.startTimeString);
  if (config.timeLimit > 0){
    $('#endTime').html('答题限制时间: ' + sheet.timeLimitString);
  }
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

function postResult():void{
  let expressions = sheet.expressions;
  if (!expressions.length) {
    alert('请先出题！');
    return;
  }
  let answers:number[] = [];
  $('#items').find('tr').each((i, elem) => answers.push($('.answer input', elem).val()));
  sheet.submit(answers);
}

function showValidationResult(){
  let config = sheet.config;
  let expressions = sheet.expressions;
  $('#items').find('tr').each((i, elem) => {
    let correctTd = $('.correct', elem);
    let expression = expressions[i];
    if (expression.correct){
      correctTd.html('正确').css('color', 'inherit');
    } else {
      correctTd.html('错误').css('color', 'red');
    }
  });
  $('#toggleResult').prop('disabled', false);
  $('#score').html('你得了' + sheet.score + '分');
  let timeCost = sheet.passedTimeString;//Math.floor((Date.now() - sheet.startTimeValue) / 1000);
  $('#time').html('总共用时' + timeCost);  
}

window['calcSheet'] = {
  start: start,
  toggleResult: toggleResult,
  postResult: postResult
};