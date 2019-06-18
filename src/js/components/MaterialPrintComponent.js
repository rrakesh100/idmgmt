import React, { Component } from 'react';
import Image from 'grommet/components/Image';
import Barcode from 'react-barcode';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import moment from 'moment';

export default class MaterialPrintComponent extends Component {

  render() {
    const { screenshot,
            inwardSNo,
            outwardSNo,
            retNonret,
            fromLocation,
            toLocation,
            gatepassNumber,
            weighbillNumber,
            material,
            materialNumber,
            quantity,
            purpose,
            vehicleNum,
            mobileNumber,
            personName, inComponent } = this.props;
      const date = new Date();
      let dateStr = moment(date).format('DD-MM-YYYY');
      let timeStr = moment(date).format('h:mm A');
      const timestampStr = moment(date).format('DD/MM/YYYY hh:mm:ss A');

      return (
          <div className='vehicleCard'>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
              <h4 style={{position: 'absolute', right:20}}><strong>{timestampStr}</strong></h4>
            </div>
            <div className='vehicleCardBody'>
                <div className='box header'>
                  <h4 style={{textAlign:'center'}}><strong>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</strong></h4>
                  <h4 style={{textAlign:'center'}}><strong>Valuthimmapuram Road – Peddapuram – Unit2</strong></h4>
                  {inComponent ?
                  <h3 style={{textDecoration : 'underline', marginLeft:20}}>Material Inward Gatepass</h3>:
                <h3 style={{textDecoration : 'underline', marginLeft:20}}>Material Outward Gatepass</h3>}
                </div>
                <div className='box content'>
                  <Image src={screenshot} style={{width:300, height:300}}/>
                </div>
              <div className='box sidebar'>
              <Table>
                <tbody>
                        <TableRow>
                            {inComponent ?
                            <td>
                              Inward No: <b>{inwardSNo}</b>
                            </td> :
                            <td>
                              Outward No: <b>{outwardSNo}</b>
                           </td>
                          }
                          <td>
                            Material: <b>{material}</b>
                          </td>
                          </TableRow>
                        <TableRow>
                          {inComponent ?
                            <td>
                            In Date: <b>{dateStr}</b>
                          </td>:
                          <td>
                          Out Date: <b>{dateStr}</b>
                        </td> }
                          <td>
                            Material SNo: <b>{materialNumber}</b>
                          </td>
                          </TableRow>
                        <TableRow>
                        {inComponent ?
                          <td>
                            In Time: <b>{timeStr}</b>
                          </td>:
                          <td>
                          Out Time: <b>{timeStr}</b>
                        </td> }
                          <td>
                            quantity: <b>{quantity}</b>
                          </td>
                          </TableRow>
                          <TableRow>
                            <td>
                              From Location: <b>{fromLocation}</b>
                            </td>
                            <td>
                              Purpose: <b>{purpose}</b>
                            </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            To Location: <b>{toLocation}</b>
                          </td>
                          <td>
                            Vehicle Number: <b>{vehicleNum}</b>
                          </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          Gatepass Number: <b>{gatepassNumber}</b>
                        </td>
                        <td>
                          Person Name: <b>{personName}</b>
                        </td>
                    </TableRow>
                  <TableRow>
                    <td>
                      Weighbill Number: <b>{weighbillNumber}</b>
                    </td>
                    <td>
                      Mobile Number: <b>{mobileNumber}</b>
                    </td>
                </TableRow>
                <TableRow>
                  <td>
                    Ret/Non-ret: <b>{retNonret}</b>
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
                      Transporter Signature
                    </td>
                    </TableRow>
                  </tbody>
              </Table>
              <div className='footer'>
                <Barcode value={inwardSNo || outwardSNo} height={20} />
              </div>
              </div>
            </div>
          </div>
      );
  }
}
