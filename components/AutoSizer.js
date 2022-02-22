import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";

import styles from "./AutoSizer.module.css";

export function withAutoSizer(Component) {
  return function AutoSizer(props) {
    return (
      <ReactVirtualizedAutoSizer>
        {({ height, width }) => (
          <div className={styles.Container}>
            <Component height={height} width={width} {...props} />
          </div>
        )}
      </ReactVirtualizedAutoSizer>
    );
  };
}
