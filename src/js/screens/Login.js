import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Split from 'grommet/components/Split';
import Button from 'grommet/components/Button';
import Sidebar from 'grommet/components/Sidebar';
import LoginForm from 'grommet/components/LoginForm';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Logo from 'grommet/components/icons/Grommet';
import Select from 'grommet/components/Select';
import Layer from 'grommet/components/Layer';
import { Container, Row, Col } from 'react-grid-system';
import { loginUser } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';
import Headline from 'grommet/components/Headline';
import Status from 'grommet/components/icons/Status';
import Label from 'grommet/components/Label';


class Login extends Component {
  constructor() {
    super();
    this.state={
      fUnit:'UNIT2',
      sUnit: 'UNIT2'
    };
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    pageLoaded('Login');
    this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    this.props.dispatch(navEnable(true));
  }

  onCloseLayer() {
    this.setState({
      fUnit: '',
      sUnit: ''
    })
  }

  onOkButtonClick() {
    this.setState({
      fUnit: '',
      sUnit: ''
    })
  }

  confirmDialog() {
    const { fUnit, sUnit } = this.state;

    if(fUnit && sUnit && fUnit!== sUnit) {
      return (
          <Layer onClose={this.onCloseLayer.bind(this)}>
          <Heading strong={true}
            uppercase={false}
            truncate={false}
            margin='small'
            align='center'>
          <Status value='critical'
          size='medium'
          style={{marginRight:'10px'}} />
          Mismatch!
          </Heading>
           <hr />
           <h3>Please Select Again</h3>

           <Row>
           <Button
             label='OK'
             onClick={this.onOkButtonClick.bind(this)}
             href='#' style={{marginLeft: '300px', marginBottom:'10px'}}
             primary={true} />
           </Row>
          </Layer>
      )
    } else {
      return
    }
  }

  onFieldChange(fieldName, e) {

      this.setState({
        [fieldName]: e.option
      })
  }

  _onSubmit(fields) {
    const { dispatch } = this.props;
    const { router } = this.context;
    const { fUnit, sUnit } = this.state;

    if(fUnit && sUnit) {
      loginUser(fields.username, fields.password, fUnit).then((payload) => {
            if(!payload.errorCode) {
              try {
                const localStorage = window.localStorage;
                localStorage.email = payload.email;
                localStorage.name = payload.displayName;
                localStorage.token = payload.uid;
                if(fUnit == 'UNIT2' && sUnit == 'UNIT2') {
                  localStorage.unit='';
                } else {
                  localStorage.unit=fUnit;
                }
              } catch (e) {
                alert(
                  'Unable to preserve session, probably due to being in private ' +
                  'browsing mode.'
                );
              }
                router.history.push('/vehicles')
            }else {
              alert("Invalid username / password");
            }

      }
      ).catch((e) => {
        console.log("error occured while logging in")
      });
    } else {
      alert('Please select unit');
      return (
          <Layer>
          <Heading strong={true}
            uppercase={false}
            truncate={false}
            margin='small'
            align='center'>
          <Status value='critical'
          size='medium'
          style={{marginRight:'10px'}} />
          Alert!
          </Heading>
           <hr />
           <h3>Please Select Unit</h3>

           <Row>
           <Button
             label='OK'
             onClick={this.onOkButtonClick.bind(this)}
             href='#' style={{marginLeft: '300px', marginBottom:'10px'}}
             primary={true} />
           </Row>
          </Layer>
      )
    }
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
            align='center' size="full"
          >
          <Headline strong={true} className="loginHeadline"
              size='medium'>
              SpotMe
          </Headline>
          <Heading uppercase={false} className="loginHeading">
              Best way to track the movement of visitors, items and vehicles using images.
          </Heading>
          </Section>
        </Article>
        <Sidebar justify='between' align='center' pad='none' size='large' full={true}>
          <span />
          <Select style={{width: 420}}
          options={['UNIT1', 'UNIT2', 'UNIT3', 'UNIT4']}
          placeHolder='UNIT'
          value={this.state.fUnit}
          onChange={this.onFieldChange.bind(this, 'fUnit')}
          />
          <Select style={{width: 420}}
          options={['UNIT1', 'UNIT2', 'UNIT3', 'UNIT4']}
          placeHolder='UNIT'
          value={this.state.sUnit}
          onChange={this.onFieldChange.bind(this, 'sUnit')}
          />
          <LoginForm
            align='start'
            title='Sign in'
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
          { this.confirmDialog() }
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
