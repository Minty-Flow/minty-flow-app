import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTypography = (props: SvgProps) => (
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
    <Path d="M4 20l3 0" />
    <Path d="M14 20l7 0" />
    <Path d="M6.9 15l6.9 0" />
    <Path d="M10.2 6.3l5.8 13.7" />
    <Path d="M5 20l6 -16l2 0l7 16" />
  </Svg>
);
export default SvgTypography;
