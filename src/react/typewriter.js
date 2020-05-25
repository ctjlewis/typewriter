import React, { Component } from 'react';
import TypewriterCore from './../core';
import isEqual from 'lodash/isEqual';

class Typewriter extends Component {
  state = {
    instance: null,
  };

  refreshInstance() {
    const { strings, ...config } = this.props;
    this.setState({
      instance: new TypewriterCore(
          this.typewriter,
          strings, 
          config
        )
    });
  }

  componentDidMount() {
    this.refreshInstance();
  }

  componentDidUpdate(prevProps) {
    if(!isEqual(this.props, prevProps)) 
      this.refreshInstance();
  }

  componentWillUnmount() {
    if(this.state.instance) {
      this.state.instance.stop();
    }
  }

  render() {
    const config = this.props.config || {};
    return (
      <div
        ref={(ref) => this.typewriter = ref}
        className='typewriter'
        data-testid='typewriter-wrapper'
      >{config.default || ""}</div>
    );
  }
}

export default Typewriter;