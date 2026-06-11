import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMickey = (props: SvgProps) => (
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
    <Path d="M5.5 3a3.5 3.5 0 0 1 3.25 4.8a7.017 7.017 0 0 0 -2.424 2.1a3.5 3.5 0 1 1 -.826 -6.9" />
    <Path d="M18.5 3a3.5 3.5 0 1 1 -.826 6.902a7.013 7.013 0 0 0 -2.424 -2.103a3.5 3.5 0 0 1 3.25 -4.799" />
    <Path d="M5 14a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  </Svg>
);
export default SvgMickey;
