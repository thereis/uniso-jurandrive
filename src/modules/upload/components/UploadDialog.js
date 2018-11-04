import * as React from "react";
import { observer } from "mobx-react";

/**
 * Material-UI components
 */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";

@observer
class UploadDialog extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.isVisible}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>{this.props.content}</DialogContent>
        <DialogActions>
          {this.props.cancelText ? (
            <Button onClick={this.props.handleClose} color="primary">
              {this.props.cancelText}
            </Button>
          ) : null}
          {this.props.confirmText ? (
            <Button
              onClick={this.props.handleConfirm}
              color="primary"
              autoFocus
            >
              {this.props.confirmText}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    );
  }
}

export default UploadDialog;
