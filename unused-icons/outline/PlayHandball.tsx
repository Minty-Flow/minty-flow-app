import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlayHandball = (props: SvgProps) => (
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
    <Path d="M13 21l3.5 -2l-4.5 -4l2 -4.5" />
    <Path d="M7 6l2 4l5 .5l4 2.5l2.5 3" />
    <Path d="M4 20l5 -1l1.5 -2" />
    <Path d="M15 7a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M9.5 5a.5 .5 0 1 0 0 -1a.5 .5 0 0 0 0 1" fill="currentColor" />
  </Svg>
);
export default SvgPlayHandball;
