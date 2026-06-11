import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWindOff = (props: SvgProps) => (
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
    <Path d="M5 8h3m4 0h1.5a2.5 2.5 0 1 0 -2.34 -3.24" />
    <Path d="M3 12h9" />
    <Path d="M16 12h2.5a2.5 2.5 0 0 1 1.801 4.282" />
    <Path d="M4 16h5.5a2.5 2.5 0 1 1 -2.34 3.24" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgWindOff;
