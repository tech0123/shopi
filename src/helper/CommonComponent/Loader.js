import { ProgressSpinner } from "primereact/progressspinner";

const Loader = () => {
  return (
    <div className="loader_Wrapper">
      <ProgressSpinner
        className="loader"
        strokeWidth="3"
        fill="var(--surface-ground)"
        animationDuration=".8s"
      />
    </div>
  );
};

export default Loader;
