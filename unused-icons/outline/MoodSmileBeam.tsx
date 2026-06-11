import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodSmileBeam = (props: SvgProps) => (
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
    <Path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18" />
    <Path d="M10 10c-.5 -1 -2.5 -1 -3 0" />
    <Path d="M17 10c-.5 -1 -2.5 -1 -3 0" />
    <Path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />
  </Svg>
);
export default SvgMoodSmileBeam;
