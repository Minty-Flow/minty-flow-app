import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodX = (props: SvgProps) => (
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
    <Path d="M20.983 12.556a9 9 0 1 0 -8.433 8.427" />
    <Path d="M9 10h.01" />
    <Path d="M15 10h.01" />
    <Path d="M9.5 15c.658 .64 1.56 1 2.5 1c.194 0 .386 -.015 .574 -.045" />
    <Path d="M21.5 21.5l-5 -5" />
    <Path d="M16.5 21.5l5 -5" />
  </Svg>
);
export default SvgMoodX;
