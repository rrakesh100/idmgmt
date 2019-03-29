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
import { saveShift, saveTimeslot, saveVillage, saveVehicle, saveDriver, saveOwnPlace, saveMaterial, saveParty, saveAgent } from '../api/configuration';
import { Container, Row, Col } from 'react-grid-system';
import Status from 'grommet/components/icons/Status';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import { getShifts,
  getTimeslots,
  getVillages,
  getVehicleNumbers,
  getDrivers,
  getOwnPlaces,
  getMaterials,
  getParties,
  getAgents
 } from '../api/configuration';

const AddButton = ({onClick}) => {
  return (
    <Button label='ADD'
    href='#' onClick={onClick}
    primary={true} style={{float: 'right', marginRight: '20px'}}/>
  )
}

export default class Configuration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shiftBtnClick: false,
      timeslotBtnClick: false,
      villageBtnClick: false,
      vehicleBtnClick: false,
      driverBtnClick: false,
      ownPlaceBtnClick: false,
      materBtnClick: false,
      timeslot: '',
      shift: '',
      village: '',
      vehicle: '',
      driverName: '',
      ownPlace: '',
      material: '',
      validationMsg: ''
    }
  }

  componentDidMount() {
     this.getShiftDetails();
     this.getTimeslotDetails();
     this.getVillageDetails();
     this.getVehicleDetails();
     this.getDriverDetails();
     this.getOwnPlaceDetails();
     this.getMaterialDetails();
     this.getPartyDetails();
     this.getAgentDetails();
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

  getVehicleDetails() {
    getVehicleNumbers().then((snap) => {
      this.setState({
        vehicles: snap.val()
      })
    })
  }

  getDriverDetails() {
    getDrivers().then((snap) => {
      this.setState({
        drivers: snap.val()
      })
    })
  }

  getOwnPlaceDetails() {
    getOwnPlaces().then((snap) => {
      this.setState({
        ownPlaces: snap.val()
      })
    })
  }

  getMaterialDetails() {
    getMaterials().then((snap) => {
      this.setState({
        materials: snap.val()
      })
    })
  }

  getPartyDetails() {
    getParties().then((snap) => {
      this.setState({
        parties: snap.val()
      })
    })
  }

  getAgentDetails() {
    getAgents().then((snap) => {
      this.setState({
        agents: snap.val()
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

  onVehicleAddBtnClick() {
    this.setState({
      vehicleBtnClick: true
    })
  }

  onDriverNameAddBtnClick() {
    this.setState({
      driverBtnClick: true
    })
  }

  onOwnPlacesAddBtnClick() {
    this.setState({
      ownPlaceBtnClick: true
    })
  }

  onMaterialAddBtnClick() {
    this.setState({
      materialBtnClick: true
    })
  }

  onPartyAddBtnClick() {
    this.setState({
      partyBtnClick: true
    })
  }

  onAgentAddBtnClick() {
    this.setState({
      agentBtnClick: true
    })
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

  onVehicleCloseLayer() {
    this.setState({
      vehicleBtnClick: false
    })
  }

  onDriverCloseLayer() {
    this.setState({
      driverBtnClick: false
    })
  }

  onOwnPlaceCloseLayer() {
    this.setState({
      ownPlaceBtnClick: false
    })
  }

  onMaterialCloseLayer() {
    this.setState({
      materialBtnClick: false
    })
  }

  onPartyCloseLayer() {
    this.setState({
      partyBtnClick: false,
      partyName:'',
      partyNum:'',
      partyTown:'',
      partyDistrict:'',
      partyState:''
    })
  }

  onAgentCloseLayer() {
    this.setState({
      agentBtnClick: false,
      agentName:'',
      agentNum:'',
      agentTown:'',
      agentDistrict:'',
      agentState:''
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

  onSavingVehicle() {
    const { unit, vehicleNumber, driver1Name, driver2Name, d1CellNum, d2CellNum } = this.state;

    saveVehicle(vehicleNumber,unit,driver1Name,d1CellNum,driver2Name,d2CellNum).then(() => {
      alert('Vehicle successfully saved')
      this.setState({
        msg: 'Vehicle successfully saved',
        vehicleBtnClick: false,
        vehicleNumber: ''
      }, this.getVehicleDetails())
    }).catch((e) => console.log(e))
  }

  onSavingDriver() {
    const { driverName } = this.state;

    saveDriver(driverName).then(() => {
      alert('Driver successfully saved')
      this.setState({
        msg: 'Driver successfully saved',
        driverBtnClick: false,
        driverName: ''
      }, this.getDriverDetails())
    }).catch((e) => console.log(e))
  }

  onSavingOwnPlace() {
    const { ownPlace } = this.state;

    saveOwnPlace(ownPlace).then(() => {
      alert('Own Place successfully saved')
      this.setState({
        msg: 'Own Place successfully saved',
        ownPlaceBtnClick: false,
        ownPlace: ''
      }, this.getOwnPlaceDetails())
    }).catch((e) => console.log(e))
  }

  onSavingMaterial() {
    const { material } = this.state;

    saveMaterial(material).then(() => {
      alert('Material successfully saved')
      this.setState({
        msg: 'Material successfully saved',
        materialBtnClick: false,
        material: ''
      }, this.getMaterialDetails())
    }).catch((e) => console.log(e))
  }

  onPartySaving() {
    const { partyName, partyNum, partyTown, partyDistrict, partyState } = this.state;

    saveParty(partyName, partyNum, partyTown,partyDistrict,partyState).then(() => {
      alert('Party successfully saved')
      this.setState({
        msg: 'Party successfully saved',
        partyBtnClick: false,
        partyName: '',
        partyNum:'',
        partyTown:'',
        partyDistrict:'',
        partyState:'',
      }, this.getPartyDetails())
    }).catch((e) => console.log(e))
  }

  onSavingParty() {
    const { partyName, partyNum, partyTown, partyDistrict, partyState } = this.state;

    if(!partyName) {
      this.setState({
        validationMsg: 'Party Name is Missing'
      })
      return
    }

    if(!partyNum) {
      this.setState({
        validationMsg: 'Mobile Number is Missing'
      })
      return
    }

    if(partyNum && (partyNum.toString()).length<10) {
      this.setState({
        validationMsg: 'Mobile Number Must contain atleast 10 digits'
      })
      return
    }

    if(!partyTown) {
      this.setState({
        validationMsg: 'Town is Missing'
      })
      return
    }

    if(!partyDistrict) {
      this.setState({
        validationMsg: 'District is Missing'
      })
      return
    }

    if(!partyState) {
      this.setState({
        validationMsg: 'State is Missing'
      })
      return
    }

    this.setState({
      validationMsg:''
    }, this.onPartySaving.bind(this))
  }

  onAgentSaving() {
    const { agentName, agentNum, agentTown, agentDistrict, agentState } = this.state;

    saveAgent(agentName, agentNum, agentTown,agentDistrict,agentState).then(() => {
      alert('Agent successfully saved')
      this.setState({
        msg: 'Agent successfully saved',
        agentBtnClick: false,
        agentName: '',
        agentNum:'',
        agentTown:'',
        agentDistrict:'',
        agentState:'',
      }, this.getAgentDetails())
    }).catch((e) => console.log(e))
  }

  onSavingAgent() {
    const { agentName, agentNum, agentTown, agentDistrict, agentState } = this.state;
    if(!agentName) {
      this.setState({
        validationMsg: 'Agent Name is Missing'
      })
      return
    }

    if(!agentNum) {
      this.setState({
        validationMsg: 'Mobile Number is Missing'
      })
      return
    }

    if(agentNum && (agentNum.toString()).length<10) {
      this.setState({
        validationMsg: 'Mobile Number Must contain atleast 10 digits'
      })
      return
    }

    if(!agentTown) {
      this.setState({
        validationMsg: 'Town is Missing'
      })
      return
    }

    if(!agentDistrict) {
      this.setState({
        validationMsg: 'District is Missing'
      })
      return
    }

    if(!agentState) {
      this.setState({
        validationMsg: 'State is Missing'
      })
      return
    }

    this.setState({
      validationMsg:''
    }, this.onAgentSaving.bind(this))
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

  renderVehiclesLayer() {

    if(!this.state.vehicleBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onVehicleCloseLayer.bind(this)}>
          <Form>
          <FormField  label='Unit'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Unit'
              value={this.state.unit}
              onDOMChange={this.onFieldChange.bind(this, 'unit')} />
          </FormField>
          <FormField  label='Vehicle Number'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Vehicle Number'
              value={this.state.vehicleNumber}
              onDOMChange={this.onFieldChange.bind(this, 'vehicleNumber')} />
          </FormField>
          <FormField  label='Driver1 Name'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Driver1'
              value={this.state.driver1Name}
              onDOMChange={this.onFieldChange.bind(this, 'driver1Name')} />
          </FormField>
          <FormField  label='Driver1 Cell No'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Cell No'
              value={this.state.d1CellNum}
              onDOMChange={this.onFieldChange.bind(this, 'd1CellNum')} />
          </FormField>
          <FormField  label='Driver2 Name'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Driver2'
              value={this.state.driver2Name}
              onDOMChange={this.onFieldChange.bind(this, 'driver2Name')} />
          </FormField>
          <FormField  label='Driver2 Cell No'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Cell No'
              value={this.state.d2CellNum}
              onDOMChange={this.onFieldChange.bind(this, 'd2CellNum')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingVehicle.bind(this)}/>
        </Row>
        </Layer>
      );
    }
  }

  renderDriversLayer() {

    if(!this.state.driverBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onDriverCloseLayer.bind(this)}>
          <Form>
          <p>Enter Driver Name</p>
          <FormField  label='Driver Name'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Driver Name'
              value={this.state.driverName}
              onDOMChange={this.onFieldChange.bind(this, 'driverName')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingDriver.bind(this)}/>
        </Row>
        </Layer>
      );
    }
  }

  renderOwnPlacesLayer() {

    if(!this.state.ownPlaceBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onOwnPlaceCloseLayer.bind(this)}>
          <Form>
          <p>Enter Own Place</p>
          <FormField  label='Own Place'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Own Place'
              value={this.state.ownPlace}
              onDOMChange={this.onFieldChange.bind(this, 'ownPlace')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingOwnPlace.bind(this)}/>
        </Row>
        </Layer>
      );
    }
  }

  renderMaterialsLayer() {

    if(!this.state.materialBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onMaterialCloseLayer.bind(this)}>
          <Form>
          <p>Enter Material</p>
          <FormField  label='Material'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Material'
              value={this.state.material}
              onDOMChange={this.onFieldChange.bind(this, 'material')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingMaterial.bind(this)}/>
        </Row>
        </Layer>
      );
    }
  }

  renderPartyLayer() {

    if(!this.state.partyBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onPartyCloseLayer.bind(this)}>
          <Form>
          <FormField  label='Party Name'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Party Name'
              value={this.state.partyName}
              onDOMChange={this.onFieldChange.bind(this, 'partyName')} />
          </FormField>
          <FormField  label='Cell No'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Cell No'
              value={this.state.partyNum}
              onDOMChange={this.onFieldChange.bind(this, 'partyNum')} />
          </FormField>
          <FormField  label='Town'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='partyTown'
              value={this.state.partyTown}
              onDOMChange={this.onFieldChange.bind(this, 'partyTown')} />
          </FormField>
          <FormField  label='District'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='partyDistrict'
              value={this.state.partyDistrict}
              onDOMChange={this.onFieldChange.bind(this, 'partyDistrict')} />
          </FormField>
          <FormField  label='State'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='partyState'
              value={this.state.partyState}
              onDOMChange={this.onFieldChange.bind(this, 'partyState')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingParty.bind(this)}/>
        </Row>
        </Layer>
      );
    }
  }

  renderAgentLayer() {

    if(!this.state.agentBtnClick)
    return null;
    else {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onAgentCloseLayer.bind(this)}>
          <Form>
          <FormField  label='Agent Name'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Agent Name'
              value={this.state.agentName}
              onDOMChange={this.onFieldChange.bind(this, 'agentName')} />
          </FormField>
          <FormField  label='Cell No'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Cell No'
              value={this.state.agentNum}
              onDOMChange={this.onFieldChange.bind(this, 'agentNum')} />
          </FormField>
          <FormField  label='Town'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Town'
              value={this.state.agentTown}
              onDOMChange={this.onFieldChange.bind(this, 'agentTown')} />
          </FormField>
          <FormField  label='District'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='District'
              value={this.state.agentDistrict}
              onDOMChange={this.onFieldChange.bind(this, 'agentDistrict')} />
          </FormField>
          <FormField  label='State'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='State'
              value={this.state.agentState}
              onDOMChange={this.onFieldChange.bind(this, 'agentState')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingAgent.bind(this)}/>
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

  renderAllVehicles() {
    const { vehicles } = this.state;
    if(vehicles) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Vehicle Number</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(vehicles).map((key, index) => {
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

  renderAllDrivers() {
    const { drivers } = this.state;
    if(drivers) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Driver Name</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(drivers).map((key, index) => {
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

  renderAllOwnPlaces() {
    const { ownPlaces } = this.state;
    if(ownPlaces) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Own Place</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(ownPlaces).map((key, index) => {
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

  renderAllMaterials() {
    const { materials } = this.state;
      if(materials) {
      return (
        <Table style={{marginLeft: '40px', width: '80%'}}>
        <thead style={{position:'relative'}}>
         <tr>
           <th>S No.</th>
           <th>Material</th>
         </tr>
        </thead>
        <tbody>
         {
           Object.keys(materials).map((key, index) => {
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

  renderAllParties() {
    const {parties}=this.state;
    if(parties) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Party</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(parties).map((key, index) => {
           let partyObj=parties[key];
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

  renderAllAgents() {
    const {agents}=this.state;
    if(agents) {
    return (
      <Table style={{marginLeft: '40px', width: '80%'}}>
      <thead style={{position:'relative'}}>
       <tr>
         <th>S No.</th>
         <th>Agent</th>
       </tr>
      </thead>
      <tbody>
       {
         Object.keys(agents).map((key, index) => {
           let agentObj=agents[key];
           return (
             <TableRow key={index}>
                <td>{index+1}</td>
                <td>{agentObj.agentName}</td>
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
    this.setState({validationMsg: ''})
  }

  onOkButtonClick() {
    this.setState({validationMsg: ''})
  }

  renderValidationMsg() {
    const { validationMsg } = this.state;
    if (validationMsg) {
      return (
        <Layer onClose={this.onCloseLayer.bind(this)}>
          <h3 style={{marginTop:20}}>
          <Status value='critical'
          size='medium'
          style={{marginRight:'10px'}} />
          <strong>{validationMsg}</strong>
          </h3>
           <hr />
           <h5>Please Select Again</h5>
           <Row>
           <Button
             label='OK'
             onClick={this.onOkButtonClick.bind(this)}
             href='#' style={{marginLeft: '300px', marginBottom:'10px'}}
             primary={true} />
           </Row>
        </Layer>
      );
    }
    return null;
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
      {this.renderValidationMsg()}
      <Tabs justify='start' style={{marginLeft:'40px'}}>
      <Tab title='SHIFT'>
      <AddButton onClick={this.onShiftAddBtnClick.bind(this)}/>
      { this.renderShiftLayer() }
      { this.renderAllShifts() }
      </Tab>
      <Tab title='TIME SLOT'>
      <AddButton onClick={this.onTimeslotAddBtnClick.bind(this)}/>
      { this.renderTimeslotLayer() }
      { this.renderAllTimeslots() }
      </Tab>
      <Tab title='VILLAGE'>
      <AddButton onClick={this.onVillageAddBtnClick.bind(this)}/>
      { this.renderVillageLayer() }
      { this.renderAllVillages() }
      </Tab>
      <Tab title='VEHICLES'>
      <AddButton onClick={this.onVehicleAddBtnClick.bind(this)}/>
      { this.renderVehiclesLayer() }
      { this.renderAllVehicles() }
      </Tab>
      <Tab title='DRIVER NAMES'>
      <AddButton onClick={this.onDriverNameAddBtnClick.bind(this)}/>
      { this.renderDriversLayer() }
      { this.renderAllDrivers() }
      </Tab>
      <Tab title='OWN PLACES'>
      <AddButton onClick={this.onOwnPlacesAddBtnClick.bind(this)}/>
      { this.renderOwnPlacesLayer() }
      { this.renderAllOwnPlaces() }
      </Tab>
      <Tab title='MATERIAL'>
      <AddButton onClick={this.onMaterialAddBtnClick.bind(this)}/>
      { this.renderMaterialsLayer() }
      { this.renderAllMaterials() }
      </Tab>
      <Tab title='PARTY'>
      <AddButton onClick={this.onPartyAddBtnClick.bind(this)}/>
      { this.renderPartyLayer() }
      { this.renderAllParties() }
      </Tab>
      <Tab title='AGENT'>
      <AddButton onClick={this.onAgentAddBtnClick.bind(this)}/>
      { this.renderAgentLayer() }
      { this.renderAllAgents() }
      </Tab>
      </Tabs>
      </div>
    )
  }
}
