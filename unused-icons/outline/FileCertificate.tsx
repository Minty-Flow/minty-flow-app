import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileCertificate = (props: SvgProps) => (
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
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5" />
    <Path d="M3 14a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5" />
  </Svg>
);
export default SvgFileCertificate;
