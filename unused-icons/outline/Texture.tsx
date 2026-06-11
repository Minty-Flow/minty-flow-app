import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTexture = (props: SvgProps) => (
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
    <Path d="M6 3l-3 3" />
    <Path d="M21 18l-3 3" />
    <Path d="M11 3l-8 8" />
    <Path d="M16 3l-13 13" />
    <Path d="M21 3l-18 18" />
    <Path d="M21 8l-13 13" />
    <Path d="M21 13l-8 8" />
  </Svg>
);
export default SvgTexture;
