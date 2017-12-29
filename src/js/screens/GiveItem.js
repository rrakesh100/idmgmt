import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import Barcode from 'react-barcode';
import Rand from 'random-key';

import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';

import Section from 'grommet/components/Section';
import Anchor from 'grommet/components/Anchor';
import Headline from 'grommet/components/Headline';
import Image from 'grommet/components/Image';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';




import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';

import Header from 'grommet/components/Header';
import ImageMapper from 'react-image-mapper';

// TO GET THE coords - use this awesome tool
// http://imagemap-generator.dariodomi.de/


class GiveItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLiveCameraFeed: true,
      itemId: Rand.generateBase30(8)
    };
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  capture() {
    if(this.state.showLiveCameraFeed) {
      const screenshot = this.webcam.getScreenshot();
      this.setState({
        screenshot,
        showLiveCameraFeed: false
      });
    } else {
      this.setState({
        showLiveCameraFeed: true
      });
    }
  }

  renderCamera() {
    return (
      <Box>
        { this.renderImage() }
      </Box>
    );
  }

  renderImage() {
    if(this.state.showLiveCameraFeed) {
      return (
        <Webcam
          audio={false}
          ref={this.setRef.bind(this)}
          screenshotFormat='image/jpeg'
          width={800}
          onClick={this.capture.bind(this)}
        />
      );
    }
    return (
      <Image src={this.state.screenshot}/>
    );
  }

  render() {
    return(
      <Article primary={true} full={true} className='giveItem'>
        <Header
          direction='row'
          size='large'
          colorIndex='light-2'
          align='center'
          responsive={true}
          pad={{ horizontal: 'small' }}
        >
          <Anchor path='/tasks'>
            <LinkPrevious a11yTitle='Back' />
          </Anchor>
          <Heading margin='none' strong={true}>
            GIVE AN ITEM
          </Heading>
        </Header>
        <Section pad='large'
          justify='center'
          align='center'>
          <Headline margin='none'>
            <Box onClick={this.capture.bind(this)} align='center'>
              {this.renderCamera() }
            </Box>
          </Headline>
        </Section>
        <Section pad='large'
          justify='center'
          align='center'>
          <Barcode value={this.state.itemId} />


          <Form>
            <FormFields>
            <FormField label='Item Name'>
              <TextInput />
            </FormField>
            <FormField label='Description'>
              <textarea className='itemTextArea'/>
            </FormField>
            </FormFields>
            <Footer pad={{"vertical": "medium"}}>
              <Button label='Submit'
                type='submit'
                primary={true}
                onClick={() => {}} />
            </Footer>
          </Form>
        </Section>
      </Article>
    )
  }

}

const item = state => ({ ...state.item });
export default connect(item)(GiveItem);
