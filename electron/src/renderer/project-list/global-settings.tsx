import React, { Component } from 'react';

// App
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import { observer } from "mobx-react";


interface SettingsProperties {
    showSettings: boolean;
    datamartIntegration: boolean;
    datamartApi: string;

    handleSaveSettings: (
      datamartIntegration: boolean,
      datamartApi: string,
    ) => void;
    cancelSaveSettings: () => void;
}

interface SettingsState {
  datamartIntegration: boolean;
  datamartApi: string;
}

@observer
class GlobalSettings extends Component<SettingsProperties, SettingsState> {
  constructor(props: SettingsProperties) {
    super(props);

    this.state = {
      datamartIntegration: this.props.datamartIntegration,
      datamartApi: this.props.datamartApi,
    }
  }

  handleSaveSettings() {
    const datamartIntegration = this.state.datamartIntegration;
    const datamartApi = this.state.datamartApi;
    this.props.handleSaveSettings(datamartIntegration, datamartApi);
  }

  render() {
    return (
      <Modal show={this.props.showSettings} size="lg" onHide={() => { /* do nothing */ }}>

        {/* header */}
        <Modal.Header style={{ background: "whitesmoke" }}>
          <Modal.Title>Global Settings</Modal.Title>
        </Modal.Header>

        {/* body */}
        <Modal.Body>
          <Form className="container">
            {/* datamart integration on/off */}
            <Form.Group as={Row} style={{ marginTop: "1rem" }}>
              <Form.Label column sm="12" md="3" className="text-right">
              Turn Datamart Integration ON
              </Form.Label>
              <Col sm="12" md="9">
                <input type="checkbox"
                  style={{ width: '25px', height: '25px', marginTop: '5px' }}
                  defaultChecked={this.props.datamartIntegration}
                  onChange={(event) => this.setState({ datamartIntegration: event?.target.checked })}/>
              </Col>
            </Form.Group>

            {/* datamart url */}
            <Form.Group as={Row}>
              <Form.Label column sm="12" md="3" className="text-right">
              Datamart api url
              </Form.Label>
              <Col sm="12" md="9">
                <Form.Control
                  type="text" size="sm"
                  defaultValue={this.props.datamartApi}
                  onChange={(event) => this.setState({ datamartApi: event?.target.value })}/>
              </Col>
            </Form.Group>
          </Form>

        </Modal.Body>

        {/* footer */}
        <Modal.Footer style={{ background: "whitesmoke" }}>
          <Button variant="outline-dark" onClick={() => this.props.cancelSaveSettings() }>
            Cancel
          </Button>
          <Button variant="dark" onClick={() => this.handleSaveSettings()}>
            Save
          </Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default GlobalSettings;
