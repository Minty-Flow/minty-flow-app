import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNumber = (props: SvgProps) => (
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
    <Path d="M4 17v-10l7 10v-10" />
    <Path d="M15 17h5" />
    <Path d="M15 10a2.5 3 0 1 0 5 0a2.5 3 0 1 0 -5 0" />
  </Svg>
);
export default SvgNumber;
