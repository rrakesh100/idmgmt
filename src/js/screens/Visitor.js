import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'moment';
import FormField from 'grommet/components/FormField';
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
import RadioButton from 'grommet/components/RadioButton';
import Map from './Map';
import VisitorActions from './VisitorActions';

import { getVisitor, updateVisitorStatus, removeAssignedWorker } from '../api/visitors';
import { getTimeInterval } from '../api/utils'

import {
  loadVisitor, unloadVisitor
} from '../actions/tasks';


class Visitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      radioSelectValue : 'yes'
    };
  }

  componentDidMount() {
    const { visitorData, visitorId } = this.props;
    console.log(visitorData);
    this.setState({
      visitorData,
      visitorId
    })
  }

  getVisitorData() {
    const { visitorId } = this.state;
    getVisitor(this.state.visitorId)
      .then((snap) => {
        const visitorData = snap.val();
        this.setState({
          visitorData,
          isLoading: false
        });
      })
      .catch((err) => {
        console.error(`Unable to fetch data for ${visitorId}`, err);
        this.setState({
          error: `Unable to fetch data for ${visitorId}`,
          isLoading: false
        });
      });
  }

  renderVisitor() {
    if (this.state.visitorData) {
      const { name, info, timestamp, screenshot, status, statusTimestamp } = this.state.visitorData;
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
                <p>Total time spent inside : <span className='emphasis'>{ timeDifference }</span>(hr:mns)</p> :
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

  handleVisitorUpdate(updateData) {
    const { visitorData, visitorId, selectedZone , radioSelectValue} = this.state;
    const timestamp = new Date();
    updateData.description = updateData.description || 'Not Available';
    updateData.metRequiredPerson = radioSelectValue;
    updateVisitorStatus({ ...updateData, timestamp,
      entryTimestamp: visitorData.timestamp,
      enteredBy: window.localStorage.email,
      visitorId })
      .then(() => {
        this.setState({
          toastMsg: `Successfully updated the status of ${this.state.visitorId}`
        }, this.getVisitorData.bind(this));
      })
      .catch((err) => {
        console.error(`Unable to update ${visitorData.name}\'s status`, err);
        this.setState({
          error: '`Unable to update ${visitorData.name}\'s status`'
        });
      });
  }


onRadioChange(button, e) {
  console.log(e);
  if(button === 'yes'){
    this.setState({
      radioSelectValue : 'yes'
    })
  }else {
    this.setState({
      radioSelectValue : 'no'
    })
  }

}

  renderActions() {
    if (!this.state.visitorData) {
      return null;
    }
    const { status, selectedZone } = this.state.visitorData;
    if (status !== 'RELEASE FOR DAY') {
      return (
        <div>
        <Heading style={ {marginLeft :'40px', marginTop : '40px'} }>Has the Visitor met the required person ? </Heading>
        <div  align='center' style={{marginLeft : '50px', marginTop : '20px'}}>
          <RadioButton id='yes'
            name='Yes'
            label='Yes'
            checked={this.state.radioSelectValue === 'yes' ? true : false}
            onChange={this.onRadioChange.bind(this, 'yes')} />
          <RadioButton id='no'
            name='No'
            label='No'
            checked={this.state.radioSelectValue === 'no' ? true : false}
            onChange={this.onRadioChange.bind(this, 'no')} />
        </div>
        <Tabs>
          <Tab title='EXIT'>
            <VisitorActions onSubmit={ this.handleVisitorUpdate.bind(this) }/>
          </Tab>
        </Tabs>
        </div>
      );
    }
    return null;
  }

  renderHistory() {
    if (!this.state.visitorData) {
      return null;
    }
    const { history } = this.state.visitorData;
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
          <Tab title='History of Visitor'>
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

    console.log(this.props)
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

    const {  visitorId } = this.state;
    const { visitorData } = this.state;
    let visitorTitle = `Visitor ${visitorId}`;
    if (visitorData) {
      visitorTitle = `"${visitorData.name}" (${visitorId})`
    }
    return (
      <Article primary={true} full={true} className='visitorDetails'>
        <Header
          direction='row'
          size='large'
          colorIndex='light-2'
          align='center'
          responsive={false}
          pad={{ horizontal: 'small' }}
        >
          <Heading margin='none' strong={true}>
            {visitorTitle}
          </Heading>
        </Header>
        {errorNode}
        {toastNode}
        { this.renderVisitor() }
        { this.renderActions() }
        { this.renderHistory() }
      </Article>
    );
  }
}

Visitor.defaultProps = {
  error: undefined,
  task: undefined
};

Visitor.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  task: PropTypes.object
};

const select = state => ({ ...state.tasks });

export default connect(select)(Visitor);
