import React, { Component } from 'react';
import Image from 'grommet/components/Image';
import Barcode from 'react-barcode';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import moment from 'moment';

export default class VehicleInPrintComponent extends Component {

  render() {
    const { screenshot,
            inwardSNo,
            ownOutVehicle,
            vehicleNumber,
            driverName,
            driverNumber,
            remarks, material, numberOfBags, comingFrom, billNumber, allVehiclesPrint, inDate, inTime, partyName } = this.props;
      const date = new Date();
      let dateStr, timeStr;
      if(allVehiclesPrint) {
        dateStr=inDate;
        timeStr=inTime;

      } else {
        dateStr = moment(date).format('DD-MM-YYYY');
        timeStr = moment(date).format('h:mm A');
      }
      const timestampStr = moment(date).format('DD/MM/YYYY hh:mm:ss A');

      return (
          <div className={allVehiclesPrint ? 'allVehicleCard' : 'vehicleCard'}>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
              <h4 style={{marginLeft: 20}}>copy:<strong>ORIGINAL</strong></h4>
              <h4 style={{position: 'absolute', right:20}}><strong>{!allVehiclesPrint ? timestampStr : null}</strong></h4>
            </div>
            <div className='vehicleCardBody'>
                <div className='box header'>
                  <h4 style={{textAlign:'center'}}><strong>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</strong></h4>
                  <h4 style={{textAlign:'center'}}><strong>Valuthimmapuram Road – Peddapuram – Unit2</strong></h4>
                  <h3 style={{textDecoration : 'underline', marginLeft:20}}>Vehicle Inward Gatepass</h3>
                </div>
              <div className='box sidebar'>
              <Table>
                <tbody>
                        <TableRow>
                          <td>
                            Inward No: <b>{inwardSNo}</b>
                          </td>
                          <td>
                            Material: <b>{material}</b>
                          </td>
                          </TableRow>
                        <TableRow>
                          <td>
                            In Date: <b>{dateStr}</b>
                          </td>
                          <td>
                            No of Bags: <b>{numberOfBags}</b>
                          </td>
                          </TableRow>
                        <TableRow>
                          <td>
                            In Time: <b>{timeStr}</b>
                          </td>
                          <td>
                            From: <b>{comingFrom}</b>
                          </td>
                          </TableRow>
                          <TableRow>
                            <td>
                              Own/Out: <b>{ownOutVehicle}</b>
                            </td>
                            <td>
                              Bill No: <b>{billNumber}</b>
                            </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            Vehicle No: <b>{vehicleNumber}</b>
                          </td>
                          <td>
                            Party Name: <b>{partyName}</b>
                          </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          Driver Name: <b>{driverName}</b>
                        </td>
                    </TableRow>
                    <TableRow>
                      <td>
                        Cell No: <b>{driverNumber}</b>
                      </td>
                  </TableRow>
                  <TableRow>
                    <td>
                      Remarks: <b>{remarks}</b>
                    </td>
                </TableRow>
                </tbody>
              </Table>
              <Table style={{marginTop : '20px'}}>
                <tbody>
                  <TableRow>
                    <td>
                      Operator Signature
                    </td>
                    <td>
                      Driver Signature
                    </td>
                    </TableRow>
                  </tbody>
              </Table>
              <div className='footer'>
                <Barcode value={inwardSNo} height={20} />
              </div>
              </div>
            </div>
          </div>
      );
  }
}
