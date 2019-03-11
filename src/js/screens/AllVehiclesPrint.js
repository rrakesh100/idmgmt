import React, {Component} from 'react';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Button from 'grommet/components/Button';
import PrintIcon from 'grommet/components/icons/base/Print';
import { getAllVehicles } from '../api/vehicles';
import VehicleInPrintComponent from '../components/VehicleInPrintComponent';
import ReactToPrint from "react-to-print";


export default class AllVehiclesPrint extends Component {
  constructor(props) {
    super(props);
    this.state={
      vehicles: null,
      vehicleInObj: null,
    }
  }

  componentDidMount() {
    getAllVehicles().then((snap) => {
      this.setState({
        vehicles: snap.val()
      })
    }).catch((err) => {
      console.error('ALL VEHICLES FETCH FAILED', err)
    })
  }

  onVehicleInPrint(vehicle) {
    const {vehicles} = this.state;
    let vehicleInObj = vehicles[vehicle]['lastInward'];
    console.log(vehicleInObj);
    this.setState({vehicleInObj})
  }

  onVehicleOutPrint() {

  }

  renderContent() {
    return this.componentRef;
  }

  renderTrigger(vehicle) {
    return (
      <Button icon={<PrintIcon />}
            onClick={this.onVehicleInPrint.bind(this, vehicle)}
            plain={true} />
    )
  }

  setPrintRef(ref) {
    this.componentRef = ref;
  }

  renderVehiclePrintCard() {
    const {vehicleInObj} = this.state;
    if(!vehicleInObj)
    return;
    return (
      <VehicleInPrintComponent
        ref={this.setPrintRef.bind(this)}
        screenshot={vehicleInObj.screenshot}
        inwardSNo={vehicleInObj.inwardSNo}
        ownOutVehicle={vehicleInObj.ownOutVehicle}
        vehicleNumber={vehicleInObj.vehicleNumber}
        driverName={vehicleInObj.driverName}
        driverNumber={vehicleInObj.driverNumber}
        remarks={vehicleInObj.remarks}
        material={vehicleInObj.material}
        numberOfBags={vehicleInObj.numberOfBags}
        comingFrom={vehicleInObj.comingFrom}
        billNumber={vehicleInObj.billNumber}
      />
    )
  }



  render() {
    const {vehicles} = this.state;
    if(!vehicles)
    return null;
    let i=0;
    return (
      <div>
      { this.renderVehiclePrintCard() }
      <div className='table'>
      <Table scrollable={true} style={{marginTop : '60px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Vehicle Number</th>
             <th>Vehicle In</th>
             <th>Vehicle Out</th>
           </tr>
          </thead>
          <tbody>
          {
            Object.keys(vehicles).map((vehicle, index) => {
              i++;

              if(vehicle !== 'U2') {
                const vehicleInwardItem = vehicles[vehicle]['lastInward'];
                const vehicleOutwadItem = vehicles[vehicle]['lastOutward'];
                return <TableRow key={index}>
                <td>{i}</td>
                <td>{vehicle}</td>
                <td>
                   <ReactToPrint
                       trigger={this.renderTrigger.bind(this, vehicle)}
                       content={this.renderContent.bind(this)}
                     />
                </td>
                <td>
                   <Button icon={<PrintIcon />}
                         onClick={this.onVehicleOutPrint.bind(this)}
                         plain={true} />
                </td>
                </TableRow>
              }
            })
          }
          </tbody>
      </Table>
      </div>
      </div>
    )
  }
}
