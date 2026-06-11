import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLocationBolt = (props: SvgProps) => (
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
    <Path d="M13.05 20.1l-3.05 -6.1l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5l-3.312 9.173" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgLocationBolt;
