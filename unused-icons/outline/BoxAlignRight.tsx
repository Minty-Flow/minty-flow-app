import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBoxAlignRight = (props: SvgProps) => (
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
    <Path d="M13.998 20.003v-16h5a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-5" />
    <Path d="M8.998 20.003h.01" />
    <Path d="M3.997 20.003h.011" />
    <Path d="M3.997 15.002h.011" />
    <Path d="M3.997 9.002h.011" />
    <Path d="M3.997 4.002h.011" />
    <Path d="M8.998 4.002h.01" />
  </Svg>
);
export default SvgBoxAlignRight;
