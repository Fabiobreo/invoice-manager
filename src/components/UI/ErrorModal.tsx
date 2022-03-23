import React from "react";
import ReactDOM from "react-dom";

import Card from "./Card";

import classes from "./ErrorModal.module.css";

export type ErrorType = {
  title: string;
  message: string;
  onConfirm: () => void;
};

const Backdrop: React.FC<{ onConfirm: () => void }> = (props) => {
  return <div className={classes.backdrop} onClick={props.onConfirm} />;
};

const ModalOverlay: React.FC<ErrorType> = (props) => {
  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.title}</h2>
      </header>
      <div className={classes.content}>
        <p>{props.message}</p>
      </div>
      <footer className={classes.actions}>
        <button onClick={props.onConfirm}>Okay</button>
      </footer>
    </Card>
  );
};

const ErrorModal: React.FC<ErrorType> = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")!
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
        />,
        document.getElementById("overlay-root")!
      )}
    </React.Fragment>
  );
};

export default ErrorModal;
