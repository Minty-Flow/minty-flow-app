import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWindmillOff = (props: SvgProps) => (
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
    <Path d="M15.061 11.06c1.18 -.824 1.939 -2.11 1.939 -3.56c0 -2.49 -2.24 -4.5 -5 -4.5v5" />
    <Path d="M12 12c0 2.76 2.01 5 4.5 5c.166 0 .33 -.01 .49 -.03m2.624 -1.36c.856 -.91 1.386 -2.19 1.386 -3.61h-5" />
    <Path d="M12 12c-2.76 0 -5 2.01 -5 4.5s2.24 4.5 5 4.5v-9" />
    <Path d="M6.981 7.033c-2.244 .285 -3.981 2.402 -3.981 4.967h9" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgWindmillOff;
