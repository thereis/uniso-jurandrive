import * as React from "react";

/**
 * Dependencies
 */
import { observer } from "mobx-react";

/**
 * Material-UI Components
 */
import { withStyles } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";

const styles = theme => ({
  root: {
    height: 380
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

@observer
class FAB extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      actions: [{ icon: <FileCopyIcon />, name: "Add new file" }]
    };
  }

  _toggleOpen = () => {
    let { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });
  };

  render() {
    let { classes } = this.props;

    return (
      <SpeedDial
        ariaLabel="Upload new file"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClick={this._toggleOpen}
        onClose={this._toggleOpen}
        open={this.state.isOpen}
      >
        {this.state.actions.map(action => (
          <SpeedDialAction
            open={this.state.isOpen}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={this.props.onClick}
          />
        ))}
      </SpeedDial>
    );
  }
}
export default withStyles(styles)(FAB);
