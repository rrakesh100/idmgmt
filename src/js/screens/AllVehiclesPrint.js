import React, {Component} from 'react';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Button from 'grommet/components/Button';
import PrintIcon from 'grommet/components/icons/base/Print';
import { getAllVehicles } from '../api/vehicles';


export default class AllVehiclesPrint extends Component {
  constructor(props) {
    super(props);
    this.state={
      vehicles: null
    }
  }

  componentDidMount() {
    getAllVehicles().then((snap) => {
      this.setState({
        vehicles: snap.val()
      })
    }).catch((err) => {
      console.error('ALL VEHICLES FETCH FAILED', err)
    })
  }

  onVehicleInPrint() {

  }

  onVehicleOutPrint() {

  }

  render() {
    const {vehicles} = this.state;
    if(!vehicles)
    return null;
    let i=0;
    return (
      <div>
      <div className='table'>
      <Table scrollable={true} style={{marginTop : '60px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Vehicle Number</th>
             <th>Vehicle In</th>
             <th>Vehicle Out</th>
           </tr>
          </thead>
          <tbody>
          {
            Object.keys(vehicles).map((vehicle, index) => {
              i++;

              if(vehicle !== 'U2') {
                const vehicleInwardItem = vehicles[vehicle]['lastInward'];
                console.log(vehicleInwardItem);
                const vehicleOutwadItem = vehicles[vehicle]['lastOutward'];
                console.log(vehicleOutwadItem);
                return <TableRow key={index}>
                <td>{i}</td>
                <td>{vehicle}</td>
                <td>
                   <Button icon={<PrintIcon />}
                         onClick={this.onVehicleInPrint.bind(this)}
                         plain={true} />
                </td>
                <td>
                   <Button icon={<PrintIcon />}
                         onClick={this.onVehicleOutPrint.bind(this)}
                         plain={true} />
                </td>
                </TableRow>
              }
            })
          }
          </tbody>
      </Table>
      </div>
      </div>
    )
  }
}
