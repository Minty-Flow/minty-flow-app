import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAd2 = (props: SvgProps) => (
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
    <Path d="M11.933 5h-6.933v16h13v-8" />
    <Path d="M14 17h-5" />
    <Path d="M9 13h5v-4h-5v4" />
    <Path d="M15 5v-2" />
    <Path d="M18 6l2 -2" />
    <Path d="M19 9h2" />
  </Svg>
);
export default SvgAd2;
