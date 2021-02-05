import React, { Component } from 'react';
import '../project.css';
import '../ag-grid.css';
import '../ag-theme-balham.css';

import { Form } from 'react-bootstrap';

import { observer } from "mobx-react";



interface EntitiesProperties {
    property: string;
    propertyData: any;
    updateField: (key: "label"|"description"|"data_type", value:string) => void;
}


@observer
class EntityFields extends Component<EntitiesProperties, {}> {
    constructor(props: EntitiesProperties) {
        super(props);
    }


    render() {
        return (
            <ul>
                <li key={"label"+this.props.property}>
                    <Form.Group>
                        <Form.Label>Label</Form.Label><br></br>
                        <Form.Control defaultValue={this.props.propertyData.label || ""}
                            onChange={(event) => (this.props.updateField("label", event.target?.value))}
                        />
                    </Form.Group>
                </li>
                <li key={"description"+this.props.property}>
                <Form.Group>
                    <Form.Label>Description</Form.Label><br></br>
                    <Form.Control defaultValue={this.props.propertyData.description || ""}
                         onChange={(event) => (this.props.updateField("description", event.target?.value))}
                    />
                </Form.Group>
                </li>
                {this.props.propertyData.data_type ?
                <li key={"datatype"+this.props.property}>
                <Form.Group>
                    <Form.Label>Data type</Form.Label><br></br>
                    <Form.Control as="select"
                        defaultValue={this.props.propertyData.data_type}
                        onChange={(event) => (this.props.updateField("data_type", event.target?.value))}>
                        <option>quantity</option>
                        <option>time</option>
                        <option>monolingualtext</option>
                        <option>string</option>
                        <option>wikibaseitem</option>
                    </Form.Control>
                </Form.Group>
            </li>: null
                }
            </ul>
        );
    }
}

export default EntityFields;