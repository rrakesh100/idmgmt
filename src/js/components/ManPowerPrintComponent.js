import React, { Component } from 'react';
import Image from 'grommet/components/Image';
import Barcode from 'react-barcode';
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'

export default class ManPowerPrintComponent extends Component {

  render() {
    const { employeeId, name, gender, village, paymentType, numberOfPersons, screenshot, address } = this.props.printEmployeeObj;
    return (
      <div className='card' style={{width:'100%', height:'30%'}}>
        <div className='card-body' >
          <div className='box header'>
            <h5 style={{fontWeight: 'bold'}}>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</h5>
            <h5>Unit-2, Valuthimmapuram Road, Peddapuram</h5>
            <h5 style={{textDecoration : 'underline',fontWeight : 'bold', fontStyle: 'italic'}}>
            MANPOWER ID CARD
            </h5>
            </div>

            <div className='content'>
            <Table>
              <tbody>
                <TableRow>
                  <td>
                     <div style={{fontSize: 'large'}}>MPID:<b>{employeeId.toUpperCase()}</b></div>
                  </td>
                </TableRow>
                <TableRow>
                  <td>
                    <div style={{fontSize: 'large'}}>Name: <b>{name.toUpperCase()}</b></div>
                  </td>
                </TableRow>
                <TableRow>
                  <td>
                     <div style={{fontSize: 'large'}}>Gender: <b>{gender.toUpperCase()}</b></div>
                  </td>
                  <td>
                   <div style={{fontSize: 'large'}}>Village: <b>{village.toUpperCase()}</b></div>
                  </td>
                </TableRow>
                <TableRow>
                  <td>
                     <div style={{fontSize: 'large'}}>Address: <b>{address.toUpperCase()}</b></div>
                  </td>
                </TableRow>
                <TableRow>
                  <td>
                     <div style={{fontSize: 'large'}}>Payment Type: <b>{paymentType.toUpperCase()}</b></div>
                  </td>
                  <td>
                   <div style={{fontSize: 'large'}}>No Of Persons: <b>{numberOfPersons.toUpperCase()}</b></div>
                  </td>
                </TableRow>
                <TableRow>
                <td>
                </td>
                </TableRow>
                <TableRow>
                  <td>
                    <div style={{fontSize: 'large'}}>Authorised Signature</div>
                   </td>
                </TableRow>
             </tbody>
           </Table>
           </div>
           <div className='box sidebar'>
             <Image src={screenshot} />
             <Barcode value={employeeId} height={20}/>
           </div>
        </div>
       </div>
    )
  }
}
