import React, { Component } from 'react';
import { getVehicles, getVehicle } from '../api/vehicles';
import Search from 'grommet/components/Search';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Moment from 'moment';
import Button from 'grommet/components/Button';
import Vehicle from 'grommet/components/icons/base/DocumentConfig';
import Article from 'grommet/components/Article';



export default class AttendanceOut extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  componentDidMount() {
    getVehicles()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        let suggests = [];
        Object.keys(data).forEach((vehicle) => {
          suggests.push({
             label : data[vehicle].name,
             vehicleId : vehicle
          })
        })
        this.setState({
          vehicleSuggestions: suggests,
          filteredSuggestions: suggests
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
      let filtered = [];
      let  options  = this.state.vehicleSuggestions;

      if(e.target.value == '')
        filtered = options
      else {
        options.forEach((opt) => {
          if(opt.label.startsWith(e.target.value))
            filtered.push(opt)
          if(opt.vehicleId.startsWith(e.target.value))
            filtered.push(opt)
        })
      }

      this.setState({
        vehicleSearchString: e.target.value,
        filteredSuggestions: filtered
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
      const {vehicleSuggestions} = this.state;
      console.log(vehicleSuggestions);
      if(!vehicleSuggestions)
      return null;
      return (
        <Search placeHolder='Search Vehicle By Name or Barcode'
          inline={true}
          iconAlign='start'
          size='small'
          suggestions={this.state.filteredSuggestions}
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
        selectedVehicleId ?
        <List>
          <ListItem justify='between'
            separator='horizontal'>
            <span>
              'No such vehicle in the records!'
            </span>
          </ListItem>
        </List> : null
      );
    }

  render() {
    console.log(this.state)
    return (
      <Article primary={true} full={true} className='giveVehicle'>
      { this.renderVehicleSearch() }
      { this.renderSearchedVehicle() }
      </Article>
    )
  }
}
