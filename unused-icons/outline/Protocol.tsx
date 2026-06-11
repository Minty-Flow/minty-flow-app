import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgProtocol = (props: SvgProps) => (
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
    <Path d="M15 6l-7 12" />
    <Path d="M20 6l-7 12" />
    <Path d="M5 14v.015" />
    <Path d="M5 10.015v.015" />
  </Svg>
);
export default SvgProtocol;
