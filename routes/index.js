var express = require('express');
var router = express.Router();
var StoreService = require('../services/FileStorageService').getInstance('sheet');
var mailService = require('../services/MailService').getInstance();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.redirect('/calc-sheet.html');  
});

router.post('/', function(req, res, next){
  var sheetResult = JSON.parse(Object.keys(req.body)[0]);
  StoreService.save(Date.now(), sheetResult);
  sendResult(sheetResult);
  res.send('ok');
});

function sendResult(sheetResult){
  console.log('sendResult...' + sheetResult);
  var output = [];
  output.push('<h3>一次数学测试已经完成。' + '得分： ' + sheetResult.score + '</h3>');
  output.push('<p>开始时间：' + new Date(sheetResult.startTime).toLocaleTimeString() + "</p>");
  output.push('<p>完成时间：' + new Date(sheetResult.endTime).toLocaleTimeString() + "</p>");
  output.push('<p>花费时间：' + Math.floor(sheetResult.timeCost/60) + '分' + (sheetResult.timeCost % 60) + "秒</p>");
  output.push('<h3>试卷难度</h3>');  
  output.push('<p>' + '题目数量：' + sheetResult.itemCount + '</p>');
  output.push('<p>' + '数字个数：' + sheetResult.degree + '</p>');
  output.push('<p>' + '乘法小数点位数：' + sheetResult.plusDigitalBit + '</p>');
  output.push('<p>' + '乘法小数点位数：' + sheetResult.multipleDigitalBit + '</p>');
  output.push('<p>' + '最大数字：' + sheetResult.max + '</p>');
  output.push('<p>' + '最小数字：' + sheetResult.min + '</p>');
  output.push('<p>' + '是否包含乘法：' + (sheetResult.multipleFlag ? '是' : '否') + '</p>');
  console.log(output.join(''));
  mailService.sendMail('一次数学测试已经完成。得分： ' + sheetResult.score, output.join('')).then(info => console.log(info));
}
module.exports = router;  