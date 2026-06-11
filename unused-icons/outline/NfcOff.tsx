import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNfcOff = (props: SvgProps) => (
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
    <Path d="M11 20a3 3 0 0 1 -3 -3v-9" />
    <Path d="M13 4a3 3 0 0 1 3 3v5m0 4v2l-5 -5" />
    <Path d="M8 4h9a3 3 0 0 1 3 3v9m-.873 3.116a2.99 2.99 0 0 1 -2.127 .884h-10a3 3 0 0 1 -3 -3v-10c0 -.83 .337 -1.582 .882 -2.125" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgNfcOff;
