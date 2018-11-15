import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';
import Moment from 'moment';


import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Paragraph from 'grommet/components/Paragraph';
import AddIcon from 'grommet/components/icons/base/Add';
import NavControl from '../components/NavControl';


import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import Headline from 'grommet/components/Headline';
import Image from 'grommet/components/Image';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Search from 'grommet/components/Search';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Item from 'grommet/components/icons/base/DocumentConfig';
import Header from 'grommet/components/Header';

import { getItems, getItem } from '../api/items';


class Items extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getItems()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        this.setState({
          itemSuggestions: [...Object.keys(data)]
        });
      })
      .catch((err) => {
        console.error('ITEM FETCH FAILED', err);
      });
  }


  onItemSelect(data, isSuggestionSelected) {
    if (isSuggestionSelected) {
      this.setState({
        selectedItemId: data.suggestion,
        itemSearchString: data.suggestion
      }, this.fetchSearchedItem.bind(this));
    } else {
      this.setState({
        selectedItemId: data.target.value,
        itemSearchString: data.suggestion
      }, this.fetchSearchedItem.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({
      itemSearchString: e.target.value
    });
  }

  fetchSearchedItem() {
    const { selectedItemId } = this.state;
    if (selectedItemId) {
      getItem(selectedItemId)
        .then((snap) => {
          const selectedItemData = snap.val();
          this.setState({
            selectedItemData
          });
        })
        .catch((err) => {
          console.error('UNABLE TO FETCH SEARCHED USER', err);
        });
    }
  }

  renderItemSearch() {
    return (
      <Search placeHolder='Search Item'
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.itemSuggestions}
        value={this.state.itemSearchString}
        onSelect={this.onItemSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
    )
  }

  renderSearchedItem() {
    const { selectedItemData, selectedItemId } = this.state;

    if (selectedItemData) {
      const { timestamp } = selectedItemData;
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();

      return (
        <List>
          <ListItem justify='between'
            separator='horizontal'>
            <span>
              <Button icon={<Item />}
                label={selectedItemId}
                href={`/item/${selectedItemId}`}
                primary={true} />
            </span>
            <span>
              {selectedItemData.name}
            </span>
            <span>
              entered <span className='emphasis'>{timeRelativeStr}</span> at <strong>{timestampStr}</strong>
            </span>
          </ListItem>
        </List>
      );
    }
    return (
      <List>
        <ListItem justify='between'
          separator='horizontal'>
          <span>
            { selectedItemId ? 'No such item in the records!' : null }
          </span>
        </ListItem>
      </List>
    );
  }

  render() {
    const { error, tasks } = this.props;
    const { intl } = this.context;

    let errorNode;
    if (error) {
      errorNode = (
        <Notification
          status='critical'
          size='large'
          state={error.message}
          message='An unexpected error happened, please try again later'
        />
      );
    }

    return (
      <Article primary={true} full={true} className='giveItem'>
        <Header
          direction='row'
          size='large'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}
        >


          <NavControl />

          <Heading margin='none' strong={true}>
            Items Tracking system
          </Heading>
        </Header>
        <Section>
        {errorNode}
        <Box pad={{ horizontal: 'medium' }}>
          <Paragraph size='large'>
            <Button icon={<AddIcon />}
              label='Add new Item'
              href='/new/item' />
          </Paragraph>
        </Box>
        { this.renderItemSearch() }
        { this.renderSearchedItem() }
        </Section>
      </Article>
    );
  }
}

const items = state => ({ ...state.items });
export default connect(items)(Items);
