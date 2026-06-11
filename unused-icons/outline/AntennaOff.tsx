import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAntennaOff = (props: SvgProps) => (
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
    <Path d="M20 4v8" />
    <Path d="M16 4.5v7" />
    <Path d="M12 5v3m0 4v9" />
    <Path d="M8 8v2.5" />
    <Path d="M4 6v4" />
    <Path d="M20 8h-8m-4 0h-4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAntennaOff;
