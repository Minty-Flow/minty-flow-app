import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWaveSawTool = (props: SvgProps) => (
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
    <Path d="M3 12h5l4 8v-16l4 8h5" />
  </Svg>
);
export default SvgWaveSawTool;
