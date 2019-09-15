import React from 'react';
import Save from 'grommet/components/icons/base/Upload';
import Split from 'grommet/components/Split';
import Webcam from 'react-webcam';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Label from 'grommet/components/Label';
import Select from 'grommet/components/Select';
import Section from 'grommet/components/Section';
import Image from 'grommet/components/Image';
import Rand from 'random-key';
import Layer from 'grommet/components/Layer';
import Status from 'grommet/components/icons/Status';
import { Container, Row, Col } from 'react-grid-system';
import { Input } from 'semantic-ui-react';
import { saveMaterialOut, fetchMaterialData, uploadStoreMaterialImage } from '../api/materials';
import ReactToPrint from "react-to-print";
import MaterialPrintComponent from './MaterialPrintComponent';
import PrintIcon from 'grommet/components/icons/base/Print';


class MaterialOut extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      outwardSNo:Rand.generateBase30(8),
      showLiveCameraFeed: true,
      sNoArray:[],
      materialFetched: false,
      toastMsg: '',
      materialSaved: false
    };
  }

  onFieldChange(fieldName,e,o) {
    let dr = /^[0-9\b]/;
    let re = /^[1-9][0-9]{0,4}$/;
    let ne = /^[0-9]{11}$/;
    let mn = /^\d{10}$/;
    let an = /^[a-zA-Z0-9]+$/;
    let nre = /^[a-zA-Z0-9]{11}$/;
    let tre = /^[A-Za-z. ]+$/;
    let pre = /^[A-Za-z. ]{0,100}$/;

    if(fieldName === 'retNonret' || fieldName === 'materialStatus') {
      this.setState({
        [fieldName]: e.option,
        validationMsg: ''
      })
    }

    else if (fieldName === 'materialInSNo') {
      this.setState({
        [fieldName]: o.value,
        validationMsg: ''
      })
    }

    else {
      this.setState({
        [fieldName]: e.target.value,
        validationMsg:''
      })
    }

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
      }, this.onSaveClick.bind(this));
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot: ''
      }, this.onSaveClick.bind(this));
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
          width={300}
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

  onSavingMaterial() {
    const {
      screenshot,
      outwardSNo,
      retNonret,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus,
      materialInObj
    } = this.state;
    console.log(screenshot);

    let fromLocation;
    let toLocation;
    let authorisedPerson;
    let weighbillNumber;
    let material;
    let remarks;
    let quantity;
    let purpose;
    let inwardSNo;
    let inDate;

    if(materialInObj && materialInObj.retNonret === 'Non-Returnable') {
      this.setState({
        validationMsg: 'Non-Returnable Material cant be Marked Out',
        materialInObj: null,
        vehicleNum: '',
        personName: '',
        mobileNumber: ''
      })
      return;
    }

    if(materialStatus === 'Pending' && materialInObj) {
       inwardSNo = materialInObj.inwardSNo;
       inDate = materialInObj.inDate;
       fromLocation = materialInObj.toLocation;
       toLocation = materialInObj.fromLocation;
       authorisedPerson =  materialInObj.authorisedPerson;
       weighbillNumber = materialInObj.weighbillNumber;
       material = materialInObj.material;
       remarks = materialInObj.remarks;
       quantity = materialInObj.quantity;
       purpose = materialInObj.purpose;
    } else {
       inwardSNo=null;
       inDate=null;
       fromLocation = window.localStorage.unit || 'UNIT2';
       toLocation = this.state.toLocation;
       authorisedPerson = this.state.authorisedPerson;
       weighbillNumber = this.state.weighbillNumber;
       material = this.state.material;
       remarks = this.state.remarks;
       quantity = this.state.quantity;
       purpose = this.state.purpose;
    }

    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadStoreMaterialImage(imgFile, outwardSNo).then((snapshot) => {
         let outwardPhoto = snapshot.downloadURL;
    saveMaterialOut({
      outwardPhoto,
      outwardSNo,
      inwardSNo,
      inDate,
      retNonret,
      fromLocation,
      toLocation,
      authorisedPerson,
      weighbillNumber,
      material,
      remarks,
      quantity,
      purpose,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus
    }).then(() => {
      this.setState({
        outwardSNo:Rand.generateBase30(8),
        savedSerialNo: outwardSNo,
        toastMsg: `Material ${material} saved`,
        materialSaved: true
      })
    })
  }).catch(err => console.error(err))

  }

  renderReactToPrintComponent() {
    return (
     <ReactToPrint
          trigger={() => <a id="printAnchor"
                     href='#' style={{marginLeft: '80px',display:'none' }}>Print</a>
                  }
          content={this.renderContent.bind(this)}
        />
    );
  }

  renderTrigger() {
    return (
      <Button icon={<PrintIcon />}
        label='PRINT' style={!this.state.materialSaved ?
        {
          marginTop:20,
          width: '300px',
          display: 'none'
        } :
        {
          marginTop:20,
          width: '300px',
        }}
        href='#'
        primary={true} />
    )
  }

  renderContent() {
    return this.componentRef;
  }

  setPrintRef(ref) {
    this.componentRef = ref;
  }

  renderMaterialPrintCard() {
    const {materialInObj}=this.state;
    return (
      <MaterialPrintComponent
        ref={this.setPrintRef.bind(this)}
        screenshot={this.state.screenshot}
        outwardSNo={this.state.outwardSNo}
        retNonret={this.state.retNonret}
        fromLocation={this.state.fromLocation || (materialInObj && materialInObj.fromLocation)}
        toLocation={this.state.toLocation || (materialInObj && materialInObj.toLocation)}
        authorisedPerson={this.state.authorisedPerson || (materialInObj && materialInObj.authorisedPerson)}
        weighbillNumber={this.state.weighbillNumber || (materialInObj && materialInObj.weighbillNumber)}
        material={this.state.material || (materialInObj && materialInObj.materil)}
        remarks={this.state.remarks || (materialInObj && materialInObj.remarks)}
        quantity={this.state.quantity || (materialInObj && materialInObj.quantity)}
        purpose={this.state.purpose || (materialInObj && materialInObj.purpose)}
        vehicleNum={this.state.vehicleNum}
        personName={this.state.personName}
        mobileNumber={this.state.mobileNumber}
      />
    )
  }

  onSaveClick() {
    const {
      outwardSNo,
      retNonret,
      fromLocation,
      toLocation,
      fromDepartment,
      toDepartment,
      authorisedPerson,
      weighbillNumber,
      material,
      remarks,
      quantity,
      purpose,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus
    } = this.state;

    if(!retNonret && materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Ret/Non-Ret is missing'
      })
      return
    }

    if(!this.state.toLocation&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'To Location is missing'
      })
      return
    }

    if(!this.state.authorisedPerson&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Authorised Person is missing'
      })
      return
    }

    if(!this.state.weighbillNumber&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Weighbill Number is missing'
      })
      return
    }

    if(!this.state.material&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Material Name is missing'
      })
      return
    }

    if(!this.state.remarks&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Remarks is missing'
      })
      return
    }

    if(!this.state.quantity&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Quantity is missing'
      })
      return
    }

    if(!this.state.purpose&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Purpose is missing'
      })
      return
    }

    if(!this.state.vehicleNum&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Vehicle Number is missing'
      })
      return
    }

    if(!this.state.personName&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Person Name is missing'
      })
      return
    }

    if(!this.state.mobileNumber&& materialStatus !== 'Pending') {
      this.setState({
        validationMsg: 'Mobile Number is missing'
      })
      return
    }

    if(!this.state.screenshot) {
      this.setState({
        validationMsg: 'Screenshot is missing'
      })
      return
    }

  this.setState({
    validationMsg:''
  }, this.onSavingMaterial.bind(this))

  }

  onNewBtnClick() {
    this.setState({
      showLiveCameraFeed: true,
      savedSerialNo: '',
      materialInObj: null,
      materialStatus:'',
      materialInSNo: '',
      retNonret: '',
      toLocation: '',
      fromDepartment: '',
      toDepartment: '',
      authorisedPerson: '',
      weighbillNumber: '',
      material: '',
      remarks: '',
      quantity: '',
      purpose: '',
      vehicleNum: '',
      personName: '',
      mobileNumber: '',
      materialSaved: false
    })
  }

  onCloseLayer() {
    this.setState({
      validationMsg: '',
      showLiveCameraFeed: true
    })
  }

  onOkButtonClick() {
    this.setState({
      validationMsg: '',
      showLiveCameraFeed: true
    })
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

  fetchMaterialByBarcode() {
    const {materialInSNo}=this.state;
    let sNo=materialInSNo.toUpperCase();
    fetchMaterialData(sNo).then(snap => {
      const materialInObj=snap.val();
      this.setState({
        materialInObj,
        materialFetched: true
      })
    }).catch(err => console.log(err))
  }

  onGoBtnClick() {
    this.fetchMaterialByBarcode();
  }


  renderInputFields() {
    const {
      outwardSNo,
      retNonret,
      fromLocation,
      toLocation,
      fromDepartment,
      toDepartment,
      authorisedPerson,
      weighbillNumber,
      material,
      remarks,
      quantity,
      purpose,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus,
      materialFetched,
      materialInObj,
      materialSaved,
    } = this.state;
    return (
      <Section>
       <Split>
        <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
        {
          materialSaved ?
          <Form className='newVisitorFields'>
            <FormField  label='OutwardSNo'  strong={true} style={{marginTop : '10px'}}>
            <Label style={{marginLeft:'20px'}}><strong>{outwardSNo}</strong></Label>
            </FormField>
          <FormField label='Material Status' strong={true} style={{marginTop : '10px'}}>
            <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialStatus}</strong></Label>
          </FormField>
          <FormField label='Ret/Non-ret' strong={true} style={{marginTop : '10px'}}>
            <Label style={{fontSize: 16, marginLeft: 20}}><strong>{retNonret || (materialInObj && materialInObj.retNonret)}</strong></Label>
          </FormField>
          <FormField label='From Location' strong={true} style={{marginTop : '10px'}}>
            <Label style={{fontSize: 16, marginLeft: 20}}><strong>{window.localStorage.unit || 'UNIT2'}</strong></Label>
          </FormField><FormField label='To Location' strong={true} style={{marginTop : '10px'}}>
            <Label style={{fontSize: 16, marginLeft: 20}}><strong>{toLocation || (materialInObj && materialInObj.toLocation)}</strong></Label>
          </FormField><FormField label='Authorised Person/DEPT' strong={true} style={{marginTop : '10px'}}>
            <Label style={{fontSize: 16, marginLeft: 20}}><strong>{authorisedPerson || (materialInObj && materialInObj.authorisedPerson)}</strong></Label>
          </FormField>
          <FormField label='Weigh Bill Number' strong={true} style={{marginTop : '10px'}}>
            <Label style={{fontSize: 16, marginLeft: 20}}><strong>{weighbillNumber || (materialInObj && materialInObj.weighbillNumber)}</strong></Label>
          </FormField>
          </Form> :
          <Form className='manPowerFields'>
        <FormField  label='OutwardSNo'  strong={true} style={{marginTop : '10px'}}  >
          <Label style={{marginLeft:'20px'}}><strong>{outwardSNo}</strong></Label>
        </FormField>
        <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16,marginLeft: 20,color: 'red'}}>Material Status</Label>
          <Select
          options={['New', 'Pending']}
          value={materialStatus}
          onChange={this.onFieldChange.bind(this, 'materialStatus')}
          />
      </FormField>
        {materialStatus==='Pending' ?
        <div>
        <FormField strong={true} style={{marginTop : '8px'}}>
        <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Material Inward SNo</Label>
          <Input transparent
          ref={(input) => { this.state.barcodeInput = input }}
          list='sNo'
          placeholder='Inward Sno'
          onChange={this.onFieldChange.bind(this, 'materialInSNo')} />
          <datalist id='sNo'>
            {
              this.state.sNoArray.map((val, index) => {
                return <option value={val} key={index} />
              })
            }
          </datalist>
          </FormField>
          <div style={{marginTop:10}}>
          <Button
            label='GO' style={{width: '5px'}}
            onClick={this.onGoBtnClick.bind(this)}
            disabled={true}
            href='#'
            primary={true} />
            </div>
            </div>
          :
        <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16,marginLeft: 20,color: 'red'}}>Returnable/Non-Returnable</Label>
          <Select
          options={['Returnable', 'Non-Returnable']}
          value={retNonret}
          onChange={this.onFieldChange.bind(this, 'retNonret')}
          />
      </FormField>
    }
      {materialFetched ?
        <FormField label='From Location' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.toLocation}</strong></Label>
        </FormField>:
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>From Location</Label>
          <TextInput
              placeHolder='From Location'
              value={window.localStorage.unit || 'UNIT2'}
              onDOMChange={this.onFieldChange.bind(this, 'fromLocation')}
          />
      </FormField>}
      {materialFetched ?
        <FormField label='To Location' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.fromLocation}</strong></Label>
        </FormField>:
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>To Location</Label>
          <TextInput
              placeHolder='To Location'
              value={toLocation}
              onDOMChange={this.onFieldChange.bind(this, 'toLocation')}
          />
      </FormField>}
      {materialFetched ?
        <FormField label='Authorised Person/DEPT' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.authorisedPerson}</strong></Label>
        </FormField>:
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Authorised Person/DEPT</Label>
          <TextInput
              placeHolder='Authorised Person/DEPT'
              value={authorisedPerson}
              onDOMChange={this.onFieldChange.bind(this, 'authorisedPerson')}
          />
      </FormField>}
      {materialFetched ?
        <FormField label='Weigh Bill No' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.weighbillNumber}</strong></Label>
        </FormField>:
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Weigh Bill No</Label>
          <TextInput
              placeHolder='Weigh Bill No'
              value={weighbillNumber}
              onDOMChange={this.onFieldChange.bind(this, 'weighbillNumber')}
          />
      </FormField>}
      </Form>}
      </Box>
      <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
          {materialSaved ?
            <Form className='newVisitorFields'>
              <FormField  label='Material Name'  strong={true} style={{marginTop : '10px'}}>
              <Label style={{marginLeft:'20px'}}><strong>{material || (materialInObj && materialInObj.material)}</strong></Label>
              </FormField>
            <FormField label='Remarks' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{remarks || (materialInObj && materialInObj.remarks)}</strong></Label>
            </FormField>
            <FormField label='Quantity' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{quantity || (materialInObj && materialInObj.quantity)}</strong></Label>
            </FormField>
            <FormField label='Purpose' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{purpose || (materialInObj && materialInObj.purpose)}</strong></Label>
            </FormField><FormField label='Vehicle Number' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{vehicleNum}</strong></Label>
            </FormField><FormField label='Person Name' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{personName}</strong></Label>
            </FormField>
            <FormField label='Mobile Number' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{mobileNumber}</strong></Label>
            </FormField>
            </Form> :
            <Form>
          {materialFetched ?
            <FormField label='Material Name' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.material}</strong></Label>
            </FormField>:
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Material Name</Label>
              <TextInput
                  placeHolder='Material Name'
                  value={material}
                  onDOMChange={this.onFieldChange.bind(this, 'material')}
              />
          </FormField>}
          {materialFetched ?
            <FormField label='Remarks' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.remarks}</strong></Label>
            </FormField>:
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Remarks</Label>
              <TextInput
                  placeHolder='Remarks'
                  value={remarks}
                  onDOMChange={this.onFieldChange.bind(this, 'remarks')}
              />
          </FormField>}
          {materialFetched ?
            <FormField label='Quantity' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.quantity}</strong></Label>
            </FormField>:
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Quantity</Label>
              <TextInput
                  placeHolder='Quantity'
                  value={quantity}
                  onDOMChange={this.onFieldChange.bind(this, 'quantity')}
              />
          </FormField>}
          {materialFetched ?
            <FormField label='Purpose' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialInObj && materialInObj.purpose}</strong></Label>
            </FormField>:
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Purpose</Label>
              <TextInput
                  placeHolder='Purpose'
                  value={purpose}
                  onDOMChange={this.onFieldChange.bind(this, 'purpose')}
              />
          </FormField>}
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Vehicle No</Label>
              <TextInput
                  placeHolder='Vehicle No'
                  value={vehicleNum}
                  onDOMChange={this.onFieldChange.bind(this, 'vehicleNum')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Person Name</Label>
              <TextInput
                  placeHolder='Person Name'
                  value={personName}
                  onDOMChange={this.onFieldChange.bind(this, 'personName')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Mobile No</Label>
              <TextInput
                  placeHolder='Mobile No'
                  value={mobileNumber}
                  onDOMChange={this.onFieldChange.bind(this, 'mobileNumber')}
              />
          </FormField>
        </Form>}
        </Box>
        <Box
         direction='column'
        style={{marginLeft : '10px', width:'300px'}}
        align='center'>
        { this.renderCamera() }
        <Button icon={<Save />}
          label='SAVE' style={materialSaved ? {
            marginTop:20,
            width: '300px',
            display: 'none'
          } :
          {
            marginTop:20,
            width: '300px',
          }}
          onClick={this.capture.bind(this)}
          disabled={true}
          href='#'
          primary={true} />
          <ReactToPrint
              trigger={this.renderTrigger.bind(this)}
              content={this.renderContent.bind(this)}
            />
          <Button
            label='NEW' style={{marginTop: 20, width: '300px'}}
            onClick={this.onNewBtnClick.bind(this)}
            disabled={true}
            href='#'
            primary={true} />
        </Box>
        </Split>
        </Section>
    )
  }

  onToastOkButtonClick() {
    this.setState({
      toastMsg: ''
    })
  }

  render() {
    if(this.state.toastMsg) {
      return (
        <Layer>
        <strong>
        <h2 style={{marginTop: 20}}>
        <Status value='ok'
        size='medium'
        style={{marginRight:'10px'}} />
        {this.state.toastMsg}!
        </h2>
        </strong>
         <hr />
         <Row>
         <Button
           label='OK'
           onClick={this.onToastOkButtonClick.bind(this)}
           href='#' style={{marginLeft:200, marginBottom:'10px'}}
           primary={true} />
         </Row>
        </Layer>
      )
    }
    return (
      <div>
        { this.renderValidationMsg() }
        { this.renderInputFields() }
        { this.renderMaterialPrintCard() }
      </div>
    )
  }
}

export default MaterialOut;
