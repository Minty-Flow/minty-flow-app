import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTopologyStar = (props: SvgProps) => (
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
    <Path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M7.5 7.5l3 3" />
    <Path d="M7.5 16.5l3 -3" />
    <Path d="M13.5 13.5l3 3" />
    <Path d="M16.5 7.5l-3 3" />
  </Svg>
);
export default SvgTopologyStar;
