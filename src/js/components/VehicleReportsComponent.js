import React, {Component} from 'react';
import moment from 'moment';


export default class VehicleReportsComponent extends Component {

  renderVehicleReports() {
    const { response, reportType, ownOutVehicle, emptyLoad, startDate, endDate, datesArr, timeSlot, timeSlotSelected } = this.props;
    if(!response)
    return null;

    let tHead1, tHead2, tHead3, tHead4;
    let tRow1, tRow2, tRow3, tRow4;
    let i=0;
    let format = 'DD-MM-YYYY h:mm A';

    if(reportType == 'Outward') {
      tHead1='Outward Sno';
      tHead2='Inward Sno';
      tHead3='Coming From';
      tHead4='Going To';
    } else {
      tHead1='Inward Sno';
      tHead2='Outward Sno';
      tHead3='Going To';
      tHead4='Coming From';
    }

    let tablesArray=[];
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

        if(ownOutVehicle !== 'All Vehicles' && ownOutVehicle !== vObj.ownOutVehicle) {
          isValid=false;
        }
          if(emptyLoad !== 'All' && emptyLoad !== vObj.emptyLoad) {
            isValid=false;
          }

          if(reportType == 'Inside the Unit' && !vObj.inSide) {
            isValid=false;
          }

          if(reportType == 'In-Outward-Completed' && vObj.inSide) {
            isValid=false;
          }

          if(timeSlotSelected) {
            let vTime;
            if(reportType === 'Outward') {
              vTime=vObj.outTime;
            } else {
              vTime=vObj.inTime;
            }
            let time = moment(datesArr.filter(val => val == date)[0] + ' ' + vTime,format),
              beforeTime = moment(startDate + ' ' + '8:59 AM', format),
              afterTime = moment(endDate + ' ' + '9:01 AM', format);

            if (!time.isBetween(beforeTime, afterTime)) {
              isValid=false;
            }
          }

          if(reportType == 'Outward') {
            tRow1=vObj.outwardSNo;
            tRow2=vObj.inwardSNo;
            tRow3=vObj.comingFrom;
            tRow4=vObj.goingTo;
          } else {
            tRow1=vObj.inwardSNo;
            tRow2=vObj.outwardSNo;
            tRow3=vObj.goingTo;
            tRow4=vObj.comingFrom;
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
               <td rowSpan={2}>{tRow1}</td>
               <td rowSpan={2}>{vObj.ownOutVehicle}</td>
               <td rowSpan={2}>{vObj.vehicleNumber}</td>
               <td>{vObj.driverName}</td>
               <td>{slicedInDate}</td>
               <td>{slicedOutDate || '--'}</td>
               <td>{tRow2 || '--'}</td>
               <td rowSpan={2}>{totalTime}</td>
               <td>{vObj.material}</td>
               <td>{vObj.partyName}</td>
               <td>{vObj.billNumber}</td>
             </tr>
             <tr>
               <td>{vObj.driverNumber}</td>
               <td>{vObj.inTime}</td>
               <td>{vObj.outTime || '--'}</td>
               <td>{tRow3}</td>
               <td>{vObj.numberOfBags}</td>
               <td>{tRow4}</td>
               <td>{vObj.remarks}</td>
             </tr>
           </tbody>
         )
         }
       })
       })
     })
      return (
        <div className="vehicleReports">
          <div style={{marginTop:20}}>
            {
              reportType && startDate && endDate ?
              <h3 style={{textAlign: 'center'}}><strong>{reportType} Vehicle Details Report- Indate From {startDate} To {endDate}</strong></h3> :
              <h3 style={{textAlign: 'center'}}><strong>{reportType} Vehicle Details Reports</strong></h3>
            }
          </div>
           <table className="vehicleReportsTable" style={{ marginLeft : 4, marginTop:10}}>
             <thead className="vehiclesTableHead" style={{position: 'relative', backgroundColor: '#F5F5F5'}}>
              <tr>
                <th colSpan={4}>Out/Own Vehicles: {ownOutVehicle}</th>
                <th colSpan={4}>Empty/Load: {emptyLoad}</th>
                <th colSpan={4}>No of Vehicles: {tablesArray.length}</th>
              </tr>
              <tr>
                <th rowSpan={2}>S No.</th>
                <th rowSpan={2}>{tHead1}</th>
                <th rowSpan={2}>Out/Own Vehicle</th>
                <th rowSpan={2}>Vehicle No</th>
                <th>Driver Name</th>
                <th>In Date</th>
                <th>Out Date</th>
                <th>{tHead2}</th>
                <th rowSpan={2}>Duration</th>
                <th>Material</th>
                <th>Party</th>
                <th>Bill No</th>
              </tr>
              <tr>
                <th>Cell No</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>{tHead3}</th>
                <th>Bags</th>
                <th>{tHead4}</th>
                <th>Remarks</th>
              </tr>
             </thead>
              {tablesArray}
           </table>
       </div>
    )
  }

  render() {
    const { startDate, endDate } = this.props;

    return (
      <div>
        {this.renderVehicleReports()}
      </div>
    )
  }
}
