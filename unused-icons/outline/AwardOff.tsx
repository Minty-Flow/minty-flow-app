import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAwardOff = (props: SvgProps) => (
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
    <Path d="M16.72 12.704a6 6 0 0 0 -8.433 -8.418m-1.755 2.24a6 6 0 0 0 7.936 7.944" />
    <Path d="M12 15l3.4 5.89l1.598 -3.233l.707 .046m1.108 -2.902l-1.617 -2.8" />
    <Path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAwardOff;
