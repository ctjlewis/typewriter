import React, { Component } from 'react';
import TypewriterCore from './../core';
import isEqual from 'lodash/isEqual';

class Typewriter extends Component {

  constructor(props) {
    super(props);
    const { strings, ...config } = this.props;
    this.strings = strings;
    this.config = config;
  }
  
  state = {
    instance: null,
  };

  stop() {
    if(this.instance) this.instance.stop();
    return this;
  }

  async refreshInstance() {

    console.log("Refreshing Typewriter...");
    this.typewriter.textContent = this.config.default || "";

    await this.stop();
    this.setState({
      instance: new TypewriterCore(
          this.typewriter,
          typeof this.strings == "string"
            ? JSON.parse(this.strings)
            : this.strings, 
          this.config
        )
    });
  }

  componentDidMount() {
    // console.log("componentDidMount");
    this.refreshInstance();
  }

  componentDidUpdate(prevProps) {
    // console.log("componentDidUpdate\n", this.props, prevProps);
    if(!isEqual(this.props, prevProps)) 
      this.refreshInstance();
  }

  componentWillUnmount() {
    // console.log("componentWillUnmount");
    this.stop();
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