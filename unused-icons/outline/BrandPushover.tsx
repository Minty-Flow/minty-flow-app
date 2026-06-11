import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandPushover = (props: SvgProps) => (
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
    <Path d="M6.16 10.985c-.83 -1.935 1.53 -7.985 8.195 -7.985c3.333 0 4.645 1.382 4.645 3.9c0 2.597 -2.612 6.1 -9 6.1" />
    <Path d="M12.5 6l-5.5 15" />
  </Svg>
);
export default SvgBrandPushover;
