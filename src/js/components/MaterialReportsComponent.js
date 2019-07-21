import React from 'react';
import moment from 'moment';


class MaterialReportsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      response: props.response
    };
  }

  renderMaterialReportsTable() {
    const { response, reportType, transactionType, startDate, endDate, datesArr, materialStatus } = this.props;
    if(!response)
    return null;

    let tHead1, tHead2, tHead3, tHead4, tHead5, tHead6;
    let tRow1, tRow2, tRow3, tRow4, tRow5, tRow6;
    let i=0;
    let format = 'DD-MM-YYYY h:mm A';

    if(reportType == 'Outward') {
      tHead1='Outward Sno';
      tHead2='Inward Sno';
      tHead3='Out Date';
      tHead4='Out Time';
      tHead5='In Date';
      tHead6='In Time';
    } else {
      tHead1='Inward Sno';
      tHead2='Outward Sno';
      tHead3='In Date';
      tHead4='In Time';
      tHead5='Out Date';
      tHead6='Out Time';
    }

    let tablesArray=[];
    let materialsArray=[];
    let materialObj;
    Object.keys(response).map((date, index) => {
      if(datesArr) {
        let datesFilterArr = datesArr.filter(val => val == date);
        let filteredDate = datesFilterArr[0];
        materialObj=response[filteredDate];
      } else {
        materialObj=response[date];
      }
      if(!materialObj)
      return null;
      Object.keys(materialObj).map((sNo, indx) => {
        let mObj=materialObj[sNo];
        if(!mObj)
        return null;

        let isValid=true;
        let inTime=mObj.inTime;
        let outTime=mObj.outTime;
        let totalNumberOfdays=0;
        let totalTime='N/A';

        if(outTime && inTime) {
          totalNumberOfdays++;
          let startTime = moment(inTime, "HH:mm a");
          let endTime=moment(outTime, "HH:mm a");
          let duration;
          if(reportType === "Outward"){
              duration = moment.duration(startTime.diff(endTime));
          } else if(reportType === "Inward"){
              duration = moment.duration(endTime.diff(startTime));
          }
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

          if(reportType == 'Outward') {
            tRow1=mObj.outwardSNo;
            tRow2=mObj.inwardSNo;
          } else {
            tRow1=mObj.inwardSNo;
            tRow2=mObj.outwardSNo;
          }
          let mInDate=mObj.inDate;
          let mOutDate=mObj.outDate;
          let slicedInDate,slicedOutDate;
          if(mInDate) {
            slicedInDate=mInDate.slice(0,6) + mInDate.slice(8,10);
          }
          if(mOutDate) {
            slicedOutDate=mOutDate.slice(0,6) + mOutDate.slice(8,10);
          }

          if(mObj.retNonret!=='Returnable' && transactionType==='Returnable') {
            isValid=false;
          }

          if(mObj.retNonret!=='Non-Returnable' && transactionType==='Non-Returnable') {
            isValid=false;
          }

          if(materialStatus==='Returned' && mObj.returnable===true) {
            isValid=false;
          }

          if(materialStatus==='Pending' && mObj.returnable===false) {
            isValid=false;
          }

          if(reportType == 'Outward') {
            tRow3=slicedOutDate;
            tRow4=mObj.outTime;
            tRow5=slicedInDate;
            tRow6=mObj.inTime;
          } else {
            tRow3=slicedInDate;
            tRow4=mObj.inTime;
            tRow5=slicedOutDate;
            tRow6=mObj.outTime;
          }

          if(isValid) {
            i++;
          tablesArray.push(
            <tbody key={tRow1} style={mObj.ownOutVehicle == 'Own Vehicle' ? {backgroundColor: '#9E9E9E'}: {backgroundColor: 'white'}}>
              <tr>
               <td rowSpan={2}>{i}</td>
               <td rowSpan={2}>{tRow1}</td>
               <td rowSpan={2}>{mObj.retNonret}</td>
               <td rowSpan={2}>{mObj.fromLocation}</td>
               <td>{tRow3}</td>
               <td>{tRow4}</td>
               <td>{mObj.material}</td>
               <td>{mObj.toLocation}</td>
               <td>{tRow5 || '--'}</td>
               <td>{tRow6 || '--'}</td>
               <td rowSpan={2}>{totalTime}</td>
               <td>{mObj.vehicleNum}</td>
               <td>{mObj.personName}</td>
               <td>{tRow2 || '--'}</td>
             </tr>
           </tbody>
         )
         }
       })
     })
      return (
          <div className="vehicleReports">
          <div style={{marginTop:20}}>
            {
              reportType && startDate && endDate ?
              <h3 style={{textAlign: 'center'}}><strong>Store Material Report- Indate From {startDate} To {endDate}</strong></h3> :
              <h3 style={{textAlign: 'center'}}><strong>Store Material Reports</strong></h3>
            }
          </div>
           <table className="vehicleReportsTable" style={{ marginLeft : 4, marginTop:10}}>
             <thead className="vehiclesTableHead" style={{position: 'relative', backgroundColor: '#F5F5F5'}}>
              <tr>
                <th colSpan={7}>Report Type: {reportType}</th>
                <th colSpan={8}>Transaction Type: {transactionType}</th>
              </tr>
              <tr>
                <th>S No.</th>
                <th>{tHead1}</th>
                <th>Ret/Non-ret</th>
                <th>From Location</th>
                <th>{tHead3}</th>
                <th>{tHead4}</th>
                <th>Material</th>
                <th>To Location</th>
                <th>{tHead5}</th>
                <th>{tHead6}</th>
                <th>Duration</th>
                <th>Vehicle Number</th>
                <th>Person Name</th>
                <th>{tHead2}</th>
              </tr>
             </thead>
              {tablesArray}
           </table>
       </div>
    )  }

  render() {
    return (
      <div>
        {this.renderMaterialReportsTable()}
      </div>
    )
  }
}

export default MaterialReportsComponent;
