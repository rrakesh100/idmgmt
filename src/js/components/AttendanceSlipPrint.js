import React from 'react';

export default class AttendanceSlipPrint extends React.Component {

  render() {
      return (
        <div className="attSlip">
          { this.props.attendanceSlipArr }
        </div>
      )
}

}
