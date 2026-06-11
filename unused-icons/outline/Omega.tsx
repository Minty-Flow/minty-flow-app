import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgOmega = (props: SvgProps) => (
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
    <Path d="M4 19h5v-1a7.35 7.35 0 1 1 6 0v1h5" />
  </Svg>
);
export default SvgOmega;
