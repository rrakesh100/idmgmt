import React, { Component } from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Heading from 'grommet/components/Heading';
import Header from 'grommet/components/Header';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import EditIcon from 'grommet/components/icons/base/Edit';
import UpdateIcon from 'grommet/components/icons/base/Update';
import Select from 'grommet/components/Select';
import { Container, Row, Col } from 'react-grid-system';
import { saveWorkPlace, getWorkPlaces, saveEditedWorkPlace } from '../api/workmanager';
import WorkManagerComponent from './WorkManagerComponent';
import Footer from 'grommet/components/Footer';
import Box from 'grommet/components/Box';



export default class WorkManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      workPlaceBtnClick: false,
      workPlaceEditClick: false,
      shift: '',
      numOfMale: '',
      numOfFemale: ''
    }
  }

  componentDidMount() {
    this.getWorkPlaces() 
  }

  getWorkPlaces() {
    getWorkPlaces().then((snap) => {
      this.setState({
        workplaces: snap.val()
      })
    })
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  onShiftFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option
    })
  }

  onAddWorkPlace() {
    this.setState({
      workPlaceBtnClick: true
    })
  }

  onWorkPlaceCloseLayer() {
    this.setState({
      workPlaceBtnClick: false
    })
  }

  renderWorkPlace() {
    return (
      <Button label='ADD'
      href='#' onClick={this.onAddWorkPlace.bind(this)}
      primary={true} style={{float: 'right', marginRight: '20px'}}/>
    )
  }

  renderWorkPlaceLayer() {
    if(this.state.workPlaceBtnClick) {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onWorkPlaceCloseLayer.bind(this)}>
        <Form>
        <p>Enter Workplace Slot</p>
        <FormField  label='Enter Workplace Location'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Workplace'
            value={this.state.workplace}
            onDOMChange={this.onFieldChange.bind(this, 'workplace')} />
        </FormField>
        </Form>
      <Row>
      <Button label='SAVE'
      primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
      href='#' onClick={this.onSavingWorkPlace.bind(this)}/>
      </Row>
        </Layer>
      )
    }
  }

  onSavingWorkPlace() {
    const { workplace } = this.state;

    saveWorkPlace(workplace).then(() => {
      alert('workplace successfully saved')
      this.setState({
        msg: 'workplace successfully saved',
        workPlaceBtnClick: false,
        workplace:''
      }, this.getWorkPlaces())
    }).catch((e) => console.log(e))
  }

  renderWorkPlaceTable() {
    const { workplaces } = this.state;
    if(workplaces) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Work Place</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(workplaces).map((key, index) => {
           return (
             <TableRow key={index}>
              <td>{index+1}</td>
              <td>{key}</td>
              </TableRow>
           )
         })
       }
       </tbody>
       </Table>
    )
  }
  }

  onEditWorkPlace(key) {
    this.setState({
      workPlaceEditClick: true,
      editWorkPlaceId: key
    })
  }

  renderAllWorkPlaces() {
    const { workplaces } = this.state;
    if(workplaces) {
    return (
      <Table style={{marginLeft: '40px', width: '90%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Work Place</th>
         <th>Shift</th>
         <th>Male</th>
         <th>Female</th>
         <th></th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(workplaces).map((key, index) => {
           return (
             <TableRow key={index}>
              <td>{index+1}</td>
              <td>{key}</td>
              <td></td>
              <td></td>
              <td></td>
              <td>
              <Button icon={<EditIcon />}
                    onClick={this.onEditWorkPlace.bind(this, key)}
                    plain={true} />
              </td>
              </TableRow>
           )
         })
       }
       </tbody>
       </Table>
    )
  }
  }

  onCloseLayer() {
    this.setState({
      workPlaceEditClick: false
    })
  }

  onUpdateWorkPlace() {
    const { shift, numOfMale, numOfFemale, editWorkPlaceId } = this.state;
    saveEditedWorkPlace({
      editWorkPlaceId,
      shift,
      numOfMale,
      numOfFemale
    }).then(() => {
    this.setState({
      workPlaceEditClick: false,
      shift: '',
      numOfMale: '',
      numOfFemale: ''
    })
  }
  ).catch((e) => console.log(e))

  }

  renderWorkPlaceEditForm() {
    const { workPlaceEditClick } = this.state;
    if(workPlaceEditClick) {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onCloseLayer.bind(this)}>

        <Header
          direction='row'
          size='small'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}>
          <Heading margin='none' strong={true}>
            WORK PLACE EDIT
          </Heading>
        </Header>
        <Box direction='column'>
        <Form>
        <p style={{marginLeft : '80px'}}>Select Shift</p>
        <FormField style={{marginLeft : '80px',width:'300px'}} >
          <Select style={{marginLeft: '20px'}}
            placeHolder='Select Shift'
            options={['DAY', 'NIGHT']}
            value={this.state.shift}
            onChange={this.onShiftFieldChange.bind(this, 'shift')}
          />
        </FormField>
        <p style={{marginLeft : '80px'}}>Enter No.of Male</p>
        <TextInput style={{marginLeft: '80px', width: '300px'}}
            placeHolder='number of male'
            value={this.state.male}
            onDOMChange={this.onFieldChange.bind(this, 'numOfMale')}
        />
        <p style={{marginLeft : '80px'}}>Enter No.of Female</p>
        <TextInput style={{marginLeft: '80px', width: '300px'}}
            placeHolder='number of female'
            value={this.state.female}
            onDOMChange={this.onFieldChange.bind(this, 'numOfFemale')}
        />
        </Form>
        <Footer pad={{"vertical" : "medium"}} style={{marginTop:'25px', marginLeft:'140px'}}>
          <Button label='update' icon={<UpdateIcon />}
          href='#' onClick={this.onUpdateWorkPlace.bind(this)}
          primary={true} style={{}}/>
        </Footer>
        </Box>
        </Layer>
      );
    }
  }

  render() {
    const { workplaces } = this.state;
    return (
      <div>
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}
        style={{marginLeft:'10px'}}>
        <Heading margin='none' strong={true}>
          WORK MANAGER
        </Heading>
      </Header>
      <Tabs justify='start' style={{marginLeft:'40px'}}>
        <Tab title='Work place allocation'>
        <WorkManagerComponent />
        </Tab>
        <Tab title='Work places (Master)'>
        { this.renderWorkPlace() }
        { this.renderWorkPlaceLayer() }
        { this.renderWorkPlaceTable() }
        </Tab>
        <Tab title='Manpower allocation (Master)'>
        { this.renderAllWorkPlaces() }
        { this.renderWorkPlaceEditForm() }
        </Tab>
        <Tab title='Reports'>

        </Tab>
      </Tabs>
      </div>
    )
  }
}
