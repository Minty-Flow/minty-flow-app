import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandAppleNews = (props: SvgProps) => (
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
    <Path d="M4 14l6 6h-6l0 -6" />
    <Path d="M20 10l-6 -6h6l0 6" />
    <Path d="M4 4v4l12 12h4v-4l-12 -12l-4 0" />
  </Svg>
);
export default SvgBrandAppleNews;
