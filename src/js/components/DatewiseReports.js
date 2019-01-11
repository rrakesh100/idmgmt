import React, { Component } from 'react';
import InputForm from './InputForm';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Notification from 'grommet/components/Notification';
import TextInput from 'grommet/components/TextInput';
import Layer from 'grommet/components/Layer';
import PrintIcon from 'grommet/components/icons/base/Print';
import Button from 'grommet/components/Button';
import { Container, Row, Col } from 'react-grid-system';
import { Print } from 'react-easy-print';
import { RingLoader } from 'react-spinners';
import { getEmployees, getEmployee } from '../api/employees';
import { attendanceDatesLoop,
  getEmployeeAttendanceDates,
  saveEmailReport,
  savePrintCopiesData,
  fetchPrintCopiesData } from '../api/attendance';
import moment from 'moment';
import * as firebase from 'firebase';
import CloseIcon from 'grommet/components/icons/base/Close';
import DatewisePrintComponent from './DatewisePrintComponent';
import ReactToPrint from "react-to-print";

const uniqid = require('uniqid');


export default class DatewiseReports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validationMsg:'',
      startDate : null,
      endDate: null,
      unit: null,
      paymentType: '',
      shift: '',
      emailReport: false,
      loading: false,
      allEmployees: null,
      response: null,
      employeeSuggestions: [],
      filteredSuggestions: [],
      refreshData: false
    }
  }

  componentDidMount() {
    this.getEmployees();
  }


  getEmployees() {
    getEmployees()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        this.setState({
          allEmployees : data
        });
      })
      .catch((err) => {
        console.error('VISITOR FETCH FAILED', err);
      });
  }

  onUnitSelected(unit) {
    this.setState({
      unit,
      response: null,
      validationMsg: ''
    })
  }

  onStartDateSelected(startDate) {
    this.setState({
      startDate,
      response : null,
      validationMsg: ''
    })
  }

  onEndDateSelected(endDate, dateRange) {
    this.setState({
      endDate,
      dateRange,
      response: null,
      validationMsg: ''
    })
  }

  onPaymentSelected(paymentType) {
    if(paymentType == '-EMPTY-') {
      this.setState({
        paymentType,
        paymentTypeSelected: false
      })
    } else {
      this.setState({
        paymentType,
        paymentTypeSelected: true
      })
    }
  }

  onShiftSelected(shift) {
    if(shift == '-EMPTY-') {
      this.setState({
        shift,
        shiftSelected: false
      })
    } else {
      this.setState({
        shift,
        shiftSelected: true
      })
    }
  }

  onGenderSelected(gender) {
    if(gender == '-EMPTY-') {
      this.setState({
        gender,
        genderSelected: false
      })
    } else {
      this.setState({
        gender,
        genderSelected: true
      })
    }
  }

  onVillageSelected(village) {
    if(village == '-EMPTY-') {
      this.setState({
        village,
        villageSelected: false
      })
    } else {
      this.setState({
        village,
        villageSelected: true
      })
    }
  }

  renderValidationMsg() {
    const { validationMsg } = this.state;
    if (validationMsg) {
      return (
        <Notification message={validationMsg} size='small' status='critical' />
      );
    }
    return null;
  }

  renderActivityIndicator() {
    const { loading } = this.state;
      return (

        <div style={{display: 'flex', justifyContent: 'center', marginTop:10}}>
        <RingLoader
              sizeUnit={"px"}
              size={100}
              color={'#865CD6'}
              loading={this.state.loading}
            />
        </div>
      )
  }

  getOldTablesArray(isPrint) {
    const { response,
            startDate,
            endDate,
            paymentType,
            shift,
            shiftSelected,
            paymentTypeSelected,
            allEmployees,
            gender,
            village,
            genderSelected,
            villageSelected,
            employeeSelected,
            selectedEmployeeId } = this.state;

    if(!response)
    return null;

    let tablesArray = [];
    let reportData = [];
    let empArr = [];
    let returnObj = {};
    let i = 0;

    let dailyMaleDayShift = 0;
    let dailyMaleNightShift = 0;
    let dailyFemaleDayShift = 0;
    let dailyFemaleNightShift = 0;
    let weeklyMaleDayShift = 0;
    let weeklyMaleNightShift = 0;
    let weeklyFemaleDayShift = 0;
    let weeklyFemaleNightShift = 0;
    let jattuPayment = 0;
    let iterator = 0;

    let rowCount=0;

    let numOfTable = document.getElementById('datewiseTableId');
    let  now = new Date();
    const timestampStr = moment(now).format('DD/MM/YYYY hh:mm:ss A');
    let strt = moment(startDate , 'DD-MM-YYYY');
    let end = moment(endDate, 'DD-MM-YYYY');
    let diff = end.diff(strt, 'days');

    Object.keys(response).map((date, index) => {
      iterator++
      const attendanceObj = response[date];
      let header;
      if(diff==1&&index==0) {
        header = `Datewise Manpower Details as on ${startDate}`;
      } else if(diff==1&&index==1){
        header = `Datewise Manpower Details as on ${endDate}`;
      } else if(startDate == endDate) {
        header = `Datewise Manpower Details as on ${startDate}`;
      } else if (diff>1) {
        header = `Datewise Manpower Details from ${startDate} to ${endDate}`
      }
      let numOfManpower = empArr.length;
      const numOfEmployees = Object.keys(attendanceObj).length;
      if(attendanceObj ==null)
        return;
      tablesArray.push(<div className='tablesArray'  key={index}>
      <h2 style={isPrint ? {textAlign: 'center', marginTop: 80}: {textAlign: 'center'}}><strong>{header}</strong></h2>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <div style={{display:'flex', flexDirection: 'column', marginLeft: 10}}>
           <h3 style={{marginLeft: 30}}>{date}<span  style={isPrint ? {position: 'absolute', right:40} : {display: 'none'}}>{iterator}</span></h3>
           <h3 style={{marginLeft: 30}}>Number of Manpower: {numOfEmployees}<span  style={isPrint ? {position: 'absolute', right:40} : {display: 'none'}}>{timestampStr}</span></h3>
           </div>
           <div style={isPrint ? {display: 'none'}:{position: 'absolute', right: 40}}>
             <ReactToPrint
                 trigger={this.renderTrigger.bind(this)}
                 content={this.renderContent.bind(this)}
                 onAfterPrint={this.handleAfterPrint.bind(this)}
               />
           </div>
           </div>
           <Table className="datewiseTable" id='datewiseTableId' scrollable={true} style={{ marginLeft : 10}}>
          <thead>
           <tr>
             <th>S No.</th>
             <th>Name</th>
             <th>Id</th>
             <th>Payment Type</th>
             <th>Shift</th>
             <th>In Time</th>
             <th>Out Time</th>
             <th>Total Time Spent</th>
           </tr>
          </thead>
          <tbody>
            {
                Object.keys(attendanceObj).map((key,index)=> {
                  let empAttObj = allEmployees[key];
                  const employeeAttendaceObj = attendanceObj[key];
                  if(employeeAttendaceObj !== null){
                  let inTime = employeeAttendaceObj.in;
                  let outTime = employeeAttendaceObj.shift == 'Night Shift' ? employeeAttendaceObj.tomorrowsOutTime : employeeAttendaceObj.out;
                  let totalTime = 'N/A';

                  if(employeeAttendaceObj.shift === 'Night Shift' ) {
                    let inT = moment(key)
                  }

                  if(outTime && inTime) {
                    let startTime = moment(inTime, "HH:mm a");
                    let endTime=moment(outTime, "HH:mm a");
                    let duration = moment.duration(endTime.diff(startTime));

                    let hours = 0, minutes =0;
                    if(duration.asMilliseconds() < 0) {
                     let dMillis = duration.asMilliseconds();
                     let bufferedMillis = dMillis + (24 * 60 * 60 * 1000);
                     let bufferedSeconds = bufferedMillis / 1000;
                      hours = Math.floor(bufferedSeconds / 3600);
                     let remainingSeconds = bufferedSeconds % 3600 ;
                      minutes = remainingSeconds / 60;
                     }else {
                      hours = parseInt(duration.asHours());
                      minutes = parseInt(duration.asMinutes())%60;
                     }

                     totalTime = hours + ' hr ' + minutes + ' min '
                  }

                  let istInTime =  moment.utc(inTime).local().format('YYYY-MM-DD HH:mm:ss');
                  let istOutTime =  '--'
                  if(outTime !== 'N/A')
                    istOutTime=moment.utc(outTime).local().format('YYYY-MM-DD HH:mm:ss');
                  let isValid = true;

                  if(paymentTypeSelected && paymentType !== employeeAttendaceObj.paymentType) {
                    isValid = false;
                  }

                  if(shiftSelected && shift !== employeeAttendaceObj.shift) {
                    isValid = false;
                  }

                  if(genderSelected && gender !== allEmployees[key]['gender'] ) {
                    isValid = false;
                  }

                  if(villageSelected && village !== allEmployees[key]['village'] ) {
                    isValid = false;
                  }

                  if(employeeSelected && selectedEmployeeId !== key ) {
                    isValid = false;
                  }

                  if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Day Shift') {
                    dailyMaleDayShift += 1
                 }

                 if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Night Shift') {
                   dailyMaleNightShift += 1
                }

                if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Day Shift') {
                  dailyFemaleDayShift += 1
               }

               if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Night Shift') {
                 dailyFemaleNightShift += 1
              }

              if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Day Shift') {
                weeklyMaleDayShift += 1
             }
             if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Night Shift') {
               weeklyMaleNightShift += 1
            }
            if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Day Shift') {
              weeklyFemaleDayShift += 1
           }
           if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Night Shift') {
             weeklyFemaleNightShift += 1
          }
          if(empAttObj.paymentType === 'Jattu-Daily payment') {
            jattuPayment += 1
          }


                    if(isValid && inTime) {
                     i++;
                     reportData.push({
                       serialNo : index + 1,
                       manpowerId : key,
                       name :  employeeAttendaceObj.name,
                       numberOfPersons : employeeAttendaceObj.numberOfPersons,
                       shift : employeeAttendaceObj.shift,
                       inTime : istInTime,
                       outTime : istOutTime,
                       totalTime : totalTime
                     })
                     return <TableRow className="datewiseTableRow" key={key} style={employeeAttendaceObj.paymentType == 'Daily payment' ?
                     {backgroundColor : '#C6D2E3'} : employeeAttendaceObj.paymentType == 'Jattu-Daily payment' ?
                     {backgroundColor: '#eeeeee'}: employeeAttendaceObj.paymentType == 'Weekly payment' ?
                     {backgroundColor: '#9E9E9E'}: {backgroundColor: 'white'}}>

                     <td style={{width: '5%'}}>{i}</td>
                     <td style={{width: '15%'}}>{employeeAttendaceObj.name}</td>
                     <td style={{width: '10%'}}>{key}</td>
                     <td style={{width: '15%'}}>{employeeAttendaceObj.paymentType}</td>
                     <td style={{width: '15%'}}>{employeeAttendaceObj.shift}</td>
                     <td style={{width: '10%'}}>{employeeAttendaceObj.in}</td>
                     <td style={{width: '10%'}}>{outTime}</td>
                     <td style={{width: '15%'}}>{totalTime}</td>
                     </TableRow>
                   }
              }
              })
            }
          </tbody>
      </Table>

      </div>)
    })
    returnObj['tablesArray'] = tablesArray;
    returnObj['summary'] = {
      dailyMaleDayShift,
      dailyMaleNightShift,
      dailyFemaleDayShift,
      dailyFemaleNightShift,
      weeklyMaleDayShift,
      weeklyMaleNightShift,
      weeklyFemaleDayShift,
      weeklyFemaleNightShift,
      jattuPayment
    };
    return returnObj;
  }


  showOldEmployeeReportsTable() {
    let tablesObj = this.getOldTablesArray(false);

      if(!tablesObj)
      return null;

   return (
    <div>
     <div  style={{marginBottom: 40}}>
      {tablesObj['tablesArray']}
     </div>
     </div>
   )
 }

 handleAfterPrint() {
   this.setState({
     response: null
   })
 }

 renderContent() {
   return this.componentRef;
 }

 renderTrigger() {
   return (
     <Button icon={<PrintIcon />} label='Print' fill={true}
     primary={true} style={{marginRight: '13px'}}
     href='#'/>
   )
 }


 onFieldChange(fieldName, e) {
   this.setState({
     [fieldName]: e.target.value
   })
 }

 onSavingEmailReport() {
   const { email, startDate, endDate } = this.state;
   const date = new Date();
   const epochTime = date.getTime();

   let datesArr=[];
   let startDateParts = startDate.split("-");
   let endDateParts = endDate.split("-");
   let startDateObj = new Date(startDateParts[2], startDateParts[1]-1, startDateParts[0]);
   let endDateObj = new Date(endDateParts[2], endDateParts[1]-1, endDateParts[0]);

   while (startDateObj <= endDateObj) {
   datesArr.push(moment(startDateObj).format('DD-MM-YYYY'));
   startDateObj.setDate(startDateObj.getDate() + 1);
   }

   saveEmailReport({
     email,
     epochTime,
     datesArr
   }).then(() => {
     this.setState({
       emailReport: false
     })
   }).catch((e) => console.log(e));
 }

 onCloseLayer() {
   this.setState({
     showAbstractTable: false
   })
 }

 emailReportDialog() {
   const {emailReport} = this.state;
   if(emailReport) {
     return (
       <Layer closer={true}
         flush={false}
         onClose={this.onCloseLayer.bind(this)}>
         <Form>
         <p>Enter Email</p>
         <FormField  label='Email'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
         <TextInput
             placeHolder='Email'
             value={this.state.email}
             onDOMChange={this.onFieldChange.bind(this, 'email')} />
         </FormField>
         </Form>
       <Row>
       <Button label='Add'
       primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
       href='#' onClick={this.onSavingEmailReport.bind(this)}/>
       </Row>
       </Layer>
     )
   } else {
     return
   }

 }

 renderAbstractTable() {
   const { showAbstractTable,
           dailyMaleDayShift,
           dailyMaleNightShift,
           dailyFemaleDayShift,
           dailyFemaleNightShift,
           weeklyMaleDayShift,
           weeklyMaleNightShift,
           weeklyFemaleDayShift,
           weeklyFemaleNightShift ,
           jattuPayment, unit, startDate, endDate } = this.state;


   let weeklyMaleTotal = weeklyMaleDayShift + weeklyMaleNightShift;
   let weeklyFemaleTotal = weeklyFemaleDayShift + weeklyFemaleNightShift;
   let dailyMaleTotal = dailyMaleDayShift + dailyMaleNightShift;
   let dailyFemaleTotal = dailyFemaleDayShift + dailyFemaleNightShift;

   let weeklyDaySubTotal = weeklyMaleDayShift + weeklyFemaleDayShift;
   let weeklyNightSubTotal = weeklyMaleNightShift + weeklyFemaleNightShift;
   let weeklySubTotal = weeklyDaySubTotal + weeklyNightSubTotal;

   let dailyDaySubTotal = dailyMaleDayShift + dailyFemaleDayShift;
   let dailyNightSubTotal = dailyMaleNightShift + dailyFemaleNightShift;
   let dailySubTotal = dailyDaySubTotal + dailyNightSubTotal;

   let dayGrandTotal = weeklyDaySubTotal + dailyDaySubTotal;
   let nightGrandTotal = weeklyNightSubTotal + dailyNightSubTotal;
   let grandTotal = dayGrandTotal + nightGrandTotal + jattuPayment;

   if(showAbstractTable) {
     return (
       <Layer
         flush={false}
         closer={true}
         onClose={this.onCloseLayer.bind(this)}>
         <div style={{marginTop: 20, marginLeft: 'auto', marginRight: 'auto'}}>
         <div style={{display: 'flex', justifyContent: 'flex-end'}}>
           <a onClick={() => setTimeout(() => window.print(), 1)}>Print</a>
         </div>
         <div>
         {
           startDate == endDate ?
           <h5 style={{textAlign: 'center', marginLeft : '20px'}}><strong>ABSTRACT MANPOWER DETAILS AS ON :{startDate}</strong></h5> :
           <h5 style={{textAlign: 'center', marginLeft : '20px'}}><strong>ABSTRACT MANPOWER DETAILS AS ON :{startDate} To: {endDate}</strong></h5>
         }
         <h5><strong>Unit: {unit}</strong></h5>
         </div>
         <Table scrollable={true}>
             <thead>
              <tr>
                <th></th>
                <th>Day Shift</th>
                <th>Night Shift</th>
                <th>Day Total</th>
              </tr>
             </thead>
             <tbody>
               <TableRow style={{color : 'green'}}>
                   <td>Weekly Male</td>
                   <td>{weeklyMaleDayShift}</td>
                   <td>{weeklyMaleNightShift}</td>
                   <td>{weeklyMaleTotal}</td>
               </TableRow>
               <TableRow style={{color : 'green'}}>
                   <td>Weekly Female</td>
                   <td>{weeklyFemaleDayShift}</td>
                   <td>{weeklyFemaleNightShift}</td>
                   <td>{weeklyFemaleTotal}</td>
               </TableRow>
               <hr style={{width: '300%'}}/>
               <TableRow style={{color : 'red'}}>
                   <td>Sub Total</td>
                   <td>{weeklyDaySubTotal}</td>
                   <td>{weeklyNightSubTotal}</td>
                   <td>{weeklySubTotal}</td>
               </TableRow>
               <hr style={{width: '300%'}}/>
               <TableRow style={{color : 'blue'}}>
                   <td>Daily Male</td>
                   <td>{dailyMaleDayShift}</td>
                   <td>{dailyMaleNightShift}</td>
                   <td>{dailyMaleTotal}</td>
               </TableRow>
               <TableRow style={{color : 'blue'}}>
                   <td>Daily Female</td>
                   <td>{dailyFemaleDayShift}</td>
                   <td>{dailyFemaleNightShift}</td>
                   <td>{dailyFemaleTotal}</td>
               </TableRow>
               <hr style={{width: '300%'}}/>
               <TableRow style={{color : 'red'}}>
                   <td>Sub Total</td>
                   <td>{dailyDaySubTotal}</td>
                   <td>{dailyNightSubTotal}</td>
                   <td>{dailySubTotal}</td>
               </TableRow>
               <hr style={{width: '300%'}}/>
               <TableRow>
                   <td>Jattu</td>
                   <td>{jattuPayment}</td>
                   <td>0</td>
                   <td>{jattuPayment}</td>
               </TableRow>
               <hr style={{width: '300%'}}/>
               <TableRow style={{color : 'red'}}>
                   <td>GRAND TOTAL</td>
                   <td><strong>{dayGrandTotal}</strong></td>
                   <td><strong>{nightGrandTotal}</strong></td>
                   <td><strong>{grandTotal}</strong></td>
               </TableRow>
             </tbody>
         </Table>
         </div>
       </Layer>
     )
   } else {
     return
   }
 }


 abstractPrintPdf() {
   const { showAbstractTable } = this.state;
   if(showAbstractTable) {
     let abstractTableCopy = this.renderAbstractTable();
     return(
       <Print name="hihi" exclusive>
          <div className="abstractPrint">
            {abstractTableCopy}
          </div>
       </Print>
     );
   } else {
     return null;
   }
 }

 onAbstractClick() {
   const { unit, startDate, endDate } = this.state;

   if(!unit) {
     this.setState({
       validationMsg: 'UNIT is Missing'
     })
     return
   }

   if(!startDate) {
     this.setState({
       validationMsg: 'From Date is Missing'
     })
     return
   }

   if(!endDate) {
     this.setState({
       validationMsg: 'To Date is Missing'
     })
     return
   }

   this.setState({
     validationMsg:'',
   }, this.getAbstractSummary.bind(this))
 }

 getAbstractSummary() {
   let tablesObj = this.getOldTablesArray(false);
   if(!tablesObj)
   return null;
   let data = tablesObj['summary'];
   this.setState({
     showAbstractTable: true,
     dailyMaleDayShift: data.dailyMaleDayShift || 0,
     dailyMaleNightShift: data.dailyMaleNightShift || 0,
     dailyFemaleDayShift: data.dailyFemaleDayShift || 0,
     dailyFemaleNightShift: data.dailyFemaleNightShift || 0,
     weeklyMaleDayShift: data.weeklyMaleDayShift || 0,
     weeklyMaleNightShift: data.weeklyMaleNightShift || 0,
     weeklyFemaleDayShift: data.weeklyFemaleDayShift || 0,
     weeklyFemaleNightShift: data.weeklyFemaleNightShift || 0,
     jattuPayment : data.jattuPayment || 0
   })
 }

 onValidatingInputs() {
   const { startDate, endDate, unit } = this.state;
   if(!unit) {
     this.setState({
       validationMsg: 'UNIT is Missing'
     })
     return
   }

   if(!startDate) {
     this.setState({
       validationMsg: 'From Date is Missing'
     })
     return
   }

   if(!endDate) {
     this.setState({
       validationMsg: 'To Date is Missing'
     })
     return
   }

   this.setState({
     validationMsg:'',
     loading: true
   }, this.attendanceDatesLoop.bind(this))
 }

 attendanceDatesLoop() {
   const { startDate, endDate, unit, allEmployees } = this.state;

   let datesArr=[];
   let startDateParts = startDate.split("-");
   let endDateParts = endDate.split("-");
   let startDateObj = new Date(startDateParts[2], startDateParts[1]-1, startDateParts[0]);
   let endDateObj = new Date(endDateParts[2], endDateParts[1]-1, endDateParts[0]);

   while (startDateObj <= endDateObj) {
   datesArr.push(moment(startDateObj).format('DD-MM-YYYY'));
   startDateObj.setDate(startDateObj.getDate() + 1);
   }

   let returnObj = {};
   let unitVal;
   if(unit == 'UNIT2') {
     unitVal= ''
   } else {
     unitVal = unit;
   }
   const dbRef = firebase.database().ref(`${unitVal}/attendance/`);
   Promise.all(
     datesArr.map((date) => {
       return dbRef.child('dates').child(date).once('value').then((snapshot) => {
         let response = snapshot.val();
         returnObj[date] = response;
       })
     })
   ).then(() => {
     let employeeVsDate = {};
     Object.keys(returnObj).map((date,index) => {
           let attObj = returnObj[date];
           if(attObj) {
           Object.keys(attObj).map((empId, k) => {
             let existingData  = employeeVsDate[empId] || [];
             let newData = {
               date : date,
               value : attObj[empId]
             }
             existingData.push(newData);
             employeeVsDate[empId] = existingData;
           })
         } else {
           this.setState({
             noDataMsg : 'No Data Existed',
             loading: false
           })
         }
       });
       this.setState({
           response: returnObj,
           employeeVsDate,
           loading: false
         });
   })

 }

 onEmployeeSelected(employeeSelected, selectedEmployeeId, selectedEmployeeData) {
   this.setState({
     employeeSelected,
     selectedEmployeeId,
     selectedEmployeeData
   })
 }

 renderInputForm() {
   return (
     <InputForm
       refreshData={this.state.refreshData}
       onUnitSelected={this.onUnitSelected.bind(this)}
       onStartDateSelected={this.onStartDateSelected.bind(this)}
       onEndDateSelected={this.onEndDateSelected.bind(this)}
       onPaymentSelected={this.onPaymentSelected.bind(this)}
       onShiftSelected={this.onShiftSelected.bind(this)}
       onGenderSelected={this.onGenderSelected.bind(this)}
       onVillageSelected={this.onVillageSelected.bind(this)}
       onEmployeeSelected={this.onEmployeeSelected.bind(this)}
       onShowReport={this.onValidatingInputs.bind(this)}
       onAbstractButtonClick={this.onAbstractClick.bind(this)}
       showAbstractButton={true}
     />
   )
 }

 setPrintRef(ref) {
   this.componentRef = ref;
 }

 renderNewPrintCard() {
   const { startDate, endDate } = this.state;
   let tablesObj = this.getOldTablesArray(true);
   if(!tablesObj)
   return null;

   let datewiseArr = tablesObj['tablesArray'];
   return (
     <div>
         <DatewisePrintComponent
           ref={this.setPrintRef.bind(this)}
           startDate={startDate}
           endDate={endDate}
           datewiseArr={datewiseArr}
         />
     </div>
   )
 }

  render() {
    return (
      <div>
      { this.renderValidationMsg() }
      { this.renderInputForm() }
      { this.renderActivityIndicator() }
      { this.showOldEmployeeReportsTable() }
      { this.emailReportDialog() }
      { this.renderAbstractTable() }
      { this.abstractPrintPdf() }
      { this.renderNewPrintCard() }
      </div>
    )
  }
}
