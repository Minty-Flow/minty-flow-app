import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCategoryMinus = (props: SvgProps) => (
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
    <Path d="M4 4h6v6h-6v-6" />
    <Path d="M14 4h6v6h-6v-6" />
    <Path d="M4 14h6v6h-6v-6" />
    <Path d="M14 17h6" />
  </Svg>
);
export default SvgCategoryMinus;
