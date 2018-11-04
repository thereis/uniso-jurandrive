import * as React from "react";

/**
 * Dependencies
 */
import LoadingOverlay from "react-loading-overlay";

export default class Loading extends React.Component {
  render() {
    return (
      <LoadingOverlay
        active={true}
        spinner={true}
        spinnerSize={"250px"}
        text="Jurandrive is loading..."
        background={"#000000"}
      />
    );
  }
}
