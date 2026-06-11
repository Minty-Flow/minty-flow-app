import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlaskOff = (props: SvgProps) => (
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
    <Path d="M9 3h6" />
    <Path d="M13 9h1" />
    <Path d="M10 3v3m-.268 3.736l-3.732 10.264a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-1.143 -3.142m-2.288 -6.294l-.569 -1.564v-6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgFlaskOff;
