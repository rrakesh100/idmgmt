import React from 'react';

const AbstractVehicleReports = ({response, datesArr}) => {
  let rDate=datesArr&&datesArr[0];
  let tablesArray=[];
  let vObj;
  let inwardOwnEmpty=0;
  let inwardOwnLoad=0;
  let inwardOutEmpty=0;
  let inwardOutLoad=0;
  let outwardOwnEmpty=0;
  let outwardOwnLoad=0;
  let outwardOutEmpty=0;
  let outwardOutLoad=0;

  Object.keys(response).map((vNo, index) => {
    const vehicleObj = response[vNo];
    vObj=rDate&&vehicleObj[rDate];
    console.log(vObj);
      if(!vObj)
      return null;
      console.log(vObj);

  })
    return (
      <div>
        <h1>Abstract vehicle report</h1>
        <table className="vehicleReportsTable" style={{ marginLeft : 20, marginTop:10}}>
          <thead className="vehiclesTableHead" style={{position: 'relative', backgroundColor: '#F5F5F5'}}>
           <tr>
             <th colSpan={1}></th>
             <th colSpan={3}>Own Vehicle</th>
             <th colSpan={3}>Out Vehicle</th>
           </tr>
           <tr>
             <th>Inward</th>
             <th>Empty</th>
             <th>Load</th>
             <th>Total</th>
             <th>Empty</th>
             <th>Load</th>
             <th>Total</th>
           </tr>
          </thead>
        </table>
      </div>
    )
}

export default AbstractVehicleReports;
