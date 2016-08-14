import Expression from './Expression';
import SheetConfigure from './SheetConfigure';
import DelayTasks from './DelayTasks';

export class Sheet{
  private _config:SheetConfigure;
  private _expressions:Expression[];
  private _tasks:DelayTasks;
  private _submitted:boolean;


  constructor(config:SheetConfigure){
    this._config = config;
    this._expressions = [];
    this._tasks = new DelayTasks();
    this._submitted = false;
  }

}

export default Sheet;