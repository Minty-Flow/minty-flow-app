import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLighter = (props: SvgProps) => (
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
    <Path d="M10 3v16a2 2 0 0 0 2 2h5a2 2 0 0 0 2 -2v-7h-12a2 2 0 0 1 -2 -2v-5a2 2 0 0 1 2 -2h3" />
    <Path d="M16 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737" />
  </Svg>
);
export default SvgLighter;
