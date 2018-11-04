import * as React from "react";

/**
 * Dependencies
 */
import { AuthenticationStore } from "../AuthenticationStore";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";

/**
 * Material-UI Components
 */
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

@observer
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLoading: false
    };
  }

  /**
   * Events
   */
  _handleEmail = e => {
    this.setState({
      email: e.currentTarget.value
    });
  };

  _handlePassword = e => {
    this.setState({
      password: e.currentTarget.value
    });
  };

  /**
   * Sign in
   */
  _handleSubmit = async event => {
    event.preventDefault();

    let { email, password } = this.state;

    this.setState(
      {
        isLoading: true
      },
      async () => {
        await AuthenticationStore.authenticateUserWithEmail(email, password);

        this.setState({
          isLoading: false
        });
      }
    );
  };

  /**
   * Handle register
   */
  _handleRegister = () => {
    this.props.history.push("/register");
  };

  /**
   * Validations
   */
  _handleValidate = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };

  render() {
    let { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Jurandrive
            </Typography>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={this.state.email}
                  onChange={this._handleEmail}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={this._handlePassword}
                />
              </FormControl>
              <Button
                type="submit"
                disabled={!this._handleValidate()}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this._handleSubmit}
              >
                Sign in
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={this._handleRegister}
              >
                Register
              </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Login));
