import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNurse = (props: SvgProps) => (
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
    <Path d="M12 5c2.941 0 6.685 1.537 9 3l-2 11h-14l-2 -11c2.394 -1.513 6.168 -3.005 9 -3" />
    <Path d="M10 12h4" />
    <Path d="M12 10v4" />
  </Svg>
);
export default SvgNurse;
