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
import { saveMaterialIn, fetchMaterialData, uploadStoreMaterialImage } from '../api/materials';
import ReactToPrint from "react-to-print";
import MaterialPrintComponent from './MaterialPrintComponent';
import PrintIcon from 'grommet/components/icons/base/Print';


class MaterialIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inwardSNo:Rand.generateBase30(8),
      showLiveCameraFeed: true,
      toastMsg:'',
      sNoArray: [],
      materialFetched: false,
      toastMsg: '',
      materialOutObj: null,
    };
  }

  onFieldChange(fieldName,e, o) {
    if(fieldName === 'retNonret' || fieldName === 'materialStatus') {
      this.setState({
        [fieldName]: e.option,
        validationMsg: ''
      })
    }

    else if (fieldName === 'materialOutSNo') {
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
      });
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot: ''
      });
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
      inwardSNo,
      retNonret,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus,
      materialOutObj
    } = this.state;

    let fromLocation;
    let toLocation;
    let gatepassNumber;
    let weighbillNumber;
    let material;
    let materialNumber;
    let quantity;
    let purpose;
    let outwardSNo;
    let outDate;

    if(materialStatus === 'Pending' && materialOutObj) {
       outwardSNo = materialOutObj.outwardSNo;
       outDate = materialOutObj.outDate;
       fromLocation = materialOutObj.fromLocation;
       toLocation = materialOutObj.toLocation;
       gatepassNumber =  materialOutObj.gatepassNumber;
       weighbillNumber = materialOutObj.weighbillNumber;
       material = materialOutObj.material;
       materialNumber = materialOutObj.materialNumber;
       quantity = materialOutObj.quantity;
       purpose = materialOutObj.purpose;
    } else {
       outwardSNo=null;
       outDate=null;
       fromLocation = this.state.fromLocation;
       toLocation = this.state.toLocation;
       gatepassNumber = this.state.gatepassNumber;
       weighbillNumber = this.state.weighbillNumber;
       material = this.state.material;
       materialNumber = this.state.materialNumber;
       quantity = this.state.quantity;
       purpose = this.state.purpose;
    }

    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadStoreMaterialImage(imgFile, inwardSNo).then((snapshot) => {
         let inwardPhoto = snapshot.downloadURL;
         if(materialStatus==='New') {
           document.getElementById('printAnchor').click();
         }
    saveMaterialIn({
      inwardPhoto,
      inwardSNo,
      outwardSNo,
      outDate,
      retNonret,
      fromLocation,
      toLocation,
      gatepassNumber,
      weighbillNumber,
      material,
      materialNumber,
      quantity,
      purpose,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus
    }).then(() => {
      this.setState({
        inwardSNo:Rand.generateBase30(8),
        showLiveCameraFeed: true,
        retNonret: '',
        fromLocation: '',
        toLocation: '',
        fromDepartment: '',
        toDepartment: '',
        gatepassNumber: '',
        weighbillNumber: '',
        material: '',
        materialNumber: '',
        quantity: '',
        purpose: '',
        vehicleNum: '',
        personName: '',
        mobileNumber: '',
        materialStatus: '',
        toastMsg: `Material ${material} saved`,
      })
    })
  }).catch(err => console.error(err))

  }

  onSaveClick() {

    if(!this.state.retNonret && this.state.materialStatus === 'New') {
      this.setState({
        validationMsg: 'Ret/Non-Ret is missing'
      })
      return
    }

    /*if(!this.state.screenshot) {
      this.setState({
        validationMsg: 'Screenshot is missing'
      })
      return
    }*/

  this.setState({
    validationMsg:''
  }, this.onSavingMaterial.bind(this))

  }

  onNewBtnClick() {
    this.setState({
      inwardSNo:Rand.generateBase30(8),
      showLiveCameraFeed: true,
      retNonret: '',
      fromLocation: '',
      toLocation: '',
      fromDepartment: '',
      toDepartment: '',
      gatepassNumber: '',
      weighbillNumber: '',
      material: '',
      materialNumber: '',
      quantity: '',
      purpose: '',
      vehicleNum: '',
      personName: '',
      mobileNumber: '',
      materialStatus: '',
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

  onGoBtnClick() {
    const {materialOutSNo}=this.state;
    let sNo=materialOutSNo.toUpperCase();
    fetchMaterialData(sNo).then(snap => {
      const materialOutObj=snap.val();
      this.setState({
        materialOutObj,
        materialFetched: true
      })
    }).catch(err => console.log(err))
  }


  renderInputFields() {
    const {
      inwardSNo,
      retNonret,
      fromLocation,
      toLocation,
      fromDepartment,
      toDepartment,
      gatepassNumber,
      weighbillNumber,
      material,
      materialNumber,
      quantity,
      purpose,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus,
      materialFetched,
      materialOutObj
    } = this.state;
    return (
      <Section>
       <Split>
        <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
        <Form className='manPowerFields'>
        <FormField  label='InwardSNo'  strong={true} style={{marginTop : '10px'}}  >
          <Label style={{marginLeft:'20px'}}><strong>{inwardSNo}</strong></Label>
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
      <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Material Outward SNo</Label>
        <Input transparent
        ref={(input) => { this.state.barcodeInput = input }}
        list='sNo'
        placeholder='Outward Sno'
        onChange={this.onFieldChange.bind(this, 'materialOutSNo')} />
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
          </div> :
        <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16,marginLeft: 20,color: 'red'}}>Returnable/Non-Returnable</Label>
          <Select
          options={['Returnable', 'Non-Returnable']}
          value={retNonret}i
          onChange={this.onFieldChange.bind(this, 'retNonret')}
          />
      </FormField>}
      {materialFetched ?
        <FormField label='From Location' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.fromLocation}</strong></Label>
        </FormField>:
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>From Location</Label>
          <TextInput
              placeHolder='From Location'
              value={fromLocation}
              onDOMChange={this.onFieldChange.bind(this, 'fromLocation')}
          />
      </FormField>}
      {materialFetched ?
        <FormField label='To Location' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.toLocation}</strong></Label>
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
        <FormField label='Gatepass No' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.gatepassNumber}</strong></Label>
        </FormField>:
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Gatepass No</Label>
          <TextInput
              placeHolder='Gatepass No'
              value={gatepassNumber}
              onDOMChange={this.onFieldChange.bind(this, 'gatepassNumber')}
          />
      </FormField>}
      {materialFetched ?
        <FormField label='Weigh Bill No' strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.weighbillNumber}</strong></Label>
        </FormField>:
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Weigh Bill No</Label>
          <TextInput
              placeHolder='Weigh Bill No'
              value={weighbillNumber}
              onDOMChange={this.onFieldChange.bind(this, 'weighbillNumber')}
          />
      </FormField>}
      </Form>
      </Box>
      <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
          <Form>
          {materialFetched ?
            <FormField label='Material Name' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.material}</strong></Label>
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
            <FormField label='Material SNo' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.materialNumber}</strong></Label>
            </FormField>:
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Material SNo</Label>
              <TextInput
                  placeHolder='Material SNo'
                  value={materialNumber}
                  onDOMChange={this.onFieldChange.bind(this, 'materialNumber')}
              />
          </FormField>}
          {materialFetched ?
            <FormField label='Quantity' strong={true} style={{marginTop : '10px'}}>
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.quantity}</strong></Label>
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
              <Label style={{fontSize: 16, marginLeft: 20}}><strong>{materialOutObj && materialOutObj.purpose}</strong></Label>
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
        </Form>
        </Box>
        <Box onClick={this.capture.bind(this)}
         direction='column'
        style={{marginLeft : '10px', width:'300px'}}
        align='center'>
        { this.renderCamera() }
        <Button icon={<Save />}
          label='SAVE' style={
          {
            marginTop:20,
            width: '300px',
          }}
          onClick={this.onSaveClick.bind(this)}
          disabled={true}
          href='#'
          primary={true} />
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

  setPrintRef(ref) {
    this.componentRef = ref;
  }

  renderTrigger() {
    return (
      <Button icon={<PrintIcon />}
        label='PRINT' style={
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

  renderMaterialPrintCard() {
    return (
      <MaterialPrintComponent
        ref={this.setPrintRef.bind(this)}
        screenshot={this.state.screenshot}
        inwardSNo={this.state.inwardSNo}
        retNonret={this.state.retNonret}
        fromLocation={this.state.fromLocation}
        toLocation={this.state.toLocation}
        gatepassNumber={this.state.gatepassNumber}
        weighbillNumber={this.state.weighbillNumber}
        material={this.state.material}
        materialNumber={this.state.materialNumber}
        quantity={this.state.quantity}
        purpose={this.state.purpose}
        vehicleNum={this.state.vehicleNum}
        personName={this.state.personName}
        mobileNumber={this.state.mobileNumber}
        inComponent={true}
      />
    )
  }

  onToastOkButtonClick() {
    this.setState({
      toastMsg: ''
    })
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

  render() {
    const {toastMsg}=this.state;
    if(toastMsg) {
      return (
        <Layer>
        <strong>
        <h2 style={{marginTop: 20}}>
        <Status value='ok'
        size='medium'
        style={{marginRight:'10px'}} />
        {toastMsg}!
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
        { this.renderReactToPrintComponent() }
      </div>
    )
  }
}

export default MaterialIn;
