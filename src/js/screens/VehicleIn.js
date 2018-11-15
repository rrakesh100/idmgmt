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
import { savingInwardVehicle, getAllVehicles, uploadVehicleImage, getOutwardVehicle } from '../api/vehicles';
import Clock from 'react-live-clock';
import moment from 'moment';
import Notification from 'grommet/components/Notification';
import Image from 'grommet/components/Image';



export default class VehicleIn extends Component {
  constructor(props) {
    super(props);
    this.state={
      inwardSNo: '',
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
      ourVehicle: false,
      emptyVehicle: true,
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
      const data = snap.val();
      let prefix = 'U2';
      if(window.localStorage.unit === 'UNIT3') {
        prefix = 'U3';
      }
      const lastCount = data ? data[prefix]['count']['inCount'] :  0;
      let inwardSNo = `${prefix}-in-${lastCount}`;
      this.setState({ inwardSNo, lastCount })
    }).catch((e) => console.log(e))
  }

  getOutwardVehicleDetails() {
    const { vehicleNumber, selectVehicleNumber } = this.state;
        let vNo=vehicleNumber;
        if(selectVehicleNumber)
         vNo = selectVehicleNumber;
      getOutwardVehicle(vNo).then((snap) => {
        const outwardObj = snap.val();
        this.setState({outwardObj})
      }).catch((e) => console.log(e));
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
            width={300}
            onClick={this.capture.bind(this)}
          />
        );
      } else {
        return (
          <Image src={this.state.screenshot} height={300}/>
        );
      }
    }

    renderCamera() {
      return (
        <Box>
          { this.renderImage() }
        </Box>
      );
    }

    onFieldChange(fieldName, e) {

      if(fieldName == 'ownOutVehicle' || fieldName == 'emptyLoad' || fieldName == 'material' || fieldName == 'selectVehicleNumber') {
        this.setState({
          [fieldName]: e.option,
          validationMsg:''
        })
      } else {
        this.setState({
          [fieldName]: e.target.value,
          validationMsg: ''
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
        let formRef = this.refs.loadVeicleForm;
        formRef.hidden = true;
          this.setState({
            emptyVehicle: true
          })
      } else {
        let formRef = this.refs.loadVeicleForm;
        formRef.hidden = true;
          this.setState({
            emptyVehicle: false
          })
      }

    }

    onShowingOutwardDetails() {
      this.setState({
        showDetails: true
      }, this.getOutwardVehicleDetails())
    }

    onHidingOutwardDetails() {
      this.setState({
        showDetails: false
      })
    }

    showOutwardDetails() {
      const { ourVehicle, emptyVehicle, showDetails, outwardObj } = this.state;
      if(!outwardObj)
        return;

      if(showDetails) {
        let outwardObjKey = outwardObj['outwardSNo'];
        let outwardObjVal = outwardObj;
        return (
          <div>
          <Button icon={<Down/>}
            primary={true}
            href='#'
            label='Hide Last Outward Details'
            onClick={this.onHidingOutwardDetails.bind(this)}
            />
            <Section justify='center'>
              <Split>
                <Box direction='column' style={{width:'300px'}} >

                    <Form className='newVisitorFields'>
                      <FormField  label='Outward Sno'  strong={true} style={{marginTop : '15px'}} >
                      <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.outwardSNo}</strong></Label>

                      </FormField>
                      <FormField label='Own/Out Vehicle'  strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.ownOutVehicle}</strong></Label>
                      </FormField>
                      <FormField label='Vehicle Number'  strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.vehicleNumber}</strong></Label>
                      </FormField>
                      <FormField label='Driver Name' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.driverName}</strong></Label>
                      </FormField>
                      <FormField label='Driver Cell No' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.driverNumber}</strong></Label>
                      </FormField>
                      <FormField label='Empty/Load' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.emptyLoad}</strong></Label>
                      </FormField>
                    </Form>
                </Box>
                <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                    <Form className='newVisitorFields'>
                      <FormField label='Party Name' strong={true}  ref='loadVeicleForm' style={{marginTop : '18px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.partyName}</strong></Label>
                      </FormField>

                      <FormField label='Material' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.material}</strong></Label>
                      </FormField>
                      <FormField label='No of Bags' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.numberOfBags}</strong></Label>
                      </FormField>
                      <FormField label='Coming From' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.comingFrom}</strong></Label>
                      </FormField>
                      <FormField label='Bill No' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.billNumber}</strong></Label>
                      </FormField>
                      <FormField label='Remarks' strong={true} style={{marginTop : '15px'}}>
                          <Label style={{marginLeft:'20px'}}><strong>{outwardObjVal.remarks}</strong></Label>
                      </FormField>
                    </Form>
                  </Box>
                  <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                      <Image src={outwardObjVal.outwardPhoto}  height={300} width={400}/>
                  </Box>
                </Split>
              </Section>
            </div>
        )
      }
    }

    hideOutwardDetails() {
      return (
        <Button icon={<Next/>}
          href='#'
          label='Show Last Outward Details'
          onClick={this.onShowingOutwardDetails.bind(this)}
          />
      )
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

    onSavingInwardVehicle() {

      const {
        lastCount,
        inwardSNo,
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
        uploadVehicleImage(imgFile, vNo, inwardSNo).then((snapshot) => {
             let inwardPhoto = snapshot.downloadURL;

      savingInwardVehicle({
        lastCount,
        inwardSNo,
        ownOutVehicle,
        vehicleNumber : vNo,
        driverName,
        driverNumber,
        emptyLoad,
        partyName,
        material,
        numberOfBags,
        comingFrom,
        billNumber,
        remarks,
        inwardPhoto
      }).then(this.setState({
        inwardSNo: '',
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
        screenshot: '',
        showLiveCameraFeed: true
      }, this.getVehicleDetails())).catch((err) => {
        console.error('Vehicle Inward Save Error', err);
      })
    })
    }


    onSaveClick() {
      const {
        lastCount,
        inwardSNo,
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

        if(!ownOutVehicle) {
          this.setState({
            validationMsg: 'Own/Out Vehicle is missing'
          })
          return
        }

        if(!vehicleNumber) {
          this.setState({
            validationMsg: 'Vehicle Number is missing'
          })
          return
        }

        if(!driverName) {
          this.setState({
            validationMsg: 'Driver Name is missing'
          })
          return
        }

        if(!emptyLoad) {
          this.setState({
            validationMsg: 'Empty/Load is missing'
          })
          return
        }

        if(!screenshot) {
          this.setState({
            validationMsg: 'Screenshot is missing'
          })
          return
        }

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
        }

        this.setState({
          validationMsg:''
        }, this.onSavingInwardVehicle.bind(this))



    }

  render() {
    const date = new Date();
    const dateStr = moment(date).format('DD-MM-YYYY');
    const { ourVehicle, emptyVehicle, showDetails, vehicleOpt, materialOpt, inwardSNo } = this.state;
    return (
      <div>
      { this.renderValidationMsg() }

        <h4 style={{marginLeft: 40, textDecoration: 'underline', fontWeight: 'bold'}}>Present Inward Details</h4>
        <Section justify='center'>
          <Split>
            <Box direction='column' style={{marginLeft:'40px', width:'300px'}} >

                <Form className='newVisitorFields'>
                  <FormField  label='Inward Sno'  strong={true} style={{marginTop : '15px'}}  >
                  <Label style={{marginLeft:'20px'}}><strong>{inwardSNo}</strong></Label>
                  </FormField>
                  <FormField strong={true} style={{marginTop : '15px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Own/Out Vehicle *</Label>
                      <Select
                      options={['Own Vehicle', 'Outside Vehicle']}
                      placeHolder='Own/Out Vehicle'
                      value={this.state.ownOutVehicle}
                      onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
                      />
                  </FormField>
                  <FormField strong={true} style={{marginTop : '15px', color: 'red'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Vehicle No *</Label>
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
                  <FormField strong={true} style={{marginTop : '15px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Driver Name *</Label>
                      <TextInput
                          placeHolder='Driver Name'
                          value={this.state.driverName}
                          onDOMChange={this.onFieldChange.bind(this, 'driverName')}
                      />
                  </FormField>
                  <FormField label='Driver Cell No' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Driver Cell No'
                          value={this.state.driverNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'driverNumber')}
                      />
                  </FormField>
                  <FormField strong={true} style={{marginTop : '15px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Empty/Load *</Label>
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

                  <FormField strong={true}  ref='loadVeicleForm' style={{marginTop : '18px'}}>
                  <Label style={!emptyVehicle ?
                          {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'red'
                          }: {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'black'
                          }}>Party Name</Label>
                      <TextInput
                          placeHolder='Party Name'
                          value={this.state.partyName}
                          onDOMChange={this.onFieldChange.bind(this, 'partyName')}
                      />
                  </FormField>

                  <FormField strong={true} style={{marginTop : '15px'}}>
                  <Label style={!emptyVehicle ?
                          {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'red'
                          }: {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'black'
                          }}>Material</Label>
                      <Select
                        options={materialOpt}
                        placeHolder='Material'
                        value={this.state.material}
                        onChange={this.onFieldChange.bind(this, 'material')}
                      />
                  </FormField>
                  <FormField strong={true} style={{marginTop : '15px'}}>
                  <Label style={!emptyVehicle ?
                          {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'red'
                          }: {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'black'
                          }}>No of Bags</Label>
                      <TextInput
                          placeHolder='No of Bags'
                          value={this.state.numberOfBags}
                          onDOMChange={this.onFieldChange.bind(this, 'numberOfBags')}
                      />
                  </FormField>
                  <FormField strong={true} style={{marginTop : '15px'}}>
                  <Label style={!emptyVehicle ?
                          {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'red'
                          }: {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'black'
                          }}>Coming From</Label>
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
            <Box direction='column'
              style={{marginTop:'25px', marginLeft : '10px', width:'300px'}} align='center'>
              <div  onClick={this.capture.bind(this)}>
                {this.renderCamera() }
              </div>
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
                      <span style={{marginLeft: 30}}>In Date : {dateStr}</span>
                    </Col>
                    <Col>
                      <span>In Time : <Clock format={'hh:mm:ss A'} ticking={true} /></span>
                    </Col>
                </Row>
            </Container>
          </div>
          <div style={{marginLeft: 40, marginTop: 40}}>
            { showDetails ? this.showOutwardDetails() : this.hideOutwardDetails() }
          </div>
        </Section>
      </div>
    )
  }
}
