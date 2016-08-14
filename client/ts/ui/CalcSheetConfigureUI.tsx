import * as React from 'react';
import {Component} from 'react';
import SheetConfigure from '../SheetConfigure';
import Sheet from '../Sheet';

export class CalcSheetConfigureUI extends Component<SheetConfigure, Sheet>{

  constructor(config){
    super(config);
    this.state = new Sheet(config);
  }

  render(){
    var self = this;
    return (
      <div id="calc-sheet-configure-form" class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">Panel title</h3>
        </div>
        <div class="panel-body">

        </div>
      </div>
    )
  }
}

export default CalcSheetConfigureUI;