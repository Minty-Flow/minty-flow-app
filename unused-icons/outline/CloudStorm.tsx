import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCloudStorm = (props: SvgProps) => (
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
    <Path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
    <Path d="M13 14l-2 4l3 0l-2 4" />
  </Svg>
);
export default SvgCloudStorm;
