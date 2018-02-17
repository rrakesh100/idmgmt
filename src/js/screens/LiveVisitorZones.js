import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { Popup } from 'semantic-ui-react';
import * as firebase from 'firebase';



import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Toast from 'grommet/components/Toast';
import Spinning from 'grommet/components/icons/Spinning';


import Anchor from 'grommet/components/Anchor';
import Image from 'grommet/components/Image';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Header from 'grommet/components/Header';
import Columns from 'grommet/components/Columns';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

import ItemActions from './ItemActions';
import { getItem, updateItemStatus } from '../api/items';
import { getTimeInterval } from '../api/utils';


// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/


class LiveVisitorZones extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      zonesData: {}
    };
  }

  componentDidMount() {
    const timeNow = new Date();
    const dateToday = Moment(timeNow).format('DD-MM-YYYY');
    const todayLiveZonesRef = firebase.database().ref(`liveZones/${dateToday}`);
    todayLiveZonesRef.once('value')
      .then((snap) => {
        this.setState({
          isLoading: false,
          zonesData: snap.val()
        });
      });
  }

  renderVisitorsTable(visitors) {
    if(!visitors) {
      return null;
    }

    const rows = [];
    Object.keys(visitors).forEach((visitorId) => {
      const { name, timestamp, entryTimestamp} = visitors[visitorId];
      const mTimestamp = Moment(timestamp);
      const timestampStr = mTimestamp.format('DD/MM/YYYY hh:mm:ss A');
      const timestampFromNow = mTimestamp.fromNow();
      const mEntryTimestamp = Moment(entryTimestamp);
      const entryTimestampStr = mEntryTimestamp.format('DD/MM/YYYY hh:mm:ss A');
      const entryTimestampFromNow = mEntryTimestamp.fromNow();
      rows.push(
        <TableRow key={visitorId}>
          <td>
            <Anchor
              label={visitorId}
              href={`/visitor/${visitorId}`} />
          </td>
          <td>
            <Anchor
              label={name}
              href={`/visitor/${visitorId}`} />
          </td>
          <td>
            {entryTimestampStr} <br /> <span className='relativeTime'>{entryTimestampFromNow}</span>
          </td>
          <td>
            {timestampStr} <br /><span className='relativeTime'>{timestampFromNow}</span>
          </td>
        </TableRow>
      );
    });

    return (
      <div className='popTable'>
        <Table responsive={true} scrollable={true} >
          <thead>
            <tr>
              <th>
                Visitor ID
              </th>
              <th>
                Name
              </th>
              <th>
                Entered at
              </th>
              <th>
                Assinged Zone at
              </th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </Table>
      </div>
    );

  }


  renderLiveZoneVisitorsTable() {
    if (this.state.isLoading) {
      return <Spinning />;
    }
    const { zonesData } = this.state;
    if (!zonesData) {
      return null;
    }
    const rows = [];
    Object.keys(zonesData).forEach((zoneId) => {
      const visitors = zonesData[zoneId];

      rows.push(
        <TableRow key={zoneId}>
          <td>
            {zoneId}
          </td>
          <td>
            <Popup
              trigger={<Button label={Object.keys(visitors).length} href='#' />}
              on='click'
              hideOnScroll>
              { this.renderVisitorsTable(visitors) }
            </Popup>
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
                    Zone
                  </th>
                  <th>
                    Number of Visitors Now
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

  render() {
    return (
      <Tabs>
        <Tab title='Live Zone Visitor Statistics'>
          { this.renderLiveZoneVisitorsTable() }
        </Tab>
      </Tabs>
    );
  }

}

const item = state => ({ ...state.item });
export default connect(item)(LiveVisitorZones);
