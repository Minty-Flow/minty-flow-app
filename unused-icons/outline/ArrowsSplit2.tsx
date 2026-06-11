import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsSplit2 = (props: SvgProps) => (
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
    <Path d="M21 17h-5.397a5 5 0 0 1 -4.096 -2.133l-.514 -.734a5 5 0 0 0 -4.096 -2.133h-3.897" />
    <Path d="M21 7h-5.395a5 5 0 0 0 -4.098 2.135l-.51 .73a5 5 0 0 1 -4.097 2.135h-3.9" />
    <Path d="M18 10l3 -3l-3 -3" />
    <Path d="M18 20l3 -3l-3 -3" />
  </Svg>
);
export default SvgArrowsSplit2;
