import React, { Component } from 'react';
import Search from 'grommet/components/Search';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Moment from 'moment';
import Button from 'grommet/components/Button';
import Vehicle from 'grommet/components/icons/base/DocumentConfig';
import Article from 'grommet/components/Article';
import Select from 'grommet/components/Select';
import TextInput from 'grommet/components/TextInput';
import Label from 'grommet/components/Label';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import { Container, Row, Col } from 'react-grid-system';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Webcam from 'react-webcam';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import Next from 'grommet/components/icons/base/CaretNext';
import Down from 'grommet/components/icons/base/CaretDown';
import { getVehicles } from '../api/configuration';


export default class AttendanceOut extends Component {
  constructor(props) {
    super(props);
    this.state={
      ownOutVehicle: '',
      material: '',
      ourVehicle: false,
      emptyVehicle: false,
      showDetails: false,
      showLiveCameraFeed: true,
    };
  }

  componentDidMount() {
    this.getVehicleNumberDetails()
  }

  getVehicleNumberDetails() {
    getVehicles().then((snap) => {
      const options = snap.val();
      console.log(options)
      let vehicleOpt = [];
      Object.keys(options).forEach((opt) => {
        vehicleOpt.push(opt)
      })
      this.setState({vehicleOpt})
    }).catch((e) => console.log(e))
  }

    capture() {
      if (this.state.showLiveCameraFeed) {
        const screenshot = this.webcam.getScreenshot();
        this.setState({
          screenshot,
          showLiveCameraFeed: false,
          validationMsg: ''
        });
      } else {
        this.setState({
          showLiveCameraFeed: true,
          screenshot: ''
        });
      }
    }

    setRef(webcam) {
      this.webcam = webcam;
    }

    renderImage() {
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
      return (
        <Image src={inSide ? this.state.selectedEmployeeData.inwardPhoto : this.state.screenshot} height={300}/>
      );
    }

    renderCamera() {
      return (
        <Box>
          { this.renderImage() }
        </Box>
      );
    }

    onFieldChange(fieldName, e) {

      if(fieldName == 'ownOutVehicle' || fieldName == 'emptyLoad' || fieldName == 'material') {
        this.setState({
          [fieldName]: e.option
        })
      } else {
        this.setState({
          [fieldName]: e.target.value
        })
      }

      if(fieldName == 'ownOutVehicle' && e.option == 'Own Vehicle') {
        this.setState({
          ourVehicle: true
        })
      } else {
        this.setState({
          ourVehicle: false
        })
      }

      if(fieldName == 'emptyLoad' && e.option == 'Empty') {
        let formRef = this.refs.loadVeicleForm;
        formRef.hidden = true;
          this.setState({
            emptyVehicle: true
          })
      } else {
        let formRef = this.refs.loadVeicleForm;
        formRef.hidden = true;
          this.setState({
            emptyVehicle: false
          })
      }

    }

    onShowingOutwardDetails() {
      this.setState({
        showDetails: true
      })
    }

    onHidingOutwardDetails() {
      this.setState({
        showDetails: false
      })
    }

    showOutwardDetails() {
      const { ourVehicle, emptyVehicle, showDetails, vehicleOpt } = this.state;
      console.log(vehicleOpt)
      return (
        <div>
        <Button icon={<Down/>}
          primary={true}
          href='#'
          label='Hide Last Outward Details'
          onClick={this.onHidingOutwardDetails.bind(this)}
          />
          <Section justify='center'>
            <Split>
              <Box direction='column' style={{width:'300px'}} >

                  <Form className='newVisitorFields'>
                    <FormField  label='Inward Sno'  strong={true} style={{marginTop : '15px'}}  >
                      <TextInput
                        value={this.state.inwardNumber}
                        onDOMChange={this.onFieldChange.bind(this, 'inwardNumber')}
                      />
                    </FormField>
                    <FormField label='Own/Out Vehicle *'  strong={true} style={{marginTop : '15px'}}>
                        <Select
                        options={['Own Vehicle', 'Outside Vehicle']}
                        placeHolder='Own/Out Vehicle'
                        value={this.state.ownOutVehicle}
                        onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
                        />
                    </FormField>
                    <FormField label='Vehicle No *' strong={true} style={{marginTop : '15px'}}>
                      {
                        !ourVehicle ?
                        <TextInput
                            placeHolder='Vehicle No'
                            value={this.state.vehicleNumber}
                            onDOMChange={this.onFieldChange.bind(this, 'vehicleNumber')}
                        /> :
                        <Select
                        placeHolder='Vehicle No'
                        options={vehicleOpt}
                        value={this.state.vehicleNumber}
                        onChange={this.onFieldChange.bind(this, 'vehicleNumber')}
                        />
                      }

                    </FormField>
                    <FormField label='Driver Name *' strong={true} style={{marginTop : '15px'}}>
                        <TextInput
                            placeHolder='Driver Name'
                            value={this.state.driverName}
                            onDOMChange={this.onFieldChange.bind(this, 'driverName')}
                        />
                    </FormField>
                    <FormField label='Driver Cell No *' strong={true} style={{marginTop : '15px'}}>
                        <TextInput
                            placeHolder='Driver Cell No'
                            value={this.state.driverNumber}
                            onDOMChange={this.onFieldChange.bind(this, 'driverNumber')}
                        />
                    </FormField>
                    <FormField label='Empty/Load *' strong={true} style={{marginTop : '15px'}}>
                        <Select
                          options={['Empty', 'Load']}
                          placeHolder='Empty/Load'
                          value={this.state.emptyLoad}
                          onChange={this.onFieldChange.bind(this, 'emptyLoad')}
                        />
                    </FormField>
                  </Form>
              </Box>
              <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                  <Form className='newVisitorFields'>

                    <FormField label='Party Name' strong={true}  ref='loadVeicleForm' style={{marginTop : '18px'}}>
                        <TextInput
                            placeHolder='Party Name'
                            value={this.state.partyName}
                            onDOMChange={this.onFieldChange.bind(this, 'partyName')}
                        />
                    </FormField>

                    <FormField label='Material' strong={true} style={{marginTop : '15px'}}>
                        <Select
                          options={[]}
                          placeHolder='Material'
                          value={this.state.material}
                          onChange={this.onFieldChange.bind(this, 'material')}
                        />
                    </FormField>
                    <FormField label='No of Bags' strong={true} style={{marginTop : '15px'}}>
                        <TextInput
                            placeHolder='No of Bags'
                            value={this.state.numberOfBags}
                            onDOMChange={this.onFieldChange.bind(this, 'numberOfBags')}
                        />
                    </FormField>
                    <FormField label='Coming From' strong={true} style={{marginTop : '15px'}}>
                        <TextInput
                            placeHolder='Coming From'
                            value={this.state.comingFrom}
                            onDOMChange={this.onFieldChange.bind(this, 'comingFrom')}
                        />
                    </FormField>
                    <FormField label='Bill No' strong={true} style={{marginTop : '15px'}}>
                        <TextInput
                            placeHolder='Bill No'
                            value={this.state.billNumber}
                            onDOMChange={this.onFieldChange.bind(this, 'billNumber')}
                        />
                    </FormField>
                    <FormField label='Remarks' strong={true} style={{marginTop : '15px'}} size='small'>
                        <TextInput
                            placeHolder='Remarks'
                            value={this.state.remarks}
                            onDOMChange={this.onFieldChange.bind(this, 'remarks')}
                        />
                    </FormField>
                  </Form>
                </Box>
                <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >


                </Box>
              </Split>
            </Section>
          </div>
      )
    }

    hideOutwardDetails() {
      return (
        <Button icon={<Next/>}
          href='#'
          label='Show Last Outward Details'
          onClick={this.onShowingOutwardDetails.bind(this)}
          />
      )
    }

  render() {
    const { ourVehicle, emptyVehicle, showDetails } = this.state;

    return (
      <div>
        <h4 style={{marginLeft: 40, textDecoration: 'underline', fontWeight: 'bold'}}>Present Inward Details</h4>
        <Section justify='center'>
          <Split>
            <Box direction='column' style={{marginLeft:'40px', width:'300px'}} >

                <Form className='newVisitorFields'>
                  <FormField  label='Inward Sno'  strong={true} style={{marginTop : '15px'}}  >
                    <TextInput
                      value={this.state.inwardNumber}
                      onDOMChange={this.onFieldChange.bind(this, 'inwardNumber')}
                    />
                  </FormField>
                  <FormField label='Own/Out Vehicle *'  strong={true} style={{marginTop : '15px'}}>
                      <Select
                      options={['Own Vehicle', 'Outside Vehicle']}
                      placeHolder='Own/Out Vehicle'
                      value={this.state.ownOutVehicle}
                      onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
                      />
                  </FormField>
                  <FormField label='Vehicle No *' strong={true} style={{marginTop : '15px'}}>
                    {
                      !ourVehicle ?
                      <TextInput
                          placeHolder='Vehicle No'
                          value={this.state.vehicleNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'vehicleNumber')}
                      /> :
                      <Select
                      placeHolder='Vehicle No'
                      options={[]}
                      value={this.state.vehicleNumber}
                      onChange={this.onFieldChange.bind(this, 'vehicleNumber')}
                      />
                    }

                  </FormField>
                  <FormField label='Driver Name *' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Driver Name'
                          value={this.state.driverName}
                          onDOMChange={this.onFieldChange.bind(this, 'driverName')}
                      />
                  </FormField>
                  <FormField label='Driver Cell No *' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Driver Cell No'
                          value={this.state.driverNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'driverNumber')}
                      />
                  </FormField>
                  <FormField label='Empty/Load *' strong={true} style={{marginTop : '15px'}}>
                      <Select
                        options={['Empty', 'Load']}
                        placeHolder='Empty/Load'
                        value={this.state.emptyLoad}
                        onChange={this.onFieldChange.bind(this, 'emptyLoad')}
                      />
                  </FormField>
                </Form>
            </Box>
            <Box  direction='column' style={{marginLeft:'30px', width:'300px'}} >
                <Form className='newVisitorFields'>

                  <FormField label='Party Name' strong={true}  ref='loadVeicleForm' style={{marginTop : '18px'}}>
                      <TextInput
                          placeHolder='Party Name'
                          value={this.state.partyName}
                          onDOMChange={this.onFieldChange.bind(this, 'partyName')}
                      />
                  </FormField>

                  <FormField label='Material' strong={true} style={{marginTop : '15px'}}>
                      <Select
                        options={[]}
                        placeHolder='Material'
                        value={this.state.material}
                        onChange={this.onFieldChange.bind(this, 'material')}
                      />
                  </FormField>
                  <FormField label='No of Bags' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='No of Bags'
                          value={this.state.numberOfBags}
                          onDOMChange={this.onFieldChange.bind(this, 'numberOfBags')}
                      />
                  </FormField>
                  <FormField label='Coming From' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Coming From'
                          value={this.state.comingFrom}
                          onDOMChange={this.onFieldChange.bind(this, 'comingFrom')}
                      />
                  </FormField>
                  <FormField label='Bill No' strong={true} style={{marginTop : '15px'}}>
                      <TextInput
                          placeHolder='Bill No'
                          value={this.state.billNumber}
                          onDOMChange={this.onFieldChange.bind(this, 'billNumber')}
                      />
                  </FormField>
                  <FormField label='Remarks' strong={true} style={{marginTop : '15px'}} size='small'>
                      <TextInput
                          placeHolder='Remarks'
                          value={this.state.remarks}
                          onDOMChange={this.onFieldChange.bind(this, 'remarks')}
                      />
                  </FormField>
                </Form>
              </Box>
            <Box onClick={this.capture.bind(this)} direction='column'
              style={{marginTop:'25px', marginLeft : '10px', width:'300px'}} align='center'>
                {this.renderCamera() }
            </Box>
          </Split>
          <div style={{marginLeft: 40}}>
          { showDetails ? this.showOutwardDetails() : this.hideOutwardDetails() }
          </div>
        </Section>
      </div>
    )
  }
}
