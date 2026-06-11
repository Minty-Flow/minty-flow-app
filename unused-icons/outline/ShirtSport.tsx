import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShirtSport = (props: SvgProps) => (
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
    <Path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
    <Path d="M10.5 11h2.5l-1.5 5" />
  </Svg>
);
export default SvgShirtSport;
