import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBible = (props: SvgProps) => (
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
    <Path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12" />
    <Path d="M19 16h-12a2 2 0 0 0 -2 2" />
    <Path d="M12 7v6" />
    <Path d="M10 9h4" />
  </Svg>
);
export default SvgBible;
