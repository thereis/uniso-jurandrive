import React from "react";
import { observer } from "mobx-react";

/**
 * Dependencies
 */
import { UploadStore } from "../../upload/UploadStore";
import { AuthenticationStore } from "../../authentication/AuthenticationStore";
import { withRouter } from "react-router";
import Dropzone from "react-dropzone";
import UploadDialog from "../../upload/components/UploadDialog";
import Attachments from "../components/Attachments";

/**
 * Material-UI Components
 */
import {
  List,
  ListItem,
  ListItemText,
  withStyles,
  LinearProgress,
  Snackbar
} from "@material-ui/core";

/**
 * Models
 */
import { File } from "../../upload/models/File";
import FAB from "../components/FAB";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

@observer
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      isVisible: false,
      isSnackbarVisible: true
    };
  }

  dropRef = null;

  _handleSnackbarToggle = () => {
    let { isSnackbarVisible } = this.state;

    this.setState({ isSnackbarVisible: !isSnackbarVisible });
  };

  _onDrop = files => {
    this._uploadFiles(files);
  };

  _toggleIsVisible = () => {
    let { isVisible } = this.state;

    this.setState({
      isVisible: !isVisible
    });
  };

  _uploadFiles = async files => {
    this._toggleIsVisible();
    UploadStore.addFiles(files);
    UploadStore.uploadFiles(AuthenticationStore.user);
    this._toggleIsVisible();
  };

  _onCancel = () => {
    this.setState({
      files: []
    });
  };

  UploadTask = () => {
    return (
      <React.Fragment>
        <List component="ul">
          {UploadStore.files
            ? UploadStore.files.slice().map((file: File) => {
                return (
                  <React.Fragment key={file.id}>
                    <ListItem>
                      <ListItemText
                        primary={file.name}
                        secondary={file.format}
                      />
                    </ListItem>
                    <LinearProgress
                      variant="determinate"
                      color={file.percentage === 100 ? "primary" : "secondary"}
                      value={file.percentage}
                    />
                  </React.Fragment>
                );
              })
            : null}
        </List>
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Dropzone
          ref={dropRef => (this.dropRef = dropRef)}
          onDrop={this._onDrop}
          style={{ margin: 0 }}
          disableClick={true}
        >
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={3500}
            open={this.state.isSnackbarVisible}
            onClose={this._handleSnackbarToggle}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={
              <span id="message-id">
                You can drop multiple files in this page!
              </span>
            }
          />

          <Attachments />
        </Dropzone>

        <FAB
          onClick={() => {
            this.dropRef.open();
          }}
        />

        <UploadDialog
          isVisible={this.state.isVisible}
          handleClose={() => {}}
          handleConfirm={() => {
            this.setState({ isVisible: false });
          }}
          title={"Upload task"}
          content={this.UploadTask()}
          confirmText={UploadStore.allFilesAreUploaded ? "Ok" : false}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Home));
