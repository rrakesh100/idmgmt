import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { saveAttendanceOutData } from '../api/attendance';
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


class AttendanceOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed : true,
      msg : '',
      employeeSearchString : '',
      selectedEmployeeData : null
    };
    this.onCompareClick.bind(this);
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
        if(opt.label.startsWith(e.target.value))
          filtered.push(opt)
        if(opt.employeeId.startsWith(e.target.value))
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

  onCompareButtonClick() {
    const { selectedEmployeeId, selectedEmployeeData } = this.state;
    let selectedEmployeeName = selectedEmployeeData.name;
    saveAttendanceOutData(selectedEmployeeId, selectedEmployeeName).then(() => {
      this.setState({msg:'Attendance marked as left'})
    }).catch((err) => {
      console.error('ATTENDANCE SAVE ERR', err);
    })
  }

renderSearchedEmployee() {
  const { selectedEmployeeData } = this.state;
  if(selectedEmployeeData) {
    const { screenshot, name, employeeId } = selectedEmployeeData;

    let employeeName = `"${name}" (${employeeId})`

  return (

    <Article>
    <Header
      direction='row'
      colorIndex='light-2'
      align='center'
      responsive={false}
      pad={{ horizontal: 'small' }}
    >
      <Heading margin='none' strong={true}>
        {employeeName}
      </Heading>
    </Header>
    <Box direction='column' align='center'>
    <Image src={screenshot} style={{marginTop:'5px'}}/>

    </Box>
    <Box direction='column' align='center'>

    <Button style={{marginTop:'2px'}}
      label='MARK AS LEFT'
      onClick={this.onCompareButtonClick.bind(this)}
      href='#'
      primary={true} />
    </Box>
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
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}
      >
        <Anchor path='/employees'>
          <LinkPrevious a11yTitle='Back' />
        </Anchor>
        <Heading margin='none' strong={true}>
          Attendance Out
        </Heading>
      </Header>

      { this.renderEmployeeSearch() }
      { this.renderSearchedEmployee() }

        </Article>
      );
  }
}

export default AttendanceOut;
