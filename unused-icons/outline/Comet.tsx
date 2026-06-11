import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgComet = (props: SvgProps) => (
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
    <Path d="M15.5 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5l-3 -1.5" />
    <Path d="M4 4l7 7" />
    <Path d="M9 4l3.5 3.5" />
    <Path d="M4 9l3.5 3.5" />
  </Svg>
);
export default SvgComet;
