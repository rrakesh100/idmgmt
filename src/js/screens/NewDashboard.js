import React, { Component, PropTypes } from 'react';
import Heading from 'grommet/components/Heading';
import { getVisitors } from '../api/visitors';
import { getTodaysEmployees } from '../api/employees';



export default class NewDashboard extends Component {
  constructor(){
    super();
    this.state={}
  }

  componentDidMount() {

    getVisitors()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return ;
        }
        let visitors = [];
        console.log('####333##', data);
        snap.forEach(function(child){
          let a = {};
            a[child.key] = child.val()
          visitors.push(a);
        })
        console.log('#####', visitors);

        this.setState({
          visitorSuggestions: [...Object.keys(data)],
          visitors,
          serialNo : data.serialNo
        });
      })
      .catch((err) => {
        console.error('VISITOR FETCH FAILED', err);
      });


      getTodaysEmployees().then(snap => {
        console.log(snap.val());
        this.setState({
          todaysEmployees : snap.val()
        })
      })

  }

  componentWillUnmount() {

  }

  render() {
    let {visitors , todaysEmployees } = this.state;
     let enteredCount = 0,  departedCount = 0, totalVisitorCount = 0;
    if(visitors) {
    visitors.map((visitor) => {
        Object.keys(visitor).forEach(key => {
          totalVisitorCount +=1;
          if(key !== 'serialNo' && visitor[key].status === 'DEPARTED') {
            departedCount += 1;
          }else {
            enteredCount += 1;
          }
        })

    });
  }

    let dailyLabourCount = 0,dailyDayMaleCount = 0 , dailyDayFemaleCount = 0, dailyNightMaleCount = 0 , dailyNightFemaleCount = 0;
    let weeklyLabourCount = 0, weeklyDayMaleCount = 0 , weeklyDayFemaleCount = 0, weeklyNightMaleCount = 0 , weeklyNightFemaleCount = 0;

    if(todaysEmployees) {

    Object.keys(todaysEmployees).forEach(employeeId => {
        if(employeeId.charAt(0) === 'D') {
          dailyLabourCount += 1;
          if(todaysEmployees[employeeId]['in'] && todaysEmployees[employeeId]['in'].includes("AM")) {
            if(employeeId.charAt(1) === 'M') {
              dailyDayMaleCount += 1;
            }else if(employeeId.charAt(1) === 'F') {
              dailyDayFemaleCount += 1;
            }
          }else {
            if(employeeId.charAt(1) === 'M') {
              dailyNightMaleCount += 1;
            }else if(employeeId.charAt(1) === 'F') {
              dailyNightFemaleCount += 1;
            }
          }

        }else if(employeeId.charAt(0) === 'W') {
          weeklyLabourCount += 1;
          if(todaysEmployees[employeeId]['in'] && todaysEmployees[employeeId]['in'].includes("AM")) {
            if(employeeId.charAt(1) === 'M') {
              weeklyDayMaleCount += 1;
            }else if(employeeId.charAt(1) === 'F') {
              weeklyDayFemaleCount += 1;
            }
          }else {
            if(employeeId.charAt(1) === 'M') {
              weeklyNightMaleCount += 1;
            }else if(employeeId.charAt(1) === 'F') {
              weeklyNightFemaleCount += 1;
            }
          }
        }
      })
    }

      return (<div>
        <Heading>Total Visitor count = {totalVisitorCount}</Heading>
        <Heading>Visitor Departed count = {departedCount}</Heading>
        <Heading>Visitor Entered count = {enteredCount}</Heading>
        <Heading>Daily labour count = {dailyLabourCount}</Heading>
        <Heading>Daily labour day shift male count = {dailyDayMaleCount}</Heading>
        <Heading>Daily labour day shift female count = {dailyDayFemaleCount}</Heading>
        <Heading>Daily labour night shift male count = {dailyNightMaleCount}</Heading>
        <Heading>Daily labour night shift female count = {dailyNightFemaleCount}</Heading>

        <Heading>Weekly labour count = {weeklyLabourCount}</Heading>
        <Heading>Weekly labour day shift male count = {weeklyDayMaleCount}</Heading>
        <Heading>Weekly labour day shift female count = {weeklyDayFemaleCount}</Heading>
        <Heading>Weekly labour night shift male count = {weeklyNightMaleCount}</Heading>
        <Heading>Weekly labour night shift female count = {weeklyNightFemaleCount}</Heading>


        </div> )
  }

}
