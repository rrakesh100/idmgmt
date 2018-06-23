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
import Edit from 'grommet/components/icons/base/Print';
import Toast from 'grommet/components/Toast';
import Headline from 'grommet/components/Headline';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Layer from 'grommet/components/Layer';

import { saveVisitor, uploadVisitorImage } from '../api/visitors';


class NewVisitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed: true,
      visitorId: Rand.generateBase30(8),
      department : 'Not Available',
      company : 'Not Available',
      info :'Not Available'
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
    const { visitorId, name, info, screenshot, timestamp,
      whomToMeet, department, purpose, company, mobile, comingFrom  } = this.state;

      let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
      uploadVisitorImage(imgFile, visitorId).then((snapshot) => {
           let screenshot = snapshot.downloadURL;

    saveVisitor({
      visitorId,
      name,
      info,
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
      history: [
        {
          timestamp,
          status: 'ENTERED',
          enteredBy: window.localStorage.email,
          description: 'nothing'
        }
      ]
    })
      .then(
        this.setState({
          toastMsg: `User ${name} is saved `
        }, () => { window.print(); })
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
    const { name, screenshot, mobile, whomToMeet, purpose, comingFrom} = this.state;
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
      <Image src={this.state.screenshot} height={300}/>
    );
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }


  renderBusinessCardForPrint() {
    const { name = '', whomToMeet = '', purpose='', comingFrom='',mobile='', info=''
    , timestampStr, department } = this.state;
    return (
       <Print name='bizCard' exclusive>
        <div className='card' style={{width:'92%', height:'9%', marginLeft:'40px'}}>
          <div className='card-body' style={{marginLeft:'30px'}}>
            <div className='box header'>
              <h5>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</h5>
              <h5>Unit-II, Valuthimmapuram Road, Peddapuram</h5>
            </div>
            <div className='box sidebar'>
              <Image src={this.state.screenshot} />
            </div>
            <div className='content'>
            <Table>
              <tbody>
                <TableRow>
                  <td>
                    Name: <b>{name.toUpperCase()}</b>
                  </td>
                  <td>
                    From: <b>{comingFrom.toUpperCase()}</b>
                  </td>
                  </TableRow>
                  <TableRow>
                    <td>
                      To Meet: <b>{whomToMeet.toUpperCase()}</b>
                    </td>
                    <td>
                      Mobile: <b>{mobile.toUpperCase()}</b>
                    </td>
                    </TableRow>
                    <TableRow>
                      <td>
                        Purpose: <b>{purpose.toUpperCase()}</b>
                      </td>
                      <td>
                        Department: <b>{department}</b>
                      </td>
                  </TableRow>
                  <TableRow>
                    <td>
                      In Time: <b>{timestampStr}</b>
                    </td>
                    <td>
                      Other Info: <b>{info}</b>
                    </td>
                </TableRow>
                </tbody>
              </Table>
                <Table>
                  <tbody>
                    <TableRow>
                      <td>
                        Operator Signature
                      </td>
                      <td>
                        Visitor Signature
                      </td>
                      <td>
                        Officer Signature
                      </td>
                      </TableRow>
                    </tbody>
                </Table>
            </div>
            <div className='footer' style={{width:'30%', float:'right'}}>
              <Barcode value={this.state.visitorId}
                height={20}
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
      <div className='newVisitor' >
        { this.renderValidationMsg() }
        <Article
          direction='column'
          >

          <Section
            justify='center'
            >
            <Headline size="small" style={{marginLeft :'40px'}}>
                    <span>Date :   <Clock className='visitorClock' format={'DD/MM/YYYY'}/></span>
                    <span style={{marginLeft : '20px'}}>Time :   <Clock className='visitorClock' format={'hh:mm:ss A'} ticking={true} /></span>
            </Headline>
            <Split>
              <Box direction='column' style={{marginLeft:'40px'}} >

                  <Form className='newVisitorFields'>
                    <FormField  label='Name *'  strong={true} size='small' style={{marginTop : '15px'}}  >
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
              <Box  direction='column' style={{marginLeft:'40px'}} size="medium">
                  <Form className='newVisitorFields'>

                    <FormField label='Department' strong={true} style={{marginTop : '150px'}}>
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
                    <FormField label='Info' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                        placeHolder='extra info'
                        onDOMChange={this.onFieldChange.bind(this, 'info')}
                      />
                    </FormField>
                  </Form>
                </Box>
              <Box onClick={this.capture.bind(this)} direction='column'
                style={{marginTop:'35px', marginLeft : '-80px'}} align='center'>
                  {this.renderCamera() }
                  <Barcode value={this.state.visitorId} style="" height="20"/>
                  <Section pad='small'
                    align='center'>
                    <Button icon={<Edit />}
                      label='SAVE & PRINT'
                      onClick={this.onSubmitClick.bind(this)}
                      disabled={true}
                      href='#'
                      primary={true} />
                  </Section>
              </Box>
            </Split>
          </Section>

        </Article>
        { this.renderBusinessCardForPrint() }
      </div>
    );
  }
}

const select = state => ({ ...state.newUser });

export default connect(select)(NewVisitor);
