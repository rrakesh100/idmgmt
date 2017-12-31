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

import ItemActions from './ItemActions';
import { getItem, updateItemStatus } from '../api/items';
import { getTimeInterval } from '../api/utils';


// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/


class Item extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemId: this.props.match.params.id,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getItemData();
  }

  getItemData() {
    const { itemId } = this.state;
    getItem(this.state.itemId)
      .then((snap) => {
        const itemData = snap.val();
        this.setState({
          itemData,
          isLoading: false
        });
      })
      .catch((err) => {
        console.error(`Unable to fetch data for item ${itemId}`, err);
        this.setState({
          error: `Unable to fetch data for item ${itemId}`,
          isLoading: false
        });
      });
  }

  toastClose() {
    this.setState({ toastMsg: '' });
  }


  renderItem() {
    if (this.state.itemData) {
      const { name, source, destination, timestamp, screenshot, status, statusTimestamp } = this.state.itemData;
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
              <p>from {source} to {destination}</p>
              <p>entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong></p>
              <p>current status: <strong>{status}</strong></p>
              {
                status === 'RECEIVED' ?
                <p>total time taken: <span className='emphasis'>{ timeDifference }</span>(hr:mns)</p> :
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


  handleItemUpdate(updateData) {
    const { itemData, itemId } = this.state;
    const timestamp = new Date();
    const name = itemData.name;
    updateItemStatus({ ...updateData, timestamp,
      entryTimestamp: itemData.timestamp,
      itemId })
      .then(() => {
        this.setState({
          toastMsg: `Successfully updated the status of item ${name}`
        }, this.getItemData.bind(this));
      })
      .catch((err) => {
        console.error(`Unable to update ${name} status`, err);
        this.setState({
          error: `Unable to update ${name} status`
        });
      });
  }


  renderActions() {
    if (!this.state.itemData) {
      return null;
    }
    const { status } = this.state.itemData;
    if (status !== 'RECEIVED') {
      return (
        <Tabs>
          <Tab title='Receive/Reject Item'>
            <ItemActions onSubmit={ this.handleItemUpdate.bind(this) }/>
          </Tab>
        </Tabs>
      );
    }
    return null;
  }

  renderHistory() {
    if (!this.state.itemData) {
      return null;
    }
    const { history } = this.state.itemData;
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
          <Tab title='History of Item'>
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

    const {itemData, itemId} = this.state;
    let itemTitle = `Item ${itemId}`;
    if (itemData) {
      itemTitle = `"${itemData.name}" (${itemId})`
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
          <Anchor path='/items'>
            <LinkPrevious a11yTitle='Back' />
          </Anchor>
          <Heading margin='none' strong={true}>
            {itemTitle}
          </Heading>
        </Header>
        {errorNode}
        {toastNode}
        { this.renderItem() }
        { this.renderActions() }
        { this.renderHistory() }
      </Article>
    );
  }
}

const item = state => ({ ...state.item });
export default connect(item)(Item);
