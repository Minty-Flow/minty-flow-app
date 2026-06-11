import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLanguageOff = (props: SvgProps) => (
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
    <Path d="M12 20l2.463 -5.541m1.228 -2.764l.309 -.695l.8 1.8" />
    <Path d="M18 18h-5.1" />
    <Path d="M8.747 8.748c-.66 2.834 -2.536 4.252 -4.747 4.252" />
    <Path d="M4 6.371l2.371 0" />
    <Path d="M5 9c0 2.144 2.252 3.908 6 4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgLanguageOff;
