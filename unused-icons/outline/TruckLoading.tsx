import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTruckLoading = (props: SvgProps) => (
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
    <Path d="M2 3h1a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h15" />
    <Path d="M9 9a3 3 0 0 1 3 -3h4a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3l0 -2" />
    <Path d="M7 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgTruckLoading;
