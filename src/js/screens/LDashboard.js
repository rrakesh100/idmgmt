import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';

import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';

import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import Headline from 'grommet/components/Headline';
import Paragraph from 'grommet/components/Paragraph';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Search from 'grommet/components/Search';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';







import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';

import Header from 'grommet/components/Header';
import ImageMapper from 'react-image-mapper';

// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/

const sampleItems = [
  { id: 'DTPV44HT', name: 'Printer', status: 'TRANSIT'},
  { id: 'Z0VNA9KS', name: 'Shovel', status: 'RECIEVED'},
  { id: 'DR1QUZUC', name: 'Nuts Pack', status: 'REJECTED'}
];


class LDashboard extends Component {


  render() {
    return (
      <Article primary={true} full={true} className='giveItem'>
        <Header
          direction='row'
          size='large'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}
        >
          <Anchor path='/tasks'>
            <LinkPrevious a11yTitle='Back' />
          </Anchor>
          <Heading margin='none' strong={true}>
            DAILY LABOUR DASHBOARD
          </Heading>
        </Header>


        <Tabs activeIndex={0}
          onActive={() => {}}>
          <Tab title='Zonewise'>
            <Paragraph>
            ZONES and LABOUR COUNT
            </Paragraph>
            <input type='text'
              value=''
              onChange={() => {}} />
          </Tab>
          <Tab title='Labourwise'>
            <Paragraph>
            LABOUR LIST
            </Paragraph>
            <input type='text'
              value=''
              onChange={() => {}} />
          </Tab>
        </Tabs>

      </Article>
    )
  }



}

const items = state => ({ ...state.items });
export default connect(items)(LDashboard);
