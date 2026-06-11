import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTaxPound = (props: SvgProps) => (
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
    <Path d="M8.487 21h7.026a4 4 0 0 0 3.808 -5.224l-1.706 -5.306a5 5 0 0 0 -4.76 -3.47h-1.71a5 5 0 0 0 -4.76 3.47l-1.706 5.306a4 4 0 0 0 3.808 5.224" />
    <Path d="M15 3q -1 4 -3 4t -3 -4l6 0" />
    <Path d="M14 11h-1a2 2 0 0 0 -2 2v2c0 1.105 -.395 2 -1.5 2h4.5" />
    <Path d="M10 14h3" />
  </Svg>
);
export default SvgTaxPound;
