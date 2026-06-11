import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowNarrowRightDashed = (props: SvgProps) => (
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
    <Path d="M5 12h.5m3 0h1.5m3 0h6" />
    <Path d="M15 16l4 -4" />
    <Path d="M15 8l4 4" />
  </Svg>
);
export default SvgArrowNarrowRightDashed;
