import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFingerprintScan = (props: SvgProps) => (
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
    <Path d="M9 11a3 3 0 0 1 6 0c0 1.657 .612 3.082 1 4" />
    <Path d="M12 11v1.75c-.001 1.11 .661 2.206 1 3.25" />
    <Path d="M9 14.25c.068 .58 .358 1.186 .5 1.75" />
    <Path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
    <Path d="M4 16v2a2 2 0 0 0 2 2h2" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <Path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
  </Svg>
);
export default SvgFingerprintScan;
