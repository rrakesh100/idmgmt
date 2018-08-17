import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Image from 'grommet/components/Image';
import ImageMapper from 'react-image-mapper';


// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/

const testMap = {
  name: 'my-map',
  areas: [
    { _id: 'garden', name: 'Garden', shape: 'poly', coords: [807,90,849,86,958,231,941,233,929,221,906,219,901,224,902,233,890,233] },
    { _id: 'admin', name: 'Hr & ADMIN', shape: 'poly', coords: [909,236,901,225,904,218,933,218,942,228,937,237] },
    { _id: 'guestHouse', name: 'Guest House', shape: 'poly', coords: [774,87,805,85,820,118,791,121] },
    { _id: 'office1', name: 'Office 1', shape: 'poly', coords: [798,140,825,135,847,172,816,172] },
    { _id: 'office12', name: 'Office 2', shape: 'poly', coords: [827,190,857,190,880,229,845,231] },
    { _id: 'lorryYard', name: 'Lorry Yard', shape: 'poly', coords: [770,264,915,264,965,352,956,357,977,402,844,401,806,331,791,333] },
    { _id: 'bunk', name: 'Bunk', shape: 'poly', coords: [787,334,799,363,826,361,812,334] },
    { _id: 'godown2', name: 'Godown No-2', shape: 'poly', coords: [362,90,491,89,490,99,489,115,349,119] },
    { _id: 'godown3', name: 'Godown No-3', shape: 'poly', coords: [513,88,651,86,657,94,656,118,510,117] },
    { _id: 'godown4', name: 'Godown No-4', shape: 'poly', coords: [674,87,755,84,766,96,771,115,683,115] },
    { _id: 'godown5', name: 'Godown No-5', shape: 'poly', coords: [688,131,773,129,788,139,795,165,697,166] },
    { _id: 'godown6', name: 'Godown No-6', shape: 'poly', coords: [704,182,712,199,714,227,828,229,821,198,804,181] },
    { _id: 'godown7', name: 'Godown No-8', shape: 'poly', coords: [499,245,694,248,703,270,708,309,495,303] },
    { _id: 'parking', name: 'Parking', shape: 'poly', coords: [738,256,756,256,775,312,758,315] },
    { _id: 'restHall', name: 'Drivers Rest Hall', shape: 'poly', coords: [719,258,736,259,740,270,726,270] },
    { _id: 'garage', name: 'Garage', shape: 'poly', coords: [725,274,741,272,754,315,737,314] },
    { _id: 'silos', name: 'Silos', shape: 'poly', coords: [511,122,647,121,659,156,507,157] },
    { _id: 'thotti', name: 'Thotti', shape: 'poly', coords: [651,122,664,121,673,169,655,169] },
    { _id: 'ricemill1', name: 'Rice Mill No-1', shape: 'poly', coords: [149,129,127,139,119,161,203,161,207,142,222,129] },
    { _id: 'ricemill2', name: 'Rice Mill No-2', shape: 'poly', coords: [223,129,210,139,205,162,304,162,309,139,318,127] },
    { _id: 'ricemill3', name: 'Rice Mill No-3', shape: 'poly', coords: [107,175,80,190,70,217,175,218,182,192,200,177] },
    { _id: 'ricemill4', name: 'Rice Mill No-4', shape: 'poly', coords: [201,176,181,192,176,218,271,221,279,193,293,177] },
    { _id: 'ricemill5', name: 'Rice Mill No-5', shape: 'poly', coords: [504,181,595,183,598,228,500,226] },
    { _id: 'ricemill6', name: 'Rice Mill No-6', shape: 'poly', coords: [159,86,176,80,199,81,205,90,339,88,331,93,325,115,163,119,151,109] },
    { _id: 'ricemill7', name: 'Rice Mill No-7', shape: 'poly', coords: [354,244,343,266,339,299,460,301,464,267,469,245] },
    { _id: 'newRavvaPlant', name: 'New Ravva Plant', shape: 'poly', coords: [596,182,676,180,684,196,687,228,599,228] },
    { _id: 'roads', name: 'Roads', shape: 'poly', coords: [488,131,507,136,486,383,460,382] },
    { _id: 'balabondulu', name: 'Balabondulu', shape: 'poly', coords: [493,89,511,89,509,116,491,116] },
    { _id: 'thotti1', name: 'Thotti', shape: 'poly', coords: [466,128,486,130,481,166,460,164] },
    { _id: 'steamDriers', name: 'Steam Driers A+B', shape: 'poly', coords: [367,129,360,143,355,167,459,166,465,129] },
    { _id: 'oldRavvaPlant', name: 'Old Ravva Plant', shape: 'poly', coords: [345,131,333,142,326,164,353,167,358,145,366,130] },
    { _id: 'parboiling', name: 'Parboiling', shape: 'poly', coords: [482,182,397,181,385,224,476,226] },
    { _id: 'parboilingDriers', name: 'Parboiling Driers A+B', shape: 'poly', coords: [316,181,395,181,383,226,299,222] },
    { _id: 'automobile', name: 'Automobile Stores', shape: 'poly', coords: [291,242,274,263,341,265,352,244] },
    { _id: 'tinkering', name: 'Tinkering & Carpenter', shape: 'poly', coords: [276,264,344,265,339,301,268,298] },
    { _id: 'powerPlant1', name: 'Power Plant - 1', shape: 'poly', coords: [68,287,85,246,105,234,84,231,78,227,35,226,3,244,5,280] },
    { _id: 'powerPlant2', name: 'Power Plant - 2', shape: 'poly', coords: [116,227,87,244,72,279,145,295,155,264,179,241] },
    { _id: 'gmOffice', name: 'GM Office', shape: 'poly', coords: [180,242,168,252,196,256,204,243] },
    { _id: 'roPlant', name: 'R.O.Plant', shape: 'poly', coords: [189,297,199,263,214,245,204,243,193,253,168,251,155,259,144,295] },
    { _id: 'mainStores', name: 'Main Stores', shape: 'poly', coords: [217,242,199,263,245,263,262,244] },
    { _id: 'workshop', name: 'Workshop', shape: 'poly', coords: [200,263,245,265,238,301,189,300] },
    { _id: 'drainage', name: 'Drainage', shape: 'poly', coords: [222,369,427,376,426,384,223,374] }
  ]
};


class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onMouseEnter(area, index, e) {
    this.setState({
      hoveredZone: area
    });
  }

  onMouseLeave(area, index, e) {
    this.setState({
      hoveredZone: ''
    });
  }

  onZoneSelect(area, index, e) {
    this.setState({
      selectedZone: area
    });
    this.props.onClick(area)
  }

  handleAssignZone() {
    const { selectedZone } = this.state;
    this.props.onSubmit(selectedZone);
  }

  render() {
    const { selectedZone='', hoveredZone='' } = this.state;
    const selectedZoneText = selectedZone ?
      <p className='selectedZone'><span>selected: </span>{selectedZone.name}</p> : null;
    const assignButton = selectedZone ?
      <Button primary={true} label={`Assign visitor to [${selectedZone.name}]`} onClick={this.handleAssignZone.bind(this)} /> : null;


    return (
      <div>
      <div style={{marginLeft: '40px', marginBottom: '20px'}}>
      {assignButton}
      </div>
        <div className='zonePicker'>
          {selectedZoneText}
          <ImageMapper
            src='/img/birdview1.png'
            map={testMap}
            width={1000}
            fillColor='rgba(155, 89, 182,0.5)'
            strokeColor='rgba(155, 89, 182,1)'
            lineWidth={2}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            onClick={this.onZoneSelect.bind(this)}
          />
          <p className='hoveredZone'>{hoveredZone ? `highlighted area is ${hoveredZone.name}` : null}</p>
        </div>
      </div>
    );
  }

}

const map = state => ({ ...state.map });
export default connect(map)(Map);
