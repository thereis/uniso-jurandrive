// @flow

import * as React from "react";

/**
 * Dependencies
 */
import {
  withStyles,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from "@material-ui/core";
import { withRouter } from "react-router";
import { observer } from "mobx-react";
import { AuthenticationStore } from "../../authentication/AuthenticationStore";
import { UploadStore } from "../../upload/UploadStore";
import AttachmentRow from "./AttachmentRow";

/**
 * Material-UI components
 */
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import CloudDownload from "@material-ui/icons/CloudDownload";
import FileCopy from "@material-ui/icons/FileCopy";

/**
 * Models
 */
import { Attachment } from "../../upload/models/Attachment";

const styles = theme => ({
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

@observer
class AttachmentsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAttachment: null,
      isDialogVisible: false
    };

    this._loadAttachments();
  }

  imgRef = null;
  inputRef = null;

  _loadAttachments = async () => {
    await UploadStore.loadUserAttachments(AuthenticationStore.user);
  };

  /**
   * Events
   */

  _handleSelectAttachment = (attachment: Attachment) => {
    this.setState({ isDialogVisible: true, selectedAttachment: attachment });
  };

  _handleCopyToClipboard = (attachment: Attachment) => {
    this.inputRef.select();
    return document.execCommand("copy");
  };

  _handleDownloadFile = (attachment: Attachment) => {
    return window.open(attachment.storage.downloadURL, "_blank");
  };

  _handleDialogClose = () => {
    this.setState({ isDialogVisible: false, selectedAttachment: null });
  };

  render() {
    const { classes } = this.props;

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={UploadStore.totalSelectedAttachments > 0}
                checked={UploadStore.totalSelectedAttachments > 0}
                onChange={() =>
                  UploadStore.totalSelectedAttachments > 0
                    ? UploadStore.unselectAllAttachments()
                    : UploadStore.selectAllAttachments()
                }
              />
            </TableCell>
            <TableCell />
            <TableCell>File name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Last modified</TableCell>
            <TableCell>Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {UploadStore.getUserAttachments.length > 0 ? (
            UploadStore.getUserAttachments.map((attachment: Attachment) => {
              return (
                <AttachmentRow
                  key={attachment.id}
                  attachment={attachment}
                  onClick={() => this._handleSelectAttachment(attachment)}
                />
              );
            })
          ) : (
            <React.Fragment />
          )}
        </TableBody>

        {this.state.selectedAttachment !== null ? (
          <Dialog
            open={this.state.isDialogVisible}
            onClose={this._handleDialogClose}
            aria-labelledby="simple-dialog-title"
          >
            <DialogTitle id="simple-dialog-title">Download</DialogTitle>
            <React.Fragment>
              <List>
                <ListItem
                  button
                  onClick={() =>
                    this._handleCopyToClipboard(this.state.selectedAttachment)
                  }
                >
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <FileCopy />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={"Copy download URL"}
                    secondary={"To share with your friends"}
                  />
                  <input
                    ref={ref => (this.inputRef = ref)}
                    defaultValue={
                      this.state.selectedAttachment.storage.downloadURL
                    }
                    style={{
                      opacity: 0.01,
                      position: "absolute",
                      height: 0,
                      overflow: "hidden"
                    }}
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={() =>
                    this._handleDownloadFile(this.state.selectedAttachment)
                  }
                >
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <CloudDownload />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={"Download"}
                    secondary={`${this.state.selectedAttachment.file.name}.${
                      this.state.selectedAttachment.file.type
                    }`}
                  />
                </ListItem>
              </List>
            </React.Fragment>
          </Dialog>
        ) : null}
      </Table>
    );
  }
}

export default withStyles(styles)(withRouter(AttachmentsList));
