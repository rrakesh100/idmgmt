import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import LoginForm from 'grommet/components/LoginForm';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Logo from 'grommet/components/icons/Grommet';

import { loginUser } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';

class Login extends Component {
  constructor() {
    super();
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    pageLoaded('Login');
    this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    this.props.dispatch(navEnable(true));
  }

  _onSubmit(fields) {
    const { dispatch } = this.props;
    const { router } = this.context;
    loginUser(fields.username, fields.password).then((payload) => {
              console.log(payload);
          if(!payload.errorCode) {
            try {
              const localStorage = window.localStorage;
              localStorage.email = payload.email;
              localStorage.name = payload.displayName;
              localStorage.token = payload.uid;
            } catch (e) {
              alert(
                'Unable to preserve session, probably due to being in private ' +
                'browsing mode.'
              );
            }
              router.history.push('/visitors')
          }else {
            alert("Invalid username / password");
          }

    }
    ).catch((e) => {
      console.log("error occured while logging in")
    });
  }

  render() {
    const { session: { error } } = this.props;

    return (
      <Split flex='left' separator={true}>

        <Article>
          <Section
            full={true}
            colorIndex='brand'
            texture='url(img/splash.png)'
            pad='large'
            justify='center'
            align='center'
          >
            <Heading tag='h1' strong={true}>MRP Tracking System</Heading>
            <Paragraph align='center' size='large'>
              Best way to track visitors, items and vehicles using images.
            </Paragraph>
          </Section>
        </Article>

        <Sidebar justify='between' align='center' pad='none' size='large'>
          <span />
          <LoginForm
            align='start'
            logo={<Logo className='logo' colorIndex='brand' />}
            title='MRP Tracking System'
            onSubmit={this._onSubmit}
            errors={[error]}
            usernameType='email'
          />
          <Footer
            direction='row'
            size='small'
            pad={{ horizontal: 'medium', vertical: 'small' }}
          >
            <span className='secondary'>&copy; 2017 MRP Solutions</span>
          </Footer>
        </Sidebar>

      </Split>
    );
  }
}

Login.defaultProps = {
  session: {
    error: undefined
  }
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

Login.contextTypes = {
  router: PropTypes.object.isRequired,
};

const select = state => ({
  session: state.session
});

export default connect(select)(Login);
