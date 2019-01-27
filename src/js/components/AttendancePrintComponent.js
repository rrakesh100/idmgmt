import React, { Component } from 'react';
import Image from 'grommet/components/Image';
import Barcode from 'react-barcode';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import moment from 'moment';


export default class AttendancePrintComponent extends Component {

  render() {
      const { inwardImage, selectedEmployeeData } = this.props;
      const { name, employeeId, paymentType, village, address, joinedDate, screenshot } = selectedEmployeeData;
      const date = new Date();
      const hours = date.getHours();
      let shiftVar;
      if( hours > 14) {
        shiftVar = 'Night Shift'
      } else {
        shiftVar = 'Day Shift'
      }
      let shift = shiftVar || this.props.shift;
      const dateStr = moment(date).format('DD-MM-YYYY') || this.props.dateVal;
      const timeStr = moment(date).format('h:mm A');
      return (
          <div className='card'>
            <div className='attendanceCardBody'>
              <div className='box header'>
                <h3 style={{textDecoration : 'underline'}}>Attendance In Card</h3>
              </div>
              <div className='box content'>
                <Image src={screenshot} style={{width:180, height:200}}/>
                <Image src={inwardImage} style={{width:180, height:200}}/>
              </div>
              <div className='box sidebar'>
              <Table>
                <tbody>
                  <TableRow>
                    <td>
                      Name: <b>{name}</b>
                    </td>
                    <td margin='xlarge'>
                      MCode: <b>{employeeId}</b>
                    </td>
                    </TableRow>
                    <TableRow>
                      <td>
                        In Date: <b>{dateStr}</b>
                      </td>
                      <td>
                        In Time: <b>{timeStr}</b>
                      </td>
                      </TableRow>
                    <TableRow>
                      <td>
                        Shift: <b>{shift}</b>
                      </td>
                      <td>
                        Village: <b>{village}</b>
                      </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          Address: <b>{address}</b>
                        </td>
                        <td>
                          Paymment Mode: <b>{paymentType}</b>
                        </td>
                    </TableRow>
                  </tbody>
                </Table>
                <div className='footer'>
                  <Barcode value={employeeId} height={20} />
                </div>
              </div>
            </div>
          </div>
      );
  }
}
