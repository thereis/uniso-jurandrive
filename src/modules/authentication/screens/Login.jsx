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
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  root: {
    display: "flex"
  },
  card: {},
  cardContent: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    margin: theme.spacing.unit
  },
  loginContainer: {
    display: "flex",
    justifyContent: "center"
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

  _handleValidate = () => {
    return this.state.email.length > 0 && this.state.password.length > 0;
  };

  render() {
    let { classes } = this.props;

    return (
      <React.Fragment>
        <Grid
          container={true}
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="email">E-mail</InputLabel>
                  <Input
                    id="email"
                    value={this.state.email}
                    onChange={this._handleEmail}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="password">Senha</InputLabel>
                  <Input
                    id="password"
                    type="password"
                    value={this.state.password}
                    onChange={this._handlePassword}
                  />
                </FormControl>
              </CardContent>
              <CardActions className={classes.loginContainer}>
                <Button
                  disabled={!this._handleValidate()}
                  variant="outlined"
                  size="small"
                  onClick={this._handleSubmit}
                >
                  Entrar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Login));
