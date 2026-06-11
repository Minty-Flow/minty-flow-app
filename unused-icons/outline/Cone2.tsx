import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCone2 = (props: SvgProps) => (
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
    <Path d="M21 5.002v.5l-8.13 14.99a1 1 0 0 1 -1.74 0l-8.13 -14.989v-.5c0 -1.659 4.03 -3.003 9 -3.003s9 1.344 9 3.002" />
  </Svg>
);
export default SvgCone2;
