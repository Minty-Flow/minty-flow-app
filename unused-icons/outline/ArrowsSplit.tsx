import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsSplit = (props: SvgProps) => (
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
    <Path d="M21 17h-8l-3.5 -5h-6.5" />
    <Path d="M21 7h-8l-3.495 5" />
    <Path d="M18 10l3 -3l-3 -3" />
    <Path d="M18 20l3 -3l-3 -3" />
  </Svg>
);
export default SvgArrowsSplit;
