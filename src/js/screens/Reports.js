import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { saveAttendanceData } from '../api/attendance';
import Webcam from 'react-webcam';
import Search from 'grommet/components/Search';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';
import Heading from 'grommet/components/Heading';
import axios from 'axios';
import Moment from 'moment';
import $ from 'jquery';


class Reports extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

onDateChange(e) {

  console.log(e);
  let dateFormat = e.replace('/', '-');
  console.log(dateFormat)
}

  render() {

      return (
        <Form>
          <FormField>
            <DateTime id='id'
            format='D/M/YYYY'
            name='name'
            onChange={this.onDateChange.bind(this)}
            />
          </FormField>
        </Form>
      )
    }
}

export default Reports;
