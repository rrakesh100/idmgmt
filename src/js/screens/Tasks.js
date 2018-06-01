import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Notification from 'grommet/components/Notification';
import Meter from 'grommet/components/Meter';
import Paragraph from 'grommet/components/Paragraph';
import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import Visitor from 'grommet/components/icons/base/DocumentUser';
import Button from 'grommet/components/Button';
import Search from 'grommet/components/Search';
import AddIcon from 'grommet/components/icons/base/Add';
import Heading from 'grommet/components/Heading';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'



import { getMessage } from 'grommet/utils/Intl';
import { getVisitors, getVisitor, getAllVisitors } from '../api/visitors';

import NavControl from '../components/NavControl';

import { pageLoaded } from './utils';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getVisitors()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        this.setState({
          visitorSuggestions: [...Object.keys(data)]
        });
      })
      .catch((err) => {
        console.error('VISITOR FETCH FAILED', err);
      });
      { this.showVisitors() }
  }

  showVisitors() {
    getAllVisitors().then((snap) => {
      this.setState({
        visitors: snap.val()
      })
    }).catch((err) => {
      console.error('ALL VISITORS FETCH FAILED', err)
    })
  }

  onVisitorSelect(data, isSuggestionSelected) {
    if(isSuggestionSelected) {
      this.setState({
        selectedVisitorId: data.suggestion,
        visitorSearchString: data.suggestion
      }, this.fetchSearchedVisitor.bind(this));
    } else {
      this.setState({
        selectedVisitorId: data.target.value,
        visitorSearchString: data.suggestion
      }, this.fetchSearchedVisitor.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({
      visitorSearchString: e.target.value
    });
  }

  renderVisitorSearch() {
    return (
      <Search placeHolder='Search visitor'
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.visitorSuggestions}
        value={this.state.visitorSearchString}
        onSelect={this.onVisitorSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
    )
  }

  fetchSearchedVisitor() {
    const { selectedVisitorId } = this.state;
    if (selectedVisitorId) {
      getVisitor(selectedVisitorId)
        .then((snap) => {
          const selectedVisitorData = snap.val();
          this.setState({
            selectedVisitorData
          });
        })
        .catch((err) => {
          console.error('UNABLE TO FETCH SEARCHED USER', err);
        });
    }
  }

  renderSearchedVisitor() {
    const { selectedVisitorData, selectedVisitorId } = this.state;

    if (selectedVisitorData) {
      const { timestamp } = selectedVisitorData;
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();

      return (
        <List>
          <ListItem justify='between'
            separator='horizontal'>
            <span>
              <Button icon={<Visitor />}
                label={selectedVisitorId}
                href={`/visitor/${selectedVisitorId}`}
                primary={true} />
            </span>
            <span>
              {selectedVisitorData.name}
            </span>
            <span>
              entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong>
            </span>
          </ListItem>
        </List>
      );
    }
    return (
      selectedVisitorId ? 
      <List>
        <ListItem justify='between'
          separator='horizontal'>
          <span>
            'No such visitor in the records!'
          </span>
        </ListItem>
      </List> : null
    );
  }

  showVisitorsTable() {
    const { visitors } = this.state;
    if(!visitors)
    return null;

    return (
      <div className='table'>
      <Table scrollable={true} style={{marginTop : '30px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Company</th>
             <th>Mobile Number</th>
             <th>Status</th>

           </tr>
          </thead>
          <tbody>
            {
              Object.keys(visitors).map((visitor, index) => {
                const visitorObj = visitors[visitor];
                return <TableRow key={index}>
                <td>{index+1}</td>
                <td>{visitorObj.company}</td>
                <td>{visitorObj.mobile}</td>
                <td>{visitorObj.status}</td>
                </TableRow>
              })
            }
          </tbody>
      </Table>
      </div>
    )
  }


  render() {
    console.log(this.state);
    const { error, tasks } = this.props;
    const { intl } = this.context;

    let errorNode;
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

    return (
      <Article primary={true} className='visitors'>
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}>
        <Anchor path='/visitors'>
          <LinkPrevious a11yTitle='Back' />
        </Anchor>
        <Heading margin='none' strong={true}>
          Visitors Tracking system
        </Heading>
      </Header>
        {errorNode}
        <Box pad={{ horizontal: 'medium' }}>
          <Paragraph size='large'>
            <Button
              label='Visitor In'
              href='/in/visitor' />
              <Button style={{marginLeft:'20px'}}
                label='Visitor Out'
                href='/out/visitor' />
          </Paragraph>
        </Box>
        { this.renderSearchedVisitor() }
        { this.showVisitorsTable() }
      </Article>
    );
  }
}

Tasks.defaultProps = {
  error: undefined,
  tasks: []
};

Tasks.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  tasks: PropTypes.arrayOf(PropTypes.object)
};

Tasks.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.tasks });

export default connect(select)(Tasks);
