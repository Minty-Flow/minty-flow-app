import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFocus2 = (props: SvgProps) => (
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
    <Path d="M11.5 12a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" />
    <Path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M12 3l0 2" />
    <Path d="M3 12l2 0" />
    <Path d="M12 19l0 2" />
    <Path d="M19 12l2 0" />
  </Svg>
);
export default SvgFocus2;
