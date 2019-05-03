import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Rand from 'random-key';
import Moment from 'moment';
import Split from 'grommet/components/Split';
import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import FormFields from 'grommet/components/FormFields';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Search from 'grommet/components/Search';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Vehicle from 'grommet/components/icons/base/DocumentConfig';
import Header from 'grommet/components/Header';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import { getVehicles, getVehicle, getAllVehicles } from '../api/vehicles';
import VehicleIn from './VehicleIn';
import VehicleOut from './VehicleOut';
import AllVehiclesPrint from './AllVehiclesPrint';
import VehicleReports from '../components/VehicleReports';
import MaterialwiseReports from '../components/MaterialwiseReports';
import VehiclewiseReports from '../components/VehiclewiseReports';

class Vehicles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicles: null,
    };
  }

  componentDidMount() {
    this.getAllVehicles();
  }

  getAllVehicles() {
    getAllVehicles().then((snap) => {
      this.setState({
        vehicles: snap.val()
      })
    }).catch((err) => {
      console.error('ALL VEHICLES FETCH FAILED', err)
    })
  }


  render() {
    const {vehicles} = this.state;
    return (
      <Article primary={true} full={true} className='giveVehicle'>
      <Header
        direction='row'
        size='small'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}>
        <h3 style={{marginTop:10,marginLeft:20}}><strong>Vehicle Tracking System</strong></h3>
      </Header>
        <Section>
            <Tabs justify='start' style={{marginLeft: 20, marginTop: -20}}>
            <Tab title='HOME'>
              <AllVehiclesPrint vehicles={vehicles}/>
            </Tab>
            <Tab title='VEHICLE IN'>
              <VehicleIn />
            </Tab>
            <Tab title='VEHICLE OUT'>
              <VehicleOut />
            </Tab>
            <Tab title='REPORTS'>
              <VehicleReports />
            </Tab>
            <Tab title='MATERIALWISE'>
              <MaterialwiseReports />
            </Tab>
            <Tab title='VEHICLEWISE'>
              <VehiclewiseReports />
            </Tab>
            </Tabs>
        </Section>
      </Article>
    );
  }
}

const vehicles = state => ({ ...state.vehicles });
export default connect(vehicles)(Vehicles);
