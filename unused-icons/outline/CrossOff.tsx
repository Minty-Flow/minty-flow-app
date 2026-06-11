import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCrossOff = (props: SvgProps) => (
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
    <Path d="M16 12h3v-4h-5v-5h-4v3m-2 2h-3v4h5v9h4v-7" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCrossOff;
