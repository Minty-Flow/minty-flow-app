import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBiohazardOff = (props: SvgProps) => (
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
    <Path d="M10.586 10.586a2 2 0 1 0 2.836 2.82" />
    <Path d="M11.939 14c0 .173 .048 .351 .056 .533v.217a4.75 4.75 0 0 1 -4.533 4.745h-.217" />
    <Path d="M2.495 14.745a4.75 4.75 0 0 1 7.737 -3.693" />
    <Path d="M16.745 19.495a4.75 4.75 0 0 1 -4.69 -5.503h-.06" />
    <Path d="M14.533 10.538a4.75 4.75 0 0 1 6.957 3.987v.217" />
    <Path d="M10.295 10.929a4.75 4.75 0 0 1 -2.988 -3.64m.66 -3.324a4.75 4.75 0 0 1 .5 -.66l.164 -.172" />
    <Path d="M15.349 3.133a4.75 4.75 0 0 1 -.836 7.385" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBiohazardOff;
