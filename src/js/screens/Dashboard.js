import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import '../scss/dashboard.scss';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import Value from 'grommet/components/Value';
import Meter from 'grommet/components/Meter';
import Spinning from 'grommet/components/icons/Spinning';
import Chart, {
  Axis, Grid, Area, Bar, Base, Layers, HotSpots
} from 'grommet/components/chart/Chart';
import Legend from 'grommet/components/Legend';
import { getMessage } from 'grommet/utils/Intl';

import NavControl from '../components/NavControl';
import {
  loadDashboard, unloadDashboard
} from '../actions/dashboard';

import { pageLoaded } from './utils';
import LiveVisitorZones from './LiveVisitorZones';

class Dashboard extends Component {
  componentDidMount() {
    pageLoaded('Dashboard');
    this.props.dispatch(loadDashboard());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadDashboard());
  }

  render() {
    const { error, tasks } = this.props;
    const { intl } = this.context;
    const arr1 = [70, 5, 20, 70, 60, 40, 100];
    let errorNode;
    let listNode;
    if (error) {
      errorNode = (
        <Notification
          status='critical'
          size='large'
          state={error.message}
          message='An unexpected error happened, please try again later'
        />
      );
    } else if (tasks.length === 0) {
      listNode = (
        <Box
          direction='row'
          responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}
        >
          <Spinning /><span>Loading...</span>
        </Box>
      );
    } else {
      const tasksNode = (tasks || []).map(task => (
        <ListItem
          key={`task_${task.id}`}
          justify='between'
        >
          <Label><Anchor path={`/tasks/${task.id}`} label={task.name} /></Label>
          <Box
            direction='row'
            responsive={false}
            pad={{ between: 'small' }}
          >
            <Value
              value={task.percentComplete}
              units='%'
              align='start'
              size='small'
            />
            <Meter value={task.percentComplete} />
          </Box>
        </ListItem>
      ));

      listNode = (
        <List>
          {tasksNode}
        </List>
      );
    }

    return (
      <div>
      <div>
      <Article primary={true}>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
          <NavControl />
        </Header>
        {errorNode}
        <Box pad='medium'>
          <Paragraph size='large'>
            Check <Anchor path='/visitors' label={'Visitors'} /> and <Anchor path='/items' label={'Items'} /> here.
          </Paragraph>
        </Box>
        <LiveVisitorZones />

      </Article>
      </div>
  <div className='charts'>
    <div className='barchart1' style={{float:'left'}}>
    <Chart full={false}>
      <Axis count={5} ticks={true}
      labels={[{"index": 2, "label": "50"}, {"index": 4, "label": "100"}]}
      vertical={true} />
      <Chart full={false}
      vertical={true}>
      <Base width='medium' height='small'/>
      <Layers>
       <Bar values={arr1} colorIndex='graph-1'
        points={true} />
       <Grid rows={5} columns={3}/>
       <HotSpots count={7} />
      </Layers>
      <Axis count={7} ticks={true}
      labels={[
        {"index": 0, "label": "Mill-1"},
        {"index": 1, "label": "Mill-2"},
        {"index": 2, "label": "Mill-3"},
        {"index": 3, "label": "Mill-4"},
        {"index": 4, "label": "Mill-5"},
        {"index": 5, "label": "Mill-6"},
        {"index": 6, "label": "Mill-7"}
      ]} />
     </Chart>
   </Chart>
  </div>
  <div className='barchart2' style={{float:'right'}}>
    <Chart full={false}>
     <Axis count={5} ticks={true}
     labels={[{"index": 2, "label": "50"}, {"index": 4, "label": "100"}]}
     vertical={true} />
     <Chart full={false}
     vertical={true}>
       <Base width='medium' height='small'/>
      <Layers>
       <Bar values={arr1} colorIndex='graph-1'
        points={true} />
       <Grid rows={5} columns={3}/>
       <HotSpots count={7}/>
      </Layers>
      <Axis count={7} ticks={true}
      labels={[
        {"index": 0, "label": "Mill-1"},
        {"index": 1, "label": "Mill-2"},
        {"index": 2, "label": "Mill-3"},
        {"index": 3, "label": "Mill-4"},
        {"index": 4, "label": "Mill-5"},
        {"index": 5, "label": "Mill-6"},
        {"index": 6, "label": "Mill-7"}
      ]} />
    </Chart>
  </Chart>
  </div>
  <div className='barchart3' style={{float:'left'}}>
    <Chart full={false}>
     <Axis count={5} ticks={true}
     labels={[{"index": 2, "label": "50"}, {"index": 4, "label": "100"}]}
     vertical={true} />
     <Chart full={false}
     vertical={true}>
       <Base width='medium' height='small'/>
      <Layers>
       <Bar values={arr1} colorIndex='graph-1'
        points={true} />
       <Grid rows={5} columns={3}/>
       <HotSpots count={7}/>
      </Layers>
      <Axis count={7} ticks={true} tickAlign='end'
      labels={[
        {"index": 0, "label": "Mill-1"},
        {"index": 1, "label": "Mill-2"},
        {"index": 2, "label": "Mill-3"},
        {"index": 3, "label": "Mill-4"},
        {"index": 4, "label": "Mill-5"},
        {"index": 5, "label": "Mill-6"},
        {"index": 6, "label": "Mill-7"}
      ]} />
    </Chart>
  </Chart>
  </div>
  <div className='barchart4' style={{float:'right'}}>
    <Chart full={false}>
     <Axis count={5} ticks={true}
     labels={[{"index": 2, "label": "50"}, {"index": 4, "label": "100"}]}
     vertical={true} />
     <Chart full={false}
     vertical={true}>
       <Base width='medium' height='small'/>
      <Layers>
       <Bar values={arr1} colorIndex='graph-1'
        points={true} />
       <Grid rows={5} columns={3}/>
       <HotSpots count={7}/>
      </Layers>
      <Axis count={7} ticks={true}
      labels={[
        {"index": 0, "label": "Mill-1"},
        {"index": 1, "label": "Mill-2"},
        {"index": 2, "label": "Mill-3"},
        {"index": 3, "label": "Mill-4"},
        {"index": 4, "label": "Mill-5"},
        {"index": 5, "label": "Mill-6"},
        {"index": 6, "label": "Mill-7"}
      ]} />
    </Chart>
  </Chart>
  </div>
</div>
</div>
    );
  }
}

Dashboard.defaultProps = {
  error: undefined,
  tasks: []
};

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  tasks: PropTypes.arrayOf(PropTypes.object)
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default connect(select)(Dashboard);





// SHOW ALL non received items in the items pageLoaded
// In this month,
