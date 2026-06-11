import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWaveSquare = (props: SvgProps) => (
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
    <Path d="M3 12h5v8h4v-16h4v8h5" />
  </Svg>
);
export default SvgWaveSquare;
