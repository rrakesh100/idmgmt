  import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Moment from 'moment';
import { Popup } from 'semantic-ui-react';



import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Toast from 'grommet/components/Toast';
import Spinning from 'grommet/components/icons/Spinning';


import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import Headline from 'grommet/components/Headline';
import Image from 'grommet/components/Image';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Header from 'grommet/components/Header';
import Columns from 'grommet/components/Columns';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

import VehicleActions from './VehicleActions';
import { getVehicle, updateVehicleStatus } from '../api/vehicles';
import { getTimeInterval } from '../api/utils';


// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/


class Vehicle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicleId: this.props.match.params.id,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getVehicleData();
  }

  getVehicleData() {
    const { vehicleId } = this.state;
    getVehicle(this.state.vehicleId)
      .then((snap) => {
        const vehicleData = snap.val();
        this.setState({
          vehicleData,
          isLoading: false
        });
      })
      .catch((err) => {
        console.error(`Unable to fetch data for vehicle ${vehicleId}`, err);
        this.setState({
          error: `Unable to fetch data for vehicle ${vehicleId}`,
          isLoading: false
        });
      });
  }

  toastClose() {
    this.setState({ toastMsg: '' });
  }


  renderVehicle() {
    if (this.state.vehicleData) {
      const { vehicleNumber, driverName, mobile, timestamp, screenshot, status, statusTimestamp } = this.state.vehicleData;
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
              <p className='name'>{vehicleNumber}</p>
              <p>{`driver: ${driverName} (${mobile})`}</p>
              <p>entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong></p>
              <p>current status: <strong>{status}</strong></p>
              {
                status === 'LET GO' ?
                <p>total time in campus: <span className='emphasis'>{ timeDifference }</span>(hr:mns)</p> :
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


  handleVehicleUpdate(updateData) {
    const { vehicleData, vehicleId } = this.state;
    const timestamp = new Date();
    const vehicleNumber = vehicleData.vehicleNumber;
    updateVehicleStatus({ ...updateData, timestamp,
      entryTimestamp: vehicleData.timestamp,
      enteredBy: window.localStorage.email,
      vehicleId })
      .then(() => {
        this.setState({
          toastMsg: `Successfully updated the status of vehicle ${vehicleNumber}`
        }, this.getVehicleData.bind(this));
      })
      .catch((err) => {
        console.error(`Unable to update ${name} status`, err);
        this.setState({
          error: `Unable to update ${name} status`
        });
      });
  }


  renderActions() {
    if (!this.state.vehicleData) {
      return null;
    }
    const { status } = this.state.vehicleData;
    if (status !== 'RECEIVED') {
      return (
        <Tabs>
          <Tab title='Let Go Vehicle'>
            <VehicleActions onSubmit={ this.handleVehicleUpdate.bind(this) }/>
          </Tab>
        </Tabs>
      );
    }
    return null;
  }

  renderHistory() {
    if (!this.state.vehicleData) {
      return null;
    }
    const { history } = this.state.vehicleData;
    const rows = [];
    Object.keys(history).forEach((id) => {
      const { timestamp, status, enteredBy, description, screenshotNow} = history[id];
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();

      rows.push(
        <TableRow key={timestamp}>
          <td>
            {timestampStr} <br/> <span className='relativeTime'> {timeRelativeStr} </span>
          </td>
          <td>
            <Popup
              trigger={<Button label={status} href='#' />}
              on='click'
              hideOnScroll>
              <img src={screenshotNow} alt='probably photo was not taken' />
            </Popup>
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
          <Tab title='History of Vehicle'>
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
                    entry by
                  </th>
                </tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </Table>
            <p className='supportText'><span>*</span>click on the action to see picture taken at the time of update</p>
          </Tab>
        </Tabs>
      </div>
    );
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

    const {vehicleData, vehicleId} = this.state;
    let vehicleTitle = `Vehicle ${vehicleId}`;
    if (vehicleData) {
      vehicleTitle = `"${vehicleData.vehicleNumber}" (${vehicleId})`
    }
    return(
      <Article primary={true} full={true} className='visitorDetails'>
        <Header
          direction='row'
          size='large'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}
        >
          <Anchor path='/vehicles'>
            <LinkPrevious a11yTitle='Back' />
          </Anchor>
          <Heading margin='none' strong={true}>
            {vehicleTitle}
          </Heading>
        </Header>
        {errorNode}
        {toastNode}
        { this.renderVehicle() }
        { this.renderActions() }
        { this.renderHistory() }
      </Article>
    );
  }
}

const vehicle = state => ({ ...state.vehicle });
export default connect(vehicle)(Vehicle);
