import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSeparator = (props: SvgProps) => (
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
    <Path d="M3 12l0 .01" />
    <Path d="M7 12l10 0" />
    <Path d="M21 12l0 .01" />
  </Svg>
);
export default SvgSeparator;
