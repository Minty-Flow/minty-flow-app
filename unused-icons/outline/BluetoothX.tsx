import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBluetoothX = (props: SvgProps) => (
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
    <Path d="M7 8l10 8l-5 4v-16l1 .802m0 6.396l-6 4.802" />
    <Path d="M16 6l4 4" />
    <Path d="M20 6l-4 4" />
  </Svg>
);
export default SvgBluetoothX;
