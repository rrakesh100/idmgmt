import React, { Component, PropTypes } from 'react';
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
import Edit from 'grommet/components/icons/base/Checkmark';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Toast from 'grommet/components/Toast';
import Button from 'grommet/components/Button';
import RadioButton from 'grommet/components/RadioButton';
import Map from './Map';
import VisitorActions from './VisitorActions';
import Section from 'grommet/components/Section';
import { getVisitor, updateVisitor, removeAssignedWorker } from '../api/visitors';
import { getTimeInterval } from '../api/utils'
import Split from 'grommet/components/Split';
import {
  loadVisitor, unloadVisitor
} from '../actions/tasks';
import Headline from 'grommet/components/Headline';


class VisitorOutComponent extends Component {
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
        <div>
        <Section style={{height: '500px' }}>
          <Split>
            <Box direction='column' style={{marginLeft:'40px'}} >
                <Headline size='small'>
                  Name : <span style={{color :'red'}}> {this.state.visitorData.name} </span>
                </Headline>
                <Headline size='small'>
                  Whom To Meet : <span style={{color :'red'}}> {this.state.visitorData.whomToMeet} </span>
                </Headline>
                <Headline size='small'>
                  Purpose of Visit : <span style={{color :'red'}}> {this.state.visitorData.purpose} </span>
                </Headline>
                <Headline size='small'>
                  Mobile : <span style={{color :'red'}}> {this.state.visitorData.mobile} </span>
                </Headline>
                <Headline size='small'>
                  Coming From : <span style={{color :'red'}}> {this.state.visitorData.comingFrom} </span>
                </Headline>
           </Box>
           <Box>
           <Image src={screenshot}
             size='medium' />
             <div className=''>
               <p>Entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong></p>
               <p>Current status: <strong>{status}</strong></p>
               {
                 status === 'CHANGE_THIS_LATER' ?
                 <p>Total time spent inside : <span className='emphasis'>{ timeDifference }</span>(hr:mns)</p> :
                 null
               }

             </div>
           </Box>
          </Split>
        </Section>
        </div>
      );
    }
    return (
      <p>No data to show!</p>
    );
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
    const { status } = this.state.visitorData;
    if (status !== 'DEPARTED') {
      return (
        <div>
        <Heading style={ {marginLeft :'40px', marginTop : '10px'} }>Has the Visitor met the required person ? </Heading>
        <div  align='center' style={{marginLeft : '50px'}}>
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
        <div style={{marginLeft : '50px', marginTop : '100px'}}>
        <Section pad='small'
          align='center'>
        <Button primary="true" type="button"
          label='DEPARTED' icon={<Edit />}
          disabled={true}
          onClick={this.onDepartedClick.bind(this)}
          href='#' />
          </Section>
          </div>
        </div>
      );
    }else{
      let ot = this.state.visitorData.outTime;
      let splitOT = ot.split("T");
      return (<div style={{marginLeft :'40px'}}>
      <Headline size='small'>
        Departed at : <span style={{color :'red'}}> {splitOT[0]}</span> Time : <span
        style={{color :'red'}}> {splitOT[1].split(".")[0]} UTC Time</span>
      </Headline>
      </div>)
    }
  }


  onDepartedClick() {
    console.log('clicked ! ! ! ! !')
    let updateData = {}
    const { visitorData, visitorId, radioSelectValue} = this.state;
    const timestamp = new Date();
    updateData.metRequiredPerson = radioSelectValue;
    console.log(updateData);
    updateVisitor({ ...updateData, timestamp,
      entryTimestamp: visitorData.timestamp,
      outTime : timestamp,
      status : 'DEPARTED',
      enteredBy: window.localStorage.email,
      visitorId })
      .then(() => {
        console.log('success')
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
      </Article>
    );
  }
}

VisitorOutComponent.defaultProps = {
  error: undefined,
  task: undefined
};

VisitorOutComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  task: PropTypes.object
};

const select = state => ({ ...state.tasks });

export default connect(select)(VisitorOutComponent);
