import React, { Component } from 'react';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Heading from 'grommet/components/Heading';
import Header from 'grommet/components/Header';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import EditIcon from 'grommet/components/icons/base/Edit';
import UpdateIcon from 'grommet/components/icons/base/Update';
import Select from 'grommet/components/Select';
import { Container, Row, Col } from 'react-grid-system';
import { saveWorkPlace, getWorkPlaces, saveEditedWorkPlace, getWorkPlace } from '../api/workmanager';
import { saveWheatEntries, getWheatEntries } from './../api/wheatentries';
import { getWheatEntries as getWheatVariety } from './../api/configuration';
import WorkManagerComponent from './WorkManagerComponent';
import Footer from 'grommet/components/Footer';
import Box from 'grommet/components/Box';



export default class WheatEntries extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wheatEntriesList : [],
      wheatEntries : {}
    }
  }

  componentDidMount() {
    this.getWheatVarieties() 
    this.getWheatEntriesDetails()
  }

  getWheatVarieties() {
    getWheatVariety().then((snap) => {
      this.setState({
        wheatEntries: snap.val()
      })
    })
  }

  getWheatEntriesDetails() {
    getWheatEntries().then((snap) => {
      this.setState({
        wheatEntriesList: snap.val()
      })
    })
  }

  getWorkPlaces() {
    getWorkPlaces().then((snap) => {
      const data = snap.val();
      this.setState({
        workplaces: data
      })
    }).catch((e) => console.log(e))
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  onShiftFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option
    })
  }

  onAddWorkPlace() {
    this.setState({
      workPlaceBtnClick: true
    })
  }

  onWorkPlaceCloseLayer() {
    this.setState({
      workPlaceBtnClick: false
    })
  }

  renderWorkPlace() {
    return (
      <Button label='ADD'
      href='#' onClick={this.onAddWorkPlace.bind(this)}
      primary={true} style={{float: 'right', marginRight: '20px'}}/>
    )
  }

  renderWorkPlaceLayer() {
    if(this.state.workPlaceBtnClick) {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onWorkPlaceCloseLayer.bind(this)}>
        <Form>
        <p>Enter Wheat Entries</p>
        <FormField  label='Vehicle Number'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Vehicle Number'
            value={this.state.vehicleNumber}
            onDOMChange={this.onFieldChange.bind(this, 'vehicleNumber')} />
        </FormField>
        <FormField  label='Wheat Varieties'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <Select
          options={Object.values(this.state.wheatEntries)}
          value={this.state.wheatVariety}
          onChange={({ option }) => {
            this.setState({
              ['wheatVariety']: option
            });
          }}
        />
        </FormField>
        <FormField  label='supplier'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Supplier'
            value={this.state.supplier}
            onDOMChange={this.onFieldChange.bind(this, 'supplier')} />
        </FormField>
        <FormField  label='No of Bags'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='No. of bags'
            value={this.state.noofbags}
            onDOMChange={this.onFieldChange.bind(this, 'noofbags')} />
        </FormField>
        <FormField  label='quantity'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Quantity'
            value={this.state.quantity}
            onDOMChange={this.onFieldChange.bind(this, 'quantity')} />
        </FormField>
        <FormField  label='moisture'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Moisture'
            value={this.state.moisture}
            onDOMChange={this.onFieldChange.bind(this, 'moisture')} />
        </FormField>
        <FormField  label='S.V. ml'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='s.v. ml'
            value={this.state.svml}
            onDOMChange={this.onFieldChange.bind(this, 'svml')} />
        </FormField>
        <FormField  label='Shrivelled Broken Wheat'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Shrivelled Broken Wheat'
            value={this.state.shrivelledBrokenWheat}
            onDOMChange={this.onFieldChange.bind(this, 'shrivelledBrokenWheat')} />
        </FormField>
        <FormField  label='Stones Mud Ball'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Stones Mud Ball'
            value={this.state.stonesMudBall}
            onDOMChange={this.onFieldChange.bind(this, 'stonesMudBall')} />
        </FormField>
        <FormField  label='Other edible Grains'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Other edible Grains'
            value={this.state.otherEdibleGrains}
            onDOMChange={this.onFieldChange.bind(this, 'otherEdibleGrains')} />
        </FormField>
        <FormField  label='Kernel Burnt'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Kernel Burnt'
            value={this.state.kernelBurnt}
            onDOMChange={this.onFieldChange.bind(this, 'kernelBurnt')} />
        </FormField>
        <FormField  label='Infested Dunki'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Infested Dunki'
            value={this.state.infestedDunki}
            onDOMChange={this.onFieldChange.bind(this, 'infestedDunki')} />
        </FormField>
        <FormField  label='Potia'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Potia'
            value={this.state.potia}
            onDOMChange={this.onFieldChange.bind(this, 'potia')} />
        </FormField>
        <FormField  label='Total Refrection'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Total Refrection'
            value={this.state.totalRefrection}
            onDOMChange={this.onFieldChange.bind(this, 'totalRefrection')} />
        </FormField>
        <FormField  label='Wet Gluten'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Wet Gluten'
            value={this.state.wetGluten}
            onDOMChange={this.onFieldChange.bind(this, 'wetGluten')} />
        </FormField>
        <FormField  label='Dry Gluten'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Dry Gluten'
            value={this.state.dryGluten}
            onDOMChange={this.onFieldChange.bind(this, 'dryGluten')} />
        </FormField>
        <FormField  label='Unloading Place'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='Unloading Place'
            value={this.state.unloadingPlace}
            onDOMChange={this.onFieldChange.bind(this, 'unloadingPlace')} />
        </FormField>
        <FormField  label='Remark'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <TextInput
            placeHolder='remark'
            value={this.state.remark}
            onDOMChange={this.onFieldChange.bind(this, 'remark')} />
        </FormField>
        </Form>
      <Row>
      <Button label='SAVE'
      primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
      href='#' onClick={this.onSavingWorkPlace.bind(this)}/>
      </Row>
        </Layer>
      )
    }
  }

  onSavingWorkPlace() {
    saveWheatEntries(JSON.parse(JSON.stringify(this.state))).then(() => {
      alert('wheat entries successfully saved')
      this.setState({
        msg: 'wheat entries successfully saved',
        workPlaceBtnClick: false,
        workplace:''
      }, this.getWheatEntriesDetails())
    }).catch((e) => console.log(e))
  }

  editEntry(date, wheatVariety, obj){
    this.setState({
      workPlaceBtnClick: true,
      wheatVariety,
      ...obj
    });
  }

  renderWorkPlaceTable() {
    const { wheatEntriesList } = this.state;
    if(wheatEntriesList) {
    return (
      <div style={{marginLeft: '40px', width: '80%'}}>
       {
         Object.keys(wheatEntriesList).map((key, index) => {
           return (
             <div key={index}>
              <div><b>Date - {key}</b></div>
              {
                Object.keys(wheatEntriesList[key]).map((key1, index) => {
                  return <div style={{ marginTop : 10 }}>
                      Wheat Variety - {key1}
                      <Button label='EDIT' href='#' style={{float: 'right'}} onClick={this.editEntry.bind(this, key, key1, wheatEntriesList[key][key1])}/>
                        <div style={{display: "flex", flexWrap: 'wrap', borderWidth: 1, borderColor: 'black', borderStyle: 'solid', padding: 10, borderRadius: 6, width: '100%'}}>
                      {
                          Object.keys(wheatEntriesList[key][key1]).map((key2, index) => {
                            return <div style={{ width : 400}}>{key2} - {wheatEntriesList[key][key1][key2]} </div>
                          })
                      }
                      </div>
                  </div>
                })
              }
              </div>
           )
         })
       }
       </div>
    )
  }
  }

  onEditWorkPlace(key, mCount, fCount, shift) {
    this.setState({
      workPlaceEditClick: true,
      editWorkPlaceId: key,
      male: mCount,
      female: fCount,
      shift
    })
  }

  onCloseLayer() {
    this.setState({
      workPlaceEditClick: false
    })
  }

  onUpdateWorkPlace() {
    const { shift, male, female, editWorkPlaceId } = this.state;
    saveEditedWorkPlace({
      editWorkPlaceId,
      shift,
      male,
      female
    }).then(() => {
    this.setState({
      workPlaceEditClick: false,
      shift: '',
      male: '',
      female: ''
    }, this.getWorkPlaces.bind(this))
  }
  ).catch((e) => console.log(e))

  }

  renderWorkPlaceEditForm() {
    const { workPlaceEditClick, maleCount, femaleCount } = this.state;
    if(workPlaceEditClick) {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onCloseLayer.bind(this)}>

        <Header
          direction='row'
          size='small'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}>
          <Heading margin='none' strong={true}>
            WORK PLACE EDIT
          </Heading>
        </Header>
        <Box direction='column'>
        <Form>
        <p style={{marginLeft : '80px'}}>Enter No.of Male</p>
        <TextInput style={{marginLeft: '80px', width: '300px'}}
            placeHolder='number of male'
            value={this.state.male}
            onDOMChange={this.onFieldChange.bind(this, 'male')}
        />
        <p style={{marginLeft : '80px'}}>Enter No.of Female</p>
        <TextInput style={{marginLeft: '80px', width: '300px'}}
            placeHolder='number of female'
            value={this.state.female}
            onDOMChange={this.onFieldChange.bind(this, 'female')}
        />
        </Form>
        <Footer pad={{"vertical" : "medium"}} style={{marginTop:'25px', marginLeft:'140px'}}>
          <Button label='update' icon={<UpdateIcon />}
          href='#' onClick={this.onUpdateWorkPlace.bind(this)}
          primary={true} style={{}}/>
        </Footer>
        </Box>
        </Layer>
      );
    }
  }

  render() {
    return (
      <div>
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}
        style={{marginLeft:'10px'}}>
        <Heading margin='none' strong={true}>
          WHEAT ENTRIES
        </Heading>
      </Header>
      <Tabs justify='start' style={{marginLeft:'40px'}}>
        <Tab title='Work places (Master)'>
        { this.renderWorkPlace() }
        { this.renderWorkPlaceLayer() }
        { this.renderWorkPlaceTable() }
        </Tab>
      </Tabs>
      </div>
    )
  }
}
