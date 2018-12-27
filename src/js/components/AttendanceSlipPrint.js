import React from 'react';

export default class AttendanceSlipPrint extends React.Component {

  renderAttendanceSlipPrint() {
        const { attendanceSlipArr } = this.props;
        return attendanceSlipArr;
  }

  render() {
      return (
        <div className="attSlip">
          { this.renderAttendanceSlipPrint() }
        </div>
      )
}
}
