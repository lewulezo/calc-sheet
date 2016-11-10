import * as $ from 'jquery';
import Expression from './Expression';
import SheetConfigure from './SheetConfigure';
import { DelayTasks, Observable, Serializer, Serializable } from './utils';
import ExpressionCreator from './ExpressionCreator';

export const EVENT_START = 'start';
export const EVENT_SUBMITTED = 'submitted';
export const EVENT_TIMEOUT = 'timeout';
export const EVENT_TIMEPASS = 'timepass';
const TASK_AUTO_SUBMIT = 'auto-submit';
const TASK_USED_TIME = 'used-time';


@Serializable('Sheet')
export class Sheet extends Observable{
  private _config:SheetConfigure;
  private _expressions:Expression[];
  private _tasks:DelayTasks;
  private _submitted:boolean;
  private _startTime:Date;
  private _endTime:Date;
  private _correctCount:number;

  constructor(config:SheetConfigure){
    super();
    this._config = config;
    this._expressions = [];
    this._tasks = new DelayTasks();
    this._submitted = false;
    this._endTime = null;
    this._correctCount = 0;
  }

  public start(){
    let sheet = this;
    let config = sheet.config;
    let tasks = sheet.tasks;
    sheet.generateExpressions();
    sheet._startTime = new Date();
    if (config.timeLimit > 0){
      tasks.addSimpleTask(TASK_AUTO_SUBMIT, ()=>{
        this.fire(EVENT_TIMEOUT);
      }, config.timeLimit * config.itemCount * 60000)
    }
    tasks.addRepeatTask(TASK_USED_TIME, ()=>{
      sheet.fire(EVENT_TIMEPASS, sheet.passedTimeString);
    }, 1000);
    this.fire(EVENT_START);
  }

  public submit(results:number[]):void{
    let sheet = this;
    if (sheet._submitted){
      return;
    }
    sheet._tasks.endTask(TASK_USED_TIME);
    sheet._tasks.endTask(TASK_AUTO_SUBMIT);
    sheet._correctCount = 0;
    sheet._expressions.forEach((expression, index)=>{
      expression.correct = (expression.result == results[index]);
      if (expression.correct){
        sheet._correctCount++;
      }
    });
    sheet._submitted = true;
    sheet.sendResult();
    sheet.fire(EVENT_SUBMITTED);
  }
  

  private generateExpressions():void{
    let expressions = this.expressions;
    let config = this.config;
    let creator = new ExpressionCreator(config);

    for (let i = 0; i < config.itemCount; i++){
      expressions.push(creator.createComplexExpression(config.degree));
    }
  }

  get config():SheetConfigure{
    return this._config;
  }

  get submitted():boolean{
    return this._submitted;
  }

  get tasks():DelayTasks{
    return this._tasks;
  }

  get startTime():Date{
    return this._startTime;
  }
  
  get startTimeValue():number{
    return this._startTime.getTime();
  }

  get startTimeString():string{
    return this.startTime.toLocaleTimeString();
  }

  get endTime():Date{
    return this._endTime;
  }

  get endTimeValue():number{
    return this._endTime.getTime();
  }

  get endTimeString():string{
    return this.endTime.toLocaleDateString();
  }

  get passedTime():number{
    if (this._endTime){
      return this._endTime.getTime() - this._startTime.getTime();
    } else {
      return Date.now() - this._startTime.getTime();
    }
  }

  get passedTimeString():string{
    return getPassTimeString(this.passedTime / 1000)
  }

  get timeLimitString():string{
    return getPassTimeString(this.config.timeLimit * this.config.itemCount * 60);
  }

  get expressions():Expression[]{
    return this._expressions;
  }

  get score():number{
    return Math.floor(this._correctCount * 100 / this._config.itemCount);
  }

  public finalize():void{
    this._tasks.endAllTasks();
  }

  public toJSON():string{
    let serializeObj = {
      config: this._config,
      expressions: this._expressions,
      startTime: this.startTimeValue,
      endTime: this.endTimeValue,
      score: this.score
    };
    return JSON.stringify(serializeObj);
  }

  sendResult():void{
    $.post('/', Serializer.serialize(this), function(res){
      console.log(res);
    });
  }
}


function getPassTimeString(time){
  return Math.floor(time/60) + '分' + Math.floor(time % 60) + '秒';
}


export default Sheet;