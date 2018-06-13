import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import { Print } from 'react-easy-print';
import Barcode from 'react-barcode';
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
import HomeIcon from 'grommet/components/icons/base/Home';
import Image from 'grommet/components/Image';
import PrintIcon from 'grommet/components/icons/base/Print';


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


  saveAndPrint(visitorId, visitorObj) {
    this.setState({
      printVisitorId : visitorId,
      printVisitorObj : visitorObj
    })
  }

  printBusinessCard() {
    if(!this.state.printVisitorObj)
      return;

    const { name = '', whomToMeet = '', timestampStr } = this.state.printVisitorObj;
    console.log(this.state.printVisitorObj);
    const printName = 'Visitor Name: ' + name.substring(0, 16);
    const printInfo = 'To meet: '+ whomToMeet.substring(0, 20);
    return (
      <Print name='bizCard' exclusive>
        <div className='card'>
          <div className='card-body'>
            <div className='box header'>
              <h3>Lalitha Industries</h3>
            </div>
            <div className='box sidebar'>
              <Image src={this.state.printVisitorObj.screenshot} />
            </div>
            <div className='box content'>
              <h5 className='bold'>{printName}</h5>
              <h5>{printInfo}</h5>
              <h5>{timestampStr}</h5>
            </div>
            <div className='box footer' style={{width:'30%', float:'right'}}>
              <Barcode value={this.state.printVisitorObj.visitorId}
                height={40}
              />
            </div>
          </div>
        </div>
      </Print>
    );
  }

  print() {
    if(this.state.printVisitorId)
     this.setState({printVisitorId : null},  setTimeout(() => window.print(), 2000) );
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
             <th>Name</th>
             <th>Company</th>
             <th>Mobile Number</th>
             <th>Status</th>
             <th></th>
           </tr>
          </thead>
          <tbody>
            {
              Object.keys(visitors).map((visitor, index) => {
                const visitorObj = visitors[visitor];
                return <TableRow key={index}>
                <td>{index+1}</td>
                <td>{visitorObj.name}</td>
                <td>{visitorObj.company}</td>
                <td>{visitorObj.mobile}</td>
                <td>{visitorObj.status}</td>
                <td>
                    <Button icon={<PrintIcon />}
                          onClick={this.saveAndPrint.bind(this, visitor, visitorObj)}
                          plain={true} />
                </td>
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
        <NavControl />
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
                <Button style={{marginLeft:'20px'}}
                  label='Reports'
                  href='/reports' />
          </Paragraph>
        </Box>
        { this.renderSearchedVisitor() }
        { this.showVisitorsTable() }
        { this.printBusinessCard() }
        { this.print() }

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
