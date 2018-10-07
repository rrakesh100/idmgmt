import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';
import CloseIcon from 'grommet/components/icons/base/Close';
import Logo from 'grommet/components/icons/Grommet';
import Anchor from 'grommet/components/Anchor';

import SessionMenu from './SessionMenu';
import { navActivate } from '../actions/nav';

class NavSidebar extends Component {
  constructor() {
    super();
    this._onClose = this._onClose.bind(this);
  }

  _onClose() {
    this.props.dispatch(navActivate(false));
  }

  render() {
    const { nav: { items } } = this.props;
    const localStorage = window.localStorage;
    const email = localStorage.email;
    const unit = localStorage.unit || 'UNIT2';

    const links = items.map(page => (
      <Anchor key={page.label} path={page.path} label={page.label} />
    ));

    return (
      <Sidebar colorIndex='neutral-3' fixed={true} size="small">
        <Header size='large' justify='between' pad={{ horizontal: 'medium' }}>
          <Title onClick={this._onClose} a11yTitle='Close Menu'>
            <Logo />
            <span>Tracking system</span>
          </Title>
          <Button
            icon={<CloseIcon />}
            onClick={this._onClose}
            plain={true}
            a11yTitle='Close Menu'
          />
        </Header>
        <Menu fill={true} primary={true}>
          {links}
        </Menu>
        <span style={{fontSize: 10, marginLeft: 20}}>You Entered into <span style={{fontSize: 16, marginTop:4}}>{unit}</span></span>
        <span style={{fontSize: 10, marginLeft: 20, marginTop:4}}>Email : <span style={{fontSize: 16, marginTop:4}}>{email}</span></span>

        <Footer pad={{ horizontal: 'medium', vertical: 'small' }}>
          <SessionMenu dropAlign={{ bottom: 'bottom' }} />

        </Footer>
      </Sidebar>
    );
  }
}

NavSidebar.defaultProps = {
  nav: {
    active: true, // start with nav active
    enabled: true, // start with nav disabled
    responsive: 'multiple'
  }
};

NavSidebar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
      label: PropTypes.string
    }))
  })
};

const select = state => ({
  nav: state.nav
});

export default connect(select)(NavSidebar);
