import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCongruentTo = (props: SvgProps) => (
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
    <Path d="M5 13h14" />
    <Path d="M5 17h14" />
    <Path d="M5 7.686c2.333 -2.624 4.667 -1.856 7 .064s4.667 2.688 7 .064" />
  </Svg>
);
export default SvgCongruentTo;
