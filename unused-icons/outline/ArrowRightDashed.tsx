import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRightDashed = (props: SvgProps) => (
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
    <Path d="M13 18l6 -6" />
    <Path d="M13 6l6 6" />
  </Svg>
);
export default SvgArrowRightDashed;
