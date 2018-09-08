import React, { Component } from 'react';
import Search from 'grommet/components/Search';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Moment from 'moment';
import Button from 'grommet/components/Button';
import Vehicle from 'grommet/components/icons/base/DocumentConfig';
import Article from 'grommet/components/Article';
import Select from 'grommet/components/Select';
import TextInput from 'grommet/components/TextInput';
import Label from 'grommet/components/Label';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import { Container, Row, Col } from 'react-grid-system';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Webcam from 'react-webcam';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import Next from 'grommet/components/icons/base/CaretNext';
import Down from 'grommet/components/icons/base/CaretDown';
import { getVehicleNumbers, getMaterials } from '../api/configuration';
import Save from 'grommet/components/icons/base/Upload';
import { savingOutwardVehicle, getAllVehicles, getInwardVehicle, uploadVehicleImage } from '../api/vehicles';
import Clock from 'react-live-clock';
import moment from 'moment';
import Image from 'grommet/components/Image';
import Notification from 'grommet/components/Notification';



export default class VehicleOut extends Component {
  constructor(props) {
    super(props);
    this.state={
      outwardSNo: '',
      ownOutVehicle: '',
      vehicleNumber: '',
      selectVehicleNumber: '',
      driverName:'',
      driverNumber: '',
      emptyLoad: '',
      partyName: '',
      material: '',
      numberOfBags: '',
      comingFrom: '',
      billNumber: '',
      remarks: '',
      inwardObj: {},
      ourVehicle: false,
      emptyVehicle: false,
      showDetails: false,
      showLiveCameraFeed: true,
    };
  }

  componentDidMount() {
    this.getVehicleNumberDetails();
    this.getMaterialDetails();
    this.getVehicleDetails();
  }

  getVehicleNumberDetails() {
    getVehicleNumbers().then((snap) => {
      const options = snap.val();
      let vehicleOpt = [];
      Object.keys(options).forEach((opt) => {
        vehicleOpt.push(opt)
      })
      this.setState({vehicleOpt})
    }).catch((e) => console.log(e))
  }

  getMaterialDetails() {
    getMaterials().then((snap) => {
      const options = snap.val();
      let materialOpt = [];
      Object.keys(options).forEach((opt) => {
        materialOpt.push(opt)
      })
      this.setState({materialOpt})
    }).catch((e) => console.log(e))
  }

  getVehicleDetails() {
    getAllVehicles().then((snap) => {
      const vehicleData = snap.val();
      const lastCount = vehicleData.U2.count.outCount;
      let outwardSNo = `U2-out-${lastCount}`;
      this.setState({
        vehicleData,
        outwardSNo,
        lastCount
      })
    }).catch((e) => console.log(e))
  }

  getInwardVehicleDetails() {
    const { vehicleNumber, selectVehicleNumber } = this.state;
        let vNo=vehicleNumber;
        if(selectVehicleNumber)
         vNo = selectVehicleNumber;
      getInwardVehicle(vNo).then((snap) => {
        const inwardObj = snap.val();
        this.setState({inwardObj})
      }).catch((e) => console.log(e));
  }

  onFieldChange(fieldName, e) {

    if(fieldName == 'ownOutVehicle' || fieldName == 'emptyLoad' || fieldName == 'material' || fieldName == 'selectVehicleNumber') {
      this.setState({
        [fieldName]: e.option
      })
    } else {
      this.setState({
        [fieldName]: e.target.value
      })
    }

    if(fieldName == 'ownOutVehicle' && e.option == 'Own Vehicle') {
      this.setState({
        ourVehicle: true
      })
    } else if(fieldName == 'ownOutVehicle' && e.option == 'Outside Vehicle') {
      this.setState({
        ourVehicle: false
      })
    }

    if(fieldName == 'emptyLoad' && e.option == 'Empty') {
        this.setState({
          emptyVehicle: true
        })
    } else {
        this.setState({
          emptyVehicle: false
        })
    }

  }

  renderValidationMsg() {
    const { validationMsg } = this.state;
    if (validationMsg) {
      return (
        <Notification message={validationMsg} size='small' status='critical' />
      );
    }
    return null;
  }

  onShowingInwardDetails() {
    this.setState({
      showDetails: true
    }, this.getInwardVehicleDetails())
  }

  onHidingInwardDetails() {
    this.setState({
      showDetails: false
    })
  }

  showInwardDetails() {
    const { ourVehicle, emptyVehicle, showDetails, outwardSNo, inwardObj } = this.state;
    let inwardObjKey = Object.keys(inwardObj)[0];
    let inwardObjVal = inwardObj[inwardObjKey];
    return (
      <div>
      <Button icon={<Down/>}
        primary={true}
        href='#'
        label='Hide Last Inward Details'
        onClick={this.onHidingInwardDetails.bind(this)}
        />
        <Section justify='center'>
          <Split>
            <Box direction='column' style={{width:'300px'}} >

                <Form className='newVisitorFields'>
                  <FormField  label='Inward Sno'  strong={true} style={{marginTop : '15px'}}  >
                  <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.inwardSNo}</strong></Label>

                  </FormField>
                  <FormField label='Own/Out Vehicle'  strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.ownOutVehicle}</strong></Label>
                  </FormField>
                  <FormField label='Vehicle Number'  strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.vehicleNumber}</strong></Label>
                  </FormField>
                  <FormField label='Driver Name' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.driverName}</strong></Label>
                  </FormField>
                  <FormField label='Driver Cell No' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.driverNumber}</strong></Label>
                  </FormField>
                  <FormField label='Empty/Load' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.emptyLoad}</strong></Label>
                  </FormField>
                </Form>
            </Box>
            <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                <Form className='newVisitorFields'>
                  <FormField label='Party Name' strong={true}  ref='loadVeicleForm' style={{marginTop : '18px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.partyName}</strong></Label>
                  </FormField>

                  <FormField label='Material' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.material}</strong></Label>
                  </FormField>
                  <FormField label='No of Bags' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.numberOfBags}</strong></Label>
                  </FormField>
                  <FormField label='Coming From' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.comingFrom}</strong></Label>
                  </FormField>
                  <FormField label='Bill No' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.billNumber}</strong></Label>
                  </FormField>
                  <FormField label='Remarks' strong={true} style={{marginTop : '15px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardObjVal.remarks}</strong></Label>
                  </FormField>
                </Form>
              </Box>
              <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                <Image src={inwardObjVal.inwardPhoto}  height={300} width={400}/>
              </Box>
            </Split>
          </Section>
        </div>
    )
  }

  hideInwardDetails() {
    return (
      <Button icon={<Next/>}
        href='#'
        label='Show Last Inward Details'
        onClick={this.onShowingInwardDetails.bind(this)}
        />
    )
  }

  capture() {
    if (this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false,
      });
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot: ''
      });
    }
  }

  onSavingOutwardVehicle() {
    const {
      lastCount,
      outwardSNo,
      ownOutVehicle,
      vehicleNumber,
      selectVehicleNumber,
      driverName,
      driverNumber,
      emptyLoad,
      partyName,
      material,
      numberOfBags,
      comingFrom,
      billNumber,
      remarks,
      screenshot } = this.state;
      let vNo=vehicleNumber;
      if(selectVehicleNumber)
       vNo = selectVehicleNumber;
      let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
      uploadVehicleImage(imgFile, vNo, outwardSNo).then((snapshot) => {
           let outwardPhoto = snapshot.downloadURL;
      savingOutwardVehicle({
        lastCount,
        outwardSNo,
        ownOutVehicle,
        vehicleNumber,
        selectVehicleNumber,
        driverName,
        driverNumber,
        emptyLoad,
        partyName,
        material,
        numberOfBags,
        comingFrom,
        billNumber,
        remarks,
        outwardPhoto
      }).then(this.setState({
        outwardSNo: '',
        ownOutVehicle: '',
        vehicleNumber: '',
        driverName:'',
        driverNumber: '',
        emptyLoad: '',
        partyName: '',
        material: '',
        numberOfBags: '',
        comingFrom: '',
        billNumber: '',
        remarks: '',
        screenshot:'',
        showLiveCameraFeed: true
      }, this.getVehicleDetails())).catch((err) => {
        console.error('Vehicle Outward Save Error', err);
      })
    })

  }

  onSaveClick() {
    const {
      lastCount,
      outwardSNo,
      ownOutVehicle,
      vehicleNumber,
      driverName,
      driverNumber,
      emptyLoad,
      partyName,
      material,
      numberOfBags,
      comingFrom,
      billNumber,
      remarks,
      screenshot } = this.state;

      if(emptyLoad === 'Load') {
        if(!partyName) {
          this.setState({
            validationMsg: 'Party Name is missing'
          })
          return
        }
        if(!material) {
          this.setState({
            validationMsg: 'Material is missing'
          })
          return
        }
        if(!numberOfBags) {
          this.setState({
            validationMsg: 'Number Of Bags is missing'
          })
          return
        }
        if(!comingFrom) {
          this.setState({
            validationMsg: 'Coming From is missing'
          })
          return
        }

        if(!billNumber) {
          this.setState({
            validationMsg: 'Bill Number is missing'
          })
          return
        }
        if(!remarks) {
          this.setState({
            validationMsg: 'Remarks is missing'
          })
          return
        }
      }

      if(!screenshot) {
        this.setState({
          validationMsg: 'Screenshot is missing'
        })
        return
      }

      this.setState({
        validationMsg:''
      }, this.onSavingOutwardVehicle.bind(this))


  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  renderImage() {
    if(this.state.showLiveCameraFeed) {
      return (
        <Webcam
          audio={false}
          height={300}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={400}
          onClick={this.capture.bind(this)}
        />
      );
    }
    return (
      <Image src={this.state.screenshot} height={300} width={400}/>
    );
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }



  render() {
    const date = new Date();
    const dateStr = moment(date).format('DD-MM-YYYY');
    const { ourVehicle, emptyVehicle, showDetails, vehicleOpt, materialOpt, outwardSNo } = this.state;
    return (
      <div>
      { this.renderValidationMsg() }
        <h4 style={{marginLeft: 40, textDecoration: 'underline', fontWeight: 'bold'}}>Present Outward Details</h4>
        <Section justify='center'>
          <Split>
            <Box direction='column' style={{marginLeft:'40px', width:'300px'}} >

                <Form className='newVisitorFields'>
                  <FormField  label='Outward Sno'  strong={true} style={{marginTop : '15px'}}  >
                  <Label style={{marginLeft:'20px'}}><strong>{outwardSNo}</strong></Label>
                  </FormField>
                  <FormField label='Own/Out Vehicle *'  strong={true} style={{marginTop : '15px'}}>
                      <Select
                      options={['Own Vehicle', 'Outside Vehicle']}
                      placeHolder='Own/Out Vehicle'
                      value={this.state.ownOutVehicle}
                      onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
                      />
                  </FormField>
                  <FormField label='Vehicle No *' strong={true} style={{marginTop : '15px'}}>
                      {
                      !ourVehicle ?
                      <TextInput
                          placeHolder='Vehicle No'
                          value={this.state.vehicleNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'vehicleNumber')}
                      /> :
                      <Select
                      placeHolder='Vehicle No'
                      options={vehicleOpt}
                      value={this.state.selectVehicleNumber}
                      onChange={this.onFieldChange.bind(this, 'selectVehicleNumber')}
                      />
                    }
                  </FormField>
                  <FormField label='Driver Name *' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Driver Name'
                          value={this.state.driverName}
                          onDOMChange={this.onFieldChange.bind(this, 'driverName')}
                      />
                  </FormField>
                  <FormField label='Driver Cell No *' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Driver Cell No'
                          value={this.state.driverNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'driverNumber')}
                      />
                  </FormField>
                  <FormField label='Empty/Load *' strong={true} style={{marginTop : '15px'}}>
                      <Select
                        options={['Empty', 'Load']}
                        placeHolder='Empty/Load'
                        value={this.state.emptyLoad}
                        onChange={this.onFieldChange.bind(this, 'emptyLoad')}
                      />
                  </FormField>
                </Form>
            </Box>
            <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                <Form className='newVisitorFields'>

                  <FormField label='Party Name' strong={true}  ref='loadVeicleForm' style={{marginTop : '18px'}}>
                      <TextInput
                          placeHolder='Party Name'
                          value={this.state.partyName}
                          onDOMChange={this.onFieldChange.bind(this, 'partyName')}
                      />
                  </FormField>

                  <FormField label='Material' strong={true} style={{marginTop : '15px'}}>
                      <Select
                        options={materialOpt}
                        placeHolder='Material'
                        value={this.state.material}
                        onChange={this.onFieldChange.bind(this, 'material')}
                      />
                  </FormField>
                  <FormField label='No of Bags' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='No of Bags'
                          value={this.state.numberOfBags}
                          onDOMChange={this.onFieldChange.bind(this, 'numberOfBags')}
                      />
                  </FormField>
                  <FormField label='Coming From' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Coming From'
                          value={this.state.comingFrom}
                          onDOMChange={this.onFieldChange.bind(this, 'comingFrom')}
                      />
                  </FormField>
                  <FormField label='Bill No' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Bill No'
                          value={this.state.billNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'billNumber')}
                      />
                  </FormField>
                  <FormField label='Remarks' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Remarks'
                          value={this.state.remarks}
                          onDOMChange={this.onFieldChange.bind(this, 'remarks')}
                      />
                  </FormField>
                </Form>
              </Box>
            <Box onClick={this.capture.bind(this)} direction='column'
              style={{marginTop:'25px', marginLeft : '10px', width:'300px'}} align='center'>
                {this.renderCamera() }
                <Section pad='small'
                  align='center'>
                  <Button icon={<Save />}
                    label='SAVE'
                    onClick={this.onSaveClick.bind(this)}
                    disabled={true}
                    href='#'
                    primary={true} />
                </Section>
            </Box>
          </Split>
          <div>
            <h4 style={{marginLeft: 40, textDecoration: 'underline', fontWeight: 'bold'}}>Date&Time Details</h4>
            <Container>
                <Row>
                    <Col>
                      <span style={{marginLeft: 30}}>Present Out Date : {dateStr}</span>
                    </Col>
                    <Col>
                      <span>Presemnt Out Time : <Clock format={'hh:mm:ss A'} ticking={true} /></span>
                    </Col>
                </Row>
            </Container>
          </div>
          <div style={{marginLeft: 40, marginTop: 40}}>
            { showDetails ? this.showInwardDetails() : this.hideInwardDetails() }
          </div>
        </Section>
      </div>
    )
  }
}
