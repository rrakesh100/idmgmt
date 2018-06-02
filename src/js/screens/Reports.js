import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { saveAttendanceData } from '../api/attendance';
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


class Reports extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }


  render() {

      return (
        <Heading>UNDER CONSTRUCTION</Heading>
      )
}
}

export default Reports;
