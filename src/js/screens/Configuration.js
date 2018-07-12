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
        shiftBtnClick: false
      })
    }).catch((e) => console.log(e))
  }

  onSavingTimeslot() {
    const {timeslot} = this.state;

    saveTimeslot(timeslot).then(() => {
      alert('timeslot successfully saved')
      this.setState({
        msg: 'timeslot successfully saved',
        timeslotBtnClick: false
      })
    }).catch((e) => console.log(e))
  }

  onSavingVillage() {
    const {village} = this.state;

    saveVillage(village).then(() => {
      alert('village successfully saved')
      this.setState({
        msg: 'village successfully saved',
        villageBtnClick: false
      })
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

  render() {
    console.log(this.state)
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
      </Tab>
      <Tab title='TIME SLOT'>
      { this.renderTimeslot() }
      { this.renderTimeslotLayer() }
      </Tab>
      <Tab title='VILLAGE'>
      { this.renderVillage() }
      { this.renderVillageLayer() }
      </Tab>
      </Tabs>
      </div>
    )
  }
}
