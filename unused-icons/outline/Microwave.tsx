import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMicrowave = (props: SvgProps) => (
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
    <Path d="M3 7a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10" />
    <Path d="M15 6v12" />
    <Path d="M18 12h.01" />
    <Path d="M18 15h.01" />
    <Path d="M18 9h.01" />
    <Path d="M6.5 10.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
    <Path d="M6.5 13.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
  </Svg>
);
export default SvgMicrowave;
