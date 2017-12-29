import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import PrintTemplate from 'react-print';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import Clock from 'react-live-clock';
import Moment from 'moment';


// import Anchor from 'grommet/components/Anchor';
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



// import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';

// import Label from 'grommet/components/Label';
// import Meter from 'grommet/components/Meter';
// import Notification from 'grommet/components/Notification';
// import Value from 'grommet/components/Value';
import Edit from 'grommet/components/icons/base/Print';

// import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';


class NewVisitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed: true,
      visitorId: Rand.generateBase30(8)
    };
  }

  render() {
    const { validationMsg } = this.state;
    return (
      <div className='newVisitor'>
        { validationMsg ? <Notification message={validationMsg} size='small' status='critical'/> : null}
        <Article scrollStep={false}
          direction='column'
          primary={true} full={true}>
          <Header
            direction='row'
            size='large'
            colorIndex='light-2'
            align='center'
            responsive={true}
            pad={{ horizontal: 'small' }}
          >
            <Anchor path='/tasks'>
              <LinkPrevious a11yTitle='Back' />
            </Anchor>
            <Heading margin='none' strong={true}>
              Register Visitor
            </Heading>
          </Header>

          <Section pad='small'
            justify='center'
            className='fields'
            align='center'>
              <Split>
                <Box onClick={this.capture.bind(this)} className='left' align='center'>
                  {this.renderCamera() }
                </Box>
                <Box className='right' direction='column'>
                  <Box align='center'>
                    <Clock className='visitorClock' format={'DD/MM/YYYY hh:mm:ss A'} ticking={true} />

                    <Form>
                      <FormField label='Name' strong={true} size='large'>
                        <TextInput
                          placeHolder='name'
                          onDOMChange={this.onFieldChange.bind(this, 'name')}
                        />
                      </FormField>
                      <FormField label='Info' strong={true}>
                        <TextInput
                          placeHolder='extra info'
                          onDOMChange={this.onFieldChange.bind(this, 'info')}
                        />
                      </FormField>
                    </Form>
                  </Box>
                  <Box align='center'>
                    <Barcode value={this.state.visitorId} />
                  </Box>
                </Box>
              </Split>
          </Section>
          <Section pad='small'
            justify='top'
            align='center'>
              <Button icon={<Edit />}
                label='SAVE & PRINT'
                onClick={this.saveAndPrint.bind(this) }
                disabled={true}
                href='#'
                primary={true} />
          </Section>
        </Article>
        { this.renderBusinessCardForPrint() }
      </div>
    );
  }

  saveAndPrint(e) {
    const { name, screenshot } = this.state;
    if (!name) {
      this.setState({
        validationMsg: 'NAME is missing'
      });
      return;
    }

    if(!screenshot) {
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
    },() => {window.print()});
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.target.value
    });
  }

  renderBusinessCardForPrint() {
    const { name='', info='', timestampStr } = this.state;
    const printName = name.substring(0, 16);
    const printInfo = info.substring(0, 20);

    return (
      <Print name='bizCard' exclusive>
        <div className="card">
          <div className='card-body'>
            <div className="box header">
              <h3>Lalitha Industries</h3>
            </div>
            <div className="box sidebar">
              <Image src={this.state.screenshot} />
            </div>
            <div className="box content">
              <h4 className='bold'>{printName}</h4>
              <h5>{printInfo}</h5>
              <h5>{timestampStr}</h5>
            </div>
            <div className="box footer">
              <Barcode value={this.state.visitorId}
                height={40}
              />
            </div>
          </div>
        </div>
      </Print>
    );
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
        showLiveCameraFeed: true,
        screenshot: ''
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
}

const select = state => ({ ...state.newUser });

export default connect(select)(NewVisitor);
