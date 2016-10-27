import * as React from 'react';
import {Component, ReactElement as Element} from 'react';
import SheetConfigure from '../SheetConfigure';

class ConfigureUIProps {
  cfg:SheetConfigure
}

export class ConfigureUI extends Component<ConfigureUIProps, SheetConfigure>{

  public static defaultCfg: SheetConfigure = new SheetConfigure();

  constructor(props= {cfg:ConfigureUI.defaultCfg}){
    super(props);
    this.state = props.cfg;
  }
  onChange(field:string, event){
    let value = event.target.value;
    let item = this.state;
    item[field] = value;
    this.setState(item);
  }

  render():Element<SheetConfigure>{
    let self = this;
    let state = self.state;
    return (
      <form id="calc-sheet-configure-form" className="form-horizontal" role="form">
        <div className="form-group">
          <label htmlFor="item-count" className="control-label col-sm-2">题目数量:</label>
          <div className="col-sm-2">
            <input id="item-count" type="number" className="form-control" max="100" min="1" 
            value={String(state.itemCount)}
            onChange={this.onChange.bind(this, 'itemCount')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="degree" className="control-label col-sm-2">复杂度:</label>
          <div className="col-sm-2">
            <select id="degree" value={String(state.degree)}
              onChange={this.onChange.bind(this, 'degree')} className="form-control" >
              <option value="0">两个数</option>
              <option value="1">三个数</option>
              <option value="2">四个数</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="max" className="control-label col-sm-2">最大数:</label>
          <div className="col-sm-2">
            <input id="max" type="number" className="form-control" max="10000" min="1" 
            value={String(state.max)}
            onChange={this.onChange.bind(this, 'max')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="min" className="control-label col-sm-2">最小数:</label>
          <div className="col-sm-2">
            <input id="min" type="number" className="form-control" max="10000" min="1" 
            value={String(state.min)}
            onChange={this.onChange.bind(this, 'min')} />
          </div>
        </div>
      </form>
    );
  }
}

export default ConfigureUI;