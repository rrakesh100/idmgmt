import React from 'react';
import { getOwnPlaces } from '../api/configuration';


class AbstractOnHandVehicleReports extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      ownPlaceOpt: []
    }
  }

  componentDidMount() {
    this.getOwnPlaceDetails();
  }

  getOwnPlaceDetails() {
    getOwnPlaces().then((snap) => {
      const options = snap.val();
      let ownPlaceOpt = [];
      Object.keys(options).forEach((opt) => {
        ownPlaceOpt.push(opt)
      })
      this.setState({ownPlaceOpt})
    }).catch((e) => console.log(e))
  }

  showAbstractOnHandVehicleReports() {
    const {datesArr, abstractOnhandResponse}=this.props;
    const {ownPlaceOpt}=this.state;
    console.log(ownPlaceOpt);
    if(!abstractOnhandResponse)
    return null;

    let rDate=datesArr&&datesArr[0];
    let tablesArray=[];
    let vObj;
    Object.keys(abstractOnhandResponse).map((vNo, index) => {
      const vehicleObj = abstractOnhandResponse[vNo];
        vObj=vehicleObj[rDate];
        if(!vObj)
        return null;
        
      })
      return (
        <div>
          {rDate ?
            <h3 style={{textAlign: 'center', marginTop:20}}>
            <strong>Onhand own vehicle Abstract Report as on {rDate}</strong>
          </h3> : null}
          <table className='vehicleAbstractReportsTable' style={{marginTop:10}}>
            <thead className='vehiclesTableHead' style={{position: 'relative', backgroundColor: '#F5F5F5'}}>
              <tr>
                <td>Own Location</td>
                <td>No of Vehicle</td>
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
        {this.showAbstractOnHandVehicleReports() }
      </div>
    )
  }
}

export default AbstractOnHandVehicleReports;
