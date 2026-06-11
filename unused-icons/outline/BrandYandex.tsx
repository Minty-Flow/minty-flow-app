import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandYandex = (props: SvgProps) => (
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
    <Path d="M15 20v-16h-2a4 4 0 0 0 -4 4v1a4 4 0 0 0 4 4h2" />
    <Path d="M9 20l3 -7" />
  </Svg>
);
export default SvgBrandYandex;
