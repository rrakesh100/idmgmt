import React from 'react';

class AbstractVehicleReports extends React.Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  renderAbstractReport() {
    const {response, datesArr}=this.props;

    let rDate=datesArr&&datesArr[0];
    let returnObj={};
    let inwardOwnEmpty=0;
    let inwardOwnLoad=0;
    let inwardOutEmpty=0;
    let inwardOutLoad=0;
    let outwardOwnEmpty=0;
    let outwardOwnLoad=0;
    let outwardOutEmpty=0;
    let outwardOutLoad=0;

    Object.keys(response).map((date, index) => {
      const vehicleDateObj = response[date];
        Object.keys(vehicleDateObj).map((vNo, indx) => {
          let allVehicleObj=vehicleDateObj[vNo];
          Object.keys(allVehicleObj).map(sNo => {
            let vObj=allVehicleObj[sNo];

              if(vObj.inSide && vObj.ownOutVehicle === 'Own Vehicle' && vObj.emptyLoad === 'Empty') {
                inwardOwnEmpty += 1;
              }
              if(vObj.inSide && vObj.ownOutVehicle === 'Own Vehicle' && vObj.emptyLoad === 'Load') {
                inwardOwnLoad += 1;
              }
              if(vObj.inSide && vObj.ownOutVehicle === 'Outside Vehicle' && vObj.emptyLoad === 'Empty') {
                inwardOutEmpty += 1;
              }
              if(vObj.inSide && vObj.ownOutVehicle === 'Outside Vehicle' && vObj.emptyLoad === 'Load') {
                inwardOutLoad += 1;
              }
              if(!vObj.inSide && vObj.ownOutVehicle === 'Own Vehicle' && vObj.emptyLoad === 'Empty') {
                outwardOwnEmpty += 1;
              }
              if(!vObj.inSide && vObj.ownOutVehicle === 'Own Vehicle' && vObj.emptyLoad === 'Load') {
                outwardOwnLoad += 1;
              }
              if(!vObj.inSide && vObj.ownOutVehicle === 'Outside Vehicle' && vObj.emptyLoad === 'Empty') {
                outwardOutEmpty += 1;
              }
              if(!vObj.inSide && vObj.ownOutVehicle === 'Outside Vehicle' && vObj.emptyLoad === 'Load') {
                outwardOutLoad += 1;
              }
          })
        })
    })

    returnObj['summary'] = {
      inwardOwnEmpty,
      inwardOwnLoad,
      inwardOutEmpty,
      inwardOutLoad,
      outwardOwnEmpty,
      outwardOwnLoad,
      outwardOutEmpty,
      outwardOutLoad
    }
    return returnObj;
  }

  render() {
    const abstractReportObj=this.renderAbstractReport();
    let objSummary=abstractReportObj['summary'];

    let inwardOwnEmpty=objSummary.inwardOwnEmpty;
    let inwardOwnLoad=objSummary.inwardOwnLoad;
    let inwardOutEmpty=objSummary.inwardOutEmpty;
    let inwardOutLoad=objSummary.inwardOutLoad;
    let outwardOwnEmpty=objSummary.outwardOwnEmpty;
    let outwardOwnLoad=objSummary.outwardOwnLoad;
    let outwardOutEmpty=objSummary.outwardOutEmpty;
    let outwardOutLoad=objSummary.outwardOutLoad;

    let inwardOwnTotal=inwardOwnEmpty+inwardOwnLoad;
    let inwardOutTotal=inwardOutEmpty+inwardOutLoad;
    let inwardTotal=inwardOwnTotal+inwardOutTotal;
    let outwardOwnTotal=outwardOwnEmpty+outwardOwnLoad;
    let outwardOutTotal=outwardOutEmpty+outwardOutLoad;
    let outwardTotal=outwardOwnTotal+outwardOutTotal;
    console.log(inwardOwnTotal);
    console.log(inwardOutTotal);
    console.log(inwardTotal);
    console.log(outwardTotal);

    return (
      <div>
        <h2 style={{textAlign: 'center'}}><strong>Abstract vehicle report</strong></h2>
        <table className="vehicleReportsTable" style={{ marginLeft : 20, marginTop:10}}>
          <thead className="vehiclesTableHead" style={{position: 'relative', backgroundColor: '#F5F5F5'}}>
           <tr>
             <th colSpan={1}></th>
             <th colSpan={3}>Own Vehicle</th>
             <th colSpan={3}>Out Vehicle</th>
           </tr>
           <tr>
             <th></th>
             <th>Empty</th>
             <th>Load</th>
             <th>Total</th>
             <th>Empty</th>
             <th>Load</th>
             <th>Total</th>
           </tr>
          </thead>
          <tbody>
              <tr>
                <th>Inward</th>
                <th>{inwardOwnEmpty}</th>
                <th>{inwardOwnLoad}</th>
                <th>{inwardOwnTotal}</th>
                <th>{inwardOutEmpty}</th>
                <th>{inwardOutLoad}</th>
                <th>{inwardOutTotal}</th>
              </tr>
              <tr>
                <th>Outward</th>
                <th>{outwardOwnEmpty}</th>
                <th>{outwardOwnLoad}</th>
                <th>{outwardOwnTotal}</th>
                <th>{outwardOutEmpty}</th>
                <th>{outwardOutLoad}</th>
                <th>{outwardOutTotal}</th>
              </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default AbstractVehicleReports;
