import React, {Component} from 'react';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Heading from 'grommet/components/Heading';
import Header from 'grommet/components/Header';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Select from 'grommet/components/Select';
import Webcam from 'react-webcam';



export default class ManPower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinedDate: '',
      gender: '',
      paymentType: '',
      showLiveCameraFeed: true
    }
  }

  onFieldChange(fieldName, e) {
    if(fieldName === 'joinedDate' || fieldName === 'gender' || fieldName ==='paymentType') {
      this.setState({
        [fieldName]: e.option
      })
    } else {
      this.setState({
        [fieldName]: e.target.value
      });
  }
}

setRef(webcam) {
  this.webcam = webcam;
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

  renderInputFields() {
    return (
      <div>
      <Section>
       <Split>
        <Box direction='column' style={{marginLeft:'30px'}}>
        <Form className='manPowerFields'>
        <FormField  label='Mcode *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
            placeHolder='Mcode'
            onDOMChange={this.onFieldChange.bind(this, 'mcode')}
          />
        </FormField>
        <FormField  label='Joined Date *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <Select
            placeHolder='Joined Date'
            options={['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']}
            value={this.state.joinedDate}
            onChange={this.onFieldChange.bind(this, 'joinedDate')}
          />
        </FormField>
        <FormField  label='Name *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='name'
              onDOMChange={this.onFieldChange.bind(this, 'name')}
          />
        </FormField>
          <FormField  label='Gender *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <Select
              placeHolder='Gender'
              options={['male', 'female']}
              value={this.state.gender}
              onChange={this.onFieldChange.bind(this, 'gender')}
            />
          </FormField>
          <FormField  label='Village *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Village'
              onDOMChange={this.onFieldChange.bind(this, 'village')}
            />
          </FormField>
          <FormField  label='Address'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Address'
              onDOMChange={this.onFieldChange.bind(this, 'address')}
            />
          </FormField>
          </Form>
          </Box>
          <Box direction='column' style={{marginLeft:'20px'}}>
          <Form>
          <FormField  label='Payment Type *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <Select
              placeHolder='Payment Type'
              options={['debit card', 'credit card', 'cash']}
              value={this.state.paymentType}
              onChange={this.onFieldChange.bind(this, 'paymentType')}
            />
          </FormField>
          <FormField  label='Remarks'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Remarks'
              onDOMChange={this.onFieldChange.bind(this, 'remarks')}
            />
          </FormField>
          <FormField  label='No of persons *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='No of persons'
              onDOMChange={this.onFieldChange.bind(this, 'numberOfPersons')}
            />
          </FormField>
        </Form>
        </Box>
        <Box onClick={this.capture.bind(this)} size='small' style={{marginLeft:'10px', marginTop:'10px'}}>
        { this.renderCamera() }
        </Box>
        </Split>
        </Section>
      </div>
    )
  }

  render() {
    console.log(this.state)

    return (
      <div className='manPower'>
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}
        style={{marginLeft:'10px'}}>
        <Heading margin='none' strong={true}>
          MAN POWER
        </Heading>
      </Header>
      <Tabs justify='start' style={{marginLeft:'40px'}}>
      <Tab title='ADD'>
      { this.renderInputFields() }
      </Tab>
      </Tabs>
      </div>
    )
  }
}
