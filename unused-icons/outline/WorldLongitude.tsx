import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWorldLongitude = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M11.5 3a11.2 11.2 0 0 0 0 18" />
    <Path d="M12.5 3a11.2 11.2 0 0 1 0 18" />
    <Path d="M12 3l0 18" />
  </Svg>
);
export default SvgWorldLongitude;
