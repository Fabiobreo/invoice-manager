import classes from "./LoadingSpinner.module.css";

const LoadingSpinner: React.FC<{ className?: string }> = (props) => {
  return (
    <div
      className={`${classes.spinner} ${props.className ? props.className : ""}`}
    ></div>
  );
};

export default LoadingSpinner;
