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
import VisitorActions from './VisitorActions';

import { getVisitor, updateVisitorStatus } from '../api/visitors';
import { getTimeInterval } from '../api/utils'

import {
  loadVisitor, unloadVisitor
} from '../actions/tasks';


class Visitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitorId: this.props.match.params.id,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getVisitorData();
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

  handleVisitorUpdate(updateData) {
    const { visitorData, visitorId } = this.state;
    const timestamp = new Date();
    updateVisitorStatus({ ...updateData, timestamp,
      entryTimestamp: visitorData.timestamp,
      visitorId })
      .then(() => {
        this.setState({
          toastMsg: `Successfully updated the status of ${this.state.visitorId}`
        }, this.getVisitorData.bind(this));
      })
      .catch((err) => {
        console.error('Unable to update visitor status', err);
        this.setState({
          error: 'Unable to update VISITOR status'
        });
      });
  }

  renderActions() {
    if (!this.state.visitorData) {
      return null;
    }
    const { status } = this.state.visitorData;
    if (status !== 'RELEASE FOR DAY') {
      return (
        <Tabs>
          <Tab title='Assign Work Zone'>
            <Map />
          </Tab>
          <Tab title='Release/Let Go'>
            <VisitorActions onSubmit={ this.handleVisitorUpdate.bind(this) }/>
          </Tab>
        </Tabs>
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
            <Table selectable={true}>
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

    const { visitorData, visitorId } = this.state;
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
          <Anchor path='/visitors'>
            <LinkPrevious a11yTitle='Back to Visitors' />
          </Anchor>
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
  match: PropTypes.object.isRequired,
  task: PropTypes.object
};

const select = state => ({ ...state.tasks });

export default connect(select)(Visitor);
