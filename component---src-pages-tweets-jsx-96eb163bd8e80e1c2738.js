(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{B5xs:function(t,e,n){"use strict";n.r(e);n("OG14");var o=n("q1tI"),r=n.n(o),a=n("cr+I"),s=n.n(a),c=n("Dtc0"),i=n("taWO");var u=function(t){var e,n;function o(){return t.apply(this,arguments)||this}n=t,(e=o).prototype=Object.create(n.prototype),e.prototype.constructor=e,e.__proto__=n;var a=o.prototype;return a.getState=function(t){return{tweets:[],canLoadMore:!0,loadingTweets:!0,error:!1,demoActive:t.demoActive,user:s.a.parse(t.location.search).user,currentPage:0,count:0}},o.getDerivedStateFromProps=function(t,e){var n=s.a.parse(t.location.search).user;return n!==e.user||e.demoActive!==t.demoActive?{tweets:[],canLoadMore:!0,loadingTweets:!0,error:!1,demoActive:t.demoActive,user:n,currentPage:0,count:0}:null},a.componentDidUpdate=function(){this.state.canLoadMore&&0===this.state.count&&this.fetchTweets()},a.fetchTweets=function(){this.state.demoActive?this.demoTweets():this.generateTweets()},a.generateTweets=function(){var t=this;fetch("https://infinite-scroll-is-not-enough.herokuapp.com/generate/"+this.state.user,{method:"Get"}).then((function(t){return t.json()})).then((function(e){0===e.length&&t.setState({canLoadMore:!1,loadingTweets:!1,error:!0});for(var n=[],o=0;o<e.length;++o)n.push(r.a.createElement(i.a,{tweet:e[o],key:o+t.state.count}));t.setState({tweets:t.state.tweets.concat(n),loadingTweets:!1,count:t.state.count+e.length})})).catch((function(e){t.setState({canLoadMore:!1,loadingTweets:!1,error:!0})}))},a.demoTweets=function(){var t=this;fetch("https://infinite-scroll-is-not-enough.herokuapp.com/demo/"+this.state.user+"/"+this.state.currentPage,{method:"Get"}).then((function(t){return t.json()})).then((function(e){0===e.length&&t.setState({canLoadMore:!1,loadingTweets:!1,error:!0});for(var n=[],o=0;o<e.length;++o)n.push(r.a.createElement(i.a,{tweet:e[o],key:o+t.state.count}));t.setState({tweets:t.state.tweets.concat(n),loadingTweets:!1,currentPage:t.state.currentPage+1,count:t.state.count+e.length})})).catch((function(e){t.setState({canLoadMore:!1,loadingTweets:!1,error:!0})}))},o}(c.default);e.default=u}}]);
//# sourceMappingURL=component---src-pages-tweets-jsx-96eb163bd8e80e1c2738.js.map