import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { saveAttendanceOutData, uploadAttendanceEmployeeImage } from '../api/attendance';
import Webcam from 'react-webcam';
import Search from 'grommet/components/Search';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';
import Heading from 'grommet/components/Heading';
import Notification from 'grommet/components/Notification';
import axios from 'axios';
import $ from 'jquery';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Anchor from 'grommet/components/Anchor';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Split from 'grommet/components/Split';
import Headline from 'grommet/components/Headline';
import { Container, Row, Col } from 'react-grid-system';
import Clock from 'react-live-clock';
import { uploadEmployeeImage } from '../api/employees'
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import DateTime from 'grommet/components/DateTime';
import Label from 'grommet/components/Label';
import moment from 'moment';
import Status from 'grommet/components/icons/Status';



class AttendanceOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployeeData : {},
      showLiveCameraFeed : true,
      msg : '',
      employeeSearchString : '',
      showLiveCameraFeed: true
    };
  }

  componentDidMount() {
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
      console.log(selectedEmployeeData)
      this.setState({
        selectedEmployeeData
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
        else if(opt.employeeId === e.target.value.toUpperCase())
            filtered.push(opt)
      })
    }
    this.setState({
      employeeSearchString: e.target.value,
      filteredSuggestions: filtered
    }, () => {
      if(filtered.length == 1) {
        let data = {};
        data.suggestion = filtered[0];
        this.onEmployeeSelect(data, true);
      }
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

  setRef(webcam) {
    this.webcam = webcam;
  }


  oneClickCapture() {
    if (this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false
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

  renderSaveButton() {
    const { selectedEmployeeData } = this.state;
    console.log(selectedEmployeeData)
    if(Object.keys(selectedEmployeeData).length > 0) {
      let inSide = selectedEmployeeData.inSide;
      return (
        inSide ?
          <Button
          label='Save'
          onClick={this.oneClickCapture.bind(this)}
          href='#' style={{marginLeft: '80px'}}
          primary={true} /> : null
      );
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

  onSaveButtonClick() {
    const { screenshot } = this.state;
    console.log(screenshot)
    if(!screenshot) {
      this.setState({
        validationMsg: 'SCREENSHOT is missing'
      })
      return
    }

    this.setState({
      validationMsg: ''
    }, this.onMarkButtonClick())
  }

  onMarkButtonClick() {

    const { selectedEmployeeId, selectedEmployeeData, screenshot } = this.state;

    if(!screenshot) {
      alert("please click on the camera to take picture")
    }

    let shift = selectedEmployeeData.shift;
    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadAttendanceEmployeeImage(imgFile, selectedEmployeeId).then((snapshot) => {
         let outwardPhoto = snapshot.downloadURL;
    saveAttendanceOutData({
      selectedEmployeeId,
      outwardPhoto,
      shift
      }).then(() => {
      this.setState({
        msg:'Attendance out data saved',
        shift: '',
        numberOfPersons: ''
      })
    }).catch((err) => {
      console.error('ATTENDANCE SAVE ERR', err);
    })
    }).catch((e) => console.log(e))
  }

renderSearchedEmployee() {
  const { selectedEmployeeData } = this.state;
  if(Object.keys(selectedEmployeeData).length > 0) {
    const { screenshot, name, employeeId } = selectedEmployeeData;
    console.log(selectedEmployeeData);
    let inSide = selectedEmployeeData.inSide;
    let inTime = selectedEmployeeData.inTime;
    let outTime = selectedEmployeeData.outTime;

    let startTime=moment(inTime, "HH:mm a");
    let endTime=moment(outTime, "HH:mm a");
    let duration = moment.duration(endTime.diff(startTime));
    let hours = parseInt(duration.asHours());
    let minutes = parseInt(duration.asMinutes())%60;
  return (

    <Article>

    <Container>
    <Row>
    <Col sm={8}>
    <Row>
      <Col sm={4}>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2'>
      In Date : {selectedEmployeeData.inDate || ' --'}
      </Box>
      </Col>
      <Col sm={4}>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2'>
      In Time : {selectedEmployeeData.inTime || ' --'}
      </Box>
      </Col>
      <Col sm={4}>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2'>
      Shift : {selectedEmployeeData.shift}
      </Box>
      </Col>
      </Row>
      <Row>
        <Col sm={5}>
        <Box align='start'
        pad='small'
        margin='small'
        colorIndex='light-2'>
        <span>Out Date : <Clock className='employeeClock' format={'DD-MM-YYYY'}/></span>
        </Box>
        </Col>
        <Col sm={5}>
        <Box align='start'
        pad='small'
        margin='small'
        colorIndex='light-2'>
        <span>Out Time : {inSide ? <Clock className='employeeClock' format={'hh:mm:ss A'} ticking={true} /> : outTime }</span>
        </Box>
        </Col>
        </Row>
        <Row>
        <Col sm={5}>
        <Box align='start'
        pad='small'
        margin='small'
        colorIndex='light-2'>
        No of Persons Attendance : {selectedEmployeeData.numberOfPersons || 1}
        </Box>
        </Col>
        <Col sm={5}>
        <Box align='start'
        pad='small'
        margin='small'
        colorIndex='light-2'>
        Working Hours : {inTime&&outTime ? hours + ' hr ' + minutes + ' min ' : ' -- '}
        </Box>
        </Col>
        </Row>
      </Col>
      <Col>
      {inSide ?
      <div onClick={this.capture.bind(this)}
        style={{marginTop: '20px', marginBottom:'30px', width:'300px', height: '300px'}}>
      { this.renderCamera() }
      </div> :
      <Image src={selectedEmployeeData.outwardPhoto} style={{marginTop:'15px', height:'300px'}}/> }
      </Col>
      </Row>


      <Row>
      <Col>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      Name : {selectedEmployeeData.name}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      MCode : {selectedEmployeeData.employeeId}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      DOJ : {selectedEmployeeData.joinedDate}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      Village : {selectedEmployeeData.village}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      Address : {selectedEmployeeData.address}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      Payment Mode: {selectedEmployeeData.paymentType}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      No of persons : {selectedEmployeeData.numberOfPersons}
      </Box>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      Remarks : {selectedEmployeeData.remarks}
      </Box>
      </Col>
      <Col>
      <div>
      <Image src={screenshot} style={{marginTop:'15px', height:'350px'}}/>
      </div>
      </Col>
      <Col>
      <div>
      <Image src={selectedEmployeeData.inwardPhoto} style={{marginTop:'15px', height:'350px'}}/>
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
    selectedEmployeeData:{}
  })
}



  render() {
    const { msg } = this.state;

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

export default AttendanceOut;
