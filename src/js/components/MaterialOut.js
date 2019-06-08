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


class MaterialOut extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      outwardSNo:Rand.generateBase30(8),
      showLiveCameraFeed: true,
      sNoArray:[],
    };
  }

  onFieldChange(fieldName,e) {
    if(fieldName === 'retNonret' || 'materialStatus') {
      this.setState({
        [fieldName]: e.option,
        validationMsg: ''
      })
    } else {
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
    console.log('saved');
  }

  onSaveClick() {
    const {
      outwardSNo,
      retNonret,
      fromLocation,
      toLocation,
      fromDepartment,
      toDepartment,
      gatepassNumber,
      weighbillNumber,
      material,
      materialSNo,
      quantity,
      purpose,
      vehicleNum,
      personName,
      mobileNumber
    } = this.state;

    if(!retNonret) {
      this.setState({
        validationMsg: 'Ret/Non-Ret is missing'
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
      retNonret: '',
      fromLocation: '',
      toLocation: '',
      fromDepartment: '',
      toDepartment: '',
      gatepassNumber: '',
      weighbillNumber: '',
      material: '',
      materialSNo: '',
      quantity: '',
      purpose: '',
      vehicleNum: '',
      personName: '',
      mobileNumber: ''
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


  renderInputFields() {
    const {
      outwardSNo,
      retNonret,
      fromLocation,
      toLocation,
      fromDepartment,
      toDepartment,
      gatepassNumber,
      weighbillNumber,
      material,
      materialSNo,
      quantity,
      purpose,
      vehicleNum,
      personName,
      mobileNumber,
      materialStatus
    } = this.state;
    return (
      <Section>
       <Split>
        <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
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
                return <option value={val} key={index}/>
              })
            }
          </datalist>
          </FormField>:
        <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16,marginLeft: 20,color: 'red'}}>Returnable/Non-Returnable</Label>
          <Select
          options={['Returnable', 'Non-Returnable']}
          value={retNonret}
          onChange={this.onFieldChange.bind(this, 'retNonret')}
          />
      </FormField>
    }
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>From Location</Label>
          <TextInput
              placeHolder='From Location'
              value={fromLocation}
              onDOMChange={this.onFieldChange.bind(this, 'fromLocation')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>To Location</Label>
          <TextInput
              placeHolder='To Location'
              value={toLocation}
              onDOMChange={this.onFieldChange.bind(this, 'toLocation')}
          />
      </FormField>

      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Gatepass No</Label>
          <TextInput
              placeHolder='Gatepass No'
              value={gatepassNumber}
              onDOMChange={this.onFieldChange.bind(this, 'gatepassNumber')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Weigh Bill No</Label>
          <TextInput
              placeHolder='Weigh Bill No'
              value={weighbillNumber}
              onDOMChange={this.onFieldChange.bind(this, 'weighbillNumber')}
          />
      </FormField>


          </Form>
          </Box>
          <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
          <Form>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Material Name</Label>
              <TextInput
                  placeHolder='Material Name'
                  value={material}
                  onDOMChange={this.onFieldChange.bind(this, 'material')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Material SNo</Label>
              <TextInput
                  placeHolder='Material SNo'
                  value={materialSNo}
                  onDOMChange={this.onFieldChange.bind(this, 'materialSNo')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Quantity</Label>
              <TextInput
                  placeHolder='Quantity'
                  value={quantity}
                  onDOMChange={this.onFieldChange.bind(this, 'quantity')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Purpose</Label>
              <TextInput
                  placeHolder='Purpose'
                  value={purpose}
                  onDOMChange={this.onFieldChange.bind(this, 'purpose')}
              />
          </FormField>
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

  render() {
    return (
      <div>
        { this.renderValidationMsg() }
        { this.renderInputFields() }
      </div>
    )
  }
}

export default MaterialOut;
