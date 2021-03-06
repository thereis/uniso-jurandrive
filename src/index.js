import React from "react";
import { render } from "react-dom";

/**
 * Dependencies
 */
import { observer } from "mobx-react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { firebase } from "./firebase";
import { AuthenticationStore } from "./modules/authentication/AuthenticationStore";

/**
 * Components
 */
import Login from "./modules/authentication/screens/Login";
import Home from "./modules/home/screens/Home";
import Register from "./modules/authentication/screens/Register";

import "./App.css";
import Loading from "./modules/authentication/components/Loading";

/**
 * Private router HOC
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      AuthenticationStore.user ? <Component {...props} /> : <Loading />
    }
  />
);

@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this._login();
  }

  _login = async () => {
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        await AuthenticationStore.authenticateUserWithId(user.uid);

        this.props.history.push("/home");
      } else {
        this.props.history.push("/");
      }
    });

    this.setState({
      isLoading: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute exact path="/home" component={Home} />
        </Switch>
      </React.Fragment>
    );
  }
}

const AppWithRoutes = withRouter(App);

const Wrapper = () => (
  <Router>
    <AppWithRoutes />
  </Router>
);

render(<Wrapper />, document.getElementById("root"));
