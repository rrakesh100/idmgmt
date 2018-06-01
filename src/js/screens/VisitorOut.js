import React, { Component } from 'react';
import Search from 'grommet/components/Search';
import { getVisitors, getVisitor } from '../api/visitors';
import Article from 'grommet/components/Article';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import VIcon from 'grommet/components/icons/base/DocumentUser';
import Moment from 'moment';
import Button from 'grommet/components/Button';
import Visitor from './Visitor';

class VisitorOut extends Component {
  constructor(props) {
    super(props);
    this.state= {
      visitorBtnClick : false
    }
  }

  componentDidMount() {
    getVisitors()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        this.setState({
          visitorSuggestions: [...Object.keys(data)]
        });
      })
      .catch((err) => {
        console.error('VISITOR FETCH FAILED', err);
      });
  }

  fetchSearchedVisitor() {
    const { selectedVisitorId } = this.state;
    if (selectedVisitorId) {
      getVisitor(selectedVisitorId)
        .then((snap) => {
          const selectedVisitorData = snap.val();
          this.setState({
            selectedVisitorData
          });
        })
        .catch((err) => {
          console.error('UNABLE TO FETCH SEARCHED USER', err);
        });
    }
  }

  onVisitorSelect(data, isSuggestionSelected) {
    if(isSuggestionSelected) {
      this.setState({
        selectedVisitorId: data.suggestion,
        visitorSearchString: data.suggestion
      }, this.fetchSearchedVisitor.bind(this));
    } else {
      this.setState({
        selectedVisitorId: data.target.value,
        visitorSearchString: data.suggestion
      }, this.fetchSearchedVisitor.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({
      visitorSearchString: e.target.value
    });
  }

  renderVisitorSearch() {
    return (
      <Search placeHolder='Search visitor By Barcode'
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.visitorSuggestions}
        value={this.state.visitorSearchString}
        onSelect={this.onVisitorSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
    )
  }

  onVisitorButtonClick(selectedVisitorId) {
    this.setState({
      visitorBtnClick: true
    })
  }

  renderSearchedVisitor() {
    const { selectedVisitorData, selectedVisitorId } = this.state;

    console.log(selectedVisitorData)
    if (selectedVisitorData) {
      const { timestamp } = selectedVisitorData;
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();

      return (
        <List>
          <ListItem justify='between'
            separator='horizontal'>
            <span>
              <Button icon={<VIcon />}
                label={selectedVisitorId}
                onClick={this.onVisitorButtonClick.bind(this, selectedVisitorId)}
                primary={true} />
            </span>
            <span>
              {selectedVisitorData.name}
            </span>
            <span>
              entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong>
            </span>
          </ListItem>
        </List>
      );
    }
    return (
      selectedVisitorId ? 
      <List>
        <ListItem justify='between'
          separator='horizontal'>
          <span>
             'No such visitor in the records!'
          </span>
        </ListItem>
      </List> : null
    );
  }

  renderVisitorNameSearch() {
    // return (
    //   <Search placeHolder='Search visitor By Name'
    //     inline={true}
    //     iconAlign='start'
    //     size='small'
    //     suggestions={this.state.visitorSuggestions}
    //     value={this.state.visitorSearchString}
    //     onSelect={this.onVisitorSelect.bind(this)}
    //     onDOMChange={this.onSearchEntry.bind(this)} />
    // )
  }
  
  
  renderVisitorDetail() {
    const { visitorBtnClick, selectedVisitorId, selectedVisitorData } = this.state;
    return visitorBtnClick ?   <Visitor visitorData={selectedVisitorData} visitorId={selectedVisitorId} /> : null
  }

  render() {
  
    return (
      <Article primary={true} className='visitors'>
      { this.renderVisitorSearch() }
      { this.renderVisitorNameSearch() }
      { this.renderSearchedVisitor() }
      { this.renderVisitorDetail() }
      </Article>
    )
  }
}

export default VisitorOut
