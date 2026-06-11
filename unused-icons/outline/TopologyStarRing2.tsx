import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTopologyStarRing2 = (props: SvgProps) => (
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
    <Path d="M14 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M14 4a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M6 12h4" />
    <Path d="M14 12h4" />
    <Path d="M12 6v4" />
    <Path d="M12 14v4" />
    <Path d="M5.5 10.5l5 -5" />
    <Path d="M13.5 5.5l5 5" />
    <Path d="M18.5 13.5l-5 5" />
    <Path d="M10.5 18.5l-5 -5" />
  </Svg>
);
export default SvgTopologyStarRing2;
