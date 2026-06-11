import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWiper = (props: SvgProps) => (
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
    <Path d="M11 18a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M3 9l5.5 5.5a5 5 0 0 1 7 0l5.5 -5.5a12 12 0 0 0 -18 0" />
    <Path d="M12 18l-2.2 -12.8" />
  </Svg>
);
export default SvgWiper;
