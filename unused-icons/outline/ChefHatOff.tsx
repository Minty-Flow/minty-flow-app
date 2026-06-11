import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChefHatOff = (props: SvgProps) => (
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
    <Path d="M8.72 4.712a4 4 0 0 1 7.19 1.439a4 4 0 0 1 2.09 7.723v.126m0 4v3h-12v-7.126a4 4 0 0 1 .081 -7.796" />
    <Path d="M6.161 17.009l10.839 -.009" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgChefHatOff;
