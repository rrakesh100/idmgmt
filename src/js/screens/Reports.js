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
import Article from 'grommet/components/Article';
import axios from 'axios';
import Moment from 'moment';
import $ from 'jquery';
import Header from 'grommet/components/Header';


class Reports extends Component {
  constructor(props) {
    super(props);
    this.state={
      startDate:'',
      endDate:''
    }
  }

  componentDidMount() {

  }

  onStartDateChange(e) {
    let startDate = e.replace(/\//g, '-');
    this.setState({startDate})

  }

  onEndDateChange(e) {
    let endDate = e.replace(/\//g, '-');

    this.setState({endDate})
  }


  renderDateFields() {
    return (
      <div style={{marginLeft:'20px'}}>
      <div style={{marginTop:'20px'}}>
      <Form>
        <FormField>
          <DateTime id='id'
          format='D/M/YYYY'
          name='name'
          onChange={this.onStartDateChange.bind(this)}
          value={this.state.startDate}
          />
        </FormField>
      </Form>
      </div>
      <div style={{marginTop:'20px'}}>
      <Form>
        <FormField>
          <DateTime id='id'
          format='D/M/YYYY'
          name='name'
          onChange={this.onEndDateChange.bind(this)}
          value={this.state.endDate}
          />
        </FormField>
      </Form>
      </div>
      </div>
    )
  }

  render() {

      return (
        <Article>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
        <Heading margin='none' strong={true}>
        Visitor Reports
        </Heading>
        </Header>
        { this.renderDateFields() }
        </Article>

      )
    }
}

export default Reports;
