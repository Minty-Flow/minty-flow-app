import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandUnsplash = (props: SvgProps) => (
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
    <Path d="M4 11h5v4h6v-4h5v9h-16v-9" />
    <Path d="M9 4h6v4h-6l0 -4" />
  </Svg>
);
export default SvgBrandUnsplash;
