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
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import { getMessage } from 'grommet/utils/Intl';
import { getVisitors, getVisitor, getAllVisitors } from '../api/visitors';
import NavControl from '../components/NavControl';
import Split from 'grommet/components/Split';
import { pageLoaded } from './utils';
import NewVisitor from './NewVisitor';
import VisitorOut from './VisitorOut';
import Reports from './Reports';



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
    getVisitors().then((snap) => {
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

      const { name = '', whomToMeet = '', purpose='', comingFrom='',mobile='', info=''
      , timestampStr,screenshot, visitorId, department, inTime } = this.state.printVisitorObj;
      console.log(this.state.printVisitorObj);
      const timestamp = new Date();
      const timestampString = Moment(timestamp).format('DD/MM/YYYY hh:mm:ss A');

    return(
      <Print name='bizCard' exclusive>
       <div className='card' style={{width:'100%', height:'30%'}}>
         <div className='card-body' style={{}}>
           <div className='box header'>
             <h5>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</h5>
             <h5>Unit-II, Valuthimmapuram Road, Peddapuram</h5>
           </div>
           <div className='box sidebar'>
             <Image src={screenshot} />
           </div>
           <div className='content'>
           <Table>
             <tbody>
               <TableRow>
                 <td>
                   Name: <b>{name.toUpperCase()}</b>
                 </td>
                 <td>
                   From: <b>{comingFrom.toUpperCase()}</b>
                 </td>
                 </TableRow>
                 <TableRow>
                   <td>
                     To Meet: <b>{whomToMeet.toUpperCase()}</b>
                   </td>
                   <td>
                     Mobile: <b>{mobile.toUpperCase()}</b>
                   </td>
                   </TableRow>
                 <TableRow>
                   <td>
                   Purpose: <b>{purpose.toUpperCase()}</b>
                   </td>
                   <td>
                   Department: <b>{department}</b>
                   </td>
                   </TableRow>
                   <TableRow>
                     <td>
                     In Time: <b>{timestampString}</b>
                     </td>
                     <td>
                       Other Info: <b>{info}</b>
                     </td>
                 </TableRow>
               </tbody>
             </Table>
               <Table>
                 <tbody>
                   <TableRow>
                     <td>
                       Operator Signature
                     </td>
                     <td>
                       Visitor Signature
                     </td>
                     <td>
                       Officer Signature
                     </td>
                     </TableRow>
                   </tbody>
               </Table>
           </div>
           <div className='footer' style={{width:'30%', float:'right'}}>
             <Barcode value={this.state.printVisitorObj.visitorId}
               height={20}
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
      <Heading tag="h4" strong="true" style={{marginLeft : '20px', marginTop : '20px'}}> Todays Visitors</Heading>
      <Table scrollable={true} style={{marginTop : '30px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Name</th>
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
          VISITOR REGISTER
        </Heading>
      </Header>
        {errorNode}
        <Article full={true} primary={true}>
            <Tabs justify='start' style={{marginLeft:'40px'}}>
            <Tab title='HOME'>
            { this.showVisitorsTable() }
            </Tab>
            <Tab title='VISITOR IN'>
            <NewVisitor />
            </Tab>
            <Tab title='VISITOR OUT'>
            <VisitorOut />
            </Tab>
            <Tab title='REPORTS'>
            <Reports />
            </Tab>
            </Tabs>
        </Article>
        { this.renderSearchedVisitor() }
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
