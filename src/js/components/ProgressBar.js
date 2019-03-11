import React from 'react';

const Filler = (props) => {
  return (
    <div className='filler' />
  )
}

const ProgressBar = (props) => {
  return (
    <div className='progressBar'>
     <Filler percentage={props.percentage}/>
    </div>
  )
}

export default ProgressBar;
