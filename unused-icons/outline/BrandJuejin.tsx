import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandJuejin = (props: SvgProps) => (
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
    <Path d="M2 12l10 7.422l10 -7.422" />
    <Path d="M7 9l5 4l5 -4" />
    <Path d="M11 6l1 .8l1 -.8l-1 -.8l-1 .8" />
  </Svg>
);
export default SvgBrandJuejin;
