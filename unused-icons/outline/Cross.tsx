import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCross = (props: SvgProps) => (
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
    <Path d="M10 21h4v-9h5v-4h-5v-5h-4v5h-5v4h5l0 9" />
  </Svg>
);
export default SvgCross;
