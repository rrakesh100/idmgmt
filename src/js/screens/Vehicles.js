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
      { this.showVehicles() }
  }

  showVehicles() {
    getAllVehicles().then((snap) => {
      this.setState({
        vehicles: snap.val()
      })
    }).catch((err) => {
      console.error('ALL VEHICLES FETCH FAILED', err)
    })
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

  showVehiclesTable() {

    const { vehicles } = this.state;

    if(!vehicles)
    return null;

    return (
      <div className='table'>
      <Table scrollable={true} style={{marginTop : '30px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>ID</th>
             <th>Vehicle Number</th>
             <th>Driver Name</th>
             <th>Status</th>
           </tr>
          </thead>
          <tbody>
            {
              Object.keys(vehicles).map((vehicle, index) => {
                const vehicleObj = vehicles[vehicle];
                const path=`vehicle/${vehicleObj.vehicleId}`;
                return <TableRow key={index}>
                <td>{index+1}</td>
                <td>
                <Button primary={true}
                  label={vehicleObj.vehicleId}
                  href={path} />
                </td>
                <td>{vehicleObj.vehicleNumber}</td>
                <td>{vehicleObj.driverName}</td>
                <td>{vehicleObj.status}</td>

                </TableRow>
              })
            }
          </tbody>
      </Table>
      </div>
    )
  }

  render() {

    const { error, tasks } = this.props;
    const { intl } = this.context;

    return (
      <Article primary={true} full={true} className='giveVehicle'>
        <Header
          direction='row'
          size='small'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}
        >
          <h2><strong>Vehicles Tracking system</strong></h2>
        </Header>
        <Section>
            <Tabs justify='start' style={{marginLeft: 20, marginTop: -20}}>
            <Tab title='VEHICLE IN'>
            <VehicleIn />
            </Tab>
            <Tab title='VEHICLE OUT'>
            <VehicleOut />
            </Tab>
            <Tab title='REPORTS'>
            </Tab>
            </Tabs>
        </Section>
      </Article>
    );
  }
}

const vehicles = state => ({ ...state.vehicles });
export default connect(vehicles)(Vehicles);
