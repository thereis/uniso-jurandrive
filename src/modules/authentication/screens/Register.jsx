import * as React from "react";

/**
 * Dependencies
 */
import { observer } from "mobx-react";
import { withRouter } from "react-router";

/**
 * Material-UI components
 */
import { withStyles, FormLabel, RadioGroup, Radio } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { AuthenticationStore } from "../AuthenticationStore";

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
class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      ra: "",
      gender: "",
      email: "",
      password: "",
      verifyPassword: "",
      isRAInvalid: true,
      isEmailInvalid: true
    };
  }

  timerRef = null;

  /**
   * Name handlers
   */
  _handleName = e => {
    this.setState({
      name: e.currentTarget.value
    });
  };

  _isNameValid = () => {
    return this.state.name.length > 0;
  };

  /**
   * RA handlers
   */
  _handleRA = e => {
    let ra: string = e.currentTarget.value;
    let raNumber: number = parseInt(ra);

    if (this.state.ra !== ra) {
      this.setState({
        isRAInvalid: true
      });
    }

    // Do not continue more than 8 digits
    if (ra.length > 8) {
      this.setState({
        isRAInvalid: true
      });

      return false;
    }

    if (raNumber < 0) {
      this.setState({
        isRAInvalid: true,
        ra
      });

      return false;
    }

    // update ra value
    this.setState({
      ra
    });

    clearTimeout(this.timerRef);

    if (ra.length === 8) {
      this.timerRef = setTimeout(
        async ra => {
          await this._isRAValid(ra);
        },
        1000,
        ra
      );
    }
  };

  _isRAValid = async (ra: string) => {
    if (ra.length === 0) {
      this.setState({
        isRAInvalid: true
      });

      return false;
    }

    let request = await AuthenticationStore.checkIfRAExists(ra);

    this.setState({
      isRAInvalid: request
    });
  };

  /**
   * Gender handlers
   */
  _handleGender = e => {
    this.setState({ gender: e.currentTarget.value });
  };

  _isGenderValid = () => {
    let { gender } = this.state;

    return gender.length === 1;
  };

  /**
   * Email handlers
   */
  _handleEmail = async e => {
    let email = e.currentTarget.value;

    if (this.state.email !== email) {
      this.setState({
        isEmailInvalid: true
      });
    }

    this.setState({
      email
    });

    clearTimeout(this.timerRef);

    this.timerRef = setTimeout(
      async email => {
        await this._isEmailValid(email);
      },
      1000,
      email
    );
  };

  _isRegexValid = (email: string) => {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(String(email).toLowerCase());
  };

  _isEmailValid = async (email: string) => {
    let isRegexValid = this._isRegexValid(email);

    if (!isRegexValid) {
      this.setState({
        isEmailInvalid: true
      });
      return false;
    }

    let request = await AuthenticationStore.checkIfEmailExists(email);
    let isRegistered = request.length === 0 ? false : true;

    this.setState({
      isEmailInvalid: isRegistered
    });
  };

  /**
   * Password handlers
   */
  _handlePassword = e => {
    this.setState({ password: e.target.value });
  };

  _isPasswordValid = () => {
    return this.state.password.length >= 6;
  };

  _handleVerifyPassword = e => {
    this.setState({ verifyPassword: e.currentTarget.value });
  };

  _isVerifyPasswordValid = () => {
    return this.state.verifyPassword.length >= 6;
  };

  _isMatchedPassword = () => {
    let { password, verifyPassword } = this.state;
    return password === verifyPassword;
  };

  /**
   * Events
   */
  _handleGoBack = () => {
    this.props.history.push("/");
  };

  _isFormValid = () => {
    return (
      this._isNameValid() &&
      !this.state.isRAInvalid &&
      this._isGenderValid() &&
      !this.state.isEmailInvalid &&
      this._isPasswordValid() &&
      this._isMatchedPassword()
    );
  };

  _handleSubmit = async e => {
    e.preventDefault();

    let { name, ra, gender, email, password } = this.state;

    await AuthenticationStore.registerNewUser(
      name,
      ra,
      gender,
      email,
      password
    );
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
              Register on Jurandrive
            </Typography>

            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="name">Name</InputLabel>
                <Input
                  type="name"
                  id="name"
                  name="name"
                  placeholder={"Your full name"}
                  autoComplete="name"
                  autoFocus
                  onChange={this._handleName}
                  error={!this._isNameValid()}
                />
              </FormControl>

              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="ra">RA</InputLabel>
                <Input
                  type={"number"}
                  id="ra"
                  name="ra"
                  autoComplete="ra"
                  placeholder={"Your 8 digits RA"}
                  value={this.state.ra}
                  onChange={this._handleRA}
                  error={this.state.isRAInvalid}
                />
              </FormControl>

              <FormControl
                margin="normal"
                required
                fullWidth
                component="fieldset"
                className={classes.formControl}
                error={!this._isGenderValid()}
              >
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  aria-label="Gender"
                  name="gender"
                  className={classes.group}
                  value={this.state.gender}
                  onChange={this._handleGender}
                >
                  <FormControlLabel
                    value="F"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="M"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder={"Your e-mail to sign in"}
                  value={this.state.email}
                  onChange={this._handleEmail}
                  error={this.state.isEmailInvalid}
                />
              </FormControl>

              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="password"
                  placeholder={"At least 6 characters"}
                  value={this.state.password}
                  onChange={this._handlePassword}
                  error={!this._isPasswordValid()}
                />
              </FormControl>

              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="verify-password">
                  Verify password
                </InputLabel>
                <Input
                  name="verify-password"
                  type="password"
                  id="verify-password"
                  autoComplete="verify-password"
                  placeholder={"Type the same password"}
                  value={this.state.verifyPassword}
                  onChange={this._handleVerifyPassword}
                  error={
                    !this._isMatchedPassword() || !this._isVerifyPasswordValid()
                  }
                />
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!this._isFormValid()}
                onClick={this._handleSubmit}
              >
                Register account
              </Button>

              <Button
                onClick={this._handleGoBack}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Go back to Sign in
              </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Register));
