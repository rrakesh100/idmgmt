import React, { Component } from 'react';
import Search from 'grommet/components/Search';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Button from 'grommet/components/Button';
import Vehicle from 'grommet/components/icons/base/DocumentConfig';
import Article from 'grommet/components/Article';
import Select from 'grommet/components/Select';
import { Input } from 'semantic-ui-react';
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
import { getVehicleNumbers, getMaterials, getOwnPlaces } from '../api/configuration';
import Save from 'grommet/components/icons/base/Upload';
import { savingOutwardVehicle,
         getAllVehicles,
         getInwardVehicle,
         uploadVehicleImage,
         saveVehicleOutPrintCopiesData,
         fetchVehicleOutPrintCopiesData, getVehicleData, getInsideVehicles } from '../api/vehicles';
import Clock from 'react-live-clock';
import moment from 'moment';
import Image from 'grommet/components/Image';
import Notification from 'grommet/components/Notification';
import Toast from 'grommet/components/Toast';
import Layer from 'grommet/components/Layer';
import Status from 'grommet/components/icons/Status';
import Car from 'grommet/components/icons/base/Car';
import PrintIcon from 'grommet/components/icons/base/Print';
import ReactToPrint from "react-to-print";
import VehicleOutPrintComponent from '../components/VehicleOutPrintComponent';
import { BeatLoader } from 'react-spinners';



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
      goingTo: '',
      billNumber: '',
      remarks: '',
      inwardObj: null,
      ourVehicle: false,
      emptyVehicle: true,
      showDetails: false,
      showLiveCameraFeed: true,
      toastMsg: '',
      materialOpt: [],
      ownPlaceOpt:[],
      vehicleSaved: false,
      showProgressBar: false,
      vehiclesArr:[],
    };
  }

  componentDidMount() {
    this.getVehicleNumberDetails();
    this.getMaterialDetails();
    this.getVehicleDetails();
    this.getOwnPlaceDetails();
    this.getInsideVehicles();
  }

  getInsideVehicles() {
    getInsideVehicles().then(snap => {
      const inVehicles = snap.val();
      let ownVehiclesArr=[];
      let outVehiclesArr=[];
      Object.keys(inVehicles).forEach(vehicle => {
        let vehicleOb = inVehicles[vehicle];
        Object.keys(vehicleOb).forEach(item => {
          let vObj = vehicleOb[item];
          if(vObj.inSide && vObj.ownOutVehicle == 'Own Vehicle') {
            ownVehiclesArr.push(vehicle);
          } else if(vObj.inSide && vObj.ownOutVehicle == 'Outside Vehicle') {
            outVehiclesArr.push(vehicle)
          }
        })
      })
      this.setState({ownVehiclesArr, outVehiclesArr});
    })
  }

  getOwnPlaceDetails() {
    getOwnPlaces().then((snap) => {
      const options = snap.val();
      let ownPlaceOpt = [];
      Object.keys(options).forEach((opt) => {
        ownPlaceOpt.push(opt)
      })
      this.setState({ownPlaceOpt})
    }).catch((e) => console.log(e))
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
      let prefix = 'U2';
      if(window.localStorage.unit === 'UNIT3') {
        prefix = 'U3';
      }
      const lastCount = vehicleData && vehicleData[prefix]['count']['outCount'] ? vehicleData[prefix]['count']['outCount'] : 1;
      let outwardSNo = `${prefix}-out-${lastCount}`;

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

  onFieldChange(fieldName, e, o) {
    let dr = /^[0-9\b]/;
    let re = /^[1-9][0-9]{0,4}$/;
    let ne = /^[0-9]{11}$/;
    let mn = /^\d{10}$/;
    let an = /^[a-zA-Z0-9]+$/;
    let nre = /^[a-zA-Z0-9]{11}$/;
    let tre = /^[A-Za-z. ]+$/;
    let pre = /^[A-Za-z. ]{0,100}$/;

    if(fieldName == 'driverNumber' && (e.target.value === '' || dr.test(e.target.value))) {
        if(!ne.test(e.target.value)) {
          this.setState({
            [fieldName]: e.target.value,
            validationMsg:''
          })
        }
    }

    if(fieldName == 'billNumber' || fieldName == 'remarks') {
      this.setState({
        [fieldName]: e.target.value,
        validationMsg: ''
      })
    }

    if(fieldName == 'goingTo' && (o.value === '' || pre.test(o.value))) {
      let cText = (o.value).toUpperCase();
      this.setState({
        [fieldName]: cText,
        validationMsg: ''
      })
    }

    if(fieldName == 'driverName' && (e.target.value === '' || tre.test(e.target.value))) {
      let dText = (e.target.value).toUpperCase();
      this.setState({
        [fieldName]: dText,
        validationMsg: ''
      })
    }

    if(fieldName == 'partyName' && (e.target.value === '' || pre.test(e.target.value))) {
      let pText = (e.target.value).toUpperCase();
      this.setState({
        [fieldName]: pText,
        validationMsg: ''
      })
    }

    if(fieldName == 'vehicleNumber'&& (e.target.value === '' || an.test(e.target.value))) {
        if(!nre.test(e.target.value)) {
          let vText = (e.target.value).toUpperCase();
        this.setState({
          [fieldName]: vText,
          validationMsg: ''
        }, this.getInwardVehicleDetails.bind(this))
      }
    }

    if(fieldName == 'numberOfBags' && (e.target.value === '' || re.test(e.target.value))) {
      this.setState({
        [fieldName]: e.target.value,
        validationMsg: ''
      })
    }

    if(fieldName == 'ownOutVehicle' || fieldName == 'emptyLoad' || fieldName == 'material') {
      this.setState({
        [fieldName]: e.option,
        validationMsg:''
      })
    }

    if(fieldName == 'selectVehicleNumber') {
      this.setState({
        [fieldName]: e.option,
        validationMsg: ''
      }, this.getInwardVehicleDetails.bind(this))
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
    let inwardObjVal = inwardObj;
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

  vehicleValidation() {
    const { inwardObj } = this.state;
    let inwardDate = inwardObj ? inwardObj.inwardDate : null;

    if(!inwardDate) {
      this.setState({
        vehicleExists: true
      })
    } else {
      this.startLoading();
    }
  }

  startLoading() {
    this.setState({
      showProgressBar: true
    }, this.onSavingOutwardVehicle.bind(this))
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
      goingTo,
      billNumber,
      remarks,
      screenshot, inwardObj } = this.state;
      let inwardDate = inwardObj ? inwardObj.inwardDate : null;
      let inTime = inwardObj ? inwardObj.inTime : null;
      let comingFrom = inwardObj ? inwardObj.comingFrom : null;
      let inwardSNo = inwardObj ? inwardObj.inwardSNo : null;
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
        vehicleNumber : vNo,
        selectVehicleNumber,
        driverName,
        driverNumber,
        emptyLoad,
        partyName,
        material,
        numberOfBags,
        goingTo,
        billNumber,
        remarks,
        outwardPhoto,
        inwardDate,
        inTime,
        comingFrom,
        inwardSNo
      }).then(this.setState({
        showProgressBar: false,
        toastMsg: `Vehicle ${vNo} is saved`,
        vehicleSaved: true
      }, this.getVehicleDetails())).catch((err) => {
        this.setState({
          showLiveCameraFeed: true
        })
        console.error('Vehicle Outward Save Error', err);
      })
    })
  }

  onNewBtnClick() {
    this.setState({
      ownOutVehicle: '',
      vehicleNumber: '',
      selectVehicleNumber: '',
      driverName:'',
      driverNumber: '',
      emptyLoad: '',
      partyName: '',
      material: '',
      numberOfBags: '',
      goingTo: '',
      billNumber: '',
      remarks: '',
      screenshot:'',
      showLiveCameraFeed: true,
      vehicleSaved: false
    })
  }

  onSaveClick() {
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
      goingTo,
      billNumber,
      remarks,
      screenshot } = this.state;
      console.log(goingTo);
      if(!ownOutVehicle) {
        this.setState({
          validationMsg: 'Own/Out Vehicle is missing'
        })
        return
      }

      if(!vehicleNumber && !selectVehicleNumber) {
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

      if(driverNumber && (driverNumber.toString()).length<10) {
          this.setState({
            validationMsg: 'Mobile Number must contain atleast 10 digits'
          })
          return
      }

      if(!emptyLoad) {
        this.setState({
          validationMsg: 'Empty/Load is missing'
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
        if(!goingTo) {
          this.setState({
            validationMsg: 'Going to is missing'
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
      }, this.vehicleValidation.bind(this))

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

  toastClose() {
    this.setState({ toastMsg: '' });
  }

  renderToastMsg() {
    const { toastMsg } = this.state;
    if(toastMsg) {
      return (
        <Toast status='ok'
          onClose={ this.toastClose.bind(this) }>
          { toastMsg }
        </Toast>
      );
    }
    return null;
  }

  getVehicleData() {
    const { vehicleNumber, selectVehicleNumber } = this.state;
    let vNo = vehicleNumber || selectVehicleNumber;
    getVehicleData(vNo).then((snap) => {
      const vehicle = snap.val();
      const vehicleExists = vehicle ? vehicle['vehicleOut'] : null;
      if(vehicleExists) {
        this.setState({vehicleExists})
      } else {
        this.setState({vehicleExists}, this.onSavingOutwardVehicle())
      }
    })
  }


  onYesButtonClick() {
    this.setState({
      vehicleExists: false,
      showLiveCameraFeed: true
    })
  }

  renderValidationForVehicleSave() {
    const { vehicleExists } = this.state;
    if(vehicleExists) {
      return (
        <Layer>
          <h3 style={{marginTop:20}}>
          <Status value='critical'
          size='medium'
          style={{marginRight:'10px'}} />
          <strong>Vehicle In is not marked</strong>
          </h3>
           <hr />
           <Row>
           <Button
             label='Ok'
             onClick={this.onYesButtonClick.bind(this)}
             href='#' style={{marginLeft: '300px', marginBottom:'10px'}}
             primary={true} />
           </Row>
        </Layer>
      )
    } else {
      return null;
    }
  }

  handleAfterPrint() {
    const { vehicleNumber, selectVehicleNumber, printCopies } = this.state;
    const date = new Date();
    const dateStr = moment(date).format('DD-MM-YYYY');
    let vNo = vehicleNumber || selectVehicleNumber;
    const vehicleKey = vNo+ '_' +dateStr;
    saveVehicleOutPrintCopiesData(vehicleKey, printCopies);
  }

  handleBeforePrint() {
  const { vehicleNumber } = this.state;
  const date = new Date();
  const dateStr = moment(date).format('DD-MM-YYYY');
  const vehicleKey = vehicleNumber+ '_' +dateStr;
  fetchVehicleOutPrintCopiesData(vehicleKey).then((snap) => {
    let printCopies = snap.val();
    this.setState({printCopies})
  }).catch((err) => console.log(err))
  }

  renderContent() {
    return this.componentRef;
  }

  renderTrigger() {
    return (
      <Button icon={<PrintIcon />}
        label='PRINT' style={ !this.state.vehicleSaved ?
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

  onCapturingAndSaving() {
    if (this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false,
      }, this.onSaveClick.bind(this));
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot
      }, this.onSaveClick.bind(this));
    }
  }

  setPrintRef(ref) {
    this.componentRef = ref;
  }

  renderVehiclePrintCard() {
    return (
      <VehicleOutPrintComponent
        ref={this.setPrintRef.bind(this)}
        screenshot={this.state.screenshot}
        outwardSNo={this.state.outwardSNo}
        ownOutVehicle={this.state.ownOutVehicle}
        vehicleNumber={this.state.vehicleNumber}
        driverName={this.state.driverName}
        driverNumber={this.state.driverNumber}
        remarks={this.state.remarks}
        material={this.state.material}
        numberOfBags={this.state.numberOfBags}
        goingTo={this.state.goingTo}
        billNumber={this.state.billNumber}
        printCopies={this.state.printCopies}
      />
    )
  }

  onToastOkButtonClick() {
    this.setState({
      toastMsg: ''
    })
  }


  render() {
    const date = new Date();
    const dateStr = moment(date).format('DD-MM-YYYY');
    const { ourVehicle,
            emptyVehicle,
            showDetails,
            vehicleOpt,
            materialOpt,
            outwardSNo,
            vehicleSaved,
            driverName,
            vehicleNumber,
            selectVehicleNumber,
            ownOutVehicle,
            driverNumber,
            emptyLoad,
            partyName,
            material,
            numberOfBags,
            goingTo,
            billNumber,
            remarks, showProgressBar, toastMsg, lastCount, ownVehiclesArr, outVehiclesArr } = this.state;
            let prefix = 'U2';
            if(window.localStorage.unit === 'UNIT3') {
              prefix = 'U3';
            }
            let savedCount = Number(lastCount) - 1;
            let savedOutwardSNo = `${prefix}-out-${savedCount}`;

            if(showProgressBar) {
              return (
                <div style={{display: 'flex', justifyContent: 'center', marginTop:200}}>
                <BeatLoader
                      sizeUnit={"px"}
                      size={40}
                      color={'#865CD6'}
                      loading={this.state.showProgressBar}
                    />
                </div>
              )
            }

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
      { this.renderValidationForVehicleSave() }
      { this.renderVehiclePrintCard() }
        <h4 style={{marginLeft: 20, textDecoration: 'underline', fontWeight: 'bold'}}>Present Outward Details</h4>
          <Split style={{marginTop: -20}}>
            <Box direction='column' style={{marginLeft:'20px', width:'300px'}} >
            { vehicleSaved ?
              <Form className='newVisitorFields'>
                <FormField  label='Outward Sno'  strong={true} style={{marginTop : '10px'}}>
                <Label style={{marginLeft:'20px'}}><strong>{savedOutwardSNo}</strong></Label>
                </FormField>
              <FormField label='Own/Out Vehicle' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{ownOutVehicle}</strong></Label>
              </FormField>
              <FormField label='Vehicle No' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{vehicleNumber || selectVehicleNumber}</strong></Label>
              </FormField>
              <FormField label='Driver Name' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{driverName}</strong></Label>
              </FormField><FormField label='Driver Cell No' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{driverNumber}</strong></Label>
              </FormField><FormField label='Empty/Load' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{emptyLoad}</strong></Label>
              </FormField>
              </Form> :
                <Form className='newVisitorFields'>
                  <FormField  label='Outward Sno'  strong={true} style={{marginTop : '8px'}}  >
                  <Label style={{marginLeft:'20px'}}><strong>{outwardSNo}</strong></Label>
                  </FormField>
                  <FormField strong={true} style={{marginTop : '8px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Own/Out Vehicle</Label>
                      <Select
                      options={['Own Vehicle', 'Outside Vehicle']}
                      placeHolder='Own/Out Vehicle'
                      value={this.state.ownOutVehicle}
                      onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
                      />
                  </FormField>
                  <FormField strong={true} style={{marginTop : '8px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Vehicle Number</Label>
                      {
                      !ourVehicle ?
                      <Select
                      placeHolder='Vehicle No'
                      options={outVehiclesArr}
                      value={this.state.selectVehicleNumber}
                      onChange={this.onFieldChange.bind(this, 'selectVehicleNumber')}
                      /> :
                      <Select
                      placeHolder='Vehicle No'
                      options={ownVehiclesArr}
                      value={this.state.selectVehicleNumber}
                      onChange={this.onFieldChange.bind(this, 'selectVehicleNumber')}
                      />
                    }
                  </FormField>
                  <FormField strong={true} style={{marginTop : '8px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Driver Name</Label>

                      <TextInput
                          placeHolder='Driver Name'
                          value={this.state.driverName}
                          onDOMChange={this.onFieldChange.bind(this, 'driverName')}
                      />
                  </FormField>
                  <FormField label='Driver Cell No' strong={true} style={{marginTop : '8px'}}>
                      <TextInput
                          placeHolder='Driver Cell No'
                          value={this.state.driverNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'driverNumber')}
                      />
                  </FormField>
                  <FormField strong={true} style={{marginTop : '8px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Empty/Load</Label>

                      <Select
                        options={['Empty', 'Load']}
                        placeHolder='Empty/Load'
                        value={this.state.emptyLoad}
                        onChange={this.onFieldChange.bind(this, 'emptyLoad')}
                      />
                  </FormField>
                </Form>}
            </Box>
            <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
            {vehicleSaved ?
              <Form className='newVisitorFields'>
                <FormField  label='Party Name'  strong={true} style={{marginTop : '10px'}}>
                <Label style={{marginLeft:'20px'}}><strong>{partyName}</strong></Label>
                </FormField>
              <FormField label='Material' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{material}</strong></Label>
              </FormField>
              <FormField label='No of Bags' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{numberOfBags}</strong></Label>
              </FormField>
              <FormField label='Going To' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{goingTo}</strong></Label>
              </FormField><FormField label='Bill No' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{billNumber}</strong></Label>
              </FormField><FormField label='Remarks' strong={true} style={{marginTop : '10px'}}>
                <Label style={{fontSize: 16, marginLeft: 20}}><strong>{remarks}</strong></Label>
              </FormField>
              </Form> :
                <Form className='newVisitorFields'>
                  <FormField strong={true} style={{marginTop : '8px'}}>
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

                  <FormField strong={true} style={{marginTop : '8px'}}>
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
                  <FormField strong={true} style={{marginTop : '8px'}}>
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
                  <FormField strong={true} style={{marginTop : '8px'}}>
                  <Label style={!emptyVehicle ?
                          {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'red'
                          }: {
                            fontSize:14,
                            marginLeft: 20,
                            color: 'black'
                          }}>Going To</Label>
                          <Input transparent
                            list='places'
                            placeholder='Going To'
                            onChange={this.onFieldChange.bind(this, 'goingTo')} />
                          <datalist id='places'>
                            {
                              this.state.ownPlaceOpt.map((val, index) => {
                                return <option value={val} key={index}/>
                              })
                            }
                          </datalist>
                  </FormField>
                  <FormField label='Bill No' strong={true} style={{marginTop : '8px'}}>
                      <TextInput
                          placeHolder='Bill No'
                          value={this.state.billNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'billNumber')}
                      />
                  </FormField>
                  <FormField label='Remarks' strong={true} style={{marginTop : '8px'}}>
                      <TextInput
                          placeHolder='Remarks'
                          value={this.state.remarks}
                          onDOMChange={this.onFieldChange.bind(this, 'remarks')}
                      />
                  </FormField>
                </Form> }
              </Box>
            <Box direction='column'
              style={{marginLeft : '10px', width:'300px'}} align='center'>
                <div onClick={this.capture.bind(this)}>
                {this.renderCamera() }
                </div>
                  <Button icon={<Save />}
                    label='SAVE' style={ vehicleSaved ?
                      {
                        marginTop: 20,
                        width: '300px',
                        display: 'none'
                      } :
                      {
                        marginTop: 20,
                        width: '300px'
                      }}
                    onClick={this.onCapturingAndSaving.bind(this)}
                    disabled={true}
                    href='#'
                    primary={true} />
                <ReactToPrint
                    trigger={this.renderTrigger.bind(this)}
                    content={this.renderContent.bind(this)}
                    onBeforePrint={this.handleBeforePrint.bind(this)}
                    onAfterPrint={this.handleAfterPrint.bind(this)}
                  />
                <Button icon={<Car />}
                  label='NEW' style={{marginTop: 20, width: '300px'}}
                  onClick={this.onNewBtnClick.bind(this)}
                  disabled={true}
                  href='#'
                  primary={true} />
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
      </div>
    )
  }
}
