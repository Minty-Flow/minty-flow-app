import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgInnerShadowBottom = (props: SvgProps) => (
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
    <Path d="M18.364 18.364a9 9 0 1 0 -12.728 -12.728a9 9 0 0 0 12.728 12.728" />
    <Path d="M7.757 16.243a6 6 0 0 0 8.486 0" />
  </Svg>
);
export default SvgInnerShadowBottom;
