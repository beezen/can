import 'commons/base';
import FastClick from 'fastclick';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import loadable from 'components/loadable';

/* eslint-disable */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowInnerHeight: window.innerHeight, // 获取当前窗口的高度
    };
  }
  componentDidMount() {
    // 300ms 延迟处理
    if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
      }, false);
    }
  }
  render() {
    return (
      <div style={{ "height": `${this.state.windowInnerHeight}px` }}>
        {
          this.props.children
        }
      </div>
    );
  }
}

ReactDOM.render(
  (<HashRouter>
    <App>
      {/* 路由配置 */}
      <Route path="/" exact component={loadable(() => import("entries/home"))} /> {/* 首页 */}
    </App>
  </HashRouter>),
  document.getElementById('app')
);
if (module.hot) {
  module.hot.accept();
}
