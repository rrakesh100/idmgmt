import React from 'react';
import moment from 'moment';


export default class MaterialwiseReportsComponent extends React.Component {

  renderMaterialwiseReports() {
    const { showReports, response, materialType, location, startDate, endDate } = this.props;

    if(!showReports || !response)
    return null;

    let tablesArray=[];
    let vehiclesArray=[];
    let vehicleDateObj;
    Object.keys(response).map((date, index) => {
      if(datesArr) {
        let datesFilterArr = datesArr.filter(val => val == date);
        let filteredDate = datesFilterArr[0];
        vehicleDateObj=response[filteredDate];
      } else {
        vehicleDateObj=response[date];
      }
      if(!vehicleDateObj)
      return null;
      Object.keys(vehicleDateObj).map((vNo, indx) => {
        let allVehicleObj=vehicleDateObj[vNo];
        Object.keys(allVehicleObj).map(sNo => {
          let vObj=allVehicleObj[sNo];
        if(!vObj)
        return null;

        let isValid=true;
        let inTime=vObj.inTime;
        let outTime=vObj.outTime;
        let totalNumberOfdays=0;
        let totalTime='N/A';

        if(outTime && inTime) {
          totalNumberOfdays++;
          let startTime = moment(inTime, "HH:mm a");
          let endTime=moment(outTime, "HH:mm a");
          let duration = moment.duration(endTime.diff(startTime));

          let hours = 0, minutes =0;
          if(duration.asMilliseconds() < 0) {
           let dMillis = duration.asMilliseconds();
           let bufferedMillis = dMillis + (24 * 60 * 60 * 1000);
           let bufferedSeconds = bufferedMillis / 1000;
            hours = Math.floor(bufferedSeconds / 3600);
           let remainingSeconds = bufferedSeconds % 3600;
            minutes = remainingSeconds / 60;
           }else {
            hours = parseInt(duration.asHours());
            minutes = parseInt(duration.asMinutes())%60;
           }
           totalTime = hours + ' hr ' + minutes + ' min ';
        }

          let vInDate=vObj.inDate;
          let vOutDate=vObj.outDate;
          let slicedInDate,slicedOutDate;
          if(vInDate) {
            slicedInDate=vInDate.slice(0,6) + vInDate.slice(8,10);
          }
          if(vOutDate) {
            slicedOutDate=vOutDate.slice(0,6) + vOutDate.slice(8,10);
          }

          if(isValid) {
            i++;
          tablesArray.push(
            <tbody key={index} style={vObj.ownOutVehicle == 'Own Vehicle' ? {backgroundColor: '#9E9E9E'}: {backgroundColor: 'white'}}>
              <tr>
               <td rowSpan={2}>{i}</td>
               <td rowSpan={2}>{vObj.inwardSNo}</td>
               <td rowSpan={2}>{vObj.ownOutVehicle}</td>
               <td rowSpan={2}>{vObj.vehicleNumber}</td>
               <td>{vObj.driverName}</td>
               <td>{slicedInDate}</td>
               <td>{slicedOutDate || '--'}</td>
               <td>{vObj.outwardSNo || '--'}</td>
               <td rowSpan={2}>{totalTime}</td>
               <td>{vObj.material}</td>
               <td>{vObj.partyName}</td>
               <td>{vObj.billNumber}</td>
             </tr>
             <tr>
               <td>{vObj.driverNumber}</td>
               <td>{vObj.inTime}</td>
               <td>{vObj.outTime || '--'}</td>
               <td>{vObj.goingTo}</td>
               <td>{vObj.numberOfBags}</td>
               <td>{vObj.comingFrom}</td>
               <td>{vObj.remarks}</td>
             </tr>
           </tbody>
         )
         vehiclesArray.push(vObj.vehicleNumber);
         }
       })
       })
     })
      return (
        <div className="vehicleReports">
          <div style={{marginTop:20}}>
            {
              startDate && endDate ?
              <h3 style={{textAlign: 'center'}}><strong>Materialwise Report- Indate From {startDate} To {endDate}</strong></h3> :
              <h3 style={{textAlign: 'center'}}><strong>Materialwise Reports</strong></h3>
            }
          </div>
           <table className="vehicleReportsTable" style={{ marginLeft : 4, marginTop:10}}>
             <thead className="vehiclesTableHead" style={{position: 'relative', backgroundColor: '#F5F5F5'}}>
              <tr>
                <th colSpan={4}>Out/Own Vehicles: {ownOutVehicle}</th>
                <th colSpan={4}>Empty/Load: {emptyLoad}</th>
                <th colSpan={4}>No of Vehicles: {[...new Set(vehiclesArray)].length}</th>
              </tr>
              <tr>
                <th rowSpan={2}>S No.</th>
                <th rowSpan={2}>Inward Sno</th>
                <th rowSpan={2}>Out/Own Vehicle</th>
                <th rowSpan={2}>Vehicle No</th>
                <th>Driver Name</th>
                <th>In Date</th>
                <th>Out Date</th>
                <th>Outward Sno</th>
                <th rowSpan={2}>Duration</th>
                <th>Material</th>
                <th>Party</th>
                <th>Bill No</th>
              </tr>
              <tr>
                <th>Cell No</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Going To</th>
                <th>Bags</th>
                <th>Coming From</th>
                <th>Remarks</th>
              </tr>
             </thead>
              {tablesArray}
           </table>
       </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderMaterialwiseReports()}
      </div>
    )
  }
}
