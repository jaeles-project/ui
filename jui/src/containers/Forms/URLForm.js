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

class URLForm extends Component {
  state = {
    currentURL: this.props.axiosStore.url,
  };

  componentDidMount() {}

  handleOnChange = e => {
    // console.log(e.target.value);
    this.setState({
      currentURL: `${e.target.value}`,
    });
    
  };
  handleSubmit = () => {
    const url = this.state.currentURL;
    // console.log(url);
    this.props.axiosStore.setURL(url);
    this.setState({ isSubmited: true });
    this.setState({ isOpen: false });
  };

  render() {
    const url = this.state.currentURL;
    // modal form part
    const additionalProps = {
      className: 'some-class',
      onSubmit: e => {
        e.preventDefault();
        const path = this.refs.url.value;
        // const override = this.refs.override.value;
        // console.log(path, override);
        this.handleSubmit(url);
      },
    };

    return (
      <div>
        <ModalHeader
          // label="Optional Label"
          title="Change Destination URL"
          iconDescription="Close"
          //   buttonOnClick={() => this.closeAdd()}
        />
        <ModalBody>
          <br />
          <Form {...additionalProps}>
            <FormGroup className="some-class" legendText="Destination URL">
              <TextInput
                type="text"
                name="url"
                ref="url"
                value={this.state.currentURL}
                onChange={this.handleOnChange}
              />
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

export default inject('sessStore', 'axiosStore')(observer(URLForm));
