import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCeOff = (props: SvgProps) => (
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
    <Path d="M6.53 6.53a6.001 6.001 0 0 0 2.47 11.47" />
    <Path d="M21 6a6 6 0 0 0 -5.927 5.061l.927 .939" />
    <Path d="M16 12h5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCeOff;
