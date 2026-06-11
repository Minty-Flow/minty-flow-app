import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodAngry = (props: SvgProps) => (
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
    <Path d="M8 9l2 1" />
    <Path d="M16 9l-2 1" />
    <Path d="M14.5 16.05a3.5 3.5 0 0 0 -5 0" />
  </Svg>
);
export default SvgMoodAngry;
