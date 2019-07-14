import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import Clock from 'react-live-clock';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Meter from 'grommet/components/Meter';
import Notification from 'grommet/components/Notification';
import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Columns from 'grommet/components/Columns';
import Image from 'grommet/components/Image';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Select from 'grommet/components/Select';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Form from 'grommet/components/Form';
import Button from 'grommet/components/Button';
import Toast from 'grommet/components/Toast';


class ItemActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAction: 'ACCEPTED',
      showLiveCameraFeed: true
    };
  }

  onActionSelect(data) {
    this.setState({
      selectedAction: data.value
    });
  }

  onDescriptionChange(e) {
    this.setState({
      description: e.target.value
    });
  }

  handleSubmit() {
    const { selectedAction, description, screenshotNow } = this.state;
    this.props.onSubmit({ status: selectedAction, description, screenshotNow, enteredBy: window.localStorage.email });
    this.setState({
      selectedAction: 'ACCEPTED',
      showLiveCameraFeed: true,
      description: '',
      screenshotNow: ''
    });
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  renderCamera() {
    return (
      <Box onClick={this.capture.bind(this)} align='center'>
        { this.renderImage() }
      </Box>
    );
  }

  capture() {
    if (this.state.showLiveCameraFeed) {
      const screenshotNow = this.webcam.getScreenshot();
      this.setState({
        screenshotNow,
        showLiveCameraFeed: false
      });
    } else {
      this.setState({
        showLiveCameraFeed: true
      });
    }
  }

  renderImage() {
    if (this.state.showLiveCameraFeed) {
      return (
        <Webcam
          audio={false}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={400}
          onClick={this.capture.bind(this)}
        />
      );
    }
    return (
      <Image src={this.state.screenshotNow} width={400} />
    );
  }

  render() {
    return (
      <div>
        <Form className='visitorActions'>
          <Clock className='visitorClock' format={'DD/MM/YYYY hh:mm:ss A'} ticking={true} />
          <Select placeHolder='Item Wants'
            options={['TRANSIT', 'RECEIVED', 'REJECTED', 'LOST', 'ACCEPTED', 'RETURNED']}
            value={this.state.selectedAction}
            onChange={this.onActionSelect.bind(this)} />
            <FormFields>
              <FormField label='Current Image'>
                { this.renderCamera() }
              </FormField>
            </FormFields>
          <FormFields>
            <FormField label='Description'>
              <textarea className='itemTextArea'
                onChange={this.onDescriptionChange.bind(this)}
                value={this.state.description}
              />
            </FormField>
          </FormFields>
          <Footer pad={{"vertical": "medium"}}>
            <Button label='Update'
              primary={true}
              onClick={ this.handleSubmit.bind(this) } />
          </Footer>
        </Form>
      </div>
    );
  }
}

ItemActions.defaultProps = {
  error: undefined
};

ItemActions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

const select = state => ({ ...state.itemId });

export default connect(select)(ItemActions);
