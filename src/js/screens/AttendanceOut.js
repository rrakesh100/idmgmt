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
import Spinning from 'grommet/components/icons/Spinning';


class AttendanceOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployeeId : '',
      selectedEmployeeData : null,
      showLiveCameraFeed : true,
      msg : '',
      employeeSearchString : '',
      showLiveCameraFeed: true,
      hideOutsideCamera : false,
      scheduled : false,
      savingInProgress : false
    };
  }

  componentDidMount() {
    let employeeSuggestions = JSON.parse(window.localStorage.employeeSuggestions || '{}');
    let filteredSuggestions = JSON.parse(window.localStorage.filteredSuggestions || '{}');
    if(Object.keys(employeeSuggestions).length > 0  && Object.keys(filteredSuggestions).length > 0) {
      this.setState({
        employeeSuggestions,
        filteredSuggestions
      })
    } else {
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
      });
    })
    .catch((err) => {
      console.error('VISITOR FETCH FAILED', err);
    });
  }
  }



  autoSaveEmployee() {
    const { selectedEmployeeData } = this.state;
    let inSide;
    if(localStorage.unit == '') {
      inSide = selectedEmployeeData.inSide || false;
    } else {
      inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
    }
    if(selectedEmployeeData && inSide) {
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
      },() => {
          if(autoSave){
           this.autoSaveEmployee();
          }
        }
      );
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

  onSearchEntry(e) {
    this.setState({selectedEmployeeData: ''})
    let filtered = [];
    let  options  = this.state.employeeSuggestions;
    let exactMatch = false;

    if(e.target.value == '')
      filtered = options
    else {
      options.forEach((opt) => {
        if(opt.label && opt.label.toUpperCase().startsWith(e.target.value.toUpperCase()))
          filtered.push(opt);
        else if(opt.label && opt.employeeId.toUpperCase().startsWith(e.target.value.toUpperCase())) {
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
     });
  }

  onBarCodeSearch(e) {
    this.setState({
      selectedEmployeeId:  e.target.value,
      selectedEmployeeData: null
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


  renderEmployeeSearch() {
    return (
      <Search placeHolder='Search manpower By Name or Barcode' style={{width:'400px'}}
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

  renderEmployeeSearchByBarcode() {
    const { empId } = this.state;
    return (
      <Search placeHolder='Search manpower By Barcode' style={{width:'400px', marginLeft: '20px'}}
        inline={true}
        iconAlign='end'
        ref={(input) => { this.state.barcodeInput = input; }}
        size='small'
        value={this.state.selectedEmployeeId}
        onDOMChange={this.onBarCodeSearch.bind(this)}
        />
    )
  }

  setRef(webcam) {
    this.webcam = webcam;
  }


  oneClickCapture() {
    const { pickScreenshotFromOutsideCamera, screenshot, showLiveCameraFeed } = this.state;
    console.log(pickScreenshotFromOutsideCamera);
    if(pickScreenshotFromOutsideCamera){
      this.setState({
        showLiveCameraFeed: false
      }, this.onSaveButtonClick.bind(this));
      return;
    }

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
    const { selectedEmployeeData } = this.state;
    let inSide;
    if(localStorage.unit == '') {
      inSide = selectedEmployeeData.inSide || false;
    } else {
      inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
    }
      return (
        <Webcam
          audio={false}
          height={300}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={300}
          onClick={this.oneClickCapture.bind(this)}
        />
      );
    return (
      <Image src={inSide ? this.state.selectedEmployeeData.outwardPhoto : this.state.screenshot} height={300}/>
    );
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }

  setOutsideRef(webcam) {
    this.outsideWebcam = webcam;
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


  renderSaveButton() {
    const { selectedEmployeeData } = this.state;
    if(selectedEmployeeData && Object.keys(selectedEmployeeData).length > 0) {
      let inSide;
      if(localStorage.unit == '') {
        inSide = selectedEmployeeData.inSide || false;
      } else {
        inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
      }
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

  onSaveButtonClick() {
    const { screenshot , selectedEmployeeId } = this.state;
    if(!screenshot) {
      this.setState({
        validationMsg: 'SCREENSHOT is missing'
      })
      return;
    }

    if(!selectedEmployeeId) {
      this.setState({
        validationMsg: 'Cannot SAVE. Please RETRY'
      })
      return;
    }

    this.setState({
      validationMsg: ''
    }, this.onMarkButtonClick())
  }

  onMarkButtonClick() {

    const { selectedEmployeeId, selectedEmployeeData, screenshot } = this.state;

    if(!screenshot) {
      alert("please click on the camera to take picture");
      return;
    }

    let shift = selectedEmployeeData.shift;
    if(!selectedEmployeeId || selectedEmployeeId === '') {
      alert("Could not SAVE. Please try again..");
      return;
    }
    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    /*uploadAttendanceEmployeeImage(imgFile, selectedEmployeeId).then((snapshot) => {
         let outwardPhoto = snapshot.downloadURL;*/
    saveAttendanceOutData({
      selectedEmployeeId,
      shift
      }).then(() => {
      this.setState({
        msg:'Attendance out data saved',
        shift: '',
        numberOfPersons: '',
        selectedEmployeeId : '',
        hideOutsideCamera : false,
        savingInProgress : false
      }, () => {
          setTimeout( () => { this.onOkButtonClick() }, 500);
      })
    }).catch((err) => {
      this.setState({
        savingInProgress : false
      })
      alert('Could not save the data')
    })
    /*}).catch((e) => console.log(e))*/
  }

renderSearchedEmployee() {
  const { selectedEmployeeData, hideOutsideCamera, pickScreenshotFromOutsideCamera } = this.state;
  let inSide;
  const screenShotFromOutsideCamera = this.state.screenshot;
  if(selectedEmployeeData && Object.keys(selectedEmployeeData).length > 0) {
    const { screenshot, name, employeeId } = selectedEmployeeData;
    if(localStorage.unit == '') {
      inSide = selectedEmployeeData.inSide || false;
    } else {
      inSide  = selectedEmployeeData[localStorage.unit] ? selectedEmployeeData[localStorage.unit].inSide : false;
    }
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
      {
        inSide && !pickScreenshotFromOutsideCamera ? (<div style={{marginTop: '20px', marginBottom:'30px', width:'300px', height: '300px'}}>
                 { this.renderCamera() } </div> ) :
          <Image src={!inSide ? selectedEmployeeData.outwardPhoto : screenShotFromOutsideCamera} style={{marginTop:'15px', height:'300px'}}/>
       }
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
    selectedEmployeeData:null
  });
  this.state.barcodeInput.focus()
}



  render() {
    const { msg, selectedEmployeeData, hideOutsideCamera, savingInProgress } = this.state;
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
      { savingInProgress ?  (<Layer style={{ background : 'transparent' }}>
        <Spinning style={{ background : 'transparent' }} size="huge" /></Layer>) : null}
      { this.renderEmployeeSearch() }
      { this.renderEmployeeSearchByBarcode() }
      {
        !hideOutsideCamera &&
        <div onClick={this.oneClickCapture.bind(this)}
          style={{marginBottom:'10px', marginTop:'10px', width:'300px', height: '300px'}}>
        { this.renderOutsideCamera() }
        { this.renderSelectedOptions() }
        </div>
      }
      { this.renderSaveButton() }
      { this.renderValidationMsg() }
      </div>
      { this.renderSearchedEmployee() }
        </Article>
      );
  }
}

export default AttendanceOut;
