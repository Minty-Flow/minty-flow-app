import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBallFootball = (props: SvgProps) => (
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
    <Path d="M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55l4.76 -3.45" />
    <Path d="M12 7v-4m3 13l2.5 3m-.74 -8.55l3.74 -1.45m-11.44 7.05l-2.56 2.95m.74 -8.55l-3.74 -1.45" />
  </Svg>
);
export default SvgBallFootball;
