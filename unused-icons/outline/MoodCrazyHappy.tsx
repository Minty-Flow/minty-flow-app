import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodCrazyHappy = (props: SvgProps) => (
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
    <Path d="M7 8.5l3 3" />
    <Path d="M7 11.5l3 -3" />
    <Path d="M14 8.5l3 3" />
    <Path d="M14 11.5l3 -3" />
    <Path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
  </Svg>
);
export default SvgMoodCrazyHappy;
