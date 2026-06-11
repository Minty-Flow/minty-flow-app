import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEmphasis = (props: SvgProps) => (
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
    <Path d="M16 5h-8v10h8m-1 -5h-7" />
    <Path d="M6 20l0 .01" />
    <Path d="M10 20l0 .01" />
    <Path d="M14 20l0 .01" />
    <Path d="M18 20l0 .01" />
  </Svg>
);
export default SvgEmphasis;
