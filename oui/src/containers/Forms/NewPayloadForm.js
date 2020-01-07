import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import CountUpCard from '../../components/Info/CountUpCard';
import {
  Form,
  FormGroup,
  Button,
  TextInput,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from 'carbon-components-react';
import {
  Add24,
  Search16,
  Download20,
  Edit20,
  Play20,
  Carbon24,
  Login20,
} from '@carbon/icons-react';

class NewPayloadForm extends Component {
  state = {
    override: true,
  };

  componentDidMount() {}

  handleAdd(path, override) {
    // console.log(path, override)
    override = this.state.override;
    let json_body = JSON.stringify({
      active_folder: path,
      override: override,
    });
    console.log(json_body);

    this.props.axiosStore.instance
      .post('/action/parsing/active', json_body)
      .then(response => {
        if (response.data.hasOwnProperty('status')) {
          const status_code = response.data.hasOwnProperty(
            'status'
          );
          if (status_code === 200) {
            // console.log('Success');
            this.setState({ isSubmit: true });
          }
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => this.setState({ error: true }));
  }

  handleCheck(data) {
    // console.log(data.target.value);
    const override = !this.state.override;
    
    this.setState({ override: override });
  }

  render() {
    // modal form part
    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const path = this.refs.path.value;
        const override = this.refs.override.value;
        // console.log(path, override);
        this.handleAdd(path, override);
      },
    };

    return (
      <div>
        <ModalBody className="bx--modal-content__text}">
          <br />
          <Form {...additionalProps}>
            <FormGroup className="some-class" legendText="Payloads Path">
              <TextInput type="text" name="path" ref="path" />
            </FormGroup>

            <FormGroup className="some-class" legendText="Override">
              <div className="bx--form-item bx--checkbox-wrapper">
                <input
                  defaultChecked
                  disabled={false}
                  type="checkbox"
                  ref="override"
                  name="override"
                  onChange={data => this.handleCheck(data)}
                  className="bx--checkbox"
                  id="checkbox-label-1"
                />
                <label
                  htmlFor="checkbox-label-1"
                  className="bx--checkbox-label some-class"
                  title={null}>
                  <span className="bx--checkbox-label-text">Override</span>
                </label>
              </div>
            </FormGroup>

            <Button
              renderIcon={Play20}
              value=""
              //   onClick={() => this.submitHandler()}
              type="submit"
              kind="secondary">
              Submit
            </Button>
          </Form>
          
        </ModalBody>
      </div>
    );
  }
}

export default inject('sessStore', 'axiosStore')(observer(NewPayloadForm));
