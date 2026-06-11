import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandNetflix = (props: SvgProps) => (
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
    <Path d="M9 3l10 18h-4l-10 -18l4 0" />
    <Path d="M5 3v18h4v-10.5" />
    <Path d="M19 21v-18h-4v10.5" />
  </Svg>
);
export default SvgBrandNetflix;
