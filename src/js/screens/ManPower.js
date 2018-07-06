import React, {Component} from 'react';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Heading from 'grommet/components/Heading';
import Header from 'grommet/components/Header';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Label from 'grommet/components/Label';
import Select from 'grommet/components/Select';
import Webcam from 'react-webcam';
import DateTime from 'grommet/components/DateTime';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';
import Toast from 'grommet/components/Toast';
import Edit from 'grommet/components/icons/base/Print';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import { saveEmployee, uploadEmployeeImage, getEmployees, removeEmployee, getEmployee, saveEditedEmployee } from '../api/employees';
import PrintIcon from 'grommet/components/icons/base/Print';
import TrashIcon from 'grommet/components/icons/base/Trash';
import UpdateIcon from 'grommet/components/icons/base/Update';
import EditIcon from 'grommet/components/icons/base/Edit';
import { Print } from 'react-easy-print';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Layer from 'grommet/components/Layer';
import { Container, Row, Col } from 'react-grid-system';
import Footer from 'grommet/components/Footer';
import ManPowerComponent from './ManPowerComponent';


export default class ManPower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId:'',
      name:'',
      joinedDate: '',
      gender: '',
      paymentType: '',
      screenshot: '',
      village: '',
      address: '',
      remarks: '',
      numberOfPersons: '',
      showLiveCameraFeed: true,
      jattuValid: false,
      removeBtnClick: false,
      editBtnClick: false
    }
  }

  componentDidMount() {
    { this.getEmployees() }
  }

  getEmployees() {
    getEmployees().then((snap) => {
      this.setState({
        employeeData: snap.val()
      })

    }).catch((err) => {
      console.error('ALL EMPLOYEES FETCH FAILED', err)
    })
  }

  onFieldChange(fieldName, e) {
    let fieldValue = '';
    if(fieldName === 'joinedDate' || fieldName === 'gender' || fieldName ==='paymentType') {
      fieldValue =  e.option
    } else {
      fieldValue = e.target.value
    }

    if(fieldName ==='paymentType' && e.option === 'Jattu-Daily payment') {
      this.setState({jattuValid : true})
    }

    if(fieldName ==='paymentType' && e.option === 'Daily payment' || fieldName ==='paymentType' && e.option === 'Weekly payment') {
      this.setState({jattuValid : false})
    }

    this.setState({
      [fieldName]: fieldValue
    },() => {
      const { employeeData, gender, paymentType } = this.state;
      if(gender && paymentType) {
        let genderStr = gender.substring(0,1);
        let paymentTypeStr = paymentType.substring(0,1);
        let countObj = employeeData.count;
        let barCode = paymentTypeStr + genderStr;let employeeId = '000'
        if(gender ==='Male' && paymentType !== 'Jattu-Daily payment') {
           employeeId = barCode + countObj.maxMaleCount;
        }else if(gender==='Female' && paymentType !== 'Jattu-Daily payment') {
           employeeId = barCode + countObj.maxFemaleCount;
        }else{
           employeeId = barCode + countObj.maxJattuCount;
        }
        this.setState({
          employeeId
        })
      }
    })
  }

  onJoinedDateChange(e) {
    this.setState({joinedDate:e})
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
          width={400}
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

  onSavingData() {
    const { name,
            employeeId,
            employeeData,
            joinedDate,
            screenshot,
            gender,
            village,
            address,
            paymentType,
            remarks,
            numberOfPersons,
            count } = this.state;
    let countObj = employeeData.count;
    let imgFile = screenshot.replace(/^data:image\/\w+;base64,/, "");
    uploadEmployeeImage(imgFile, employeeId).then((snapshot) => {
    let screenshot = snapshot.downloadURL;
    saveEmployee({
      countObj,
      name,
      employeeId,
      joinedDate,
      screenshot,
      gender,
      village,
      address,
      paymentType,
      remarks,
      numberOfPersons
    }).then(this.setState({
      name:'',
      employeeId: '',
      joinedDate:'',
      screenshot: '',
      gender: '',
      village: '',
      address: '',
      paymentType: '',
      remarks: '',
      numberOfPersons: '',
      showLiveCameraFeed: true,
      toastMsg: `User ${name} is saved`
    }, this.getEmployees())
  ).catch((err) => {
    console.error('VISITOR SAVE ERR', err);
    this.setState({
      validationMsg: `Unable to save ${name}. Contact admin for assistance`
    });
  })
  }).catch((e) => console.log(e))
  }

  onSubmitClick(e) {
    e.stopPropagation();
    const {name, joinedDate, screenshot, gender, village, address, paymentType, remarks, numberOfPersons} = this.state;

    if (!joinedDate) {
      alert('JOINED DATA is missing');
      this.setState({
        validationMsg: 'JOINED DATA is missing'
      });
      return;
    }

    if (!name) {
      alert('NAME is missing');
      this.setState({
        validationMsg: 'NAME is missing'
      });
      return;
    }

    if (!gender) {
      alert('GENDER is missing');
      this.setState({
        validationMsg: 'GENDER is missing'
      });
      return;
    }

    if (!village) {
      alert('VILLAGE is missing');
      this.setState({
        validationMsg: 'VILLAGE is missing'
      });
      return;
    }

    if (!paymentType) {
      alert('PAYMENT TYPE is missing');
      this.setState({
        validationMsg: 'PAYMENT TYPE is missing'
      });
      return
    }

    if (!screenshot) {
      alert('IMAGE is not taken. Click on the camera to take photo!');
      this.setState({
        validationMsg: 'IMAGE is not taken. Click on the camera to take photo!'
      });
      return
    }

    if (paymentType === 'Jattu-Daily payment' && !numberOfPersons) {
      alert('NUMBER OF PERSONS is missing');
      this.setState({
        validationMsg: 'NUMBER OF PERSONS is missing'
      });
      return
    }
    this.setState({validationMsg:''}, this.onSavingData.bind(this))
  }

  toastClose() {
    this.setState({ toastMsg: '' });
  }

  renderToastMsg() {
    const { toastMsg } = this.state;
    if(toastMsg) {
      return (
        <Toast status='ok'
          onClose={ this.toastClose.bind(this) }>
          { toastMsg }
        </Toast>
      );
    }
    return null;
  }



  renderBarcode() {
    const { employeeId } = this.state;
     return (
       <div className='barCode'>
          <Barcode value={employeeId} height={20} />
       </div>
     )
  }

  renderInputFields() {
    const {employeeId, jattuValid} = this.state;
    return (
      <Article>
      <Section>
       <Split>
        <Box direction='column' style={{marginLeft:'30px'}}>
        <Form className='manPowerFields'>

        <FormField  label='Joined Date *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
        <DateTime id='id'
        format='D/M/YYYY'
        name='name'
        onChange={this.onJoinedDateChange.bind(this)}
        value={this.state.joinedDate}
        />
        </FormField>
        <FormField  label='Name *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Name'
              value={this.state.name}
              onDOMChange={this.onFieldChange.bind(this, 'name')}
          />
        </FormField>
          <FormField  label='Gender *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <Select
              placeHolder='Gender'
              options={['Male', 'Female']}
              value={this.state.gender}
              onChange={this.onFieldChange.bind(this, 'gender')}
            />
          </FormField>
          <FormField  label='Village *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Village'
              value={this.state.village}
              onDOMChange={this.onFieldChange.bind(this, 'village')}
            />
          </FormField>
          <FormField  label='Address'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Address'
              value={this.state.address}
              onDOMChange={this.onFieldChange.bind(this, 'address')}
            />
          </FormField>
          </Form>
          </Box>
          <Box direction='column' style={{marginLeft:'20px'}}>
          <Form>
          <FormField  label='Payment Type *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <Select
              placeHolder='Payment Type'
              options={['Daily payment', 'Weekly payment', 'Jattu-Daily payment']}
              value={this.state.paymentType}
              onChange={this.onFieldChange.bind(this, 'paymentType')}
            />
          </FormField>
          <FormField  label='Remarks'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='Remarks'
              value={this.state.remarks}
              onDOMChange={this.onFieldChange.bind(this, 'remarks')}
            />
          </FormField>
          { jattuValid ? <FormField  label='No of persons *'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
            <TextInput
              placeHolder='No of persons'
              value={this.state.numberOfPersons}
              onDOMChange={this.onFieldChange.bind(this, 'numberOfPersons')}
            />
          </FormField> : null }
        </Form>
        </Box>
        <Box onClick={this.capture.bind(this)}
        size='small' direction='column'
        style={{marginLeft:'10px', marginTop:'10px', width:'300px'}}
        align='center'>
        { this.renderCamera() }
        <div className='barCode'>
        { this.renderBarcode() }
        </div>
        <Section pad='small'
          align='center'>
          <Button icon={<Edit />}
            label='SAVE'
            onClick={this.onSubmitClick.bind(this)}
            disabled={true}
            href='#'
            primary={true} />
        </Section>
        </Box>
        </Split>
        </Section>
      </Article>
    )
  }

  saveAndPrint(employeeId, employeeObj) {
    this.setState({
      printEmployeeId : employeeId,
      printEmployeeObj : employeeObj
    })
  }

  printBusinessCard() {
      if(this.state.printEmployeeObj) {
   const { employeeId, name, gender, village, paymentType, numberOfPersons, screenshot, address } = this.state.printEmployeeObj;

      return(
        <Print name='bizCard' exclusive>
         <div className='card' style={{width:'100%', height:'30%'}}>
           <div className='card-body' >
             <div className='box header'>
               <h5 style={{fontWeight: 'bold'}}>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</h5>
               <h5>Unit-2, Valuthimmapuram Road, Peddapuram</h5>
               <h5 style={{textDecoration : 'underline',fontWeight : 'bold', fontStyle: 'italic'}}>
               MANPOWER ID CARD
               </h5>
               </div>

               <div className='content'>
               <Table>
                 <tbody>
                   <TableRow>
                     <td>
                        <div style={{fontSize: 'large'}}>MPID:<b>{employeeId.toUpperCase()}</b></div>
                     </td>
                   </TableRow>
                   <TableRow>
                     <td>
                       <div style={{fontSize: 'large'}}>Name: <b>{name.toUpperCase()}</b></div>
                     </td>
                   </TableRow>
                   <TableRow>
                     <td>
                        <div style={{fontSize: 'large'}}>Gender: <b>{gender.toUpperCase()}</b></div>
                     </td>
                     <td>
                      <div style={{fontSize: 'large'}}>Village: <b>{village.toUpperCase()}</b></div>
                     </td>
                   </TableRow>
                   <TableRow>
                     <td>
                        <div style={{fontSize: 'large'}}>Address: <b>{address.toUpperCase()}</b></div>
                     </td>
                   </TableRow>
                   <TableRow>
                     <td>
                        <div style={{fontSize: 'large'}}>Payment Type: <b>{paymentType.toUpperCase()}</b></div>
                     </td>
                     <td>
                      <div style={{fontSize: 'large'}}>No Of Persons: <b>{numberOfPersons.toUpperCase()}</b></div>
                     </td>
                   </TableRow>
                   <TableRow>
                   <td>
                   </td>
                   </TableRow>
                   <TableRow>
                     <td>
                       <div style={{fontSize: 'large'}}>Authorised Signature</div>
                      </td>
                   </TableRow>

                </tbody>
              </Table>

              </div>
              <div className='box sidebar'>
                <Image src={screenshot} />
                <Barcode value={employeeId} height={20}/>
              </div>
           </div>
          </div>
        </Print>
      );
    }


  }

  setTimeoutFunc() {
    setTimeout(() => window.print(), 4000)
  }

  print() {
    if(this.state.printEmployeeId)
     this.setState({printEmployeeId : null}, this.setTimeoutFunc() );
  }



  onEditClick(id, e) {

    e.stopPropagation();
    this.setState({
      editBtnClick: true,
      editEmployeeId: id
    })
  }

  onCloseLayer() {
    this.setState({
      editBtnClick: false
    })
  }

  onEmployeeUpdate(res, employeeName) {

    if(res) {
      this.setState({
        toastMsg: `Edited successfully`,
        editBtnClick: false,

      }, this.getEmployees())
    } else {
      this.setState({
        toastMsg: `Error occured while editing`
      })
    }
  }



  renderEditForm() {
    const {editBtnClick, paymentType, screenshot, editEmployeeId} = this.state;

    if(editBtnClick) {
      return (
        <Layer closer={true}
        flush={false}
        onClose={this.onCloseLayer.bind(this)}>
        <ManPowerComponent employeeId={editEmployeeId} screenshot={screenshot} onSubmit={this.onEmployeeUpdate.bind(this)}/>
        </Layer>
      );
    }
  }



  renderAllEmployees() {
    const email = window.localStorage.email;
    const { employeeData, printEmployeeObj } = this.state;
    if(!employeeData)
    return null;
    return (
      <div className='table'>
      <Table scrollable={true} style={{marginTop : '30px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Employee ID</th>
             <th>Name</th>
             <th>Payment Type</th>
             <th></th>
             <th></th>
             {email == 'admin@gmail.com' ? <th></th> : null }

           </tr>
          </thead>
          <tbody>
            {
              Object.keys(employeeData).map((employee, index) => {
                const employeeObj = employeeData[employee];
                let employeeId = employeeObj.employeeId;
                let name = employeeObj.name;
                let paymentType = employeeObj.paymentType;
                let gender = employeeObj.gender;

                if(employee !== 'count')
                return <TableRow key={index}>
                <td>{index+1}</td>
                <td>{employeeId}</td>
                <td>{name}</td>
                <td>{paymentType}</td>
                <td>
                   <Button icon={<PrintIcon />}
                         onClick={this.saveAndPrint.bind(this, employee, employeeObj)}
                         plain={true} />
                </td>
                <td>
                   <Button icon={<EditIcon />}
                         onClick={this.onEditClick.bind(this, employeeId)}
                         plain={true} />
                </td>
                { email == 'admin@gmail.com' ?
                <td>
                  <Button icon={<TrashIcon />}
                    onClick={this.onDeleteEmployee.bind(this, employeeId, paymentType, gender, employeeData.count)}
                    plain={true} />
                </td> : null }
                </TableRow>
              })
            }
          </tbody>
      </Table>
      </div>
    )

  }

  onDeleteEmployee(employeeId, paymentType, gender, countObj) {
    this.setState({
      removeBtnClick: true,
      deleteEmployeeId: employeeId,
      deletePaymentType: paymentType,
      deleteGender: gender,
      deleteCountObj: countObj
    })
  }

  onRemovingEmployee() {
    const {deleteEmployeeId, deletePaymentType, deleteGender, deleteCountObj} = this.state;

    removeEmployee(deleteEmployeeId, deletePaymentType, deleteGender, deleteCountObj).then(() => {
      this.setState({
        toastMsg: 'successfully removed employee'
      }, this.getEmployees())
    }).catch((e) => console.log(e))
  }


  onYesButtonClick(e) {
    e.stopPropagation();
    this.setState({
      removeBtnClick: false
    }, this.onRemovingEmployee())
  }

  onNoButtonClick(e) {
    e.stopPropagation();
    this.setState({
      removeBtnClick: false
    })
  }

  renderConfirmationDialog() {
    const { removeBtnClick } = this.state;

    if(!removeBtnClick) {
      return null;
    }

      return(
        <Layer>
        <Row>
        <Col sm={14}>
        <Box align='start'
        pad='small'
        style={{backgroundColor: '#9E9E9E', width:'130%'}}>
        confirmation
        </Box>
        </Col>
        </Row>
        <strong><h4 style={{marginTop: '20px', marginLeft:'15px', marginBottom: '70px'}}>
         Are you sure you want to remove the selected employee?
        </h4></strong>

        <Row>
        <Button
          label='No'
          onClick={this.onNoButtonClick.bind(this)}
          href='#' style={{marginLeft: '300px', marginBottom:'10px'}}
          primary={false} />

        <Button
          label='yes'
          onClick={this.onYesButtonClick.bind(this)}
          href='#' style={{marginLeft: '20px', marginBottom: '10px'}}
          primary={true} />
       </Row>
        </Layer>
      )

  }



  render() {
    console.log(this.state)
    return (
      <div className='manPower'>
      <Header
        direction='row'
        size='large'
        colorIndex='light-2'
        align='center'
        responsive={true}
        pad={{ horizontal: 'small' }}
        style={{marginLeft:'10px'}}>
        <Heading margin='none' strong={true}>
          MAN POWER REGISTER
        </Heading>
      </Header>
      <Tabs justify='start' style={{marginLeft:'40px'}}>
      <Tab title='ADD'>
      { this.renderInputFields() }
      </Tab>
      <Tab title='REPORTS'>
      { this.renderAllEmployees() }
      { this.printBusinessCard() }
      { this.print() }
      { this.renderConfirmationDialog() }
      { this.renderEditForm() }
      </Tab>
      </Tabs>
      { this.renderToastMsg() }
      </div>
    )
  }
}
