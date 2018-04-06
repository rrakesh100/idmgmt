import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Meter from 'grommet/components/Meter';
import Notification from 'grommet/components/Notification';
import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Columns from 'grommet/components/Columns';
import Image from 'grommet/components/Image';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Toast from 'grommet/components/Toast';
import Button from 'grommet/components/Button';

import Map from './Map';
import EmployeeActions from './EmployeeActions';

import { getEmployee, updateEmployeeStatus, updateAssignedZone, removeAssignedWorker } from '../api/employees';
import { getTimeInterval } from '../api/utils'

import {
  loadEmployee, unloadEmployee
} from '../actions/tasks';


class Employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: this.props.match.params.id,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getEmployeeData();
  }

  getEmployeeData() {
    const { employeeId } = this.state;
    getEmployee(this.state.employeeId)
      .then((snap) => {
        const employeeData = snap.val();
        this.setState({
          employeeData,
          isLoading: false
        });
      })
      .catch((err) => {
        console.error(`Unable to fetch data for ${employeeId}`, err);
        this.setState({
          error: `Unable to fetch data for ${employeeId}`,
          isLoading: false
        });
      });
  }

  renderEmployee() {
    if (this.state.employeeData) {
      const { name, info, timestamp, screenshot, status, statusTimestamp } = this.state.employeeData;
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();
      const timeDifference = getTimeInterval(timestamp, statusTimestamp);

      return (
        <Columns
          maxCount={1}
          size='large'
          masonry={true}
          justify='center'
        >
          <Box align='center'
            pad='medium'
            margin='small'
            colorIndex='light-2'>
            <Image src={screenshot}
              full='horizontal'
              fit='contain'
              size='large' />
          </Box>
          <Box align='center'
            pad='medium'
            margin='small'
            colorIndex='light-2'>
            <div className='details'>
              <p className='name'>{name}</p>
              <p>{info}</p>
              <p>entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong></p>
              <p>current status: <strong>{status}</strong></p>
              {
                status === 'RELEASE FOR DAY' ?
                <p>total working time: <span className='emphasis'>{ timeDifference }</span>(hr:mns)</p> :
                null
              }

            </div>
          </Box>
        </Columns>
      );
    }
    return (
      <p>No data to show!</p>
    );
  }

  handleEmployeeUpdate(updateData) {
    const { employeeData, employeeId, selectedZone } = this.state;
    const timestamp = new Date();
    updateEmployeeStatus({ ...updateData, timestamp,
      entryTimestamp: employeeData.timestamp,
      selectedZone: employeeData.selectedZone,
      employeeId })
      .then(() => {
        this.setState({
          toastMsg: `Successfully updated the status of ${this.state.employeeId}`
        }, this.getEmployeeData.bind(this));
      })
      .catch((err) => {
        console.error(`Unable to update ${employeeData.name}\'s status`, err);
        this.setState({
          error: '`Unable to update ${employeeData.name}\'s status`'
        });
      });
  }

  updateAssignedZone() {
    const { selectedZone, employeeId, employeeData } = this.state;
    const timestamp = new Date();
    const zoneData = {
      employeeId,
      entryTimestamp: employeeData.timestamp,
      timestamp,
      status: 'ASSIGNED',
      selectedZone,
      name: employeeData.name,
      description: `assigned to ${selectedZone.name}`
    };
    updateAssignedZone(zoneData)
      .then(() => {
        this.setState({
          toastMsg: `Success! Assigned ${employeeData.name} to "${selectedZone.name}"`
        }, this.getEmployeeData.bind(this));
      })
      .catch((err) => {
        console.error(`Unable to assign ${employeeData.name} to "${selectedZone.name}"!`, err);
        this.setState({
          error: `Unable to assign ${employeeData.name} to ${selectedZone.name}!`
        });
      });
  }

  onAssignZone(selectedZone) {
    this.setState({
      selectedZone
    }, this.updateAssignedZone.bind(this));
  }

  renderActions() {
    if (!this.state.employeeData) {
      return null;
    }
    const { status, selectedZone } = this.state.employeeData;
    if (status !== 'RELEASE FOR DAY') {
      return (
        <Tabs>
          <Tab title='Assign Work Zone'>
            <Map onSubmit={this.onAssignZone.bind(this)} selectedZone={selectedZone} />
          </Tab>
          <Tab title='Release/Let Go'>
            <EmployeeActions onSubmit={ this.handleEmployeeUpdate.bind(this) }/>
          </Tab>
        </Tabs>
      );
    }
    return null;
  }

  renderHistory() {
    if (!this.state.employeeData) {
      return null;
    }
    const { history } = this.state.employeeData;
    const rows = [];
    Object.keys(history).forEach((id) => {
      const { timestamp, status, enteredBy, description} = history[id];
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();

      rows.push(
        <TableRow key={timestamp}>
          <td>
            {timestampStr} <br/> <span className='relativeTime'> {timeRelativeStr} </span>
          </td>
          <td>
            <Button label={status} href='#' />
          </td>
          <td className='secondary'>
            {description}
          </td>
          <td className='secondary'>
            {enteredBy}
          </td>
        </TableRow>
      );
    });
    return (
      <div className='historyTable'>
        <Tabs>
          <Tab title='History of Employee'>
            <Table selectable={true} responsive={true} scrollable={true} >
              <thead>
                <tr>
                  <th>
                    Time
                  </th>
                  <th>
                    Action
                  </th>
                  <th>
                    Notes
                  </th>
                  <th>
                    Entry by
                  </th>
                </tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </Table>
          </Tab>
        </Tabs>

      </div>
    );
  }

  toastClose() {
    this.setState({ toastMsg: '' });
  }


  render() {

    if (this.state.isLoading) {
      return (
        <Spinning className='spinner' size='xlarge' />
      );
    }

    const { error } = this.props;
    const { toastMsg } = this.state;

    let errorNode;
    let toastNode;

    if (error) {
      errorNode = (
        <Notification
          status='critical'
          size='large'
          state={error.message}
          message='An unexpected error happened, please try again later'
        />
      );
    }

    if (toastMsg) {
      toastNode = (
        <Toast status='ok'
          onClose={ this.toastClose.bind(this) }>
          { toastMsg }
        </Toast>
      )
    }

    const { employeeData, employeeId } = this.state;
    let employeeTitle = `Employee ${employeeId}`;
    if (employeeData) {
      employeeTitle = `"${employeeData.name}" (${employeeId})`
    }
    return (
      <Article primary={true} full={true} className='employeeDetails'>
        <Header
          direction='row'
          size='large'
          colorIndex='light-2'
          align='center'
          responsive={false}
          pad={{ horizontal: 'small' }}
        >
          <Anchor path='/employees'>
            <LinkPrevious a11yTitle='Back to Employees' />
          </Anchor>
          <Heading margin='none' strong={true}>
            {employeeTitle}
          </Heading>
        </Header>
        {errorNode}
        {toastNode}
        { this.renderEmployee() }
        { this.renderActions() }
        { this.renderHistory() }
      </Article>
    );
  }
}

Employee.defaultProps = {
  error: undefined,
  task: undefined
};

Employee.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  match: PropTypes.object.isRequired,
  task: PropTypes.object
};

const select = state => ({ ...state.tasks });

export default connect(select)(Employee);
