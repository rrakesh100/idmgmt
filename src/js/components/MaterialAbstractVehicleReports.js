import React from 'react';


export default class MaterialAbstractVehicleReports extends React.Component {

  renderAbstractReport() {
    const {response, selectedDate}=this.props;
    console.log(response);
    let returnObj={};
    let inwardOwnEmpty=0;
    let inwardOwnLoad=0;
    let inwardOutEmpty=0;
    let inwardOutLoad=0;
    let outwardOwnEmpty=0;
    let outwardOwnLoad=0;
    let outwardOutEmpty=0;
    let outwardOutLoad=0;

    Object.keys(response).map((vNo, index) => {
      const sNoObj = response[vNo];
      Object.keys(sNoObj).map(sNo => {
        let vObj=sNoObj[sNo];
              console.log(vObj);
            })
    })

    returnObj['summary'] = {
      inwardOwnEmpty,
      inwardOwnLoad,
      inwardOutEmpty,
      inwardOutLoad,
      outwardOwnEmpty,
      outwardOwnLoad,
      outwardOutEmpty,
      outwardOutLoad
    }
    return returnObj;
  }

  render() {
    let renderAbstractReport=this.renderAbstractReport();
    console.log(renderAbstractReport);
    return (
      <div>
      <h1>hola</h1>
      </div>
    );
  }
}
