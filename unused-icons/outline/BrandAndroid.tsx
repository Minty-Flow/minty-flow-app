import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandAndroid = (props: SvgProps) => (
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
    <Path d="M4 10l0 6" />
    <Path d="M20 10l0 6" />
    <Path d="M7 9h10v8a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-8a5 5 0 0 1 10 0" />
    <Path d="M8 3l1 2" />
    <Path d="M16 3l-1 2" />
    <Path d="M9 18l0 3" />
    <Path d="M15 18l0 3" />
  </Svg>
);
export default SvgBrandAndroid;
