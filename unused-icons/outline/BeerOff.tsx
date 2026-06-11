import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBeerOff = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M7 7v1.111c0 1.242 .29 2.467 .845 3.578l.31 .622a8 8 0 0 1 .845 3.578v4.111h6v-4.111a8 8 0 0 1 .045 -.85m.953 -3.035l.157 -.315a8 8 0 0 0 .845 -3.578v-4.111h-9" />
    <Path d="M7 8h1m4 0h5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBeerOff;
