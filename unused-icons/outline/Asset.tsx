import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAsset = (props: SvgProps) => (
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
    <Path d="M3 15a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
    <Path d="M7 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M14.218 17.975l6.619 -12.174" />
    <Path d="M6.079 9.756l12.217 -6.631" />
    <Path d="M7 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgAsset;
