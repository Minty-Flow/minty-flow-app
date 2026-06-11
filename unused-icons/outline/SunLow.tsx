import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSunLow = (props: SvgProps) => (
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
    <Path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M4 12h.01" />
    <Path d="M12 4v.01" />
    <Path d="M20 12h.01" />
    <Path d="M12 20v.01" />
    <Path d="M6.31 6.31l-.01 -.01" />
    <Path d="M17.71 6.31l-.01 -.01" />
    <Path d="M17.7 17.7l.01 .01" />
    <Path d="M6.3 17.7l.01 .01" />
  </Svg>
);
export default SvgSunLow;
