import React, { Component, Fragment } from 'react';

// App
import { Button } from 'react-bootstrap';

import { observer } from "mobx-react";
import { Event } from 'electron/main';
import { t2wmlColors } from '@/renderer/common/general';


interface SheetProperties  {
    sheetNames: Array<string> | null,     // csv: null    excel: [ "sheet1", "sheet2", ... ]
    currSheetName: string | null,  // csv: null    excel: "sheet1"
    itemType?: "sheet" | "file",

    handleSelectSheet: (event: Event) => void;
    handleDoubleClickItem?: (value: string, index: number) => void;
}

interface SheetState {
  changeItemName: string | undefined;
  index: number | undefined;
}


@observer
class SheetSelector extends Component<SheetProperties, SheetState> {
  constructor(props: SheetProperties) {
    super(props);

    this.state = {
      changeItemName: undefined,
      index: undefined,
    };
  }

  render() {
    const { sheetNames, currSheetName } = this.props;

    // if csv file, sheetNames === null && currSheetName === null
    if (sheetNames === null) return null;
    
    let color = t2wmlColors.TABLE;
    if (this.props.itemType === "file") {
      color = t2wmlColors.YAML;
    }
    // else, excel file
    const currSheetStyle = { borderColor: color, background: color, padding: "0rem 0.5rem", margin: "0rem 0.25rem" };
    const otherSheetStyle = { borderColor: color, background: "whitesmoke", color: color, padding: "0rem 0.5rem", margin: "0rem 0.25rem" };

    const sheetSelectorHtml = [];
    for (let i = 0, len = sheetNames.length; i < len; i++) {
      sheetSelectorHtml.push(
        <Button
          key={i}
          variant="success"
          size="sm"
          style={sheetNames[i] === currSheetName ? currSheetStyle : otherSheetStyle}
          onClick={(event: any) => { this.props.handleSelectSheet(event) }}
        >{sheetNames[i]}</Button>
      );
    }
    // Rename item (yaml), double click on button 
    // onDoubleClick={() => {this.setState({changeItemName: sheetNames[i], index: i})}} 

    let renameItem = null;
    
    if (this.props.handleDoubleClickItem && this.state.changeItemName && this.state.index) {
      renameItem = 
      <div>
        <label>{this.state.changeItemName}</label>
        <input value={this.state.changeItemName} onChange={(e) => this.setState({changeItemName: e.target.value})}
        onKeyPress={(event: any) => {
          if (event.key === "Enter") {
            // if press enter (13), then do create new project
            event.preventDefault();
            this.props.handleDoubleClickItem!(event.target.value, this.state.index!);
            this.setState({changeItemName: undefined, index: undefined});
          }
        }}
        />
      </div>;
    }

    return (
    <Fragment>
      {renameItem}
      {sheetSelectorHtml}
    </Fragment>
    );
  }
}

export default SheetSelector;
