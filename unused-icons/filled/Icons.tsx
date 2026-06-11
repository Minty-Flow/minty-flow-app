import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIcons = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M4.25 2.603a4.5 4.5 0 1 1 -2.25 3.897l.006 -.229a4.5 4.5 0 0 1 2.244 -3.668" />
    <Path d="M5.632 13.504a1 1 0 0 1 1.736 0l4 7a1 1 0 0 1 -.868 1.496h-8a1 1 0 0 1 -.868 -1.496z" />
    <Path d="M13.293 2.293a1 1 0 0 1 1.414 0l7 7a1 1 0 1 1 -1.414 1.414l-7 -7a1 1 0 0 1 0 -1.414" />
    <Path d="M20.293 2.293a1 1 0 0 1 1.414 1.414l-7 7a1 1 0 0 1 -1.414 -1.414z" />
    <Path d="M21 13a1 1 0 0 1 1 1v7a1 1 0 0 1 -1 1h-7a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1z" />
  </Svg>
);
export default SvgIcons;
