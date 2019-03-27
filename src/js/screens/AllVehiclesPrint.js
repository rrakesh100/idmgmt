import React, {Component} from 'react';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Button from 'grommet/components/Button';
import PrintIcon from 'grommet/components/icons/base/Print';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import { getAllVehicles } from '../api/vehicles';
import VehicleInPrintComponent from '../components/VehicleInPrintComponent';
import VehicleOutPrintComponent from '../components/VehicleOutPrintComponent';
import ReactToPrint from "react-to-print";
import Layer from 'grommet/components/Layer';
import Article from 'grommet/components/Article';
import ReactFileReader from 'react-file-reader';
import FileReaderInput from 'react-file-reader-input';


export default class AllVehiclesPrint extends Component {
  constructor(props) {
    super(props);
    this.state={
      vehicles: null,
      vehicleInObj: null,
      vehicleOutObj: null,
      showVehicleList: true
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
    let vehicleInObj = vehicles[vehicle] && vehicles[vehicle]['lastInward'];
    this.setState({vehicleInObj, showVehicleList:false})
  }

  onVehicleOutPrint(vehicle) {
    const {vehicles} = this.state;
    let vehicleOutObj = vehicles[vehicle] && vehicles[vehicle]['lastOutward'];
    this.setState({vehicleOutObj, showVehicleList: false})
  }

  renderInContent() {
    return this.vInRef;
  }

  renderOutContent() {
    return this.vOutRef;
  }


  renderInTrigger(vehicle) {
    return (
      <div className="prntAnchor" style={{marginRight:30}}>
        <a>Print</a>
      </div>
    )
  }

  renderOutTrigger(vehicle) {
    return (
      <div className="prntAnchor" style={{marginRight:30}}>
        <a>Print</a>
      </div>
    )
  }

  setInPrintRef(ref) {
    this.vInRef = ref;
  }

  setOutPrintRef(ref) {
    this.vOutRef = ref;
  }

  onVehicleInCloseLayer() {
    this.setState({
      vehicleInObj: null
    })
  }

  onVehicleOutCloseLayer() {
    this.setState({
      vehicleOutObj: null
    })
  }

  onInGoingBack() {
    this.setState({
      vehicleInObj: null,
      showVehicleList: true
    })
  }

  onOutGoingBack() {
    this.setState({
      vehicleOutObj: null,
      showVehicleList: true
    })
  }


  renderVehicleInPrintCard() {
    const {vehicleInObj} = this.state;
    if(!vehicleInObj)

    return;
    return (
      <Article>
        <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent: 'space-between'}}>
        <Button icon={<LinkPrevious color='#481BA2'/>}
              onClick={this.onInGoingBack.bind(this)}
               />
         <ReactToPrint
             trigger={this.renderInTrigger.bind(this)}
             content={this.renderInContent.bind(this)}
           />
        </div>
        <VehicleInPrintComponent
          ref={this.setInPrintRef.bind(this)}
          allVehiclesPrint={true}
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
          inDate={vehicleInObj.inwardDate}
          inTime={vehicleInObj.inTime}
        />
      </Article>
    )
  }

  renderVehicleOutPrintCard() {
    const {vehicleOutObj} = this.state;
    if(!vehicleOutObj)
    return;
    return (
      <Article>
      <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent: 'space-between'}}>
      <Button icon={<LinkPrevious color='#481BA2'/>}
            onClick={this.onOutGoingBack.bind(this)}
             />
         <ReactToPrint
             trigger={this.renderOutTrigger.bind(this)}
             content={this.renderOutContent.bind(this)}
           />
        </div>
        <VehicleOutPrintComponent
          ref={this.setOutPrintRef.bind(this)}
          allVehiclesPrint={true}
          screenshot={vehicleOutObj.screenshot}
          outwardSNo={vehicleOutObj.outwardSNo}
          ownOutVehicle={vehicleOutObj.ownOutVehicle}
          vehicleNumber={vehicleOutObj.vehicleNumber}
          driverName={vehicleOutObj.driverName}
          driverNumber={vehicleOutObj.driverNumber}
          remarks={vehicleOutObj.remarks}
          material={vehicleOutObj.material}
          numberOfBags={vehicleOutObj.numberOfBags}
          comingFrom={vehicleOutObj.comingFrom}
          billNumber={vehicleOutObj.billNumber}
          outDate={vehicleOutObj.outwardDate}
          outTime={vehicleOutObj.outTime}
        />
      </Article>
    )
  }

  renderAllVehiclesList() {
    const {vehicles, showVehicleList} = this.state;
    if(!vehicles)
    return null;
    let i=0;

    if(showVehicleList) {
    return (
      <div className='table'>
      <Table scrollable={true} style={{marginTop : '60px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>Vehicle No.</th>
             <th>Inward Sno</th>
             <th>In Date</th>
             <th>In Time</th>
             <th>Outward Sno</th>
             <th>Out Date</th>
             <th>Out Time</th>
             <th>Vehicle In</th>
             <th>Vehicle Out</th>
           </tr>
          </thead>
          <tbody>
          {
            Object.keys(vehicles).map((vehicle, index) => {
              i++;
              if(vehicle !== 'U2') {
                const vehicleInwardItem = vehicles[vehicle] && vehicles[vehicle]['lastInward'];
                const vehicleOutwadItem = vehicles[vehicle] && vehicles[vehicle]['lastOutward'];
                return <TableRow key={index}>
                <td>{vehicle}</td>
                <td>{vehicleInwardItem.inwardSNo}</td>
                <td>{vehicleInwardItem.inwardDate}</td>
                <td>{vehicleInwardItem.inTime}</td>
                <td>{vehicleOutwadItem ? vehicleOutwadItem.outwardSNo : '--'}</td>
                <td>{vehicleOutwadItem ? vehicleOutwadItem.outwardDate : '--'}</td>
                <td>{vehicleOutwadItem ? vehicleOutwadItem.outTime : '--'}</td>
                <td>
                     <Button icon={<PrintIcon />}
                           onClick={this.onVehicleInPrint.bind(this, vehicle)}
                           plain={true} />
                </td>
                <td>
                   {
                     vehicleOutwadItem ?
                     <Button icon={<PrintIcon />}
                         onClick={this.onVehicleOutPrint.bind(this, vehicle)}
                         plain={true} /> : 'N/A'
                   }
                </td>
                </TableRow>
              }
            })
          }
          </tbody>
      </Table>
      </div>
    )
  } else {
    return null;
  }
}

  handleFiles(files) {
   console.log(files)
  }

  renderFileReader() {
    return (
      <ReactFileReader fileTypes={[".txt"]} handleFiles={this.handleFiles}>
        <button className='btn'>Upload</button>
      </ReactFileReader>
    )
  }


  render() {

    return (
      <div>
      { this.renderVehicleInPrintCard() }
      { this.renderVehicleOutPrintCard() }
      { this.renderAllVehiclesList() }
      </div>
    )
  }
}
