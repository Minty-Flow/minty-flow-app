import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBallVolleyball = (props: SvgProps) => (
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
    <Path d="M12 12a8 8 0 0 0 8 4" />
    <Path d="M7.5 13.5a12 12 0 0 0 8.5 6.5" />
    <Path d="M12 12a8 8 0 0 0 -7.464 4.928" />
    <Path d="M12.951 7.353a12 12 0 0 0 -9.88 4.111" />
    <Path d="M12 12a8 8 0 0 0 -.536 -8.928" />
    <Path d="M15.549 15.147a12 12 0 0 0 1.38 -10.611" />
  </Svg>
);
export default SvgBallVolleyball;
