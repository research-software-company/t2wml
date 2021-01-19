import React from 'react';

import './wikify-menu.css';
import WikifyForm from './wikify-form';

import Draggable from 'react-draggable';
import { Toast } from 'react-bootstrap';
import { ErrorMessage } from '../../../common/general';
import RequestService from '../../../common/service';
import wikiStore from '../../../data/store';


interface WikifyMenuProperties {
  selections?: Array<any>,
  position?: Array<number>,
  onDelete: any | null,
  onClose: any | null,
}


interface WikifyMenuState {
  errorMessage: ErrorMessage;
}


class WikifyMenu extends React.Component<WikifyMenuProperties, WikifyMenuState> {

  private requestService: RequestService;

  constructor(props: WikifyMenuProperties) {
    super(props);

    this.state = {
      errorMessage: {} as ErrorMessage,
    };
  }

  handleOnChange(key: string, value: string) {
    console.log('WikifyMenu OnChange triggered for -> ', key, value);
  }

  handleOnSubmit(values: { [key: string]: string }) {
    console.log('WikifyMenu OnSubmit triggered for -> ', selections, values);
  }

  renderWikifyForms() {
    const { selections } = this.props;
    return (
      <WikifyForm
        selections={selections}
        onChange={this.handleOnChange.bind(this)}
        onSubmit={this.handleOnSubmit.bind(this)} />
    )
  }

  render() {
    const { position, onClose } = this.props;
    let style = {};
    if (position) {
      style = {
        'left': position[0],
        'top': position[1],
      };
    }
    return (
      <div className="wikify-menu" style={style}>
        <Draggable handle=".handle">
          <Toast onClose={onClose}>
            <Toast.Header className="handle">
              <strong className="mr-auto">Update Qnode</strong>
            </Toast.Header>
            <Toast.Body>
              {this.renderWikifyForms()}
            </Toast.Body>
          </Toast>
        </Draggable>
      </div>
    )
  }
}


export default WikifyMenu
