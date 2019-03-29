import React, { Component } from 'react';
import Image from 'grommet/components/Image';
import Barcode from 'react-barcode';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

export default class VisitorPrintComponent extends Component {

  render() {
    const { name, visitorId, whomToMeet, purpose, comingFrom, mobile, remarks, timestampStr, department,company, screenshot, serialNo } = this.props;
    console.log(this.props);
      return (
          <div className='visitorCard'>
            <div className='card-body'>
              <div className='box header'>
                <h4>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</h4>
                <h4>Unit-II, Valuthimmapuram Road, Peddapuram</h4>
                <h4 style={{textDecoration : 'underline'}}>VISITOR PASS</h4>
              </div>
              <div className='box sidebar'>
                <Image src={screenshot} />
              </div>
              <div className='box content'>
              <Table>
                <tbody>
                  <TableRow>
                    <td>
                      <div style={{overflowWrap: 'break-word'}}>Name: <b>{name.toUpperCase()}</b></div>
                    </td>
                    <td>
                      From: <b>{comingFrom.toUpperCase()}</b>
                    </td>
                    </TableRow>
                    <TableRow>
                      <td>
                        To Meet: <b>{whomToMeet.toUpperCase()}</b>
                      </td>
                      <td>
                        Mobile: <b>{mobile.toUpperCase()}</b>
                      </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          Purpose: <b>{purpose.toUpperCase()}</b>
                        </td>
                        <td>
                          Department: <b>{department}</b>
                        </td>
                    </TableRow>
                    <TableRow>
                      <td>
                        Company: <b>{company.toUpperCase()}</b>
                      </td>
                      <td>
                        Remarks: <b>{remarks}</b>
                      </td>
                  </TableRow>
                  <TableRow style={{marginTop : '40px', color:'red'}}>
                    <td>
                      In Time: <b>{timestampStr}</b>
                    </td>
                    <td>
                      Serial No.#: <b>{serialNo}</b>
                    </td>
                </TableRow>
                  </tbody>
                </Table>
                  <Table style={{marginTop : '40px'}}>
                    <tbody>
                      <TableRow>
                        <td>
                          Operator Signature
                        </td>
                        <td>
                          Visitor Signature
                        </td>
                        <td>
                          Officer Signature
                        </td>
                        </TableRow>
                      </tbody>
                  </Table>
              </div>
              <div className='footer'>
                <Barcode value={visitorId} height={20} />
              </div>
            </div>
            </div>
      );
  }
}
