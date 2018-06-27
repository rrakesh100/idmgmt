import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
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
import CheckMark from 'grommet/components/icons/base/Checkmark';
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
    if (this.props.visitorData) {
      const { visitorData } = this.props;
      const { name, info, timestamp, screenshot, status, statusTimestamp } = this.props.visitorData;
      console.log(timestamp)
      const m = moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();
      const timeDifference = getTimeInterval(timestamp, statusTimestamp);

      return (
        <div style={{height: '400px' }}>
        <Section >
          <Split>
            <Box direction='column' style={{marginLeft:'20px'}} >
                <h3>
                  Name<span style={{color :'red',marginLeft : '114px'}}>: {visitorData.name} </span>
                </h3>
                <h3 size='small'>
                  Whom To Meet<span style={{color :'red',marginLeft : '12px'}}>: {visitorData.whomToMeet} </span>
                </h3>
                <h3 size='small'>
                  Purpose of Visit<span style={{color :'red',marginLeft : '9px'}}>: {visitorData.purpose} </span>
                </h3>
                <h3 size='small'>
                  Mobile<span style={{color :'red',marginLeft : '111px'}}>: {visitorData.mobile} </span>
                </h3>
                <h3 size='small'>
                  Coming From<span style={{color :'red',marginLeft : '32px'}}>: {visitorData.comingFrom} </span>
                </h3>
           </Box>
           <Box>
           <Image src={screenshot}
             size='medium' />
             <div className=''>
               <p>In Date & Time: <strong>{timestampStr}[{timeRelativeStr}]</strong></p>
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
    if (!this.props.visitorData && !this.state.visitorData) {
      return null;
    }
    const { status, inTime } = this.state.visitorData;

    if(this.props.visitorData.visitorId !== this.state.visitorData.visitorId){
      const { status, inTime } = this.props.visitorData;

    }
    if (status !== 'DEPARTED') {
      return (
        <Box style={{marginTop:'50px'}} direction='row'>
        <h3 style={ {marginLeft :'20px', marginRight:'40px'} }>Has the Visitor met the required person ? </h3>

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

        </Box>
      );
    }else{
      let ot = this.state.visitorData.outTime;
      console.log(ot)
      let splitOT = ot.split("T");
      let time = splitOT[1].split(".")[0];
      let hour = Number(time.split(":")[0]) + 5;
      let minute = Number(time.split(":")[1]) + 30;
      let pmTime = false;
      let timestampStr = moment(ot).format('DD/MM/YYYY hh:mm:ss A');
      let startTime=moment(inTime, "YYYY-MM-DD HH:mm:ss");
      let endTime=moment(ot, "YYYY-MM-DD HH:mm:ss");
      let duration = moment.duration(endTime.diff(startTime));
      let hours = parseInt(duration.asHours());
      let minutes = parseInt(duration.asMinutes())%60;
      if(minute >= 60) {
        hour = hour + 1;
        minute = minute -60;
      }
      let second = time.split(":")[2];
      if(hour > 12) {
        hour = hour - 12;
        pmTime = true;
      }
      let formattedTime= hour.toString() + ':' + minute.toString() + ':' + second.toString()
      if(pmTime){
        formattedTime = formattedTime + ' PM'
      }else{
        formattedTime = formattedTime + ' AM'
      }


      return (<div style={{marginLeft :'40px'}}>
      <div style={{marginLeft:'380px', marginTop:'50px'}}>
      <p>Out Date & Time: <strong>{timestampStr}[Duration:{hours+' hr'} {minutes + ' min'}]</strong></p>
      </div>
      <Headline size='small'>
        Departed at : <span style={{color :'red'}}> {splitOT[0]}</span> Time : <span
        style={{color :'red'}}>{formattedTime}</span>
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


    const { visitorData, visitorId } = this.props || this.state;
    let status = ''; let hideButton = false;
    let visitorTitle = `Visitor ${visitorId}`;
    if (visitorData) {
      visitorTitle = `"${visitorData.name}" (${visitorId})`;
      if(visitorData.status === 'DEPARTED')
       hideButton = true;
    }
    return (
      <div style={{height:'700px'}}>
      <Article primary={true} full={true} className='visitorDetails' style={{height:'680px'}}>

        {errorNode}
        {toastNode}
        { this.renderVisitor() }
        { this.renderActions() }
      </Article>
      <div style={{marginLeft : '50px'}}>
      { !hideButton &&

      <Section pad='small'
        align='center'>
      <Button primary="true" type="button"
        label='DEPARTED' icon={<CheckMark/>}
        onClick={this.onDepartedClick.bind(this)}
        href='#' />

        </Section>
      }
        </div>

      </div>
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
