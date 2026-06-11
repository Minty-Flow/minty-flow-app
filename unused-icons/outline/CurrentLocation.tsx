import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrentLocation = (props: SvgProps) => (
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
    <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
    <Path d="M12 2l0 2" />
    <Path d="M12 20l0 2" />
    <Path d="M20 12l2 0" />
    <Path d="M2 12l2 0" />
  </Svg>
);
export default SvgCurrentLocation;
