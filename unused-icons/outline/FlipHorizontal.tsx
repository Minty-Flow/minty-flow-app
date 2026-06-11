import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlipHorizontal = (props: SvgProps) => (
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
    <Path d="M3 12l18 0" />
    <Path d="M7 16l10 0l-10 5l0 -5" />
    <Path d="M7 8l10 0l-10 -5l0 5" />
  </Svg>
);
export default SvgFlipHorizontal;
