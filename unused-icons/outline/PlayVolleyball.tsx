import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlayVolleyball = (props: SvgProps) => (
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
    <Path d="M13 4a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M20.5 10a.5 .5 0 1 0 0 -1a.5 .5 0 0 0 0 1" fill="currentColor" />
    <Path d="M2 16l5 1l.5 -2.5" />
    <Path d="M11.5 21l2.5 -5.5l-5.5 -3.5l3.5 -4l3 4l4 2" />
  </Svg>
);
export default SvgPlayVolleyball;
