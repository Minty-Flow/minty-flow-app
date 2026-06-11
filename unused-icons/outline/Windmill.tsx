import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWindmill = (props: SvgProps) => (
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
    <Path d="M12 12c2.76 0 5 -2.01 5 -4.5s-2.24 -4.5 -5 -4.5v9" />
    <Path d="M12 12c0 2.76 2.01 5 4.5 5s4.5 -2.24 4.5 -5h-9" />
    <Path d="M12 12c-2.76 0 -5 2.01 -5 4.5s2.24 4.5 5 4.5v-9" />
    <Path d="M12 12c0 -2.76 -2.01 -5 -4.5 -5s-4.5 2.24 -4.5 5h9" />
  </Svg>
);
export default SvgWindmill;
