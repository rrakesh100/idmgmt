import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Moment from 'moment';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import Employee from 'grommet/components/icons/base/DocumentUser';
import Button from 'grommet/components/Button';
import Search from 'grommet/components/Search';
import AddIcon from 'grommet/components/icons/base/Add';


import { getMessage } from 'grommet/utils/Intl';
import { getEmployees, getEmployee } from '../api/employees';

import NavControl from '../components/NavControl';

import { pageLoaded } from './utils';

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getEmployees()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        this.setState({
          employeeSuggestions: [...Object.keys(data)]
        });
      })
      .catch((err) => {
        console.error('VISITOR FETCH FAILED', err);
      });
  }


  onEmployeeSelect(data, isSuggestionSelected) {
    if(isSuggestionSelected) {
      this.setState({
        selectedEmployeeId: data.suggestion,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this));
    } else {
      this.setState({
        selectedEmployeeId: data.target.value,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({
      employeeSearchString: e.target.value
    });
  }

  renderEmployeeSearch() {
    return (
      <Search placeHolder='Search employee'
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.employeeSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
    )
  }

  fetchSearchedEmployee() {
    const { selectedEmployeeId } = this.state;
    if (selectedEmployeeId) {
      getEmployee(selectedEmployeeId)
        .then((snap) => {
          const selectedEmployeeData = snap.val();
          this.setState({
            selectedEmployeeData
          });
        })
        .catch((err) => {
          console.error('UNABLE TO FETCH SEARCHED USER', err);
        });
    }
  }

  renderSearchedEmployee() {
    const { selectedEmployeeData, selectedEmployeeId } = this.state;

    if (selectedEmployeeData) {
      const { timestamp } = selectedEmployeeData;
      const m = Moment(timestamp);
      const timestampStr = m.format('DD/MM/YYYY hh:mm:ss A');
      const timeRelativeStr = m.fromNow();

      return (
        <List>
          <ListItem justify='between'
            separator='horizontal'>
            <span>
              <Button icon={<Employee />}
                label={selectedEmployeeId}
                href={`/employee/${selectedEmployeeId}`}
                primary={true} />
            </span>
            <span>
              {selectedEmployeeData.name}
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
            { selectedEmployeeId ? 'No such employee in the records!' : null }
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
      <Article primary={true} className='employees'>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
          <NavControl name={getMessage(intl, 'Employees')} />
        </Header>
        {errorNode}
        <Box pad={{ horizontal: 'medium' }}>
          <Paragraph size='large'>
            <Button icon={<AddIcon />}
              label='Add new Employee'
              href='/new/employee' />
          </Paragraph>
        </Box>
        { this.renderEmployeeSearch() }
        { this.renderSearchedEmployee() }
      </Article>
    );
  }
}

Employees.defaultProps = {
  error: undefined,
  tasks: []
};

Employees.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  tasks: PropTypes.arrayOf(PropTypes.object)
};

Employees.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.tasks });

export default connect(select)(Employees);
