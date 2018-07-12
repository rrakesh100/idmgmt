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


class AttendanceIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barCodeId: Rand.generateBase30(8),
      showLiveCameraFeed : true,
      msg : '',
      employeeSearchString : '',
      selectedEmployeeData : null,
      showLiveCameraFeed: true,
      Date: '',
      shift: '',
      numberOfPersons: '',
      manpowerName: '',
      timeslot: ''
    };
    this.onCompareClick.bind(this);
  }

  componentDidMount() {
    { this.getEmployeeDetails() }
    { this.getShiftOptions() }
    { this.getTimeslotOptions() }
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
      console.log(data);
      if (!data) {
        return;
      }
      let suggests = [];
      Object.keys(data).forEach((employee) => {
        if(employee != 'count')
        suggests.push({
           label : data[employee].name,
           employeeId : employee
        })
      })
      this.setState({
        employeeSuggestions: suggests,
        filteredSuggestions: suggests
      });
    })
    .catch((err) => {
      console.error('VISITOR FETCH FAILED', err);
    });
  }

  fetchSearchedEmployee() {
    const { selectedEmployeeId } = this.state;
    if(selectedEmployeeId) {
    getEmployee(selectedEmployeeId).then((snap) => {
      const selectedEmployeeData = snap.val();
      this.setState({
        selectedEmployeeData,
        shift: '',
        timeslot: ''
      })
    }).catch((e) => console.log(e))
  }
  }

  onEmployeeSelect(data, isSuggestionSelected) {
    if(isSuggestionSelected) {
      this.setState({
        selectedEmployeeId: data.suggestion.employeeId,
        employeeSearchString: data.suggestion.label
      }, this.fetchSearchedEmployee.bind(this));
    } else {
      this.setState({
        selectedEmployeeId: data.target.value,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({selectedEmployeeData: ''})
    let filtered = [];
    let  options  = this.state.employeeSuggestions;

    if(e.target.value == '')
      filtered = options
    else {
      options.forEach((opt) => {
        if(opt.label.toUpperCase().startsWith(e.target.value.toUpperCase()))
          filtered.push(opt)
        else if(opt.employeeId === e.target.value)
          filtered.push(opt)
      })
    }
    this.setState({
      employeeSearchString: e.target.value,
      filteredSuggestions: filtered
    });
  }

  renderEmployeeSearch() {

    return (
      <Search placeHolder='Search manpower By Name or Barcode' style={{width:'800px'}}
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.filteredSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)}
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
        console.log(data);
        return data;
      },
      error: function (responseData, textStatus, errorThrown) {
      console.log(responseData);
    }
  })

  }

  onMarkButtonClick() {
    const { selectedEmployeeId, selectedEmployeeData, shift, screenshot, numberOfPersons, Date } = this.state;

    let selectedEmployeeName = selectedEmployeeData.name;
    let paymentType = selectedEmployeeData.paymentType;

    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadAttendanceEmployeeImage(imgFile, selectedEmployeeId).then((snapshot) => {
         let inwardPhoto = snapshot.downloadURL;
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
        numberOfPersons: ''
      })
    }).catch((err) => {
      console.error('ATTENDANCE SAVE ERR', err);
    })
    }).catch((e) => console.log(e))
  }

  setRef(webcam) {
    this.webcam = webcam;
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

  onDateChange(e) {
    this.setState({Date:e})
  }

  onFieldChange(fieldName, e) {
    if(fieldName == 'shift' || fieldName == 'timeslot') {
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
  const { selectedEmployeeData, shiftOpt, timeslotOpt } = this.state;
  const date = new Date();
  const dateStr = moment(date).format('DD/M/YYYY');

  if(selectedEmployeeData) {
    const { screenshot, name, employeeId, paymentType } = selectedEmployeeData;


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
              value={this.state.Date || dateStr}
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
                value={this.state.shift}
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
              <span>In Time : <Clock className='employeeClock' format={'hh:mm:ss A'} ticking={true} /></span>
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

      <div onClick={this.capture.bind(this)}
        style={{marginBottom:'10px', marginTop:'10px', width:'300px', height: '300px'}}>
      { this.renderCamera() }
      </div>
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
      <Image src={screenshot} style={{marginTop:'15px', height:'400px'}}/>
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

  onOkButtonClick() {
    this.setState({
      msg:'',
      employeeSearchString:'',
      selectedEmployeeData:null
    })
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
    const {shift, screenshot} = this.state;

    if(!shift) {
      this.setState({
        validationMsg: 'SHIFT is missing'
      })
      return
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

  renderSaveButton() {
    const { selectedEmployeeData } = this.state;
    if(selectedEmployeeData) {
      let inSide = selectedEmployeeData.inSide;
      return (
        !inSide ?
          <Button
          label='Save'
          onClick={this.onSaveButtonClick.bind(this)}
          href='#' style={{marginLeft: '80px'}}
          primary={true} /> : null
      );
    }
  }

  render() {
    const { msg } = this.state;
    console.log(this.state)
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
      { this.renderEmployeeSearch() }
      { this.renderSaveButton() }
      { this.renderValidationMsg() }
      </div>
      { this.renderSearchedEmployee() }
        </Article>
      );
  }
}

export default AttendanceIn;
