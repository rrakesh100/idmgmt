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


class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const testMap = {
      name: 'my-map',
      areas: [
        { _id: 'gardenOutside', name: 'Outside Garden', shape: 'poly', coords: [669,72,678,72,769,188,755,187] },
        { _id: 'gardenInside', name: 'Inside Garden', shape: 'poly', coords: [644,71,662,71,737,175,725,176,727,186,716,186] },
        { _id: 'office1', name: 'Office #1', shape: 'poly', coords: [679,192,705,190,683,150,659,152] },
        { _id: 'office2', name: 'Office #2', shape: 'poly', coords: [654,143,675,140,655,108,637,111] },
        { _id: 'office3', name: 'Office #3', shape: 'poly', coords: [620,75,640,74,653,100,633,102] },
        { _id: 'godown1', name: 'Godown #1', shape: 'poly', coords: [569,191,558,155,560,148,641,147,654,160,658,184,657,191] },
        { _id: 'godown2', name: 'Godown #2', shape: 'poly', coords: [554,140,544,115,548,105,620,105,634,114,636,135,633,141] },
        { _id: 'godown3', name: 'Godown #3', shape: 'poly', coords: [534,79,537,70,605,70,612,77,615,92,614,101,544,105] },

        { _id: 'factory1', name: 'Mill #1', shape: 'poly', coords: [394,250,393,214,396,196,552,198,560,218,563,248,563,255] },
        { _id: 'factory2', name: 'Mill #2', shape: 'poly', coords: [398,190,398,181,402,144,535,145,544,157,547,183,546,192] },
        { _id: 'factory3', name: 'Mill #3', shape: 'poly', coords: [406,138,405,125,405,100,525,97,535,127,535,140] },
        { _id: 'factory4', name: 'Mill #4', shape: 'poly', coords: [406,98,408,74,411,71,518,69,523,79,523,97] },


        { _id: 'factory5', name: 'Mill #5', shape: 'poly', coords: [216,251,369,251,375,205,372,198,227,194,212,210,209,241] },
        { _id: 'factory6', name: 'Mill #6', shape: 'poly', coords: [236,187,235,178,250,142,385,145,374,182,374,192] },
        { _id: 'factory7', name: 'Mill #7', shape: 'poly', coords: [258,142,258,133,258,115,271,103,386,104,383,133,383,145] },
        { _id: 'factory8', name: 'Mill #8', shape: 'poly', coords: [278,103,275,95,277,75,288,71,390,71,387,95,387,102] },


        { _id: 'factory9', name: 'Mill #9', shape: 'poly', coords: [187,248,210,203,205,196,136,194,129,190,119,189,109,182,85,183,61,197,52,225,59,233,47,253,53,270,72,271,88,241] },
        { _id: 'factory10', name: 'Mill #10', shape: 'poly', coords: [216,187,233,151,226,143,76,141,55,153,46,176,61,188] },
        { _id: 'factory11', name: 'Mill #11', shape: 'poly', coords: [238,138,252,118,248,100,116,102,95,109,90,130,100,141] },
        { _id: 'factory12', name: 'Mill #12', shape: 'poly', coords: [260,98,269,81,264,71,157,72,149,64,123,70,115,85,125,101] },
        { _id: 'factory13', name: 'Mill #13', shape: 'poly', coords: [33,271,14,270,1,262,1,245,12,235,3,226,1,194,15,184,52,182,59,188,72,188,49,221,52,243] },

        { _id: 'freespace', name: 'Free Space', shape: 'poly', coords: [210,252,567,258,579,315,199,299] },
        { _id: 'shed', name: 'Mechanic Shed', shape: 'poly', coords: [604,311,576,205,734,214,786,319] }
      ]
    };
    const { selectedZone='', hoveredZone='' } = this.state;

    return (
      <div>
        <div className='zonePicker'>
          <p className='selectedZone'>{selectedZone}</p>
          <ImageMapper
            src='/img/Unit2.jpeg'
            map={testMap}
            width={800}
            fillColor='rgba(155, 89, 182,0.5)'
            strokeColor='rgba(155, 89, 182,1)'
            lineWidth={2}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            onClick={this.onZoneSelect.bind(this)}
          />
        <p className='hoveredZone'>{hoveredZone ? `highlighted area is ${hoveredZone}` : null}</p>

        </div>
      </div>
    );
  }



  onMouseEnter(area, index, e) {
    this.setState({
      hoveredZone: area.name
    });
  }

  onMouseLeave(area, index, e) {
    this.setState({
      hoveredZone: ''
    });
  }

  onZoneSelect(area, index, e) {
    console.log('AREA', JSON.stringify(area, null, 2));
    console.log('index', JSON.stringify(index, null, 2));
    this.setState({
      selectedZone: area.name
    });
  }
}

const map = state => ({ ...state.map });
export default connect(map)(Map);
