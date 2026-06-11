import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgList = (props: SvgProps) => (
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
    <Path d="M9 6l11 0" />
    <Path d="M9 12l11 0" />
    <Path d="M9 18l11 0" />
    <Path d="M5 6l0 .01" />
    <Path d="M5 12l0 .01" />
    <Path d="M5 18l0 .01" />
  </Svg>
);
export default SvgList;
