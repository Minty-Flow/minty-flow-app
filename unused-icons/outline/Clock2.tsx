import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClock2 = (props: SvgProps) => (
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
    <Path d="M4 5a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1l0 -14" />
    <Path d="M12 7v5l3 3" />
    <Path d="M4 12h1" />
    <Path d="M19 12h1" />
    <Path d="M12 19v1" />
  </Svg>
);
export default SvgClock2;
