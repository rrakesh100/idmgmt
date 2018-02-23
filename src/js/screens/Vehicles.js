import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Moment from 'moment';


import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Paragraph from 'grommet/components/Paragraph';
import AddIcon from 'grommet/components/icons/base/Add';



import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import Headline from 'grommet/components/Headline';
import Image from 'grommet/components/Image';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Search from 'grommet/components/Search';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Vehicle from 'grommet/components/icons/base/DocumentConfig';
import Header from 'grommet/components/Header';

import { getVehicles, getVehicle } from '../api/vehicles';


class Vehicles extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getVehicles()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        this.setState({
          vehicleSuggestions: [...Object.keys(data)]
        });
      })
      .catch((err) => {
        console.error('VEHICLE FETCH FAILED', err);
      });
  }


  onVehicleSelect(data, isSuggestionSelected) {
    if (isSuggestionSelected) {
      this.setState({
        selectedVehicleId: data.suggestion,
        vehicleSearchString: data.suggestion
      }, this.fetchSearchedVehicle.bind(this));
    } else {
      this.setState({
        selectedVehicleId: data.target.value,
        vehicleSearchString: data.suggestion
      }, this.fetchSearchedVehicle.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({
      vehicleSearchString: e.target.value
    });
  }

  fetchSearchedVehicle() {
    const { selectedVehicleId } = this.state;
    if (selectedVehicleId) {
      getVehicle(selectedVehicleId)
        .then((snap) => {
          const selectedVehicleData = snap.val();
          this.setState({
            selectedVehicleData
          });
        })
        .catch((err) => {
          console.error('UNABLE TO FETCH SEARCHED VEHICLE', err);
        });
    }
  }

  renderVehicleSearch() {
    return (
      <Search placeHolder='Search Vehicle'
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.vehicleSuggestions}
        value={this.state.vehicleSearchString}
        onSelect={this.onVehicleSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
    )
  }

  renderSearchedVehicle() {
    const { selectedVehicleData, selectedVehicleId } = this.state;

    if (selectedVehicleData) {
      const { timestamp } = selectedVehicleData;
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();

      return (
        <List>
          <ListItem justify='between'
            separator='horizontal'>
            <span>
              <Button icon={<Vehicle />}
                label={selectedVehicleId}
                href={`/vehicle/${selectedVehicleId}`}
                primary={true} />
            </span>
            <span>
              {selectedVehicleData.name}
            </span>
            <span>
              entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong>
            </span>
          </ListItem>
        </List>
      );
    }
    return (
      <List>
        <ListItem justify='between'
          separator='horizontal'>
          <span>
            { selectedVehicleId ? 'No such vehicle in the records!' : null }
          </span>
        </ListItem>
      </List>
    );
  }

  render() {

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
      <Article primary={true} full={true} className='giveVehicle'>
        <Header
          direction='row'
          size='large'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}
        >
          <Anchor path='/dashboard'>
            <LinkPrevious a11yTitle='Back' />
          </Anchor>
          <Heading margin='none' strong={true}>
            VEHICLES
          </Heading>
        </Header>
        <Section>
        {errorNode}
        <Box pad={{ horizontal: 'medium' }}>
          <Paragraph size='large'>
            <Button icon={<AddIcon />}
              label='Allow Vehicle Inside'
              href='/new/vehicle' />
          </Paragraph>
        </Box>
        { this.renderVehicleSearch() }
        { this.renderSearchedVehicle() }
        </Section>
      </Article>
    );
  }
}

const vehicles = state => ({ ...state.vehicles });
export default connect(vehicles)(Vehicles);

// Veriety
// area
// agent