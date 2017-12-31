import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';
import Clock from 'react-live-clock';


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
import Select from 'grommet/components/Select';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Form from 'grommet/components/Form';
import Button from 'grommet/components/Button';
import Toast from 'grommet/components/Toast';





class VisitorActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAction: 'RELEASE FOR DAY'
    };
  }

  onActionSelect(data) {
    this.setState({
      selectedAction: data.value
    });
  }

  onDescriptionChange(e) {
    this.setState({
      description: e.target.value
    });
  }

  handleSubmit() {
    const { selectedAction, description } = this.state;
    this.props.onSubmit({ status: selectedAction, description });
    this.setState({
      selectedAction: 'RELEASE FOR DAY',
      description: ''
    });
  }

  render() {
    return (
      <Form className='visitorActions'>
        <Clock className='visitorClock' format={'DD/MM/YYYY hh:mm:ss A'} ticking={true} />
        <Select placeHolder='Visitor Wants'
          options={['RELEASE FOR DAY', 'HALF DAY', 'TIME OFF', 'BACK FROM TIME OFF']}
          value={this.state.selectedAction}
          onChange={this.onActionSelect.bind(this)} />
        <FormFields>
          <FormField label='Description'>
            <textarea
              className='itemTextArea'
              onChange={this.onDescriptionChange.bind(this)}
              value={this.state.description}
            />
          </FormField>
        </FormFields>
        <Footer pad={{"vertical": "medium"}}>
          <Button label='Update'
            primary={true}
            onClick={ this.handleSubmit.bind(this) } />
        </Footer>
      </Form>
    );
  }
}

VisitorActions.defaultProps = {
  error: undefined,
  task: undefined
};

VisitorActions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

const select = state => ({ ...state.visitorId });

export default connect(select)(VisitorActions);
