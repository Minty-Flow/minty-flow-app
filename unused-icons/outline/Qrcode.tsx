import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgQrcode = (props: SvgProps) => (
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
    <Path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M7 17l0 .01" />
    <Path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M7 7l0 .01" />
    <Path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M17 7l0 .01" />
    <Path d="M14 14l3 0" />
    <Path d="M20 14l0 .01" />
    <Path d="M14 14l0 3" />
    <Path d="M14 20l3 0" />
    <Path d="M17 17l3 0" />
    <Path d="M20 17l0 3" />
  </Svg>
);
export default SvgQrcode;
