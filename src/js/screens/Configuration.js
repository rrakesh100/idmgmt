import React, {Component} from 'react';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Heading from 'grommet/components/Heading';
import Header from 'grommet/components/Header';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Select from 'grommet/components/Select';
import { saveShift, saveTimeslot, saveVillage } from '../api/configuration';
import { Container, Row, Col } from 'react-grid-system';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import { getShifts, getTimeslots, getVillages } from '../api/configuration';



export default class Configuration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shiftBtnClick: false,
      timeslotBtnClick: false,
      villageBtnClick: false,
      timeslot: '',
      shift: '',
      village: ''
    }
  }

  componentDidMount() {
    { this.getShiftDetails() }
    { this.getTimeslotDetails() }
    { this.getVillageDetails() }
  }

  getShiftDetails() {
    getShifts().then((snap) => {
      this.setState({
        shifts: snap.val()
      })
    })
  }

  getTimeslotDetails() {
    getTimeslots().then((snap) => {
      this.setState({
        timeslots: snap.val()
      })
    })
  }

  getVillageDetails() {
    getVillages().then((snap) => {
      this.setState({
        villages: snap.val()
      })
    })
  }

  onFieldChange(fieldName, e) {

    this.setState({
      [fieldName]: e.target.value
    })
  }

  onShiftAddBtnClick() {
    this.setState({
      shiftBtnClick: true
    })
  }

  onTimeslotAddBtnClick() {
    this.setState({
      timeslotBtnClick: true
    })
  }

  onVillageAddBtnClick() {
    this.setState({
      villageBtnClick: true
    })
  }

  renderShiftTab() {
    return (
      <Button label='ADD'
      href='#' onClick={this.onShiftAddBtnClick.bind(this)}
      primary={true} style={{float: 'right', marginRight: '20px'}}/>
    )
  }

  renderTimeslot() {
    return (
      <Button label='ADD'
      href='#' onClick={this.onTimeslotAddBtnClick.bind(this)}
      primary={true} style={{float: 'right', marginRight: '20px'}}/>
    )
  }

  renderVillage() {
    return (
      <Button label='ADD'
      href='#' onClick={this.onVillageAddBtnClick.bind(this)}
      primary={true} style={{float: 'right', marginRight: '20px'}}/>
    )
  }

  onShiftCloseLayer() {
    this.setState({
      shiftBtnClick: false
    })
  }

  onTimeslotCloseLayer() {
    this.setState({
      timeslotBtnClick: false
    })
  }

  onVillageCloseLayer() {
    this.setState({
      villageBtnClick: false
    })
  }

  onSavingShift() {
    const {shift} = this.state;

    saveShift(shift).then(() => {
      alert('shift successfully saved')
      this.setState({
        msg: 'shift successfully saved',
        shiftBtnClick: false,
        shift:''
      }, this.getShiftDetails())
    }).catch((e) => console.log(e))
  }

  onSavingTimeslot() {
    const {timeslot} = this.state;

    saveTimeslot(timeslot).then(() => {
      alert('timeslot successfully saved')
      this.setState({
        msg: 'timeslot successfully saved',
        timeslotBtnClick: false,
        timeslot: ''
      }, this.getTimeslotDetails())
    }).catch((e) => console.log(e))
  }

  onSavingVillage() {
    const {village} = this.state;

    saveVillage(village).then(() => {
      alert('village successfully saved')
      this.setState({
        msg: 'village successfully saved',
        villageBtnClick: false,
        village: ''
      }, this.getVillageDetails())
    }).catch((e) => console.log(e))
  }

  renderShiftLayer() {

    if(!this.state.shiftBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onShiftCloseLayer.bind(this)}>
          <Form>
          <p>Enter Shift</p>
          <FormField  label='Shift'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Shift'
              value={this.state.shift}
              onDOMChange={this.onFieldChange.bind(this, 'shift')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingShift.bind(this)}/>
        </Row>
        </Layer>
      );
    }
  }

  renderTimeslotLayer() {

    if(!this.state.timeslotBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onTimeslotCloseLayer.bind(this)}>
        <Form>
        <p>Enter Time Slot</p>
        <FormField  label='Time Slot'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Time Slot'
            value={this.state.timeslot}
            onDOMChange={this.onFieldChange.bind(this, 'timeslot')} />
        </FormField>
        </Form>
      <Row>
      <Button label='Add'
      primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
      href='#' onClick={this.onSavingTimeslot.bind(this)}/>
      </Row>
        </Layer>
      );
    }
  }

  renderVillageLayer() {
    if(!this.state.villageBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onVillageCloseLayer.bind(this)}>
        <Form>
        <p>Enter Village</p>
        <FormField  label='Village'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Village'
            value={this.state.village}
            onDOMChange={this.onFieldChange.bind(this, 'village')} />
        </FormField>
        </Form>
      <Row>
      <Button label='Add'
      primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
      href='#' onClick={this.onSavingVillage.bind(this)}/>
      </Row>
        </Layer>
      );
    }
  }

  renderAllShifts() {
    const { shifts } = this.state;
    if(shifts) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Shift</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(shifts).map((key, index) => {
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

  renderAllTimeslots() {
    const { timeslots } = this.state;
    if(timeslots) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Time Slot</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(timeslots).map((key, index) => {
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

  renderAllVillages() {
    const { villages } = this.state;
    if(villages) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Village</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(villages).map((key, index) => {
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
  render() {
    const { shifts, timeslots, villages } = this.state;

    return (
      <div className='configuration'>
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}
        style={{marginLeft:'10px'}}>
        <Heading margin='none' strong={true}>
          CONFIGURATION
        </Heading>
      </Header>
      <Tabs justify='start' style={{marginLeft:'40px'}}>
      <Tab title='SHIFT'>
      { this.renderShiftTab() }
      { this.renderShiftLayer() }
      { this.renderAllShifts() }
      </Tab>
      <Tab title='TIME SLOT'>
      { this.renderTimeslot() }
      { this.renderTimeslotLayer() }
      { this.renderAllTimeslots() }
      </Tab>
      <Tab title='VILLAGE'>
      { this.renderVillage() }
      { this.renderVillageLayer() }
      { this.renderAllVillages() }
      </Tab>
      </Tabs>
      </div>
    )
  }
}
