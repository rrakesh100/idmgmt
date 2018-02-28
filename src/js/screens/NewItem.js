import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Moment from 'moment';

import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import { Print } from 'react-easy-print';


import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import Headline from 'grommet/components/Headline';
import Image from 'grommet/components/Image';
import FormFields from 'grommet/components/FormFields';
import Edit from 'grommet/components/icons/base/Print';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';

import Header from 'grommet/components/Header';
import { saveItem } from '../api/items';


// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/


class NewItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed: true,
      itemId: Rand.generateBase30(8)
    };
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.target.value
    });
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  capture() {
    if(this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false
      });
    } else {
      this.setState({
        showLiveCameraFeed: true
      });
    }
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }

  renderImage() {
    if(this.state.showLiveCameraFeed) {
      return (
        <Webcam
          audio={false}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={800}
          onClick={this.capture.bind(this)}
        />
      );
    }
    return (
      <Image src={this.state.screenshot} width={800} />
    );
  }

  saveAndPrint() {
    const { itemId, name, source, destination, screenshot, timestamp } = this.state;

    const localStorage = window.localStorage;

    saveItem({
      itemId,
      name,
      source,
      destination,
      timestamp,
      screenshot,
      status: 'ENTERED',
      history: [
        {
          timestamp,
          status: 'ENTERED',
          enteredBy: localStorage.email,
          description: 'initiated transfer'
        }
      ]
    })
      .then(
        this.setState({
          toastMsg: `Item ${name} is saved `
        }, () => { window.print(); })
      )
      .catch((err) => {
        console.error('ITEM SAVE ERR', err);
        this.setState({
          validationMsg: `Unable to save ${name}. Contact admin for assistance`
        });
      });
  }

  onSubmitClick() {
    const { name, source, destination, screenshot } = this.state;
    if (!name) {
      this.setState({
        validationMsg: 'NAME is missing'
      });
      return;
    }

    if (!screenshot) {
      this.setState({
        validationMsg: 'IMAGE is not taken. Click on video to take photo!'
      });
      return;
    }

    if (!source) {
      this.setState({
        validationMsg: 'SOURCE OFFICE is missing'
      });
      return;
    }

    if (!destination) {
      this.setState({
        validationMsg: 'DESTINATION OFFICE is missing'
      });
      return;
    }
    const timestamp = new Date();
    const timestampStr = Moment(timestamp).format('DD/MM/YYYY hh:mm:ss A');
    this.setState({
      timestamp,
      timestampStr,
      validationMsg: ''
    }, this.saveAndPrint.bind(this));
  }

  renderBusinessCardForPrint() {
    const { name = '', source = '', destination = '', screenshot, timestampStr } = this.state;
    const printName = name.substring(0, 16);
    const printSource = source.substring(0, 20);
    const printDestination = destination.substring(0, 20);


    return (
      <Print name='bizCard' exclusive>
        <div className='card'>
          <div className='card-body'>
            <div className='box header'>
              <h3>Lalitha Industries</h3>
            </div>
            <div className='box sidebar'>
              <Image src={screenshot} />
            </div>
            <div className='box content'>
              <h5 className='bold'>{printName}</h5>
              <h5>from: {printSource}</h5>
              <h5>to: {printDestination}</h5>
              <h5>{timestampStr}</h5>
            </div>
            <div className='box footer'>
              <Barcode value={this.state.itemId}
                height={40}
              />
            </div>
          </div>
        </div>
      </Print>
    );
  }

  renderToastMsg() {
    const { toastMsg } = this.state;
    if (toastMsg) {
      return (
        <Toast status='ok'
          onClose={ this.toastClose.bind(this) }>
          { toastMsg }
        </Toast>
      );
    }
    return null;
  }

  renderValidationMsg() {
    const { validationMsg } = this.state;
    if (validationMsg) {
      return (
        <Notification message={validationMsg} size='small' status='critical' />
      );
    }
    return null;
  }

  render() {
    return (
      <div className='newItem'>
        { this.renderValidationMsg() }
        <Article primary={true} full={true} className='giveItem'>
          <Header
            direction='row'
            size='large'
            colorIndex='light-2'
            align='center'
            responsive={true}
            pad={{ horizontal: 'small' }}
          >
            <Anchor path='/items'>
              <LinkPrevious a11yTitle='Back' />
            </Anchor>
            <Heading margin='none' strong={true}>
              GIVE AN ITEM
            </Heading>
          </Header>
          <Section pad='large'
            justify='center'
            align='center'>
            <Headline margin='none'>
              <Box onClick={this.capture.bind(this)} align='center'>
                {this.renderCamera() }
              </Box>
            </Headline>
          </Section>
          <Section pad='large'
            justify='center'
            align='center'>
            <Barcode value={this.state.itemId} />
            <Form>
              <FormFields>
                <FormField label='Item Name'>
                  <TextInput
                    placeHolder='name'
                    onDOMChange={this.onFieldChange.bind(this, 'name')}
                  />
                </FormField>
                <FormField label='Returnable?'>
                  <TextInput
                    placeHolder='True or False'
                    onDOMChange={this.onFieldChange.bind(this, 'returnable')}
                  />
                </FormField>
                <FormField label='Expected Time'>
                  <TextInput
                    placeHolder='expected time'
                    onDOMChange={this.onFieldChange.bind(this, 'expectedTime')}
                  />
                </FormField>
                <FormField label='Source Office'>
                  <TextInput
                    placeHolder='name'
                    onDOMChange={this.onFieldChange.bind(this, 'source')}
                  />
                </FormField>
                <FormField label='Destination Office'>
                  <TextInput
                    placeHolder='name'
                    onDOMChange={this.onFieldChange.bind(this, 'destination')}
                  />
                </FormField>
                <FormField label='Description'>
                  <textarea className='itemTextArea'
                    placeHolder='name'
                    onChange={this.onFieldChange.bind(this, 'description')}
                  />
                </FormField>
              </FormFields>
            </Form>
          </Section>
          <Section pad='small'
            align='center'>
            <Button icon={<Edit />}
              label='SAVE & PRINT'
              onClick={this.onSubmitClick.bind(this)}
              disabled={true}
              href='#'
              primary={true} />
          </Section>
        </Article>
        { this.renderBusinessCardForPrint() }
      </div>
    )
  }

}

const item = state => ({ ...state.item });
export default connect(item)(NewItem);

// send SMS to destination number if returnable item
// send reminder SMS if time expires
