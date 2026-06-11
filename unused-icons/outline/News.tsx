import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNews = (props: SvgProps) => (
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
    <Path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11" />
    <Path d="M8 8l4 0" />
    <Path d="M8 12l4 0" />
    <Path d="M8 16l4 0" />
  </Svg>
);
export default SvgNews;
