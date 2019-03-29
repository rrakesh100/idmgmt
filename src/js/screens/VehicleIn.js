import React, { Component } from 'react';
import Search from 'grommet/components/Search';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Moment from 'moment';
import Vehicle from 'grommet/components/icons/base/DocumentConfig';
import Article from 'grommet/components/Article';
import Select from 'grommet/components/Select';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
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
import { getVehicleNumbers, getMaterials, getOwnPlaces, getParties } from '../api/configuration';
import Save from 'grommet/components/icons/base/Upload';
import Car from 'grommet/components/icons/base/Car';
import PrintIcon from 'grommet/components/icons/base/Print';
import { savingInwardVehicle, getAllVehicles, uploadVehicleImage, getOutwardVehicle,getInwardVehicle,
  getVehicleData,
getVehicleForValidation } from '../api/vehicles';
import Clock from 'react-live-clock';
import moment from 'moment';
import Notification from 'grommet/components/Notification';
import Image from 'grommet/components/Image';
import Toast from 'grommet/components/Toast';
import Layer from 'grommet/components/Layer';
import Heading from 'grommet/components/Heading';
import Status from 'grommet/components/icons/Status';
import { Meter } from 'grommet';
import { Input } from 'semantic-ui-react';
import VehicleInPrintComponent from '../components/VehicleInPrintComponent';
import ProgressBar from '../components/ProgressBar';
import ReactToPrint from "react-to-print";
import Progress from 'react-progressbar';
import { BeatLoader } from 'react-spinners';



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
      vehicleSaved: false,
      vehicleOpt: [],
      materialOpt: [],
      ownPlaceOpt: [],
      partyOptions: [],
      percentage: 20,
      showProgressBar: false,
      vehicleExists: false,
      savedVehicleNumber: null,
    };
  }

  componentDidMount() {
    this.getVehicleNumberDetails();
    this.getMaterialDetails();
    this.getVehicleDetails();
    this.getOwnPlaceDetails();
    this.getPartyDetails();
  }

  getPartyDetails() {
    getParties().then(res => {
      let partyObj=res.val();
      let partyOptions=[];
      Object.keys(partyObj).map(party => {
        partyOptions.push(party)
      })
      this.setState({partyOptions})
    }).catch(err => console.log(err))
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
      this.setState({vehicleOpt, allVehicleOptions: vehicleOpt})
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
      } else if(window.localStorage.unit === 'UNIT1') {
        prefix = 'U1';
      } else if (window.localStorage.unit === 'UNIT5') {
        prefix = 'U5';
      } else if (window.localStorage.unit === 'AYYAPPA') {
        prefix = 'AG';
      } else if (window.localStorage.unit === 'SURAMPALEM') {
        prefix = 'SP';
      } else if (window.localStorage.unit === 'SVPC') {
        prefix = 'SV';
      }
      const lastCount = data && data[prefix]['count']['inCount'] ? data[prefix]['count']['inCount'] :  1;
      let inwardSNo = `${prefix}-IN-${lastCount}`;
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

  getVehicleForValidation() {
    const { vehicleNumber, selectVehicleNumber } = this.state;
        let vNo=vehicleNumber;
        if(selectVehicleNumber)
         vNo = selectVehicleNumber;
      getVehicleForValidation(vNo).then((snap) => {
        const vehicleValidationObj = snap.val();
        this.setState({vehicleValidationObj})
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

    onVehicleSelect(data, isSuggestionSelected) {
      if(isSuggestionSelected) {
        this.setState({
          selectVehicleNumber: data.suggestion
        });
      } else {
        this.setState({
          selectVehicleNumber: data.target.value
        });
      }
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

      if(fieldName == 'driverName' && (e.target.value === '' || tre.test(e.target.value))) {
        let dText = (e.target.value).toUpperCase();
        this.setState({
          [fieldName]: dText,
          validationMsg: ''
        })
      }

      if(fieldName == 'partyName') {
        this.setState({
          [fieldName]: o.value,
          validationMsg:''
        })
      }

      if(fieldName == 'comingFrom') {
        this.setState({
          [fieldName]: o.value,
          validationMsg: ''
        })
      }

      if(fieldName == 'material') {
        this.setState({
          [fieldName]: o.value,
          validationMsg: ''
        })
      }

      if(fieldName == 'selectVehicleNumber') {
        this.setState({
          [fieldName]: o.value,
          validationMsg: '',
          vehicleNumber: '',
        }, this.getVehicleForValidation.bind(this))
      }

      if(fieldName == 'vehicleNumber'&& (e.target.value === '' || an.test(e.target.value))) {
          if(!nre.test(e.target.value)) {
            let vText = (e.target.value).toUpperCase();
          this.setState({
            [fieldName]: vText,
            validationMsg: '',
            selectVehicleNumber: ''
          }, this.getVehicleForValidation.bind(this))
        }
      }


      if(fieldName == 'numberOfBags' && (e.target.value === '' || re.test(e.target.value))) {
        this.setState({
          [fieldName]: e.target.value,
          validationMsg: ''
        })
      }

      if(fieldName == 'ownOutVehicle' || fieldName == 'emptyLoad') {
        this.setState({
          [fieldName]: e.option,
          validationMsg:''
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

    getVehicleData() {
      const { vehicleNumber, selectVehicleNumber } = this.state;
      let vNo = vehicleNumber || selectVehicleNumber;
      getVehicleData(vNo).then((snap) => {
        const vehicle = snap.val();
        const vehicleExists = vehicle ? vehicle['lastOutward'] : null;
        if(vehicleExists) {
          this.setState({vehicleExists})
        } else {
          this.setState({vehicleExists}, this.savingVehicleIn.bind(this))
        }
      })
    }

    refreshVehicleData(vNo) {
      const {vehicleOpt} = this.state;
      vehicleOpt.filter(item => {
        return item !== vNo;
      })
      this.setState({vehicleOpt});
    }

    savingVehicleIn() {
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
            screenshot, vehicleExists } = this.state;
            let vNo=vehicleNumber;
            if(selectVehicleNumber)
             vNo = selectVehicleNumber;

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
      }).then(this.setState({
        showProgressBar: false,
        toastMsg: `Vehicle ${vNo} is saved`,
        vehicleSaved: true,
      }, this.getVehicleDetails()
    )).catch((err) => {
        this.setState({
          showLiveCameraFeed: true
        })
        console.error('Vehicle Inward Save Error', err);
      })
    }

    onYesButtonClick() {
      this.setState({
        vehicleExists: false,
        showLiveCameraFeed: true,
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
            <strong>Vehicle already exists!</strong>
            </h3>
             <hr />
             <Row>
             <Button
               label='Ok'
               onClick={this.onYesButtonClick.bind(this)}
               href='#' style={{marginLeft: '350px', marginBottom:'10px'}}
               primary={true} />
             </Row>
          </Layer>
        )
      } else {
        return null;
      }
    }

    vehicleValidation() {
      const { vehicleValidationObj } = this.state;
      let existingVehicle=false;
      vehicleValidationObj && Object.keys(vehicleValidationObj).map(item => {
        let vehicleDateVal = vehicleValidationObj[item];
          Object.keys(vehicleDateVal).map(inSno => {
            let vInObj=vehicleDateVal[inSno];
          if(vInObj.inSide) {
            existingVehicle = true
          }
        })
      })
      if(existingVehicle) {
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
      }, this.savingVehicleIn.bind(this))
    }

    onSaveClick() {
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

        /*if(!screenshot) {
          this.setState({
            validationMsg: 'Screenshot is missing'
          })
          return
        }*/

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
        }, this.vehicleValidation.bind(this))
    }

    onNewBtnClick() {
      this.setState({
        vehicleSaved: false,
        showLiveCameraFeed: true,
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
      })
    }

    setPrintRef(ref) {
      this.componentRef = ref;
    }

    renderVehiclePrintCard() {
      const {lastCount } = this.state;
      let prefix = 'U2';
      if(window.localStorage.unit === 'UNIT3') {
        prefix = 'U3';
      }
      let savedCount = Number(lastCount) - 1;
      let savedInwardSNo = `${prefix}-IN-${savedCount}`;
      return (
        <VehicleInPrintComponent
          ref={this.setPrintRef.bind(this)}
          screenshot={this.state.screenshot}
          inwardSNo={savedInwardSNo}
          ownOutVehicle={this.state.ownOutVehicle}
          vehicleNumber={this.state.vehicleNumber || this.state.selectVehicleNumber}
          driverName={this.state.driverName}
          driverNumber={this.state.driverNumber}
          remarks={this.state.remarks}
          material={this.state.material}
          numberOfBags={this.state.numberOfBags}
          comingFrom={this.state.comingFrom}
          billNumber={this.state.billNumber}
        />
      )
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

    renderContent() {
      return this.componentRef;
    }

    handleAfterPrint() {
      console.log('after print');
    }

    onToastOkButtonClick() {
      this.setState({
        toastMsg: ''
      })
    }

  render() {
    const date = new Date();
    const dateStr = moment(date).format('DD-MM-YYYY');
    const { ownOutVehicle,
            ourVehicle,
            emptyVehicle,
            showDetails,
            vehicleOpt,
            materialOpt,
            inwardSNo,
            vehicleSaved,
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
            remarks, showProgressBar, toastMsg, lastCount } = this.state;
            let prefix = 'U2';
            if(window.localStorage.unit === 'UNIT3') {
              prefix = 'U3';
            }
            let savedCount = Number(lastCount) - 1;
            let savedInwardSNo = `${prefix}-IN-${savedCount}`;

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
          <Split style={{marginTop: -10}}>
            <Box direction='column' style={{marginLeft:'20px', width:'300px'}} >

                  { vehicleSaved ?
                    <Form className='newVisitorFields'>
                      <FormField  label='Inward Sno'  strong={true} style={{marginTop : '10px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{savedInwardSNo}</strong></Label>
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
                      <FormField  label='Inward Sno'  strong={true} style={{marginTop : '10px'}}>
                      <Label style={{marginLeft:'20px'}}><strong>{inwardSNo}</strong></Label>
                      </FormField>
                    <FormField strong={true} style={{marginTop : '10px'}}>
                      <Label style={{fontSize: 16,marginLeft: 20,color: 'red'}}>Own/Out Vehicle</Label>
                      <Select
                      options={['Own Vehicle', 'Outside Vehicle']}
                      placeHolder='Own/Out Vehicle'
                      value={ownOutVehicle}
                      onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
                      />
                  </FormField>
                  <FormField strong={true}
                   style={{marginTop : '10px', color: 'red'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Vehicle No</Label>
                    {
                      !ourVehicle ?
                      <TextInput
                          placeHolder='Vehicle Number'
                          value={this.state.vehicleNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'vehicleNumber')}
                      /> :
                      <div>
                        <Input transparent
                      list='vehicleNumber'
                      placeholder='Vehicle Number'
                      onChange={this.onFieldChange.bind(this, 'selectVehicleNumber')} />
                     <datalist id='vehicleNumber'>
                      {
                        vehicleOpt.map((val, index) => {
                          return <option value={val} key={index}/>
                        })
                      }
                    </datalist>
                    </div>
                    }
                  </FormField>
                  <FormField strong={true} style={{marginTop : '10px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Driver Name</Label>
                      <TextInput
                          placeHolder='Driver Name'
                          value={this.state.driverName}
                          onDOMChange={this.onFieldChange.bind(this, 'driverName')}
                      />
                  </FormField>
                  <FormField label='Driver Cell No'
                    strong={true} style={{marginTop : '10px'}}>
                      <TextInput
                          placeHolder='Driver Cell No'
                          value={this.state.driverNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'driverNumber')}
                      />
                  </FormField>
                  <FormField strong={true} style={{marginTop : '10px'}}>
                  <Label style={{fontSize: 16, marginLeft: 20, color: 'red'}}>Empty/Load</Label>
                      <Select
                        options={['Empty', 'Load']}
                        placeHolder='Empty/Load'
                        value={this.state.emptyLoad}
                        onChange={this.onFieldChange.bind(this, 'emptyLoad')}
                      />
                  </FormField>

                </Form> }
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
                  <FormField label='Coming From' strong={true} style={{marginTop : '10px'}}>
                    <Label style={{fontSize: 16, marginLeft: 20}}><strong>{comingFrom}</strong></Label>
                  </FormField><FormField label='Bill No' strong={true} style={{marginTop : '10px'}}>
                    <Label style={{fontSize: 16, marginLeft: 20}}><strong>{billNumber}</strong></Label>
                  </FormField><FormField label='Remarks' strong={true} style={{marginTop : '10px'}}>
                    <Label style={{fontSize: 16, marginLeft: 20}}><strong>{remarks}</strong></Label>
                  </FormField>
                  </Form> :
                  <Form className='newVisitorFields'>

                  <FormField strong={true} style={{marginTop : '10px'}}>
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

                      <Input transparent
                      list='parties'
                      placeholder='Party Name'
                      onChange={this.onFieldChange.bind(this, 'partyName')} />
                    <datalist id='parties'>
                      {
                        this.state.partyOptions.map((val, index) => {
                          return <option value={val} key={index}/>
                        })
                      }
                    </datalist>
                  </FormField>

                  <FormField strong={true} style={{marginTop : '10px'}}>
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

                      <Input transparent
                      list='materials'
                      placeholder='Material'
                      onChange={this.onFieldChange.bind(this, 'material')} />
                    <datalist id='materials'>
                      {
                        this.state.materialOpt.map((val, index) => {
                          return <option value={val} key={index}/>
                        })
                      }
                    </datalist>
                  </FormField>
                  <FormField strong={true} style={{marginTop : '10px'}}>
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
                  <FormField strong={true} style={{marginTop : '10px'}}>
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

                        <Input transparent
                        list='places'
                        placeholder='Coming From'
                        onChange={this.onFieldChange.bind(this, 'comingFrom')} />
                      <datalist id='places'>
                        {
                          this.state.ownPlaceOpt.map((val, index) => {
                            return <option value={val} key={index}/>
                          })
                        }
                      </datalist>

                  </FormField>
                  <FormField label='Bill No' strong={true} style={{marginTop : '10px'}}>
                      <TextInput
                          placeHolder='Bill No'
                          value={this.state.billNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'billNumber')}
                      />
                  </FormField>
                  <FormField label='Remarks' strong={true} style={{marginTop : '10px'}}>
                      <TextInput
                          placeHolder='Remarks'
                          value={this.state.remarks}
                          onDOMChange={this.onFieldChange.bind(this, 'remarks')}
                      />
                  </FormField>
                </Form>}
              </Box>
            <Box direction='column'
              style={{marginLeft : '10px', width:'300px'}} align='center'>

                    <Button icon={<Save />}
                      label='SAVE' style={ vehicleSaved ? {
                        marginTop:20,
                        width: '300px',
                        display: 'none'
                      } :
                      {
                        marginTop:20,
                        width: '300px',
                      }}
                      onClick={this.onSaveClick.bind(this)}
                      disabled={true}
                      href='#'
                      primary={true} />
                    <ReactToPrint
                        trigger={this.renderTrigger.bind(this)}
                        content={this.renderContent.bind(this)}
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
            <h4 style={{marginLeft: 20, textDecoration: 'underline', fontWeight: 'bold'}}>Date&Time Details</h4>
            <Container>
                <Row>
                    <Col>
                      <span style={{marginLeft: 20}}>In Date : {dateStr}</span>
                    </Col>
                    <Col>
                      <span>In Time : <Clock format={'hh:mm:ss A'} ticking={true} /></span>
                    </Col>
                </Row>
            </Container>
          </div>
          <div style={{marginLeft: 20, marginTop: 20}}>
            { showDetails ? this.showOutwardDetails() : this.hideOutwardDetails() }
          </div>
      </div>
    )
  }
}
