import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExplicit = (props: SvgProps) => (
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
    <Path d="M4 5a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1l0 -14" />
    <Path d="M14 8h-4v8h4" />
    <Path d="M14 12h-4" />
  </Svg>
);
export default SvgExplicit;
