import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandAsana = (props: SvgProps) => (
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
    <Path d="M9 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M14 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M4 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </Svg>
);
export default SvgBrandAsana;
