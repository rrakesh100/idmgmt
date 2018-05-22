import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { saveAttendanceData } from '../api/attendance';
import Webcam from 'react-webcam';
import Search from 'grommet/components/Search';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import Button from 'grommet/components/Button';
import axios from 'axios';
import $ from 'jquery';


class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed : true
    };
    this.onCompareClick.bind(this);
  }

  componentDidMount() {
    getEmployees().then((snap) => {
      const data = snap.val();
      console.log(data);
      this.setState({
        employeeSuggestions: [...Object.keys(data)]
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
        selectedEmployeeId: data.suggestion,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this));
    } else {
      this.setState({
        selectedEmployeeId: data.target.value,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({
      employeeSearchString: e.target.value
    });
  }

  renderEmployeeSearch() {
    return (
      <Search placeHolder='Search employee'
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.employeeSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)}
         />
    )
  }

  capture() {
    if(this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false
      });
    } else {
      this.setState({
        showLiveCameraFeed: true
      });
    }
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }

  renderImage() {
    if(this.state.showLiveCameraFeed) {
      return (
        <Webcam
          audio={false}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={400}
          onClick={this.capture.bind(this)}
        />
      );
    }
    return (
      <Image src={this.state.screenshot} width={800} />
    );
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
    const { selectedEmployeeId } = this.state;
    saveAttendanceData(selectedEmployeeId).then(() => {
      alert('saved attendance data');
    }).catch((err) => {
      console.error('ATTENDANCE SAVE ERR', err);
    })
  }

renderSearchedEmployee() {
  const { selectedEmployeeData } = this.state;

  if(selectedEmployeeData) {
    const { screenshot } = selectedEmployeeData;
  return (
    <div>
    <Image src={screenshot} />
    <Box onClick={this.capture.bind(this)}>
      {this.renderCamera() }
    </Box>
    </div>
  )
}
}
  render() {
    return (
      <div>
      { this.renderEmployeeSearch() }
      { this.renderSearchedEmployee() }

        <Button
          label='COMPARE'
          onClick={this.onCompareButtonClick.bind(this)}
          href='#'
          primary={true} />
              </div>
            );
  }
}

export default Attendance;
