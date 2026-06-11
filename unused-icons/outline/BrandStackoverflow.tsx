import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandStackoverflow = (props: SvgProps) => (
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
    <Path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-1" />
    <Path d="M8 16h8" />
    <Path d="M8.322 12.582l7.956 .836" />
    <Path d="M8.787 9.168l7.826 1.664" />
    <Path d="M10.096 5.764l7.608 2.472" />
  </Svg>
);
export default SvgBrandStackoverflow;
