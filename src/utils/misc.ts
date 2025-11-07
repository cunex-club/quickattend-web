import { FC } from "react";

export type StyleableFC<Props extends object = object> = FC<
  Props & { className?: string; style?: React.CSSProperties }
>;
