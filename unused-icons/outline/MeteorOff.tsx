import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMeteorOff = (props: SvgProps) => (
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
    <Path d="M9.75 5.761l3.25 -2.761l-1 5l9 -5l-5 9h5l-2.467 2.536m-1.983 2.04l-2.441 2.51a6.5 6.5 0 1 1 -8.855 -9.506l2.322 -1.972" />
    <Path d="M7 14.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMeteorOff;
