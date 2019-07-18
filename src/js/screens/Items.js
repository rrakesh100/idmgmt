import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Label from 'grommet/components/Label';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Header from 'grommet/components/Header';
import MaterialIn from '../components/MaterialIn';
import MaterialOut from '../components/MaterialOut';
import MaterialReports from '../components/MaterialReports';
import AllMaterialPrint from '../components/AllMaterialPrint';

class Items extends Component {

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
        <h3 style={{marginTop:10,marginLeft:20}}><strong>Store Material Tracking System</strong></h3>
        </Header>
        <Tabs justify='start' style={{marginLeft: 20, marginTop: -20}}>
        
        <Tab title='MATERIAL IN'>
            <MaterialIn />
        </Tab>
        <Tab title='MATERIAL OUT'>
          <MaterialOut />
        </Tab>
        <Tab title='REPORTS'>
          <MaterialReports />
        </Tab>
        </Tabs>
      </Article>
    );
  }
}

const items = state => ({ ...state.items });
export default connect(items)(Items);
