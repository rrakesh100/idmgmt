import React, {Component} from 'react';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Button from 'grommet/components/Button';
import PrintIcon from 'grommet/components/icons/base/Print';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import { getMaterialsForPrint } from '../api/materials';
import MaterialPrintComponent from './MaterialPrintComponent';
import ReactToPrint from "react-to-print";
import Layer from 'grommet/components/Layer';
import Search from 'grommet/components/Search';
import Article from 'grommet/components/Article';
import { Input } from 'semantic-ui-react';


export default class AllMaterialPrint extends Component {
  constructor(props) {
    super(props);
    this.state={
      materials: null,
      materialObj: null,
      showMaterialList: true,
      showMaterials: false,
      materialDataObj: null
    }
  }

  onSearchedMaterialPrint(mObj) {
    this.setState({materialObj: mObj, showMaterialList: false})
  }

  renderContent() {
    return this.mRef;
  }

  renderTrigger(material) {
    return (
      <div className="prntAnchor" style={{marginRight:30}}>
        <a>Print</a>
      </div>
    )
  }

  setPrintRef(ref) {
    this.mRef = ref;
  }

  onGoingBack() {
    this.setState({
      materialObj: null,
      showMaterialList: true
    })
  }


  renderMaterialPrintCard() {
    const {materialObj, searchedInMNo, searchedOutMNo} = this.state;

    let validator,screenshot,dateForPrint,timeForPrint;


    if(!materialObj)
    return;

    if(searchedInMNo) {
      validator=true;
      screenshot=materialObj.inwardPhoto;
      dateForPrint=materialObj.inDate;
      timeForPrint=materialObj.inTime;
    } else {
      validator=false;
      screenshot=materialObj.outwardPhoto;
      dateForPrint=materialObj.outDate;
      timeForPrint=materialObj.outTime;
    }

    return (
      <Article>
        <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent: 'space-between'}}>
        <Button icon={<LinkPrevious color='#481BA2'/>}
              onClick={this.onGoingBack.bind(this)}
               />
         <ReactToPrint
             trigger={this.renderTrigger.bind(this)}
             content={this.renderContent.bind(this)}
           />
        </div>
        <MaterialPrintComponent
          ref={this.setPrintRef.bind(this)}
          duplicatePrint={true}
          inComponent={validator}
          screenshot={screenshot}
          inwardSNo={materialObj.inwardSNo}
          outwardSNo={materialObj.outwardSNo}
          dateForPrint={dateForPrint}
          timeForPrint={timeForPrint}
          retNonret={materialObj.retNonret}
          fromLocation={materialObj.fromLocation}
          toLocation={materialObj.toLocation}
          authorisedPerson={materialObj.authorisedPerson}
          weighbillNumber={materialObj.weighbillNumber}
          material={materialObj.material}
          remarks={materialObj.remarks}
          quantity={materialObj.quantity}
          purpose={materialObj.purpose}
          vehicleNum={materialObj.vehicleNum}
          personName={materialObj.personName}
          mobileNumber={materialObj.mobileNumber}
        />
      </Article>
    )
  }

  onFieldChange(fieldName,e,o) {
    getMaterialsForPrint(o.value).then(res => {
      const materialDataObj=res.val();
      this.setState({
        materialDataObj,
        [fieldName]: o.value,
        showMaterials: false
      })
    }).catch(err => console.log(err))
  }

  renderSerchedMaterial() {
    const {materialDataObj, showMaterialList, searchedInMNo, searchedOutMNo}=this.state;
    if(!materialDataObj)
    return null;

    let sNo,dateForPrint,timeForPrint,sNoHeader,dateHeader,timeHeader;

    if(searchedInMNo) {
      sNoHeader='Inward Sno';
      dateHeader='In Date';
      timeHeader='In Time';
      sNo=materialDataObj.inwardSNo;
      dateForPrint=materialDataObj.inDate;
      timeForPrint=materialDataObj.inTime;
    } else {
      sNoHeader='Outward Sno';
      dateHeader='Out Date';
      timeHeader='Out Time';
      sNo=materialDataObj.outwardSNo;
      dateForPrint=materialDataObj.outDate;
      timeForPrint=materialDataObj.outTime;
    }

    if(showMaterialList) {
    return (
      <div className='table'>
      <Table scrollable={true} style={{marginTop : '60px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>{sNoHeader}</th>
             <th>Material Name</th>
             <th>{dateHeader}</th>
             <th>{timeHeader}</th>
             <th>Print</th>
           </tr>
          </thead>
          <tbody>
               <TableRow>
               <td>{materialDataObj && sNo}</td>
               <td>{materialDataObj && materialDataObj.material}</td>
               <td>{materialDataObj && dateForPrint}</td>
               <td>{materialDataObj && timeForPrint}</td>
                <td>
                     <Button icon={<PrintIcon />}
                           onClick={this.onSearchedMaterialPrint.bind(this, materialDataObj)}
                           plain={true} />
                </td>
                </TableRow>
          </tbody>
      </Table>
      </div>
    )
  } else {
    return null;
  }
  }

  renderSearchAndButton() {
    const materialOptions = this.props.materialOptions || [];
    return (
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
        <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h5>Material In SNO</h5>
          <Input transparent
          list='materials'
          placeholder='Material In Sno'
          onChange={this.onFieldChange.bind(this, 'searchedInMNo')} />
        <datalist id='materials'>
          {
            materialOptions.map((val, index) => {
              return <option value={val} key={index}/>
            })
          }
        </datalist>
        </div>
        <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h5>Material Out SNO</h5>
        <Input transparent
        list='materials'
        placeholder='Material Out Sno'
        onChange={this.onFieldChange.bind(this, 'searchedOutMNo')} />
      <datalist id='materials'>
        {
          materialOptions.map((val, index) => {
            return <option value={val} key={index}/>
          })
        }
      </datalist>
      </div>
      </div>
    )
  }


  render() {

    return (
      <div>
      {this.renderSearchAndButton()}
      {this.renderSerchedMaterial() }
      {this.renderMaterialPrintCard()}
      </div>
    )
  }
}
