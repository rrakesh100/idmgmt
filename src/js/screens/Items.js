import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Moment from 'moment';
import Save from 'grommet/components/icons/base/Upload';

import Split from 'grommet/components/Split';
import Webcam from 'react-webcam';
import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Paragraph from 'grommet/components/Paragraph';
import AddIcon from 'grommet/components/icons/base/Add';
import NavControl from '../components/NavControl';
import Label from 'grommet/components/Label';

import Select from 'grommet/components/Select';

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
import Item from 'grommet/components/icons/base/DocumentConfig';
import Header from 'grommet/components/Header';

import { getItems, getItem } from '../api/items';


class Items extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inwardSNo:'',
      showLiveCameraFeed: true
    };
  }

  onFieldChange(fieldName,e) {
    if(fieldName === 'retNonret') {
      this.setState({
        [fieldName]: e.option
      })
    } else {
      this.setState({
        [fieldName]: e.target.value
      })
    }

  }

  setRef(webcam) {
    this.webcam = webcam;
  }


  capture() {
    if (this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false
      });
    } else {
      this.setState({
        showLiveCameraFeed: true,
        screenshot: ''
      });
    }
  }


  renderImage() {
    if(this.state.showLiveCameraFeed) {
      return (
        <Webcam
          audio={false}
          height={300}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={300}
          onClick={this.capture.bind(this)}
        />
      );
    }
    return (
      <Image src={this.state.screenshot} height={300}/>
    );
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }

  onSaveClick() {

  }

  onNewBtnClick() {

  }

  renderInputFields() {
    const {
      inwardSNo,
      retNonret,
      fromLocation,
      toLocation,
      fromDepartment,
      toDepartment,
      gatepassNumber,
      weighbillNumber,
      material,
      materialSNo,
      quantity,
      purpose,
      vehicleNum,
      personNumber,
      mobileNumber
    } = this.state;
    return (
      <Section>
       <Split>
        <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
        <Form className='manPowerFields'>
        <FormField  label='InwardSNo'  strong={true} style={{marginTop : '10px'}}  >
          <Label style={{marginLeft:'20px'}}><strong>{inwardSNo}</strong></Label>
        </FormField>
        <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16,marginLeft: 20,color: 'red'}}>Returnable/Non-Returnable</Label>
          <Select
          options={['Returnable', 'Non-Returnable']}
          value={retNonret}
          onChange={this.onFieldChange.bind(this, 'retNonret')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>From Location</Label>
          <TextInput
              placeHolder='From Location'
              value={fromLocation}
              onDOMChange={this.onFieldChange.bind(this, 'fromLocation')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>To Location</Label>
          <TextInput
              placeHolder='To Location'
              value={toLocation}
              onDOMChange={this.onFieldChange.bind(this, 'toLocation')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>From Department</Label>
          <TextInput
              placeHolder='From Department'
              value={fromDepartment}
              onDOMChange={this.onFieldChange.bind(this, 'fromDepartment')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>To Department</Label>
          <TextInput
              placeHolder='To Department'
              value={toDepartment}
              onDOMChange={this.onFieldChange.bind(this, 'toDepartment')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Gatepass No</Label>
          <TextInput
              placeHolder='Gatepass No'
              value={gatepassNumber}
              onDOMChange={this.onFieldChange.bind(this, 'gatepassNumber')}
          />
      </FormField>
      <FormField strong={true} style={{marginTop : '10px'}}>
      <Label style={{fontSize: 16, marginLeft: 20}}>Weigh Bill No</Label>
          <TextInput
              placeHolder='Weigh Bill No'
              value={weighbillNumber}
              onDOMChange={this.onFieldChange.bind(this, 'weighbillNumber')}
          />
      </FormField>


          </Form>
          </Box>
          <Box direction='column' style={{marginLeft:'20px', width:'300px'}}>
          <Form>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Material Name</Label>
              <TextInput
                  placeHolder='Material Name'
                  value={material}
                  onDOMChange={this.onFieldChange.bind(this, 'material')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Material SNo</Label>
              <TextInput
                  placeHolder='Material SNo'
                  value={materialSNo}
                  onDOMChange={this.onFieldChange.bind(this, 'materialSNo')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Quantity</Label>
              <TextInput
                  placeHolder='Quantity'
                  value={quantity}
                  onDOMChange={this.onFieldChange.bind(this, 'quantity')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Purpose</Label>
              <TextInput
                  placeHolder='Purpose'
                  value={purpose}
                  onDOMChange={this.onFieldChange.bind(this, 'purpose')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Vehicle No</Label>
              <TextInput
                  placeHolder='Vehicle No'
                  value={vehicleNum}
                  onDOMChange={this.onFieldChange.bind(this, 'vehicleNum')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Person Number</Label>
              <TextInput
                  placeHolder='Person Number'
                  value={personNumber}
                  onDOMChange={this.onFieldChange.bind(this, 'personNumber')}
              />
          </FormField>
          <FormField strong={true} style={{marginTop : '10px'}}>
          <Label style={{fontSize: 16, marginLeft: 20}}>Mobile No</Label>
              <TextInput
                  placeHolder='Mobile No'
                  value={mobileNumber}
                  onDOMChange={this.onFieldChange.bind(this, 'mobileNumber')}
              />
          </FormField>
        </Form>
        </Box>
        <Box onClick={this.capture.bind(this)}
         direction='column'
        style={{marginLeft : '10px', width:'300px'}}
        align='center'>
        { this.renderCamera() }
        <Button icon={<Save />}
          label='SAVE' style={
          {
            marginTop:20,
            width: '300px',
          }}
          onClick={this.onSaveClick.bind(this)}
          disabled={true}
          href='#'
          primary={true} />
          <Button
            label='NEW' style={{marginTop: 20, width: '300px'}}
            onClick={this.onNewBtnClick.bind(this)}
            disabled={true}
            href='#'
            primary={true} />
        </Box>
        </Split>
        </Section>
    )
  }

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
      </Article>
    );
  }
}

const items = state => ({ ...state.items });
export default connect(items)(Items);
