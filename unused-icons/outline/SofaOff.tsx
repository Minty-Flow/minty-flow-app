import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSofaOff = (props: SvgProps) => (
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
    <Path d="M18 14v-1a2 2 0 1 1 4 0v5m-3 1h-16a1 1 0 0 1 -1 -1v-5a2 2 0 1 1 4 0v1h8" />
    <Path d="M4 11v-3c0 -1.082 .573 -2.03 1.432 -2.558m3.568 -.442h8a3 3 0 0 1 3 3v3" />
    <Path d="M12 5v3m0 4v2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSofaOff;
