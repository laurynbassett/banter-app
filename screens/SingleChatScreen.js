import React, { Component } from "react";

import { SingleChat } from "../components";
import Layout from "../constants/Layout";

export default class SingleChatScreen extends Component {
  static navigationOptions = {
    header: "Home",
  };

  render() {
    return (
      <SingleChat navigation={this.props.navigation} route={this.props.route} />
    );
  }
}
