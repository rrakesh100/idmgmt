import React, { Component, PropTypes } from 'react';
import Heading from 'grommet/components/Heading';
import { getVisitors } from '../api/visitors';
import { getTodaysEmployees } from '../api/employees';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';



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
          if(child.key === 'serialNo')
            return;
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

    <Table>
  <thead>
    <tr>
      <th>
      <Heading>VISITORS</Heading>
      </th>
      <th>
        Count
      </th>
    </tr>
  </thead>
  <tbody>
    <TableRow>
      <td>
        Total  count
      </td>
      <td>
        {totalVisitorCount}
      </td>
    </TableRow>
    <TableRow>
      <td>
         Inside count
      </td>
      <td>
        {enteredCount}
      </td>
    </TableRow>
    <TableRow>
      <td>
         Departed count
      </td>
      <td>
        {departedCount}
      </td>
    </TableRow>
  </tbody>
</Table>


<Table>
<thead>
<tr>
  <th>
  <Heading>DAILY LABOUR</Heading>
  </th>
  <th>
    Count
  </th>
</tr>
</thead>
<tbody>
<TableRow>
  <td>
    Total Count
  </td>
  <td>
    {dailyLabourCount}
  </td>
</TableRow>
<TableRow>
  <td>
    Day shift MALE count
  </td>
  <td>
    {dailyDayMaleCount}
  </td>
</TableRow>
<TableRow>
  <td>
    Day shift FEMALE count
  </td>
  <td>
    {dailyDayFemaleCount}
  </td>
</TableRow>
<TableRow>
  <td>
    Night shift MALE count
  </td>
  <td>
    {dailyNightMaleCount}
  </td>
</TableRow>
<TableRow>
  <td>
    Night shift FEMALE count
  </td>
  <td>
    {dailyNightFemaleCount}
  </td>
</TableRow>
</tbody>
</Table>

<Table>
<thead>
<tr>
  <th>
    <Heading>WEEKLY LABOUR</Heading>
  </th>
  <th>
    Count
  </th>
</tr>
</thead>

  <tbody>
  <TableRow>
    <td>
      Total Count
    </td>
    <td>
      {weeklyLabourCount}
    </td>
  </TableRow>
  <TableRow>
    <td>
      DAY shift MALE count
    </td>
    <td>
      {weeklyDayMaleCount}
    </td>
  </TableRow>
  <TableRow>
    <td>
    DAY shift FEMALE count
    </td>
    <td>
      {weeklyDayFemaleCount}
    </td>
  </TableRow>
    <TableRow>
      <td>
      NIGHT shift MALE count
      </td>
      <td>
        {weeklyNightMaleCount}
      </td>
    </TableRow>
    <TableRow>
      <td>
      NIGHT shift FEMALE count
      </td>
      <td>
        {weeklyNightFemaleCount}
      </td>
    </TableRow>
  </tbody>
  </Table>

        </div> )
  }

}
