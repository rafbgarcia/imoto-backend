import "phoenix_html"

// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

import ReactDOM from 'react-dom';
import React from 'react';


class App extends React.Component {
  render() {
    return (
      <div id="content">
        <h5>Time to <a href="https://facebook.github.io/react/">React</a>.</h5>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.querySelector('#app'));
});
