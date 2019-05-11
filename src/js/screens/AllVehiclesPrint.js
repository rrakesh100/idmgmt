import React, {Component} from 'react';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Button from 'grommet/components/Button';
import PrintIcon from 'grommet/components/icons/base/Print';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import { getAllVehicles, getVehicleForPrint } from '../api/vehicles';
import VehicleInPrintComponent from '../components/VehicleInPrintComponent';
import VehicleOutPrintComponent from '../components/VehicleOutPrintComponent';
import ReactToPrint from "react-to-print";
import Layer from 'grommet/components/Layer';
import Search from 'grommet/components/Search';
import Article from 'grommet/components/Article';
import { Input } from 'semantic-ui-react';


export default class AllVehiclesPrint extends Component {
  constructor(props) {
    super(props);
    this.state={
      vehicles: null,
      vehicleInObj: null,
      vehicleOutObj: null,
      showVehicleList: true,
      showVehicles: false,
      vehicleDataObj: null
    }
  }

  getAllVehicles() {
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
    console.log(vehicleInObj);
    this.setState({vehicleInObj, showVehicleList:false})
  }

  onVehicleOutPrint(vehicle) {
    const {vehicles} = this.state;
    let vehicleOutObj = vehicles[vehicle] && vehicles[vehicle]['lastOutward'];
    this.setState({vehicleOutObj, showVehicleList: false})
  }

  onSearchedVehicleInPrint(vInObj) {
    this.setState({vehicleInObj: vInObj, showVehicleList: false})
  }

  onSearchedVehicleOutPrint(vOutObj) {
    this.setState({vehicleOutObj: vOutObj, showVehicleList: false})
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
    const {vehicles, showVehicleList, showVehicles} = this.state;
    if(!vehicles)
    return null;
    let i=0;

    if(showVehicleList && showVehicles) {
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
                <td>{vehicleInwardItem && vehicleInwardItem.inwardSNo}</td>
                <td>{vehicleInwardItem && vehicleInwardItem.inwardDate}</td>
                <td>{vehicleInwardItem && vehicleInwardItem.inTime}</td>
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

  onShowingVehiclesList() {
    this.setState({
      showVehicles: true,
      vehicleDataObj: null
    }, this.getAllVehicles.bind(this))
  }

  onFieldChange(fieldName,e,o) {
    getVehicleForPrint(o.value).then(res => {
      const vehicleDataObj=res.val();
      this.setState({vehicleDataObj, showVehicles: false})
    }).catch(err => console.log(err))
  }

  renderSerchedVehicle() {
    const {vehicleDataObj, showVehicleList}=this.state;
    if(!vehicleDataObj)
    return null;

    const vehicleInwardItem = vehicleDataObj && vehicleDataObj['lastInward'];
    const vehicleOutwadItem = vehicleDataObj && vehicleDataObj['lastOutward'];
    console.log(vehicleOutwadItem);
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
               <TableRow>
               <td>{vehicleInwardItem && vehicleInwardItem.vehicleNumber}</td>
               <td>{vehicleInwardItem && vehicleInwardItem.inwardSNo}</td>
               <td>{vehicleInwardItem && vehicleInwardItem.inwardDate}</td>
               <td>{vehicleInwardItem && vehicleInwardItem.inTime}</td>
               <td>{vehicleOutwadItem ? vehicleOutwadItem.outwardSNo : '--'}</td>
               <td>{vehicleOutwadItem ? vehicleOutwadItem.outwardDate : '--'}</td>
               <td>{vehicleOutwadItem ? vehicleOutwadItem.outTime : '--'}</td>
                <td>
                     <Button icon={<PrintIcon />}
                           onClick={this.onSearchedVehicleInPrint.bind(this, vehicleInwardItem)}
                           plain={true} />
                </td>
                <td>
                   {
                     vehicleOutwadItem ?
                     <Button icon={<PrintIcon />}
                         onClick={this.onSearchedVehicleOutPrint.bind(this, vehicleOutwadItem)}
                         plain={true} /> : 'N/A'
                   }
                </td>
                </TableRow>
          }
          </tbody>
      </Table>
      </div>
    )
  } else {
    return null;
  }
  }

  renderSearchAndButton() {
    const vehicleOptions = this.props.vehicleOptions || [];
    return (
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <Input transparent
      list='vehicles'
      placeholder='Vehicle Number'
      style={{marginLeft:20}}
      onChange={this.onFieldChange.bind(this, 'searchedVNo')} />
    <datalist id='vehicles'>
      {
        vehicleOptions.map((val, index) => {
          return <option value={val} key={index}/>
        })
      }
    </datalist>
      <Button  label='Show All Vehicles'
      onClick={this.onShowingVehiclesList.bind(this)}
      style={{marginRight:40}}
      primary={true}
      href='#'/>
      </div>
    )
  }


  render() {

    return (
      <div>
      {this.renderSearchAndButton()}
      {this.renderSerchedVehicle()}
      {this.renderVehicleInPrintCard()}
      {this.renderVehicleOutPrintCard()}
      {this.renderAllVehiclesList()}
      </div>
    )
  }
}
