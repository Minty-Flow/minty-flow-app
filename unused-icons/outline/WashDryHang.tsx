import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWashDryHang = (props: SvgProps) => (
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
    <Path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12" />
    <Path d="M4 4.01c5.333 5.323 10.667 5.32 16 -.01" />
  </Svg>
);
export default SvgWashDryHang;
