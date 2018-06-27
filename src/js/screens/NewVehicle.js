import React, { Component, PropTypes } from 'react';
// import '../scss/vehicles.scss';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Moment from 'moment';
import Split from 'grommet/components/Split';

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
import Notification from 'grommet/components/Notification';
import Header from 'grommet/components/Header';
import { saveVehicle, getUserInfo, uploadVehicleImage } from '../api/vehicles';
import Toast from 'grommet/components/Toast';

// import { VoiceRecognition } from 'react-voice-components';
// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/


class NewVehicle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed: true,
      vehicleId: Rand.generateBase30(8),
      toastMsg:'',
      buttonHide: false
    };
  }

  componentDidMount(){
    this.getUserInfo(window.localStorage.token);
  }

  getUserInfo(token) {
      getUserInfo(token).then((snap) => {
          const userInfo = snap.val();
          window.localStorage.unit=userInfo['unit'];
      })
  }

  onFieldChange(fieldName, e) {
    const givenInput = e.target.value;
    this.setState({
      [fieldName] : givenInput
    });
  }

  onVehicleNumberChange(e) {
    const val = e.target.value;
    if (val) {
      const transformedVal = val.replace(' ','').toUpperCase().substring(0,10);
      this.setState({
        vehicleNumber: transformedVal
      });
    } else {
      this.setState({
        vehicleNumber: val
      });
    }
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
    const { vehicleId, vehicleNumber, driverName, mobile, screenshot, timestamp, description } = this.state;
    const localStorage = window.localStorage;

    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadVehicleImage(imgFile, vehicleId).then((snapshot) => {
         console.log(snapshot.downloadURL);
         let screenshot = snapshot.downloadURL;

    saveVehicle({
      vehicleId,
      vehicleNumber,
      driverName,
      mobile,
      timestamp,
      screenshot,
      description,
      status: 'ENTERED',
      history: [
        {
          timestamp,
          status: 'ENTERED',
          enteredBy: window.localStorage.email,
          screenshotNow:screenshot,
          description: 'Allowed vehicle in'
        }
      ]
    })
      .then(()=> {
        this.setState(Object.assign({} , {
          toastMsg: `Vehicle ${vehicleNumber} is saved`,
          buttonHide: true
      }));
      }
      )
      .catch((err) => {
        console.error('VEHICLE SAVE ERR', err);
        this.setState({
          validationMsg: `Unable to save ${name}. Contact admin for assistance`
        });
      })
    }).catch((e) => console.log(e))
  }

  onSubmitClick() {
    const { vehicleNumber, driverName, mobile, screenshot, description } = this.state;
    if (!vehicleNumber) {
      this.setState({
        validationMsg: 'Vehicle Number is missing'
      });
      return;
    }

    if (vehicleNumber.length !== 10) {
      this.setState({
        validationMsg: 'Vehicle Number has to be 10 chars length! ex. AP32MN0034'
      });
      return;
    }


    if (!screenshot) {
      this.setState({
        validationMsg: 'IMAGE is not taken. Click on video to take photo!'
      });
      return;
    }

    if (!driverName) {
      this.setState({
        validationMsg: 'Driver name is missing'
      });
      return;
    }

    // if (!destination) {
    //   this.setState({
    //     validationMsg: 'DESTINATION OFFICE is missing'
    //   });
    //   return;
    // }
    const timestamp = new Date();
    const timestampStr = Moment(timestamp).format('DD/MM/YYYY hh:mm:ss A');
    this.setState({
      timestamp,
      timestampStr,
      validationMsg: ''
    }, this.saveAndPrint.bind(this));

  }

  renderToastMsg() {
    const { toastMsg } = this.state;
    if (toastMsg) {
      return (
        <Toast status='ok'>{toastMsg}</Toast>
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
    const { buttonHide } = this.state;
    console.log(buttonHide)
    return (
      <div className='newVehicle'>
        { this.renderToastMsg() }
        { this.renderValidationMsg() }
        <Article>
          <Section
            justify='center'
            >
            <Box direction='row' margin='small' pad='small'>
            <Box direction='column'>
            <Form>
              <FormFields  style={{width:'80%',marginLeft:'20px',marginTop:'20px'}}>
                <FormField label='Vehicle Number' style={{marginBottom:'10px'}}>
                  <TextInput
                    placeHolder='AP32MN1234'
                    onDOMChange={this.onVehicleNumberChange.bind(this)}
                    value={this.state.vehicleNumber}
                  />
                </FormField>
                <FormField label='Driver Name' style={{marginBottom:'10px'}}>
                  <TextInput
                    placeHolder='driver name'
                    className='itemTextInput'
                    onDOMChange={this.onFieldChange.bind(this, 'driverName')}
                  />
                </FormField>
                <FormField label='Driver Mobile' style={{marginBottom:'10px'}}>
                  <TextInput
                    placeHolder='+91 '
                    className='itemTextInput'
                    onDOMChange={this.onFieldChange.bind(this, 'mobile')}
                  />
                </FormField>
                <FormField label='Variety' style={{marginBottom:'10px'}}>
                  <TextInput
                    placeHolder='rice||paddy '
                    className='itemTextInput'
                    onDOMChange={this.onFieldChange.bind(this, 'veriety')}
                  />
                </FormField>
                <FormField label='Area' style={{marginBottom:'10px'}}>
                  <TextInput
                    placeHolder='VSP '
                    className='itemTextInput'
                    onDOMChange={this.onFieldChange.bind(this, 'area')}
                  />
                </FormField>
                <FormField label='Agent' style={{marginBottom:'10px'}}>
                  <TextInput
                    placeHolder='Anil '
                    className='itemTextInput'
                    onDOMChange={this.onFieldChange.bind(this, 'agent')}
                  />
                </FormField>
                <FormField label='Description' style={{marginBottom:'10px'}}>
                  <textarea className='itemTextArea'
                    onChange={this.onFieldChange.bind(this, 'description')}
                  />
                </FormField>
              </FormFields>
            </Form>
            </Box>

          <Box onClick={this.capture.bind(this)} style={{marginTop:'35px', marginLeft : '-80px'}} align='center'
          direction='column' >
          {this.renderCamera() }
          <Barcode value={this.state.vehicleId} height='20' style={{marginTop:'20px'}}/>
          <Section pad='small'
            align='center'>
            {!buttonHide ? <Button icon={<Edit />}
              label='SAVE'
              onClick={this.onSubmitClick.bind(this)}
              disabled={true} style={{marginTop:'20px'}}
              href='#'
              primary={true} /> : null }
          </Section>
          </Box>
          </Box>
          </Section>
        </Article>
      </div>
    )
  }
}

const item = state => ({ ...state.item });
export default connect(item)(NewVehicle);
