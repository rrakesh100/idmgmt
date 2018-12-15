import React, { Component } from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import AttendanceSlip from '../components/AttendanceSlip';
import DatewiseReports from '../components/DatewiseReports';



class Reports extends Component {

  render() {
      return (
        <div>
        <Tabs>
          <Tab title='Attendance Slip'>
            <AttendanceSlip />
          </Tab>
          <Tab title='Datewise'>
            <DatewiseReports />
          </Tab>
        </Tabs>
        </div>
      )
    }
}

export default Reports;
