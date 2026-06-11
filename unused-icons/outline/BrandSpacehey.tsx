import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandSpacehey = (props: SvgProps) => (
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
    <Path d="M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M14 20h6v-6a3 3 0 0 0 -6 0v6" />
    <Path d="M11 8v2.5a3.5 3.5 0 0 1 -3.5 3.5h-.5a3 3 0 0 1 0 -6h4" />
  </Svg>
);
export default SvgBrandSpacehey;
