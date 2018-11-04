import * as React from "react";
import { observer } from "mobx-react";

/**
 * Dependencies
 */
import { withRouter } from "react-router";
import classNames from "classnames";

/**
 * Material-UI components
 */
import {
  withStyles,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVert from "@material-ui/icons/MoreVert";

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

@observer
class AttachmentsListHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    let { classes, numSelected } = this.props;
    const { anchorEl } = this.state;

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              {this.props.title}
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon onClick={this.props.onDeleteClick} />
              </IconButton>
            </Tooltip>
          ) : (
            <React.Fragment>
              <Tooltip title="Options">
                <IconButton
                  aria-label="Options"
                  aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.props.onLogoutClick}>Logout</MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </div>
      </Toolbar>
    );
  }
}

export default withStyles(styles)(withRouter(AttachmentsListHeader));
