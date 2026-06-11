import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRegistered = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 4.66h-2a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1l.117 -.007a1 1 0 0 0 .883 -.993v-1h.585l1.708 1.707a1 1 0 0 0 1.414 -1.414l-.9 -.899a3 3 0 0 0 -1.807 -5.394m0 2a1 1 0 0 1 0 2h-1v-2z" />
  </Svg>
);
export default SvgRegistered;
