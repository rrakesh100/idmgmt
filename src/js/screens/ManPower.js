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
import DateTime from 'grommet/components/DateTime';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';
import Toast from 'grommet/components/Toast';



export default class ManPower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: Rand.generateBase30(8),
      name:'',
      joinedDate: '',
      gender: '',
      paymentType: '',
      screenshot: '',
      village: '',
      address: '',
      remarks: '',
      numberOfPersons: '',
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

  onJoinedDateChange(e) {
    this.setState({joinedDate:e})
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

  onSavingData() {
    const {name, joinedDate, screenshot, gender, village, address, paymentType, remarks, numberOfPersons} = this.state
    this.setState({
      name:'',
      joinedDate:'',
      screenshot: '',
      gender: '',
      village: '',
      address: '',
      paymentType: '',
      remarks: '',
      numberOfPersons: '',
      showLiveCameraFeed: true,
      toastMsg: `User ${name} is saved`
    })
  }

  onSubmitClick(e) {
    e.stopPropagation();
    const {name, joinedDate, screenshot, gender, village, address, paymentType, remarks, numberOfPersons} = this.state;
    if (!name) {
      alert('NAME is missing');
      this.setState({
        validationMsg: 'NAME is missing'
      });
      return;
    }
    if (!screenshot) {
      alert('IMAGE is not taken. Click on the camera to take photo!');
      this.setState({
        validationMsg: 'IMAGE is not taken. Click on the camera to take photo!'
      });
      return
    }
    if (!joinedDate) {
      alert('JOINED DATA is missing');
      this.setState({
        validationMsg: 'JOINED DATA is missing'
      });
      return;
    }
    if (!gender) {
      alert('GENDER is missing');
      this.setState({
        validationMsg: 'GENDER is missing'
      });
      return;
    }
    if (!village) {
      alert('VILLAGE is missing');
      this.setState({
        validationMsg: 'VILLAGE is missing'
      });
      return;
    }
    if (!paymentType) {
      alert('PAYMENT TYPE is missing');
      this.setState({
        validationMsg: 'PAYMENT TYPE is missing'
      });
      return
    }
    if (!numberOfPersons) {
      alert('NUMBER OF PERSONS is missing');
      this.setState({
        validationMsg: 'NUMBER OF PERSONS is missing'
      });
      return
    }
    this.setState({validationMsg:''}, this.onSavingData.bind(this))
  }

  toastClose() {
    this.setState({ toastMsg: '' });
  }

  renderToastMsg() {
    const { toastMsg } = this.state;
    if(toastMsg) {
      return (
        <Toast status='ok'
          onClose={ this.toastClose.bind(this) }>
          { toastMsg }
        </Toast>
      );
    }
    return null;
  }

  renderInputFields() {
    return (
      <Article>
      <Section>
       <Split>
        <Box direction='column' style={{marginLeft:'30px'}}>
        <Form className='manPowerFields'>
          <Barcode value={this.state.employeeId} height={20} />
        <FormField  label='Joined Date *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <DateTime id='id'
        format='D/M/YYYY'
        name='name'
        onChange={this.onJoinedDateChange.bind(this)}
        value={this.state.joinedDate}
        />
        </FormField>
        <FormField  label='Name *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='name'
              value={this.state.name}
              onDOMChange={this.onFieldChange.bind(this, 'name')}
          />
        </FormField>
          <FormField  label='Gender *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <Select
              placeHolder='Gender'
              options={['Male', 'Female']}
              value={this.state.gender}
              onChange={this.onFieldChange.bind(this, 'gender')}
            />
          </FormField>
          <FormField  label='Village *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Village'
              value={this.state.village}
              onDOMChange={this.onFieldChange.bind(this, 'village')}
            />
          </FormField>
          <FormField  label='Address'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Address'
              value={this.state.address}
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
              options={['Daily payment', 'Weekly payment', 'Jattu-Daily payment']}
              value={this.state.paymentType}
              onChange={this.onFieldChange.bind(this, 'paymentType')}
            />
          </FormField>
          <FormField  label='Remarks'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Remarks'
              value={this.state.remarks}
              onDOMChange={this.onFieldChange.bind(this, 'remarks')}
            />
          </FormField>
          <FormField  label='No of persons *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='No of persons'
              value={this.state.numberOfPersons}
              onDOMChange={this.onFieldChange.bind(this, 'numberOfPersons')}
            />
          </FormField>
        </Form>
        </Box>
        <Box onClick={this.capture.bind(this)}
        size='small' direction='column'
        style={{marginLeft:'10px', marginTop:'10px', width:'300px'}}
        align='center'>
        { this.renderCamera() }
        <Section pad='small'
          align='center'>
          <Button
            label='SAVE'
            onClick={this.onSubmitClick.bind(this)}
            disabled={true}
            href='#'
            primary={true} />
        </Section>
        </Box>
        </Split>
        </Section>
      </Article>
    )
  }

  render() {


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
      { this.renderToastMsg() }
      </div>
    )
  }
}
