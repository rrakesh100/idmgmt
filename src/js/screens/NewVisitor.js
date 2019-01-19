import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Clock from 'react-live-clock';
import Moment from 'moment';
import { Print } from 'react-easy-print';
  import NavControl from '../components/NavControl';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Image from 'grommet/components/Image';
import Anchor from 'grommet/components/Anchor';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Header from 'grommet/components/Header';
import Notification from 'grommet/components/Notification';
import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import PrintIcon from 'grommet/components/icons/base/Print';
import Toast from 'grommet/components/Toast';
import Headline from 'grommet/components/Headline';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Layer from 'grommet/components/Layer';

import { saveVisitor, uploadVisitorImage } from '../api/visitors';
import VisitorPrintComponent from '../components/VisitorPrintComponent';
import ReactToPrint from "react-to-print";


class NewVisitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed: true,
      visitorId: Rand.generateBase30(8),
      department : '--',
      company : '--',
      remarks :'--',
      serialNo : props.serialNo
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

  toastClose() {
    this.setState({ toastMsg: '' });
  }

  capture() {
    if (this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false
      });
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot: ''
      });
    }
  }


  saveAndPrint() {
    const { visitorId, name, remarks, screenshot, timestamp,
      whomToMeet, department, purpose, company, mobile, comingFrom , serialNo } = this.state;

      let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
      uploadVisitorImage(imgFile, visitorId).then((snapshot) => {
      let screenshot = snapshot.downloadURL;
    saveVisitor({
      visitorId,
      name,
      remarks,
      screenshot,
      timestamp,
      whomToMeet,
      department,
      purpose,
      company,
      mobile,
      comingFrom,
      status: 'ENTERED',
      inTime : timestamp,
      serialNo,
      history: [
        {
          timestamp,
          status: 'ENTERED',
          enteredBy: window.localStorage.email,
          description: 'nothing'
        }
      ]
    })
      .then(()=> {
        this.setState({
          toastMsg: `User ${name} is saved `,
        })
      }

      )
      .catch((err) => {
        console.error('VISITOR SAVE ERR', err);
        this.setState({
          validationMsg: `Unable to save ${name}. Contact admin for assistance`
        });
      })
    }).catch((e) => console.log(e))
  }

  onSubmitClick(e) {
    e.stopPropagation();
    const { name, whomToMeet, purpose, mobile, comingFrom, screenshot } = this.state;

    if (!name) {
      alert('NAME is missing');
      this.setState({
        validationMsg: 'NAME is missing'
      });
      return;
    }
    if (!whomToMeet) {
      alert('WHOM TO MEET is missing');
      this.setState({
        validationMsg: 'WHOM TO MEET is missing'
      });
      return;
    }
    if (!purpose) {
      alert('PURPOSE OF VISIT is missing');
      this.setState({
        validationMsg: 'PURPOSE OF VISIT is missing'
      });
      return;
    }
    if (!mobile) {
      alert('MOBILE NUMBER is missing');
      this.setState({
        validationMsg: 'MOBILE NUMBER is missing'
      });
      return;
    }
    if (!comingFrom) {
      alert('COMING FROM is missing');
      this.setState({
        validationMsg: 'COMING FROM is missing'
      });
      return;
    }
    if (!screenshot) {
      alert('IMAGE is not taken. Click on the camera to take photo!');
      this.setState({
        validationMsg: 'IMAGE is not taken. Click on video to take photo!'
      });
      return;
    }
    const timestamp = new Date();
    const timestampStr = Moment(timestamp).format('DD/MM/YYYY hh:mm:ss A');

    document.getElementById('printVisitor').click();
    this.setState({
      timestamp,
      timestampStr,
      validationMsg: ''
    }, this.saveAndPrint.bind(this));
  }


  renderImage() {
    if(this.state.showLiveCameraFeed) {
      return (
        <Webcam
          audio={false}
          height={300}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={400}
          onClick={this.capture.bind(this)}
        />
      );
    }
    return (
      <Image src={this.state.screenshot} height={300} width={400}/>
    );
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }

  setPrintRef(ref) {
    this.componentRef = ref;
  }

  renderBusinessCardForPrint() {
    const { name = '', whomToMeet = '', purpose='', comingFrom='',mobile='', remarks='', timestampStr, department,company='', screenshot, serialNo='', visitorId } = this.state;

    return (
      <VisitorPrintComponent
        ref={this.setPrintRef.bind(this)}
        name={name}
        visitorId={visitorId}
        whomToMeet={whomToMeet}
        purpose={purpose}
        comingFrom={comingFrom}
        mobile={mobile}
        remarks={remarks}
        timestampStr={timestampStr}
        department={department}
        company={company}
        screenshot={screenshot}
        serialNo={serialNo}
      />
    )
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


 renderContent() {
   return this.componentRef;
 }


  render() {
    return (
      <div>
        { this.renderValidationMsg() }
        { this.renderBusinessCardForPrint() }

          <Section
            justify='center'
            >
            <Headline size="small" style={{marginLeft :'40px'}}>
                    <span>In Date :   <Clock className='visitorClock' format={'DD/MM/YYYY'}/></span>
                    <span style={{marginLeft : '20px'}}>In Time :   <Clock className='visitorClock' format={'hh:mm:ss A'} ticking={true} /></span>
            </Headline>
            <Split>
              <Box direction='column' style={{marginLeft:'50px', width:'300px'}} >

                  <Form className='newVisitorFields'>
                    <FormField  label='Name *'  strong={true} style={{marginTop : '15px'}}  >
                      <TextInput
                        placeHolder='name'
                        onDOMChange={this.onFieldChange.bind(this, 'name')}
                      />
                    </FormField>
                    <FormField label='Whom To Meet *'  strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                        placeHolder='ED / MD'
                        onDOMChange={this.onFieldChange.bind(this, 'whomToMeet')}
                      />
                    </FormField>
                    <FormField label={'Purpose Of Visit *'} strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                        placeHolder='Purpose..'
                        onDOMChange={this.onFieldChange.bind(this, 'purpose')}
                      />
                    </FormField>
                    <FormField label={'Mobile *'} strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                        placeHolder='Mobile number'
                        onDOMChange={this.onFieldChange.bind(this, 'mobile')}
                      />
                    </FormField>

                    <FormField label={`Coming From${' *'}`} strong={true} style={{marginTop : '15px'}}>
                        <TextInput
                          placeHolder='Coming From'
                          onDOMChange={this.onFieldChange.bind(this, 'comingFrom')}
                          />
                    </FormField>
                  </Form>
              </Box>
              <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                  <Form className='newVisitorFields'>

                    <FormField label='Department' strong={true} style={{marginTop : '18px'}}>
                      <TextInput
                        placeHolder='Power plant/ Accounts/ Store'
                        onDOMChange={this.onFieldChange.bind(this, 'department')}
                      />
                    </FormField>

                    <FormField label='Company' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                        placeHolder='Company Name'
                        onDOMChange={this.onFieldChange.bind(this, 'company')}
                      />
                    </FormField>
                    <FormField label='Remarks' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                        placeHolder='Remarks'
                        onDOMChange={this.onFieldChange.bind(this, 'remarks')}
                      />
                    </FormField>
                  </Form>
                </Box>
              <Box onClick={this.capture.bind(this)} direction='column'
                style={{marginTop:'25px', marginLeft : '10px', width:'300px'}} align='center'>
                  { this.renderCamera() }
                  <Barcode value={this.state.visitorId} height={20}/>
                  <Section pad='small'
                    align='center'>
                     <Button icon={<PrintIcon />}
                       label='SAVE'
                        onClick={this.onSubmitClick.bind(this)}
                        href='#'
                        primary={true} />
                  </Section>
              </Box>
            </Split>
          </Section>
          <ReactToPrint
              trigger={() => <a id="printVisitor" style={{display:'none'}}
                     href='#'>Print</a>
                  }
              content={this.renderContent.bind(this)}
            />
      </div>
    );
  }
}

const select = state => ({ ...state.newUser });

export default connect(select)(NewVisitor);
