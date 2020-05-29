import React from 'react';
import TypewriterCore from '../core';
import isEqual from 'lodash/isEqual';

class Typewriter extends React.Component {

  constructor(props) {
    super(props);
    this.parseProps(this.props);
    this.state = {
      instance: null,
    };
  }

  parseProps() {
    const { strings, ...config } = this.props;
    this.strings = strings;
    this.config = config;
    return this;
  }

  async stop() {
    console.log("[DEBUG:stop] Trying to stop instance...", this.state);

    this.setState(async () => {
      if (this.state.instance)
        await this.state.instance.stop();
    });

    return this;
  }

  async refreshInstance() {

    console.log("[DEBUG:refreshInstance] Refreshing Typewriter...");
    await this.stop();
    
    this.parseProps(this.props).setState({
      instance: new TypewriterCore(
          this.typewriter,
          typeof this.strings == "string"
            ? JSON.parse(this.strings)
            : this.strings, 
          this.config
        )
    });
  }

  async componentDidMount() {
    console.log("[DEBUG:componentDidMount]");
    await this.refreshInstance();
  }

  async componentDidUpdate(prevProps) {
    console.log("[DEBUG:componentDidUpdate]");
    if(!isEqual(this.props, prevProps))
      await this.refreshInstance();
  }

  async componentWillUnmount() {
    console.log("DEBUG:componentWillUnmount");
    await this.stop();
  }

  render() {
    const config = this.props.config || {};
    return React.createElement(
      'div',
      {
        ref: (ref) => this.typewriter = ref,
        className: 'typewriter'
      }
    );
  }
}

export default Typewriter;