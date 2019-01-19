import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import Webcam from 'react-webcam';
import Search from 'grommet/components/Search';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';
import Heading from 'grommet/components/Heading';
import axios from 'axios';
import $ from 'jquery';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Anchor from 'grommet/components/Anchor';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Split from 'grommet/components/Split';
import Headline from 'grommet/components/Headline';
import Columns from 'grommet/components/Columns';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import DateTime from 'grommet/components/DateTime';
import Select from 'grommet/components/Select';
import Grid from 'react-css-grid';
import TextInput from 'grommet/components/TextInput';
import Rand from 'random-key';
import Notification from 'grommet/components/Notification';
import Barcode from 'react-barcode';
import { Container, Row, Col } from 'react-grid-system';
import Clock from 'react-live-clock';
import { saveAttendaceEmployee } from '../api/employees';
import { uploadAttendanceEmployeeImage, saveAttendanceInData } from '../api/attendance';
import Label from 'grommet/components/Label';
import moment from 'moment';
import Status from 'grommet/components/icons/Status';
import { getShifts, getTimeslots } from '../api/configuration';
import Spinning from 'grommet/components/icons/Spinning';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import ReactToPrint from "react-to-print";
import AttendancePrintComponent from '../components/AttendancePrintComponent'


const localStorage = window.localStorage;

class AttendanceIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barCodeId: Rand.generateBase30(8),
      msg : '',
      employeeSearchString : '',
      selectedEmployeeId : '',
      selectedEmployeeData : {},
      showLiveCameraFeed: true,
      dateVal: '',
      shift: '',
      numberOfPersons: '',
      manpowerName: '',
      timeslot: '',
      hideOutsideCamera: false,
      barcodeInput : '',
      scheduled : false,
      savingInProgress : false,
      timeslotOpt: [],
      shiftOpt: [],
      employeeSuggestions: [],
      filteredSuggestions: [],
      screenshot: ''
    };
    this.onCompareClick.bind(this);
  }

  componentDidMount() {
     this.getEmployeeDetails() ;
     this.getShiftOptions();
     this.getTimeslotOptions() ;
  }

  getTimeslotOptions() {
    getTimeslots().then((snap) => {
      const options = snap.val();
      let timeslotOpt = [];
      Object.keys(options).forEach((opt) => {
        timeslotOpt.push(opt)
      })
      this.setState({timeslotOpt})
    }).catch((e) => console.log(e))
  }

  getShiftOptions() {
    getShifts().then((snap) => {
      const options = snap.val()
      let shiftOpt = [];
      Object.keys(options).forEach((opt) => {
        shiftOpt.push(opt)
      })
      this.setState({shiftOpt})
    }).catch((e) => console.log(e))
  }

  getEmployeeDetails() {
    getEmployees().then((snap) => {
      const data = snap.val();
      if (!data) {
        return;
      }
      let suggests = [];
      let empId = [];
      Object.keys(data).forEach((employee) => {
        if(employee != 'count')
        suggests.push({
           label : data[employee].name,
           employeeId : employee
        })
        empId.push(employee)
      })
      this.setState({
        employeeSuggestions: this.sort(suggests),
        filteredSuggestions: this.sort(suggests),
        empId
      })
    })
    .catch((err) => {
      console.error('VISITOR FETCH FAILED', err);
    });
  }


  sort(arr){
      arr.sort(function(a , b){
          let A = a.label || "";
          let B = b.label || "";
          if(A < B)
              return -1;
          else if (A > B)
              return 1;
          else {
              return 0;
          }
      })
      return arr;
  }

  autoSaveEmployee() {
    const { selectedEmployeeData } = this.state;
    let inSide;
    if(localStorage.unit == '') {
      inSide = selectedEmployeeData.inSide || false;
    } else {
      inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
    }
    if(selectedEmployeeData && !inSide) {
      this.setState({
        savingInProgress : true
      })
      setTimeout(() => this.oneClickCapture(), 500)
    }
  }

  fetchSearchedEmployee(autoSave) {
    const { selectedEmployeeId } = this.state;
    if(selectedEmployeeId) {
    getEmployee(selectedEmployeeId).then((snap) => {
      const selectedEmployeeData = snap.val();
      this.setState({
        selectedEmployeeData
      }, () =>{
        if(autoSave){
           this.autoSaveEmployee();
        }
      })
    }).catch((e) => console.log(e))
  }
  }

  onEmployeeSelect(data, isSuggestionSelected, autoSave) {
    if(isSuggestionSelected) {
      this.setState({
        selectedEmployeeId: data.suggestion.employeeId,
        employeeSearchString: data.suggestion.label,
        hideOutsideCamera: true
      }, this.fetchSearchedEmployee.bind(this, autoSave));
    } else {
      this.setState({
        selectedEmployeeId: data.target.value,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this, autoSave));
    }
  }


  onBarCodeSearch(e) {
    this.setState({
      selectedEmployeeId:  e.target.value,
      selectedEmployeeData: {}
    });
    const {scheduled} = this.state;
    let options = this.state.employeeSuggestions;
    let filtered = [];

    if(!options ){
      return ;
    }

    options.forEach((opt) => {
     if(opt.employeeId.toUpperCase() === (e.target.value.toUpperCase())) {
        filtered.push(opt);
      }
    })

    if(filtered.length > 0) {
      this.setState({
        selectedEmployeeId : e.target.value,
        filteredSuggestions : filtered
      },()=> {
        const isScheduled = this.state.scheduled;
        if(!isScheduled) {
          this.setState({scheduled : true});
          setTimeout(() => {
            const fSuggestions = this.state.filteredSuggestions;

              if(fSuggestions.length == 1) {
                let data = {};
                this.outsideCameraCapture();
                data.suggestion = fSuggestions[0];
                this.onEmployeeSelect(data, true, true);
              }
            }, 1000)
        }
      })
    }
}

  onSearchEntry(e) {
    this.setState({selectedEmployeeData: {}})
    let filtered = [];
    let  options  = this.state.employeeSuggestions;
    let exactMatch = false;

    if(!options)
      return ;

    if(e.target.value == '')
      filtered = options
    else {
      options.forEach((opt) => {
        if(opt.label && opt.label.toUpperCase().startsWith(e.target.value.toUpperCase()))
          filtered.push(opt)
        else if(opt.employeeId && opt.employeeId.toUpperCase().startsWith(e.target.value.toUpperCase())) {
          filtered.push(opt);
          if(opt.employeeId.toUpperCase() == e.target.value.toUpperCase())
            exactMatch = true;
        }
      })
    }
    this.setState({
      employeeSearchString: e.target.value,
      filteredSuggestions: filtered
    }, () => {
      if(filtered.length == 1 && exactMatch) {
        let data = {};
        data.suggestion = filtered[0];
        this.onEmployeeSelect(data, true, false);
      }
     }
   );
  }

  renderEmployeeSearch() {
    return (
      <Search placeHolder='Search manpower By Name or Barcode' style={{width:'400px'}}
        inline={true}
        iconAlign='end'
        size='small'
        suggestions={this.state.filteredSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)}
        />
    )
  }

  renderEmployeeSearchByBarcode() {
    const { empId } = this.state;
    return (
      <Search placeHolder='Search manpower By Barcode' style={{width:'400px', marginLeft: '20px'}}
        inline={true}
        iconAlign='end'
        size='small'
        ref={(input) => { this.state.barcodeInput = input; }}
        value={this.state.selectedEmployeeId}
        onDOMChange={this.onBarCodeSearch.bind(this)}
        />
    )
  }



  onCompareClick(){
    let payload = {
      api_key : "Jmq3ihDPUxpPgn2H9ahNHCY1X6wyP0vz",
      api_secret : "6oNHVC7SGToTPIVapWFg2HVIaf1bSi_F",
      image_base64_2  : this.state.screenshot,
      image_base64_1  : this.state.selectedEmployeeData.screenshot
    };

    // curl -X POST "https://api-us.faceplusplus.com/facepp/v3/compare"
    // -F "api_key=Jmq3ihDPUxpPgn2H9ahNHCY1X6wyP0vz" -F
    // "api_secret=6ooTPIVapWFg2HVIaf1bSi_F"
    // -F "image_file1=@rak1.jpeg"
    // -F "image_file2=@rak2.jpeg"
     // axios.post('https://api-us.faceplusplus.com/facepp/v3/compare',  {...payload}).then(data =>
     //  console.log(data)).catch(e => console.log(e))

      $.ajax({
        type: "POST",
       url:'https://api-us.faceplusplus.com/facepp/v3/compare',
       crossDomain: true,
       dataType: 'json',
       data : payload,
       success: (data) => {
        return data;
      },
      error: function (responseData, textStatus, errorThrown) {
    }
  })

  }

  onMarkButtonClick() {
    const { selectedEmployeeId, selectedEmployeeData , screenshot, numberOfPersons } = this.state;
    const date = new Date();
    const hours = date.getHours();
    let shiftVar;
    if( hours > 14) {
      shiftVar = 'Night Shift'
    } else {
      shiftVar = 'Day Shift'
    }
    let shift = shiftVar || this.state.shift;
    let selectedEmployeeName = selectedEmployeeData.name;
    let selectedEmployeeVillage = selectedEmployeeData.village;
    let paymentType = selectedEmployeeData.paymentType;

    if(!selectedEmployeeId || selectedEmployeeId === '') {
      alert("Could not SAVE. Please try again..");
      return;
    }

    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadAttendanceEmployeeImage(imgFile, selectedEmployeeId).then((snapshot) => {
         let inwardPhoto = snapshot.downloadURL;
      document.getElementById('printAnchor').click();
    saveAttendanceInData({
      selectedEmployeeId,
      selectedEmployeeName,
      shift,
      inwardPhoto,
      numberOfPersons,
      paymentType
      }).then(() => {
      this.setState({
        msg:'Attendance data saved',
        shift: '',
        numberOfPersons: '',
        selectedEmployeeId : '',
        selectedEmployeeData:{},
        showLiveCameraFeed: true,
        hideOutsideCamera : false,
        savingInProgress : false,
        inwardPhoto
      },() => {
          setTimeout( () => { this.onOkButtonClick() }, 500);
      })
    }).catch((err) => {
      this.setState({
        savingInProgress : false
      });
            alert('Could not save the data')
    })
    }).catch((e) => console.log(e))
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  setOutsideRef(webcam) {
    this.outsideWebcam = webcam;
  }

  oneClickCapture() {
    const { pickScreenshotFromOutsideCamera, screenshot } = this.state;
    if(pickScreenshotFromOutsideCamera){
      this.setState({
        showLiveCameraFeed: false,
      }, this.onSaveButtonClick.bind(this));
      return;
    }

    if (this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false,
        validationMsg: ''
      }, this.onSaveButtonClick.bind(this));
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot: ''
      }, this.onSaveButtonClick.bind(this));
    }
  }

  capture() {
    if (this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false,
        validationMsg: ''
      });
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot: ''
      });
    }
  }

  outsideCameraCapture() {
      const screenshot = this.outsideWebcam.getScreenshot();
      this.setState({
        screenshot,
        hideOutsideCamera : true,
        pickScreenshotFromOutsideCamera : true,
        validationMsg: '',
        scheduled : false
      });
  }

  renderOutsideCamera() {
    return (
      <Box>
          <Webcam
            audio={false}
            height={400}
            ref={this.setOutsideRef.bind(this)}
            screenshotFormat='image/jpeg'
            width={400}
            style={{marginLeft : '200', marginTop:'100'}}
            onClick={this.outsideCameraCapture.bind(this)}
          />
      </Box>
    );
  }

  renderSelectedOptions() {
    const { hideOutsideCamera } = this.state;
    if(!hideOutsideCamera) {
      return (
        <div>
        <p>Current Time slot : {window.localStorage.timeslot}</p>
        <p  size="small">Current Shift : {window.localStorage.shift}</p>
        </div>

      );
    }

  }

  renderInsideCamera() {
    const { selectedEmployeeData } = this.state;
    let inSide;
    if(localStorage.unit == '') {
      inSide = selectedEmployeeData.inSide || false;
    } else {
      inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
    }
    const { pickScreenshotFromOutsideCamera=false } = this.state ;
    if(!inSide && !pickScreenshotFromOutsideCamera) {
      return (
        <Box>
        <Webcam
          audio={false}
          height={300}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={300}
          onClick={this.capture.bind(this)}
        />
        </Box>
      );
    }
    return (
      <Box>
      <Image src={inSide ? this.state.selectedEmployeeData.inwardPhoto : this.state.screenshot} height={300}/>
      </Box>

    );
  }

  onDateChange(e) {
    this.setState({dateVal:e})
  }

  onFieldChange(fieldName, e) {
    if(fieldName == 'shift' || fieldName == 'timeslot') {
      window.localStorage[fieldName] = e.option;

    this.setState({
      [fieldName]: e.option,
      validationMsg: ''
    })
  } else {
    this.setState({
      [fieldName]: e.target.value
    })
  }
  }

renderSearchedEmployee() {
  const { selectedEmployeeData, shiftOpt, timeslotOpt, hideOutsideCamera } = this.state;
  const date = new Date();
  const dateStr = moment(date).format('DD/M/YYYY');

  const hours = date.getHours();
  let shiftVar;
  if( hours > 14) {
    shiftVar = 'Night Shift'
  } else {
    shiftVar = 'Day Shift'
  }
  let shift = shiftVar || this.state.shift;

  let timeslot = window.localStorage.timeslot || this.state.timeslot;

  if(Object.keys(selectedEmployeeData).length > 0) {
    const { screenshot, name, employeeId, paymentType, inTime } = selectedEmployeeData;
    let inSide;
    if(localStorage.unit == '') {
      inSide = selectedEmployeeData.inSide || false;
    } else {
      inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
    }

  return (

    <Article>
    <Container>
    <Row>
      <Col sm={8}>
          <Row>
              <Col>
              <Form className='manPowerFields' style={{marginLeft:'15px'}}>
              <FormField  label='Date *'  strong={true} style={{marginTop : '15px', width:'200px'}}  >
              <DateTime id='id'
              format='D/M/YYYY'
              name='name'
              onChange={this.onDateChange.bind(this)}
              value={this.state.dateVal || dateStr}
              />
              </FormField>
              </Form>
              </Col>
              <Col>
              <Form style={{marginLeft:'10px'}}>
              <FormField  label='Shift *'  strong={true} style={{marginTop : '15px',width:'200px'}}  >
              <Select
                placeHolder='Shift'
                options={shiftOpt}
                value={shift}
                onChange={this.onFieldChange.bind(this, 'shift')}
              />
              </FormField>
              </Form>
              </Col>
              {paymentType=='Jattu-Daily payment' ?
              <Col>
              <Form style={{marginLeft:'10px'}}>
              <FormField  label='No of Persons'  strong={true} style={{marginTop : '15px',width:'200px'}}  >
              <TextInput
                  placeHolder='No of Persons'
                  value={this.state.numberOfPersons}
                  onDOMChange={this.onFieldChange.bind(this, 'numberOfPersons')}
              />
              </FormField>
              </Form>
              </Col> :
              <Col sm={4}>
              <Box align='start'
              pad='medium'
              margin='small'
              colorIndex='light-2'>
              No of Persons: 1
              </Box>
              </Col>}
            </Row>
            <Row>
              <Col sm={6}>
              <Box align='start'
              pad='medium'
              margin='medium'
              colorIndex='light-2'>
              <span>In Date :<Clock className='employeeClock' format={'DD-MM-YYYY'}/></span>
              </Box>
              </Col>
              <Col sm={6}>
              <Box align='start'
              pad='medium'
              margin='medium'
              colorIndex='light-2'>
              <span>In Time : {inSide ? inTime : <Clock className='employeeClock' format={'hh:mm:ss A'} ticking={true} />}</span>
              </Box>
              </Col>
              </Row>
            <Row>
            <Col>
            <Form style={{marginLeft:'10px'}}>
            <FormField  label='Time Slot *'  strong={true} style={{marginTop : '15px',width:'400px'}}  >
            <Select
              placeHolder='Time Slot'
              options={timeslotOpt}
              value={this.state.timeslot}
              onChange={this.onFieldChange.bind(this, 'timeslot')}
            />
            </FormField>
            </Form>
            </Col>
            </Row>

      </Col>
      {
        hideOutsideCamera &&
        <div onClick={this.oneClickCapture.bind(this)}
         style={{marginBottom:'10px', marginTop:'10px', width:'300px', height: '300px'}}>
          { this.renderInsideCamera() }
        </div>
      }
      </Row>
      <Row>
      <Col>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      Name : {selectedEmployeeData.name}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      MCode : {selectedEmployeeData.employeeId}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      DOJ : {selectedEmployeeData.joinedDate}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      Village : {selectedEmployeeData.village}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      Address : {selectedEmployeeData.address}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      Payment Mode: {selectedEmployeeData.paymentType}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      No of persons : {selectedEmployeeData.numberOfPersons}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'400px'}}>
      Remarks : {selectedEmployeeData.remarks}
      </Box>
      </Col>
      <Col>
      <div style={{marginLeft:'160px'}}>
      <Image src={screenshot} style={{marginTop:'15px', height:'350px'}}/>
      </div>
      </Col>
      </Row>
      </Container>
      </Article>

    )
  }
  }

  onCloseLayer()  {
    this.setState({msg:''})
  }

  printAttendanceData() {
    setTimeout(() => window.print(), 4000);
  }

  onOkButtonClick() {
    this.setState({
      msg:'',
      employeeSearchString:'',
    });
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

  onSaveButtonClick() {
    const shift = window.localStorage.shift || this.state.shift;
    const timeslot = window.localStorage.timeslot || this.state.timeslot;

    const { screenshot, selectedEmployeeId } = this.state;

    if(!shift) {
      this.setState({
        validationMsg: 'SHIFT is missing'
      })
      return
    }

    if(!selectedEmployeeId) {
      this.setState({
        validationMsg: 'Cannot SAVE. Please RETRY'
      })
      return;
    }

    if(!timeslot) {
      this.setState({
        validationMsg: 'TIMESLOT is missing'
      })
      return;
    }

    if(!screenshot) {
      this.setState({
        validationMsg: 'SCREENSHOT is missing'
      })
      return
    }
    this.setState({
      validationMsg:''
    }, this.onMarkButtonClick.bind(this))
  }

  renderReactToPrintComponent() {
    const { selectedEmployeeData } = this.state;

      return (
       <ReactToPrint
            trigger={() => <a id="printAnchor"
                       href='#' style={{marginLeft: '80px',display:'none' }}>Print</a>
                    }
            content={this.renderContent.bind(this)}
          />
      );

  }

  renderSaveButton() {
    const { selectedEmployeeData } = this.state;
    if(Object.keys(selectedEmployeeData).length > 0) {
      let inSide;
      if(localStorage.unit == '') {
        inSide = selectedEmployeeData.inSide || false;
      } else {
        inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
      }

      return (
        !inSide ?
          <Button
           label='Save'
           onClick={this.oneClickCapture.bind(this)}
           href='#' style={{marginLeft: '80px'}}
            primary={true} /> : null
      );
    }
  }

 renderContent() {
   return this.componentRef;
 }

 setPrintRef(ref) {
   this.componentRef = ref;
 }

 setPrintButtonRef(ref) {
   this.printButtonRef = ref;
 }

  renderPrintCard() {
    const { shift, dateVal, screenshot, selectedEmployeeData, inwardPhoto } = this.state;
    return (
      <div>
      <AttendancePrintComponent
        ref={this.setPrintRef.bind(this)}
        shift={shift}
        dateVal={dateVal}
        screenshot={screenshot}
        selectedEmployeeData={selectedEmployeeData}
      />
      </div>
    )
  }

  render() {
    const { msg, hideOutsideCamera , savingInProgress, saved } = this.state;
    if(msg) {
      return (
        <Layer
        onClose={this.onCloseLayer.bind(this)}>
        <div style={{color:'#7F7F7F'}}>
          <Heading strong={true}
            uppercase={false}
            truncate={false}
            margin='small'
            align='center'>
          <Status value='ok'
          size='medium'
          style={{marginRight:'10px'}} />
          success!
        </Heading>
        </div>
        <hr/>
          <strong><h4 style={{marginTop: '10px', marginLeft:'90px', marginBottom: '60px'}}>
          {msg}
          </h4></strong>
          <Row>
          <Button
            label='OK'
            onClick={this.onOkButtonClick.bind(this)}
            href='#' style={{marginLeft: '300px', marginBottom:'10px'}}
            primary={true} />
          </Row>
        </Layer>
      )
    }
    return (
      <Article primary={true} className='employees'>
      <div style={{marginTop : '10px', marginLeft :'30px'}}>
      { savingInProgress ?  (<Layer style={{ background : 'transparent' }}><Spinning style={{ background : 'transparent' }} size="huge" /></Layer>) : null}
      { this.renderEmployeeSearch() }
      { this.renderEmployeeSearchByBarcode() }
      { this.renderSaveButton() }
      {
        !hideOutsideCamera &&
        <div onClick={this.oneClickCapture.bind(this)}
          style={{marginBottom:'10px', marginTop:'10px', width:'300px', height: '300px'}}>
        { this.renderOutsideCamera() }
        { this.renderSelectedOptions() }

        </div>
      }
      {this.renderPrintCard()}
      { this.renderReactToPrintComponent() }
      { this.renderValidationMsg() }
      </div>
      { this.renderSearchedEmployee() }
      </Article>
      );
  }
}

export default AttendanceIn;
