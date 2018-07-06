import React, {Component} from 'react';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Heading from 'grommet/components/Heading';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Label from 'grommet/components/Label';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';
import { getEmployees, getEmployee, saveEditedEmployee } from '../api/employees';
import UpdateIcon from 'grommet/components/icons/base/Update';
import EditIcon from 'grommet/components/icons/base/Edit';
import Layer from 'grommet/components/Layer';
import Footer from 'grommet/components/Footer';



export default class ManPowerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      joinedDate: '',
      gender: '',
      paymentType: '',
      screenshot: '',
      village: '',
      address: '',
      remarks: '',
      numberOfPersons: '',
    }
  }

  componentDidMount() {
    const {screenshot} = this.props;
    this.setState({screenshot})
    { this.getEmployee() }
  }

  getEmployee() {
    const { employeeId } = this.props;
    getEmployee(employeeId).then((snap) => {
      console.log(snap.val())
      this.setState(
        snap.val()
      )
    }).catch((e) => console.log(e))
  }

  onFieldChange(fieldName, e) {

    this.setState({
      [fieldName]: e.target.value
    })
  }

  onJoinedDateChange(e) {
    this.setState({joinedDate:e})
  }

  onUpdateFields() {
    const { name, employeeId,joinedDate, gender, screenshot, village, address, paymentType, remarks, numberOfPersons } = this.state;
    saveEditedEmployee({
      name,
      employeeId,
      joinedDate,
      gender,
      village,
      address,
      paymentType,
      remarks,
      numberOfPersons,
      screenshot
    }).then(
      this.props.onSubmit(true, name)
  ).catch((e) => {
    this.props.onSubmit(false, name)
    console.log(e)
  })
 }

  render() {

    console.log(this.state)
    const {paymentType,screenshot} = this.state;
    return (
      <div>
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}>
        <Heading margin='none' strong={true}
        style={{marginLeft: '300px'}}>
          MAN POWER EDIT
        </Heading>
      </Header>
      <Split>
      <Box direction='column'>
      <Form className='manPowerFields'>
      <FormField  label='Joined Date'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
      <DateTime id='id'
      format='D/M/YYYY'
      name='name'
      onChange={this.onJoinedDateChange.bind(this)}
      value={this.state.joinedDate}
      />
      </FormField>
      <FormField  label='Name'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
        <TextInput
            placeHolder='Name'
            value={this.state.name}
            onDOMChange={this.onFieldChange.bind(this, 'name')}
        />
      </FormField>
        <FormField  label='Gender'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
        <Label style={{marginLeft:'20px'}}><strong>{this.state.gender}</strong></Label>
        </FormField>
        <FormField  label='Village'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
          <TextInput
            placeHolder='Village'
            value={this.state.village}
            onDOMChange={this.onFieldChange.bind(this, 'village')}
          />
        </FormField>
        </Form>
        </Box>
        <Box direction='column'>
        <Form compact={true}>
        <FormField  label='Address'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
          <TextInput
            placeHolder='Address'
            value={this.state.address}
            onDOMChange={this.onFieldChange.bind(this, 'address')}
          />
        </FormField>
        <FormField  label='Payment Type'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
          <Label style={{marginLeft:'20px'}}><strong>{this.state.paymentType}</strong></Label>
        </FormField>
        <FormField  label='Remarks'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
          <TextInput
            placeHolder='Remarks'
            value={this.state.remarks}
            onDOMChange={this.onFieldChange.bind(this, 'remarks')}
          />
        </FormField>
        {paymentType == 'Jattu-Daily payment' ?
        <FormField  label='No of persons *'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
          <TextInput
            placeHolder='No of persons'
            value={this.state.numberOfPersons}
            onDOMChange={this.onFieldChange.bind(this, 'numberOfPersons')}
          />
        </FormField> : null}
      </Form>
      </Box>
      <Box direction='column'>
      <Form compact={true}>
      <Image src={screenshot} style={{marginTop:'25px', width:'300px', height:'270px'}}/>
      <Footer pad={{"vertical" : "medium"}} style={{marginTop:'25px', marginLeft:'75px'}}>
      <Button label='update'
      primary={true} icon={<UpdateIcon />}
      onClick={this.onUpdateFields.bind(this)}/>
      </Footer>
      </Form>
      </Box>
      </Split>
      </div>
    )
  }
}
