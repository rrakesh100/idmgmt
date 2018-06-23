import React, { Component } from 'react';
import Search from 'grommet/components/Search';
import { getVisitors, getVisitor } from '../api/visitors';
import Article from 'grommet/components/Article';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import VIcon from 'grommet/components/icons/base/DocumentUser';
import Moment from 'moment';
import Button from 'grommet/components/Button';
import Visitor from './VisitorOutComponent';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';

import NavControl from '../components/NavControl';

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
        let suggests = [];
        Object.keys(data).forEach((visitor) => {
          suggests.push({
             label : data[visitor].name,
             visitorId : visitor
          })
        })
        this.setState({
          visitorSuggestions: suggests,
          filteredSuggestions : suggests
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
        selectedVisitorId: data.suggestion.visitorId,
        visitorSearchString: data.suggestion.label
      }, this.fetchSearchedVisitor.bind(this));
    } else {
      this.setState({
        selectedVisitorId: data.target.value,
        visitorSearchString: data.suggestion
      }, this.fetchSearchedVisitor.bind(this));
    }
  }

  onSearchEntry(e) {
    let filtered = [];
    let  options  = this.state.visitorSuggestions;

    if(e.target.value == '')
      filtered = options
    else {
      options.forEach((opt) => {
        if(opt.label.toUpperCase().startsWith(e.target.value.toUpperCase()))
          filtered.push(opt)
        if(opt.visitorId.startsWith(e.target.value))
          filtered.push(opt)
      })
    }

    this.setState({
      visitorSearchString: e.target.value,
      filteredSuggestions : filtered
    });
  }

  renderVisitorSearch() {
    return (
      <div style={{marginTop : '40px', marginLeft :'30px', width: '800px'}}>
      <Search placeHolder='Search visitor By Name or Barcode' style={{width:'800px'}}
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.filteredSuggestions}
        value={this.state.visitorSearchString}
        onSelect={this.onVisitorSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
      </div>
    )
  }

  onVisitorButtonClick(selectedVisitorId) {
    this.setState({
      visitorBtnClick: true
    })
  }


  renderSearchedVisitor() {
    const { selectedVisitorData, selectedVisitorId } = this.state;
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


  renderVisitorDetail() {
    const { visitorBtnClick, selectedVisitorId, selectedVisitorData } = this.state;
    return visitorBtnClick ?   <Visitor visitorData={selectedVisitorData} visitorId={selectedVisitorId} /> : null
  }

  render() {
    return (
      <Article primary={true} className='visitors'>
      { this.renderVisitorSearch() }
      { this.renderSearchedVisitor() }
      { this.renderVisitorDetail() }
      </Article>
    )
  }
}

export default VisitorOut
