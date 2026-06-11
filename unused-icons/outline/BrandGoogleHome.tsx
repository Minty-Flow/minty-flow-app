import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGoogleHome = (props: SvgProps) => (
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
    <Path d="M19.072 21h-14.144a1.928 1.928 0 0 1 -1.928 -1.928v-6.857c0 -.512 .203 -1 .566 -1.365l7.07 -7.063a1.928 1.928 0 0 1 2.727 0l7.071 7.063c.363 .362 .566 .853 .566 1.365v6.857a1.928 1.928 0 0 1 -1.928 1.928" />
    <Path d="M7 13v4h10v-4l-5 -5" />
    <Path d="M14.8 5.2l-11.8 11.8" />
    <Path d="M7 17v4" />
    <Path d="M17 17v4" />
  </Svg>
);
export default SvgBrandGoogleHome;
