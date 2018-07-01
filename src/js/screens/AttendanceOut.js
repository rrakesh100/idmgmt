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



class AttendanceOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed : true,
      msg : '',
      employeeSearchString : '',
      selectedEmployeeData : null,
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
      <div style={{marginTop : '40px', marginLeft :'30px'}}>
      <Search placeHolder='Search employee By Name or Barcode' style={{width:'800px'}}
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.filteredSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)}
        />
    </div>
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
          width={400}
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

  onMarkButtonClick() {
    const { selectedEmployeeId, selectedEmployeeData, screenshot } = this.state;
    let selectedEmployeeName = selectedEmployeeData.name;
    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadAttendanceEmployeeImage(imgFile, selectedEmployeeId).then((snapshot) => {
         let outwardPhoto = snapshot.downloadURL;
    saveAttendanceOutData({
      selectedEmployeeId,
      outwardPhoto
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
  if(selectedEmployeeData) {
    const { screenshot, name, employeeId } = selectedEmployeeData;

    let employeeName = `"${name}" (${employeeId})`
    let inSide = selectedEmployeeData.inSide;
  return (

    <Article>

    <Container>
    <Row>
      <Col sm={2}>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      In Date : {selectedEmployeeData.inDate}
      </Box>
      </Col>
      <Col sm={2}>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      In Time : {selectedEmployeeData.inTime}
      </Box>
      </Col>
      </Row>
      <Row>
      <Col sm={2}>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      Shift : {selectedEmployeeData.shift}
      </Box>
      </Col>
      <Col sm={4}>
      <Box align='start'
      pad='small'
      margin='small'
      colorIndex='light-2' style={{width:'350px'}}>
      No of Persons Attendance : {selectedEmployeeData.numberOfPersons}
      </Box>
      </Col>
      <Col>
      <div>
      {inSide ?
      <div onClick={this.capture.bind(this)}
        style={{marginBottom:'10px', marginTop:'10px', width:'200px'}}>
      { this.renderCamera() }
      </div> :
      <div>
      <Image src={selectedEmployeeData.outwardPhoto} style={{marginTop:'15px', height:'350px'}}/>
      </div>}
      </div>
      </Col>
      </Row>
      {inSide &&
      <div style={{marginLeft: '10px', marginBottom: '30px'}}>
      <Button
        label='MARK AS LEFT'
        onClick={this.onMarkButtonClick.bind(this)}
        href='#'
        primary={true} />
      </div> }
      <Headline size="small">
              <span>Out Date :   <Clock className='employeeClock' format={'DD/MM/YYYY'}/></span>
              <span style={{marginLeft : '20px'}}>Out Time :   <Clock className='employeeClock' format={'hh:mm:ss A'} ticking={true} /></span>
      </Headline>
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
      Villge : {selectedEmployeeData.village}
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
  })
}

  render() {
    const { msg } = this.state;

    if(msg) {
      return (
        <div>
        <Layer
        onClose={this.onCloseLayer.bind(this)}>
        <div style={{color:'#7F7F7F'}}>
          <Heading strong={true}
            uppercase={false}
            truncate={false}
            margin='small'
            align='center'>
          Success!
          </Heading>
        </div>
          <Paragraph>
          {msg}
          </Paragraph>
          <div style={{marginLeft:'480px'}}>
          <Button
            label='OK'
            onClick={this.onOkButtonClick.bind(this)}
            href='#'
            primary={true} />
         </div>
        </Layer>
        </div>
      )
    }
    return (
      <Article primary={true} className='employees'>


      { this.renderEmployeeSearch() }
      { this.renderSearchedEmployee() }

        </Article>
      );
  }
}

export default AttendanceOut;
