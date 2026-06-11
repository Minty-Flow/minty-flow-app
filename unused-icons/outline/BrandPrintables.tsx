import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandPrintables = (props: SvgProps) => (
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
    <Path d="M6 21l12 -7v-7.5l-6 -3.5l-6 3.5l6 3.5v7.5l-6 -3.5l0 7" />
  </Svg>
);
export default SvgBrandPrintables;
