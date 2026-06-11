import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodSad2 = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M14.5 16.05a3.5 3.5 0 0 0 -5 0" />
    <Path d="M10 9.25c-.5 1 -2.5 1 -3 0" />
    <Path d="M17 9.25c-.5 1 -2.5 1 -3 0" />
  </Svg>
);
export default SvgMoodSad2;
