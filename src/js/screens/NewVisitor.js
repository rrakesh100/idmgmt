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

  printNewVisitor() {
    setTimeout(() => window.print(), 4000);
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
        }, this.printNewVisitor() )
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


  renderBusinessCardForPrint() {
    const { name = '', whomToMeet = '', purpose='', comingFrom='',mobile='', remarks='', timestampStr, department,company='', screenshot, serialNo='' } = this.state;

    if(!screenshot)
      return null

    return (
       <Print name='bizCard' exclusive>
       <div className="printVisitor">
        <div className='card' style={{width:'100%', height:'30%'}}>
          <div className='card-body'>
            <div className='box header'>
              <h5>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</h5>
              <h5>Unit-II, Valuthimmapuram Road, Peddapuram</h5>
              <h5 style={{textDecoration : 'underline'}}>VISITOR PASS</h5>

            </div>
            <div className='box sidebar'>
              <Image src={screenshot} />
            </div>
            <div className='box content'>
            <Table>
              <tbody>
                <TableRow>
                  <td>
                    <div style={{overflowWrap: 'break-word'}}>Name: <b>{name.toUpperCase()}</b></div>
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
                      Company: <b>{company.toUpperCase()}</b>
                    </td>
                    <td>
                      Remarks: <b>{remarks}</b>
                    </td>
                </TableRow>
                <TableRow style={{marginTop : '40px', color:'red'}}>
                  <td>
                    In Time: <b>{timestampStr}</b>
                  </td>
                  <td>
                    Serial No.#: <b>{serialNo}</b>
                  </td>
              </TableRow>
                </tbody>
              </Table>
                <Table style={{marginTop : '40px'}}>
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
            <div className='footer'>
              <Barcode value={this.state.visitorId}
                height={20}
              />
            </div>
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
                  {this.renderCamera() }
                  <Barcode value={this.state.visitorId} style="" height="20"/>
                  <Section pad='small'
                    align='center'>
                    <Button icon={<Edit />}
                      label='SAVE'
                      onClick={this.onSubmitClick.bind(this)}
                      disabled={true}
                      href='#'
                      primary={true} />
                  </Section>
              </Box>
            </Split>
          </Section>
      </div>
    );
  }
}

const select = state => ({ ...state.newUser });

export default connect(select)(NewVisitor);
