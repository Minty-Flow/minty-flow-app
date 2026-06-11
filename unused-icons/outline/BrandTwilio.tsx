import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandTwilio = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
    <Path d="M8 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M14 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M14 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M8 15a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgBrandTwilio;
