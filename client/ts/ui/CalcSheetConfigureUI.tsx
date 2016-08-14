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
      <div id="calc-sheet-configure-form" class="" role="form">
        <div class="form-group">
          <label for="item-count">题目数量:</label>
          <input id="item-count" type="number" class="form-control"/>
        </div>
      </div>
    )
  }
}

export default CalcSheetConfigureUI;