import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import Webcam from 'react-webcam';
import Search from 'grommet/components/Search';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed : true
    };
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
      </div>
    );
  }
}

export default Attendance;
